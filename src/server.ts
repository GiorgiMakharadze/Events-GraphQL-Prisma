import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { filterXSS } from 'xss';
import { AppModule } from '_app/app.module';
import errorHandlerMiddleware from '_app/middlewares/error-handler';
import notFoundMiddleware from '_app/middlewares/not-found';
import { loadTypeDefs } from '_app/graphql';
import resolvers from '_app/resolvers';
import authenticateToken from './utils/authenticateToken';

dotenv.config();

const startServer = async () => {
  const server = express();
  const port = process.env.PORT || 5000;

  server.set('trust proxy', 1);

  server.use(express.json({ limit: '100kb' }));
  server.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    })
  );
  server.use(cookieParser());
  server.use(
    cors({
      origin: true,
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    })
  );
  server.use((req, _res, next) => {
    if (req.body) {
      req.body = JSON.parse(filterXSS(JSON.stringify(req.body)));
    }
    next();
  });

  AppModule(server);

  const typeDefs = await loadTypeDefs();

  let schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  async function getContext({ req, res }) {
    const token = req.cookies.accessToken;
    if (token) {
      try {
        const user = await authenticateToken(token);
        return { user, req, res };
      } catch (error) {
        console.error('Token verification error:', error);
        return { req, res };
      }
    }
    return { req, res };
  }

  const apolloServer = new ApolloServer({
    schema,
  });
  await apolloServer.start();

  server.use('/graphql', apolloMiddleware(apolloServer, { context: getContext }));

  server.use(notFoundMiddleware);
  server.use(errorHandlerMiddleware);

  server.listen({ port }, () => {
    console.log(`Server running on port ${port}`);
    console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
});
