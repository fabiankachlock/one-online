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

export class GameStateManager {
  private state: GameState;
  private notificationManager: GameStateNotificationManager;
  private players: Player[];
  private pile: CardDeck;

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

    this.rulesManager = new RuleManager(options, this.interruptGame);

    this.Logger.info(
      `Initialized with rules: ${JSON.stringify(
        this.rulesManager.all.map(r => r.name)
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

  private finishHandler: (winner: string) => void = () => {};

  public whenFinished = (handler: (winner: string) => void) => {
    this.finishHandler = handler;
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

  public handleEvent = (event: UIClientEvent) => {
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
  };
}
