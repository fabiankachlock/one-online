export type AsyncQueueReceive<T> = {
  ok: boolean;
  value: T | undefined;
};

export class AsyncQueue<T> {
  private isClosed = false;

  private queue: Array<T> = [];

  private waitingPromise: Promise<{}> = new Promise(() => {});
  private customWaitingPromise: Promise<{}> | undefined;

  private resolveNext = () => {};

  constructor(readonly buffer: number = 1) {
    // setup waiting promise
    this.notifyNext();
  }

  private notifyNext = () => {
    // resolve pending promise (open await blocks)
    this.resolveNext();

    // and setup next promise
    this.waitingPromise = new Promise<{}>(resolve => {
      this.resolveNext = () => resolve({});
    });
  };

  close = () => {
    if (this.isClosed) {
      throw new Error('channel already closed');
    }

    this.isClosed = true;
    this.notifyNext();
  };

  send = (item: T) => {
    if (this.isClosed) {
      throw new Error("Can't send on a closed channel");
    }

    if (this.queue.length < this.buffer) {
      // store next item and send notify waiting receiver
      this.queue.unshift(item);
      this.notifyNext();
    } else {
      throw new Error('Channel full');
    }
  };

  pauseReceiver = (): (() => void) => {
    let relieve = () => {};
    this.customWaitingPromise = new Promise(
      resolve =>
        (relieve = () => {
          resolve({});
          this.customWaitingPromise = undefined;
        })
    );
    return relieve;
  };

  receive = async (): Promise<AsyncQueueReceive<T>> => {
    if (this.isClosed && this.queue.length === 0) {
      return {
        value: undefined,
        ok: false
      };
    }

    if (this.queue.length > 0) {
      return {
        value: this.queue.pop()!,
        ok: !(this.isClosed && this.queue.length === 0)
      };
    }

    // await next change
    await this.waitingPromise;
    if (this.customWaitingPromise) {
      await this.customWaitingPromise;
    }
    return this.receive();
  };
}
