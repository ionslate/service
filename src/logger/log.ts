import winston from 'winston';
import { format } from 'logform';

const alignedWithColorsAndTime = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const log = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: alignedWithColorsAndTime,
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
});

export default log;
