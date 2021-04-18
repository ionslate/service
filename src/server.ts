import { RequestContext } from '@mikro-orm/core';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import morgan from 'morgan';
import { Container } from '@root/container';
import { LoggerStream, LoggingPlugin } from '@root/log';
import { parseSchema, formatError, createContext } from '@root/utils';
import { Express } from 'express-serve-static-core';
import resolvers from '@root/resolvers';

async function app(container: Container): Promise<Express> {
  const app = express();

  app.use(morgan('short', { stream: new LoggerStream() }));

  app.use(express.json());

  app.use((req, res, next) => {
    RequestContext.create(container.entityManager, next);
  });

  const graphqlServer = new ApolloServer({
    typeDefs: parseSchema(),
    resolvers,
    context: createContext(container),
    plugins: [new LoggingPlugin()],
    formatError,
    tracing: true,
  });

  graphqlServer.applyMiddleware({ app });

  return app;
}

export default app;
