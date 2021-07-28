import { PlayerStore } from '../../store/implementations/playerStore/index.js';
import { CardDeck } from '../cards/deck.js';
import { GameMeta } from '../game.js';
import { GameRule, GameState } from '../interface.js';
import { GameOptionsType } from '../options.js';
import { Player } from '../players/player.js';
import type { UIClientEvent } from '../../../types/client';
import { GameStateNotificationManager } from './gameNotifications.js';
import { BasicDrawRule } from './rules/basicDrawRule.js';
import { BasicGameRule } from './rules/basicRule';
import { ReverseGameRule } from './rules/reverseRule.js';
import { SkipGameRule } from './rules/skipRule.js';
import { Logging } from '../../logging/index.js';

export class GameStateManager {
  private state: GameState;
  private notificationManager: GameStateNotificationManager;
  private players: Player[];

  private readonly rules: GameRule[] = [
    new BasicGameRule(),
    new BasicDrawRule(),
    new ReverseGameRule(),
    new SkipGameRule()
  ];

  constructor(
    private gameId: string,
    private metaData: GameMeta,
    private options: GameOptionsType,
    private readonly pile = new CardDeck(10, [], true)
  ) {
    this.state = {
      direction: 'left',
      currentPlayer: Array.from(metaData.players)[
        Math.floor(Math.random() * this.metaData.playerCount)
      ],
      topCard: pile.draw(),
      stack: [],
      decks: {}
    };
    this.notificationManager = new GameStateNotificationManager(this.gameId);
    this.players = Array.from(metaData.players).map(id => ({
      id,
      name: PlayerStore.getPlayerName(id) || 'noname'
    }));

    Logging.Game.info(
      `[State] Initialized with rules: ${JSON.stringify(
        this.rules.map(r => r.name)
      )}`
    );
  }

  public prepare = () => {
    Array.from(this.metaData.players).map(pid => {
      this.state.decks[pid] = [];

      for (let i = 0; i < this.options.options.numberOfCards; i++) {
        this.state.decks[pid].push(this.pile.draw());
      }
    });

    // allow just 'normal' (digit) cards as top card
    while (!/^ct\/\d$/.test(this.state.topCard.type)) {
      this.state.topCard = this.pile.draw();
    }

    this.state.stack = [
      {
        card: this.state.topCard,
        activatedEvent: false
      }
    ];

    Logging.Game.info(`[State] [Prepared] ${this.gameId}`);
  };

  public start = () => {
    Logging.Game.info(`[State] [Started] ${this.gameId}`);
    this.notificationManager.notifyGameInit(this.players, this.state);
  };

  public clear = () => {
    Logging.Game.info(`[State] [Cleared] ${this.gameId}`);
    this.finishHandler('');
  };

  private finishHandler: (winner: string) => void = () => {};

  public whenFinished = (handler: (winner: string) => void) => {
    this.finishHandler = handler;
  };

  public handleEvent = (event: UIClientEvent) => {
    const responsibleRules = this.getResponsibleRules(event);

    const rule = this.getProritiesedRules(responsibleRules);

    if (!rule) {
      Logging.Game.warn(`[State] ${this.gameId} no responsible rule found`);
      return;
    }

    Logging.Game.info(
      `[State] ${this.gameId} - responsible rule: ${rule.name}`
    );

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

    Logging.Game.info(
      `[Event] [Outgoing] ${this.gameId} ${JSON.stringify(events)}`
    );

    if (this.gameFinished()) {
      Logging.Game.info(`[State] ${this.gameId} finisher found`);
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
