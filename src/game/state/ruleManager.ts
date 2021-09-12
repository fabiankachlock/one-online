import { UIClientEvent } from '../../../types/client';
import { GameInterrupt, GameRule, GameState } from '../interface';
import { GameOptionsType } from '../options';
import { AddUpRule } from './rules/addUpRule';
import { BasicDrawRule } from './rules/basicDrawRule';
import { BasicGameRule } from './rules/basicRule';
import { ReverseGameRule } from './rules/reverseRule';
import { SkipGameRule } from './rules/skipRule';
import { UnoButtonRule } from './rules/unoButtonRule';

export class RuleManager {
  static allRules: GameRule[] = [
    new BasicGameRule(),
    new BasicDrawRule(),
    new ReverseGameRule(),
    new SkipGameRule(),
    new AddUpRule(),
    new UnoButtonRule()
  ];

  private rules: GameRule[];

  constructor(
    options: GameOptionsType,
    interrupt: (interrupt: GameInterrupt) => void
  ) {
    this.rules = RuleManager.allRules.filter(r => options[r.associatedRule]);
    for (const rule of this.rules) {
      rule.setupInterrupt(interrupt);
    }
  }

  get all(): GameRule[] {
    return [...this.rules];
  }

  getResponsibleRules = (event: UIClientEvent, state: GameState): GameRule[] =>
    this.rules.filter(r => r.isResponsible(state, event));

  getResponsibleRulesForInterrupt = (interrupt: GameInterrupt): GameRule[] =>
    this.rules.filter(r => r.isResponsibleForInterrupt(interrupt));

  getPrioritizedRules = (rules: GameRule[]): GameRule | undefined =>
    rules.sort((a, b) => a.priority - b.priority).pop();
}
