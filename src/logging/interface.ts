export type LoggingFunc = (...data: any[]) => void;

export interface LoggerInterface {
  info: LoggingFunc;
  log: LoggingFunc;
  warn: LoggingFunc;
  error: LoggingFunc;
  addBadge: (badge: string) => void;
  resetBadges: () => void;
  withBadge: (badge: string) => LoggerInterface;
}
