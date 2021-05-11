import { AppContext } from '@root/container';
import { SchemaDirectiveVisitor } from 'apollo-server-express';
import { defaultFieldResolver, GraphQLField } from 'graphql';
import { getDirectives } from 'graphql-tools';
import { NotAuthorized } from '@error/exceptions/NotAuthorized';
import { Forbidden } from '@error/exceptions/Forbidden';

export class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(
    field: GraphQLField<unknown, AppContext>,
  ): GraphQLField<unknown, AppContext> | null | void {
    const fieldDirectives = getDirectives(this.schema, field);
    const directiveArgumentMap = fieldDirectives.auth;

    if (directiveArgumentMap) {
      const { requires } = directiveArgumentMap;
      if (requires) {
        const { resolve = defaultFieldResolver } = field;
        field.resolve = function (parent, args, context, info) {
          const { user } = context.req.session;

          if (!user) {
            throw new NotAuthorized();
          }
          if (!user.roles.includes(requires)) {
            throw new Forbidden();
          }
          return resolve(parent, args, context, info);
        };
        return field;
      }
    }
  }
}
