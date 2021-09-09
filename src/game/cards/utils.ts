import { Card, CARD_COLOR, CARD_TYPE } from './type.js';

export const isColorCard = (type: CARD_TYPE) =>
  /\/\d$|skip$|draw2$|reverse$/.test(type);

export const VALID_CARD_TYPES: CARD_TYPE[] = Object.entries(CARD_TYPE)
  .map(([, t]) => t)
  .filter(t => t !== CARD_TYPE.none);

export const VALID_CARD_COLOR: CARD_COLOR[] = Object.entries(CARD_COLOR)
  .map(([, c]) => c)
  .filter(c => c !== CARD_COLOR.none);

export const ALL_CARDS: Card[] = [
  ...VALID_CARD_TYPES.map(t => {
    if (isColorCard(t)) {
      return VALID_CARD_COLOR.map(c => ({
        color: c,
        type: t
      }));
    } else {
      return {
        color: CARD_COLOR.none,
        type: t
      };
    }
  }).flat()
];

export const CARD_DECK: Card[] = [
  ...ALL_CARDS,
  ...ALL_CARDS.filter(c => c.type !== CARD_TYPE.n0),

  ...[CARD_TYPE.wild, CARD_TYPE.wildDraw2, CARD_TYPE.wildDraw4]
    .map(t => [
      {
        color: CARD_COLOR.none,
        type: t
      },
      {
        color: CARD_COLOR.none,
        type: t
      }
    ])
    .flat()
];
