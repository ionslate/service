import {
  ApolloServerPlugin,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';
import { inspect } from 'util';
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';
import log from '@logger/log';

export default class ApolloLoggingPlugin implements ApolloServerPlugin {
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
