export type GameOptionsType = {
  options: {
    realisticDraw: boolean;
    takeUntilFit: boolean;
    strictMode: boolean;
    timeMode: boolean;
    numberOfCards: number;
  };
  rules: {
    penaltyCard: boolean;
    addUp: boolean;
    placeDirect: boolean;
    cancleWithReverse: boolean;
    throwSame: boolean;
    exchange: boolean;
    globalExchange: boolean;
  };
};

export class GameOptions {
  private constructor(private options: GameOptionsType) {}

  get ruleSet() {
    return this.options.rules;
  }

  get optionSet() {
    return this.options.options;
  }

  get all() {
    return this.options;
  }

  static default(): GameOptions {
    return new GameOptions({
      options: {
        realisticDraw: true,
        takeUntilFit: false,
        timeMode: false,
        strictMode: false,
        numberOfCards: 7
      },
      rules: {
        penaltyCard: true,
        addUp: true,
        cancleWithReverse: false,
        placeDirect: false,
        throwSame: false,
        exchange: false,
        globalExchange: false
      }
    });
  }

  static custom(options: GameOptionsType): GameOptions {
    return new GameOptions({
      ...options
    });
  }

  public resolveFromMessage(options: Record<string, any>) {
    (
      Object.entries(this.options.options) as [keyof GameOptionsType, boolean][]
    ).forEach(([optionKey]) => {
      if (optionKey in options) {
        this.options[optionKey] = options[optionKey];
      }
    });

    (
      Object.entries(this.options.rules) as [keyof GameOptionsType, boolean][]
    ).forEach(([optionKey]) => {
      if (optionKey in options) {
        this.options[optionKey] = options[optionKey];
      }
    });
  }
}
