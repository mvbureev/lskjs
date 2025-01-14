export type LoggerLevelType = 'fatal' | 'error' | 'warn' | 'debug' | 'info' | 'trace' | 'log';

export interface ILoggerProps {
  prefix?: string | null;
  ns?: string | null;
  name?: string | null;
  level?: string | null;
}
export interface ILoggerMessage {
  code?: any;
  name?: string | null;
  ns?: string | null;
  level?: string | number;
  time?: string | number | Date;
  msg?: string | null;
  data?: any;
}

export interface ILogger extends ILoggerProps {
  trace(...args: any[]): void;
  info(...args: any[]): void;
  debug(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  fatal(...args: any[]): void;
  log(...args: any[]): void;
}

export type ILoggerMeta = {
  ns?: string;
  name?: string;
  level?: string;
  time?: Date;

  method?: string;
  host?: string;
  reqId?: string | number;
  ua?: string;
  ip?: string;
  url?: string;
  status?: string;
  duration?: number;
  length?: number;
};

// eslint-disable-next-line no-shadow
export enum ILoggerInternalMessageFormat {
  bunyan = 'bunyan',
  lsklog = 'lsklog',
  lsklogweb = 'lsklogweb',
  logrus = 'logrus',
  raw = 'raw',
}

export type ILoggerInternalMessage = {
  format: ILoggerInternalMessageFormat | null;
  meta: ILoggerMeta;
  args: any[];
};
