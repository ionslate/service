import { DB_ERRORS } from '@error/constants';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import * as yup from 'yup';

export function formatApolloError(e: GraphQLError): GraphQLFormattedError {
  if (DB_ERRORS.includes(e.extensions?.exception?.name)) {
    e.message = 'Internal server error...';
  }

  console.error(e);

  return {
    message: e.message,
    path: e.path,
    extensions: {
      code:
        e.extensions?.exception.status ||
        (e.extensions?.exception.name === yup.ValidationError.name ? 400 : 500),
      validationError: e.extensions?.exception.validationError,
    },
  };
}
