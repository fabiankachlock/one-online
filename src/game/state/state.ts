import { PlayerStore } from '../../store/implementations/playerStore/index.js';
import { CardDeck } from '../cards/deck.js';
import { GameMeta } from '../game.js';
import { GameEvent, GameInterrupt, GameRule, GameState } from '../interface.js';
import { GameOptionsType } from '../options.js';
import { Player } from '../players/player.js';
import type { UIClientEvent } from '../../../types/client';
import { GameStateNotificationManager } from './gameNotifications.js';
import { BasicDrawRule } from './rules/basicDrawRule.js';
import { BasicGameRule } from './rules/basicRule';
import { ReverseGameRule } from './rules/reverseRule.js';
import { SkipGameRule } from './rules/skipRule.js';
import { LoggerInterface } from '../../logging/interface.js';
import { AddUpRule } from './rules/addUpRule';
import { UnoButtonRule } from './rules/unoButtonRule.js';

export class GameStateManager {
  private state: GameState;
  private notificationManager: GameStateNotificationManager;
  private players: Player[];
  private pile: CardDeck;

  private rules: GameRule[] = [
    new BasicGameRule(),
    new BasicDrawRule(),
    new ReverseGameRule(),
    new SkipGameRule(),
    new AddUpRule(),
    new UnoButtonRule()
  ];

  constructor(
    private gameId: string,
    private metaData: GameMeta,
    private options: GameOptionsType,
    private Logger: LoggerInterface
  ) {
    this.pile = new CardDeck(10, [], options.realisticDraw);
    this.state = {
      direction: 'left',
      currentPlayer: Array.from(metaData.players)[
        Math.floor(Math.random() * this.metaData.playerCount)
      ],
      topCard: this.pile.draw(),
      stack: [],
      decks: {}
    };
    this.notificationManager = new GameStateNotificationManager(this.gameId);
    this.players = Array.from(metaData.players).map(id => ({
      id,
      name: PlayerStore.getPlayerName(id) || 'noname'
    }));

    this.Logger.info(
      `[State] Initialized with rules: ${JSON.stringify(
        this.rules.map(r => r.name)
      )}`
    );
  }

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

    // setup rules
    this.rules = this.rules.filter(r => this.options[r.associatedRule]);
    for (const rule of this.rules) {
      rule.setupInterrupt(this.interruptGame);
    }

    // setup stack
    this.state.stack = [
      {
        card: this.state.topCard,
        activatedEvent: false
      }
    ];

    this.Logger.info(`[State] [Prepared] ${this.gameId}`);
  };

  public start = () => {
    this.Logger.info(`[State] [Started] ${this.gameId}`);
    this.notificationManager.notifyGameInit(
      this.players,
      this.state,
      this.options
    );
  };

  public clear = () => {
    this.Logger.info(`[State] [Cleared] ${this.gameId}`);
    this.finishHandler('');
  };

  private finishHandler: (winner: string) => void = () => {};

  public whenFinished = (handler: (winner: string) => void) => {
    this.finishHandler = handler;
  };

  private interruptGame = (interrupt: GameInterrupt) => {
    const responsibleRules: GameRule[] = [];
    const events: GameEvent[] = [];
    this.Logger.info(`[Interrupt] ${interrupt.reason}`);

    for (const rule of this.rules) {
      if (rule.isResponsibleForInterrupt(interrupt)) {
        responsibleRules.push(rule);
      }
    }

    for (const rule of responsibleRules.sort(
      (a, b) => b.priority - a.priority
    )) {
      const copy = JSON.parse(JSON.stringify(this.state));
      const result = rule.onInterrupt(interrupt, copy, this.pile);

      this.state = result.newState;
      events.push(...result.events);
      for (let i = result.moveCount; i > 0; i--) {
        this.state.currentPlayer =
          this.metaData.playerLinks[this.state.currentPlayer][
            this.state.direction
          ];
      }
    }

    this.handleGameUpdate(events);
  };

  public handleEvent = (event: UIClientEvent) => {
    const responsibleRules = this.getResponsibleRules(event);

    const rule = this.getProritiesedRules(responsibleRules);

    if (!rule) {
      this.Logger.warn(`[State] ${this.gameId} no responsible rule found`);
      return;
    }

    this.Logger.info(`[State] ${this.gameId} - responsible rule: ${rule.name}`);

    const copy = JSON.parse(JSON.stringify(this.state));

    const result = rule.applyRule(copy, event, this.pile);

    const events = rule.getEvents(this.state, event);

    this.state = result.newState;

    for (let i = result.moveCount; i > 0; i--) {
      this.state.currentPlayer =
        this.metaData.playerLinks[this.state.currentPlayer][
          this.state.direction
        ];
    }

    this.handleGameUpdate(events);
  };

  private handleGameUpdate = (events: GameEvent[]) => {
    this.Logger.info(
      `[Event] [Outgoing] ${this.gameId} ${JSON.stringify(events)}`
    );

    if (this.gameFinished()) {
      this.Logger.info(`[State] ${this.gameId} finisher found`);
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
    for (const rule of this.rules) {
      rule.onGameUpdate(copyState, events);
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
      this.notificationManager.notifyGameFinish(
        './summary.html#' + this.gameId
      );
    }
  };

  private getResponsibleRules = (event: UIClientEvent): GameRule[] =>
    this.rules.filter(r => r.isResponsible(this.state, event));

  private getProritiesedRules = (rules: GameRule[]): GameRule | undefined =>
    rules.sort((a, b) => a.priority - b.priority).pop();
}
