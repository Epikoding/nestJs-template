import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';
import * as process from 'process';

export class Logger {
  private static readonly logDir: string = `${process.cwd()}/logs`;

  private static readonly logger: winston.Logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.label({ label: 'NestJS Application' }),
      winston.format.printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
      }),
    ),
    transports: [
      new winstonDaily({
        level: 'info',
        datePattern: 'YYYY-MM-DD',
        dirname: Logger.logDir,
        filename: `%DATE%.log`,
        maxFiles: 30,
        zippedArchive: true,
      }),
      new winstonDaily({
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        dirname: `${Logger.logDir}/error`,
        filename: `%DATE%.error.log`,
        maxFiles: 30,
        zippedArchive: true,
      }),
      ...(process.env.NODE_ENV !== 'production' ? [new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        ),
      })] : []),
    ],
    exceptionHandlers: [
      new winstonDaily({
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        dirname: Logger.logDir,
        filename: `%DATE%.exception.log`,
        maxFiles: 30,
        zippedArchive: true,
      }),
    ],
  });

  public static log(level: string, message: string) {
    Logger.logger.log(level, message);
  }

  public static info(message: string) {
    Logger.log('info', message);
  }

  public static error(message: string) {
    Logger.log('error', message);
  }
}
