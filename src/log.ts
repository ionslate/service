import winston from 'winston';
import { format } from 'logform';
import {
  ApolloServerPlugin,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';
import { inspect } from 'util';
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';

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

export class LoggerStream {
  write(message: string): void {
    log.info(message.substring(0, message.lastIndexOf('\n')));
  }
}

export class LoggingPlugin implements ApolloServerPlugin {
  requestDidStart = (
    _: GraphQLRequestContext,
  ): GraphQLRequestListener | void => {
    return {
      didEncounterErrors({ errors }) {
        const uniqErrors = uniqWith(errors, (a, b) =>
          isEqual(a.locations, b.locations),
        );
        log.error('\n' + inspect(uniqErrors, false, null, true));
      },
    };
  };
}
