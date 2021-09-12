import { CARD_TYPE } from '../../../cards/type';

export const CardType = {
  isDraw: (t: CARD_TYPE) =>
    t === CARD_TYPE.draw2 ||
    t === CARD_TYPE.wildDraw2 ||
    t === CARD_TYPE.wildDraw4,

  isWild: (t: CARD_TYPE) =>
    t === CARD_TYPE.wild ||
    t === CARD_TYPE.wildDraw2 ||
    t === CARD_TYPE.wildDraw4
};
