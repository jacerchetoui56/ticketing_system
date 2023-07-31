import { Injectable, LoggerService } from "@nestjs/common";
import { format, transports, createLogger } from "winston";

const { combine, printf, timestamp } = format;
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

@Injectable()
export class MyLogger implements LoggerService {
  private readonly logger = createLogger({
    format: combine(timestamp(), myFormat),
    transports: [
      new transports.File({
        filename: "logs/error.log",
        level: "error",
      }),
      new transports.File({
        filename: "logs/app.log",
        level: "info",
      }),
    ],
  });

  log(message: string) {
    this.logger.log("info", message);
  }

  error(message: string, trace?: string) {
    this.logger.log("error", message, { trace });
  }

  warn(message: string) {
    this.logger.log("warn", message);
  }

  debug(message: string) {
    this.logger.log("debug", message);
  }

  verbose(message: string) {
    this.logger.log("verbose", message);
  }
}
