import { AuthDirective } from '@auth/directives/AuthDirective';
import { ResourceNotFound } from '@error/exceptions/ResourceNotFound';
import { errorHandler } from '@error/handlers/errorHandler';
import { formatApolloError } from '@error/handlers/formatApolloError';
import LoggerStream from '@logger/LoggerStream';
import { RequestContext } from '@mikro-orm/core';
import { Container, createContext } from '@root/container';
import ApolloLoggingPlugin from '@root/logger/ApolloLoggingPlugin';
import resolvers from '@root/resolvers';
import { parseSchema } from '@root/utils';
import { ApolloServer } from 'apollo-server-express';
import config from '@config/config';
import express from 'express';
import { Express } from 'express-serve-static-core';
import session, { SessionOptions } from 'express-session';
import morgan from 'morgan';
import cors, { CorsOptions } from 'cors';

async function app(container: Container): Promise<Express> {
  const app = express();

  app.use(morgan('short', { stream: new LoggerStream() }));

  const corsOptions: CorsOptions = {
    credentials: true,
    // origin: 'http://localhost:3000',
    allowedHeaders: ['Origin', 'Content-Type'],
    origin: (origin, cb) => {
      if (!origin || config.allowedOrigins.indexOf(origin) !== -1) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'));
      }
    },
  };

  app.use(cors(corsOptions));

  // app.options('*', cors(corsOptions) as never);

  const sess: SessionOptions = {
    secret: config.sessionSecret,
    name: 'user_sid',
    cookie: {
      domain: config.cookieDomain,
      httpOnly: true,
      sameSite: 'lax',
    },
    saveUninitialized: false,
    resave: false,
    store: container.sessionStore,
  };

  app.use(session(sess));

  if (app.get('env') === 'production' && sess.cookie) {
    app.set('trust proxy', 1); // trust first proxy
    sess.cookie.secure = true; // serve secure cookies
  }

  app.use(express.json());

  app.use((_, __, next) => {
    RequestContext.create(container.entityManager, next);
  });

  const typeDefs = await parseSchema();

  const graphqlServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: createContext(container),
    introspection: true,
    plugins: [new ApolloLoggingPlugin()],
    formatError: formatApolloError,
    schemaDirectives: {
      auth: AuthDirective,
    },
  });

  graphqlServer.applyMiddleware({ app, cors: corsOptions });

  app.use((_, __, next) => next(new ResourceNotFound()));

  app.use(errorHandler);

  return app;
}

export default app;
