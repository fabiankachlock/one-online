export enum CARD_COLOR {
    green = 'cc/green',
    red = 'cc/red',
    blue = 'cc/blue',
    yellow = 'cc/yellow',
    none = 'none'
}

export enum CARD_TYPE {
    n1 = 'ct/1',
    n2 = 'ct/2',
    n3 = 'ct/3',
    n4 = 'ct/4',
    n5 = 'ct/5',
    n6 = 'ct/6',
    n7 = 'ct/7',
    n8 = 'ct/8',
    n9 = 'ct/9',
    n0 = 'ct/0',
    skip = 'ct/skip',
    draw2 = 'ct/draw2',
    reverse = 'ct/reverse',
    wild = 'ct/wild',
    wildDraw4 = 'ct/wildDraw4',
    wildDraw2 = 'ct/wildDraw2',
    none = 'none'
}

export type Card = {
    color: CARD_COLOR;
    type: CARD_TYPE;
}
