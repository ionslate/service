import { DB_ERRORS } from '@error/constants';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

export function formatApolloError(e: GraphQLError): GraphQLFormattedError {
  if (DB_ERRORS.includes(e.extensions?.exception?.name)) {
    e.message = 'Internal server error...';
  }

  return {
    message: e.message,
    path: e.path,
    extensions: { code: e.extensions?.exception.status || 500 },
  };
}
