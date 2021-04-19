import { RequestContext } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import morgan from 'morgan';
import { Container } from '@root/container';
import ApolloLoggingPlugin from '@root/logger/ApolloLoggingPlugin';
import LoggerStream from '@logger/LoggerStream';
import { parseSchema, createContext } from '@root/utils';
import { formatApolloError } from '@error/handlers/formatApolloError';
import { errorHandler } from '@error/handlers/errorHandler';
import { Express } from 'express-serve-static-core';
import resolvers from '@root/resolvers';
import { ResourceNotFound } from '@error/exceptions/ResourceNotFound';

async function app(container: Container): Promise<Express> {
  const app = express();

  app.use(morgan('short', { stream: new LoggerStream() }));

  app.use(express.json());

  app.use((_, __, next) => {
    RequestContext.create(container.entityManager, next);
  });

  const graphqlServer = new ApolloServer({
    typeDefs: parseSchema(),
    resolvers,
    context: createContext(container),
    plugins: [new ApolloLoggingPlugin()],
    formatError: formatApolloError,
    tracing: true,
  });

  graphqlServer.applyMiddleware({ app });

  app.use((_, __, next) => next(new ResourceNotFound()));

  app.use(errorHandler);

  return app;
}

export default app;
