export declare type GameOptionsType = {
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
export declare class GameOptions {
    private options;
    private constructor();
    get ruleSet(): {
        penaltyCard: boolean;
        addUp: boolean;
        placeDirect: boolean;
        cancleWithReverse: boolean;
        throwSame: boolean;
        exchange: boolean;
        globalExchange: boolean;
    };
    get optionSet(): {
        realisticDraw: boolean;
        takeUntilFit: boolean;
        strictMode: boolean;
        timeMode: boolean;
        numberOfCards: number;
    };
    get all(): GameOptionsType;
    static default(): GameOptions;
    static custom(options: GameOptionsType): GameOptions;
    resolveFromMessage(options: Record<string, any>): void;
}
