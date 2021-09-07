import { LoggerInterface } from './interface.js';

const MultipleWhiteSpaceRegex = /\s+/g;
export class Logger implements LoggerInterface {
  private prefix: string;

  private bagdes: string = '';

  private badgeArray: string[];

  private prefixName: string;

  constructor(prefix: string, ...badges: string[]) {
    this.badgeArray = badges;
    this.prefixName = prefix;

    this.constructBadges();
    if (prefix.length > 0) {
      this.prefix = '[' + prefix + ']';
    } else {
      this.prefix = '';
    }

    if (process.env.NODE_ENV === 'production') {
      this.info = () => {};
      this.log = () => {};
    }
  }

  private formattedDate = (): string => {
    const now = new Date();
    const day = (now.getDate() + 1).toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString().padStart(4, '0').substring(2, 4);
    const milliSecond = now.getMilliseconds().toString().padStart(3, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    return `[${day}-${month}-${year} ${hour}:${minute}:${second}.${milliSecond}]`;
  };

  info = (...data: any[]) =>
    console.info(
      this.logString(this.formattedDate(), this.prefix, this.bagdes, ...data)
    );

  warn = (...data: any[]) =>
    console.warn(
      this.logString(
        this.formattedDate(),
        '[Warn]',
        this.prefix,
        this.bagdes,
        ...data
      )
    );

  log = (...data: any[]) =>
    console.log(
      this.logString(this.formattedDate(), this.prefix, this.bagdes, ...data)
    );

  error = (...data: any[]) =>
    console.error(
      this.logString(
        this.formattedDate(),
        '[Error]',
        this.prefix,
        this.bagdes,
        ...data
      )
    );

  addBadge = (badge: string) => {
    this.badgeArray.push(badge);
    this.constructBadges();
  };

  resetBadges = () => {
    this.badgeArray = [];
    this.constructBadges();
  };

  private constructBadges = () => {
    this.bagdes = this.badgeArray.map(b => `[${b}]`).join(' ');
  };

  private logString = (...data: any[]): string => {
    let str = data.join(' ');
    return str.replace(MultipleWhiteSpaceRegex, ' ');
  };

  withBadge = (badge: string): LoggerInterface =>
    new Logger(this.prefixName, ...this.badgeArray, badge);
}
