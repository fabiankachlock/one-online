import { PlayerStore } from '../../store/implementations/playerStore/index.js';
import { CardDeck } from '../cards/deck.js';
import { GameEvent, GameInterrupt, GameRule, GameState } from '../interface.js';
import { GameOptionsType } from '../options.js';
import { Player } from '../players/player.js';
import type { UIClientEvent } from '../../../types/client';
import { GameStateNotificationManager } from './gameNotifications.js';
import { LoggerInterface } from '../../logging/interface.js';
import { GamePlayerMeta } from '../playerManager.js';
import { RuleManager } from './ruleManager.js';
import { AsyncQueue } from '../../lib/async-queue.js';

export class GameStateManager {
  private state: GameState;
  private notificationManager: GameStateNotificationManager;
  private players: Player[];
  private pile: CardDeck;
  private channel: AsyncQueue<UIClientEvent | GameInterrupt>;

  private rulesManager: RuleManager;

  constructor(
    private gameId: string,
    private metaData: GamePlayerMeta,
    private options: GameOptionsType,
    private Logger: LoggerInterface
  ) {
    this.pile = new CardDeck(10, [], options.realisticDraw);
    this.state = {
      direction: 'left',
      currentPlayer: Array.from(metaData.players)[0],
      topCard: this.pile.draw(),
      stack: [],
      decks: {}
    };
    this.notificationManager = new GameStateNotificationManager(this.gameId);
    this.players = Array.from(metaData.players).map(id => ({
      id,
      name: PlayerStore.getPlayerName(id) || 'noname'
    }));

    this.channel = new AsyncQueue(32);
    this.rulesManager = new RuleManager(options, this.scheduleInterrupt);

    this.Logger.info(
      `Initialized with rules: ${JSON.stringify(
        this.rulesManager.all.map(r => r.name)
      )}`
    );
  }

  // handler for listening to game finish from outside
  private finishHandler: (winner: string) => void = () => {};

  public whenFinished = (handler: (winner: string) => void) => {
    this.finishHandler = handler;
  };

  public leavePlayer = async (playerId: string) => {
    const restart = this.channel.pauseReceiver();
    await new Promise(res => setTimeout(() => res({}), 100)); // threshold for ongoing computation

    if (this.state.currentPlayer === playerId) {
      // select next player, if leaving player is current
      this.state.currentPlayer =
        this.metaData.playerLinks[this.state.currentPlayer][
          this.state.direction
        ];
    }

    // remove deck
    delete this.state.decks[playerId];

    const playerIndex = this.players.findIndex(p => p.id === playerId);
    if (playerIndex) {
      // remove from receivers
      this.players.splice(playerIndex, 1);

      // fix metadata
      this.metaData.playerCount -= 1;
      this.metaData.players.delete(playerId);

      const { left, right } = this.metaData.playerLinks[playerId];
      this.metaData.playerLinks[left].right = right;
      this.metaData.playerLinks[right].left = left;
    }

    restart();
  };

  public prepare = () => {
    // setup players
    Array.from(this.metaData.players).map(pid => {
      this.state.decks[pid] = [];

      for (let i = 0; i < this.options.presets.numberOfCards; i++) {
        this.state.decks[pid].push(this.pile.draw());
      }
    });

    // allow just 'normal' (digit) cards as top card
    while (!/^ct\/\d$/.test(this.state.topCard.type)) {
      this.state.topCard = this.pile.draw();
    }

    // setup stack
    this.state.stack = [
      {
        card: this.state.topCard,
        activatedEvent: false
      }
    ];

    this.Logger.info(`[Prepared] ${this.gameId}`);
  };

  public start = () => {
    this.Logger.info(`[Started] ${this.gameId}`);
    this.notificationManager.notifyGameInit(
      this.players.map(p => ({
        ...p,
        order: this.metaData.playerLinks[p.id].order
      })),
      this.state,
      this.options
    );

    // start listening to events from channel
    this.handleEvents();
  };

  public hotRejoin = (playerId: string) => {
    this.notificationManager.notifyGameInit(
      this.players.map(p => ({
        ...p,
        order: this.metaData.playerLinks[p.id].order
      })),
      this.state,
      this.options,
      [playerId]
    );
  };

  public clear = () => {
    this.Logger.info(`[Cleared] ${this.gameId}`);
    this.finishHandler('');
  };

  // send a new ClientEvent into the channel
  public scheduleEvent = (event: UIClientEvent) => {
    this.channel.send(event);
  };

  // send a new interrupt into the channel
  public scheduleInterrupt = (interrupt: GameInterrupt) => {
    this.channel.send(interrupt);
  };

  // channels listener for sequential event / interrupt processing
  private handleEvents = async () => {
    while (true) {
      const event = await this.channel.receive();

      if (event.value && 'reason' in event.value) {
        this.interruptGame(event.value);
      } else if (event.value && 'eid' in event.value) {
        this.processEvent(event.value);
      }

      if (!event.ok) {
        break;
      }
    }
  };

  private interruptGame = (interrupt: GameInterrupt) => {
    this.Logger.info(`[Interrupt] ${interrupt.reason}`);
    const responsibleRules: GameRule[] =
      this.rulesManager.getResponsibleRulesForInterrupt(interrupt);
    const events: GameEvent[] = [];

    for (const rule of responsibleRules.sort(
      (a, b) => b.priority - a.priority
    )) {
      const copy = JSON.parse(JSON.stringify(this.state));
      const result = rule.onInterrupt(interrupt, copy, this.pile);

      this.state = result.newState;
      events.push(...result.events);
      this.nextPlayer(result.moveCount);
    }

    this.handleGameUpdate(events);
  };

  private processEvent = (event: UIClientEvent) => {
    const responsibleRules = this.rulesManager.getResponsibleRules(
      event,
      this.state
    );

    const rule = this.rulesManager.getPrioritizedRules(responsibleRules);
    if (!rule) {
      this.Logger.warn(`${this.gameId} no responsible rule found`);
      return;
    }

    this.Logger.info(`${this.gameId} - responsible rule: ${rule.name}`);

    const copy = JSON.parse(JSON.stringify(this.state));
    const result = rule.applyRule(copy, event, this.pile);

    this.state = result.newState;

    this.nextPlayer(result.moveCount);
    this.handleGameUpdate(result.events);
  };

  private handleGameUpdate = (events: GameEvent[]) => {
    this.Logger.info(
      `[Event] [Outgoing] ${this.gameId} ${JSON.stringify(events)}`
    );

    if (this.gameFinished()) {
      this.Logger.info(`${this.gameId} finisher found`);
      this.finishGame();
      return;
    }

    this.notificationManager.notifyGameUpdate(
      this.players,
      this.state.currentPlayer,
      this.state.topCard,
      this.state.direction,
      Object.entries(this.state.decks).map(([id, cards]) => ({
        id,
        amount: cards.length
      })),
      events
    );

    const copyState = JSON.parse(JSON.stringify(this.state));
    for (const rule of this.rulesManager.all) {
      rule.onGameUpdate(copyState, events);
    }
  };

  private nextPlayer = (times: number) => {
    for (let i = times; i > 0; i--) {
      this.state.currentPlayer =
        this.metaData.playerLinks[this.state.currentPlayer][
          this.state.direction
        ];
    }
  };

  private gameFinished = (): boolean => {
    return (
      Object.values(this.state.decks).find(deck => deck.length === 0) !==
      undefined
    );
  };

  private finishGame = () => {
    const winner = Object.entries(this.state.decks).find(
      ([, deck]) => deck.length === 0
    );

    if (winner) {
      this.finishHandler(winner[0]);
      this.notificationManager.notifyGameFinish('./summary.html');
    }

    this.stop();
  };

  public stop = () => {
    this.channel.close();
  };
}
