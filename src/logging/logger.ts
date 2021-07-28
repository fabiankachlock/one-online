import { LoggerInterface } from './interface.js';

export class Logger implements LoggerInterface {
  private prefix;

  constructor(prefix: string) {
    if (prefix.length > 0) {
      this.prefix = '[' + prefix + ']';
    } else {
      this.prefix = '>';
    }
  }

  info = (...data: any[]) => console.info(this.prefix, ...data);

  warn = (...data: any[]) => console.warn('[Warn]', this.prefix, ...data);

  log = (...data: any[]) => console.log(this.prefix, ...data);

  error = (...data: any[]) => console.error('[Error]', this.prefix, ...data);
}
