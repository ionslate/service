import { RequestContext } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import morgan from 'morgan';
import { Container } from '@root/container';
import ApolloLoggingPlugin from '@root/logger/ApolloLoggingPlugin';
import LoggerStream from '@logger/LoggerStream';
import { parseSchema } from '@root/utils';
import { createContext } from '@root/container';
import { formatApolloError } from '@error/handlers/formatApolloError';
import { errorHandler } from '@error/handlers/errorHandler';
import { Express } from 'express-serve-static-core';
import resolvers from '@root/resolvers';
import { ResourceNotFound } from '@error/exceptions/ResourceNotFound';
import session, { SessionOptions } from 'express-session';
import { AuthDirective } from '@auth/directives/AuthDirective';

async function app(container: Container): Promise<Express> {
  const app = express();

  const sess: SessionOptions = {
    secret: 'keyboard cat',
    name: 'user_sid',
    cookie: {},
    saveUninitialized: false,
    resave: false,
    store: container.sessionStore,
  };

  if (app.get('env') === 'production' && sess.cookie) {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
  }

  app.use(session(sess));

  app.use(morgan('short', { stream: new LoggerStream() }));

  app.use(express.json());

  app.use((_, __, next) => {
    RequestContext.create(container.entityManager, next);
  });

  const typeDefs = await parseSchema();

  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: createContext(container),
    plugins: [new ApolloLoggingPlugin()],
    formatError: formatApolloError,
    schemaDirectives: {
      auth: AuthDirective,
    },
  });

  graphqlServer.applyMiddleware({ app });

  app.use((_, __, next) => next(new ResourceNotFound()));

  app.use(errorHandler);

  return app;
}

export default app;
