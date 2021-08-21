import { OptionKey } from './options';

export type OptionDescription = {
  name: string;
  description: string;
  implemented: boolean;
};

export const OptionDescriptions: Record<OptionKey, OptionDescription> = {
  [OptionKey.realisticDraw]: {
    name: 'Realistic draw',
    description: 'Simulate an actual draw from a pile of cards',
    implemented: true
  },
  [OptionKey.takeUntilFit]: {
    name: 'Take until it fits',
    description: 'You have to pick cards from the Draw-Pile until one fits.',
    implemented: false
  },
  [OptionKey.strictMode]: {
    name: 'Strict mode (experimentel)',
    description:
      'You can only take a card, when theres no other playable card left in your deck.',
    implemented: false
  },
  [OptionKey.timeMode]: {
    name: 'Time mode',
    description:
      "You have to take a penalty card, when you didn't place a card within 20 seconds.",
    implemented: false
  },
  [OptionKey.penaltyCard]: {
    name: 'Penalty card by UNO',
    description:
      'You have to take 2 cards if you forgot to say "UNO" at you last card.',
    implemented: true
  },
  [OptionKey.addUp]: {
    name: 'Add up',
    description: 'You can throw anthor plus-card onto one.',
    implemented: true
  },
  [OptionKey.placeDirect]: {
    name: 'Place cards direcly',
    description:
      'You can place a cards immediately after you picked it from the Draw-Pile.',
    implemented: false
  },
  [OptionKey.cancleWithReverse]: {
    name: 'Cancel with reverse',
    description:
      'You can throw a reverse card on a plus-card to cancel it, can be combined with "Add up".',
    implemented: false
  },
  [OptionKey.throwSame]: {
    name: 'Throw same card in between',
    description:
      'If you had the same card as the one that was thrown, you can throw this card rigth in between. The game will continue at from you position.',
    implemented: false
  },
  [OptionKey.exchange]: {
    name: '7: Card exchange',
    description:
      'When you throw a 7 you have to change your cards with the player of your desire.',
    implemented: false
  },
  [OptionKey.globalExchange]: {
    name: '0: Global card exchange',
    description:
      'When you throw a 0 all cards get moved in playing direct by one player.',
    implemented: false
  },
  [OptionKey.none]: {
    name: '',
    description: '',
    implemented: true
  }
};

export const mapOptionsKeyToDescription = (key: OptionKey): OptionDescription =>
  OptionDescriptions[key];
