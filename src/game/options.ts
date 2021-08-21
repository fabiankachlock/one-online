export enum OptionKey {
  realisticDraw = 'realisticDraw',
  takeUntilFit = 'takeUntilFit',
  strictMode = 'strictMode',
  timeMode = 'timeMode',
  penaltyCard = 'penaltyCard',
  addUp = 'addUp',
  placeDirect = 'placeDirect',
  cancleWithReverse = 'cancleWithReverse',
  throwSame = 'throwSame',
  exchange = 'exchange',
  globalExchange = 'globalExchange',
  none = 'none'
}

export type GameOptionsType = {
  [OptionKey.realisticDraw]: boolean;
  [OptionKey.takeUntilFit]: boolean;
  [OptionKey.strictMode]: boolean;
  [OptionKey.timeMode]: boolean;
  [OptionKey.penaltyCard]: boolean;
  [OptionKey.addUp]: boolean;
  [OptionKey.placeDirect]: boolean;
  [OptionKey.cancleWithReverse]: boolean;
  [OptionKey.throwSame]: boolean;
  [OptionKey.exchange]: boolean;
  [OptionKey.globalExchange]: boolean;
  [OptionKey.none]: boolean;

  presets: {
    numberOfCards: number;
  };
};

export const DefaultOptions: GameOptionsType = {
  realisticDraw: true,
  takeUntilFit: false,
  timeMode: false,
  strictMode: false,
  penaltyCard: true,
  addUp: true,
  cancleWithReverse: false,
  placeDirect: false,
  throwSame: false,
  exchange: false,
  globalExchange: false,
  none: true, // actvate default rules
  presets: {
    numberOfCards: 7
  }
};

export class GameOptions {
  private constructor(private options: GameOptionsType) {}

  get all() {
    return this.options;
  }

  get allActive(): OptionKey[] {
    const keys = <OptionKey[]>(
      Object.keys(OptionKey).filter(key => key !== OptionKey.none)
    );

    return keys.filter(key => this.options[key] === true) as OptionKey[];
  }

  static default(): GameOptions {
    return new GameOptions(DefaultOptions);
  }

  static custom(options: GameOptionsType): GameOptions {
    return new GameOptions({
      ...options
    });
  }

  public resolveFromMessage(options: Record<string, any>) {
    (<OptionKey[]>Object.keys(this.options)).forEach(key => {
      if (key in options) {
        this.options[key] = options[key];
      }
    });
  }
}
