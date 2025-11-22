import fastifyJwt from '@fastify/jwt';
import fastifyOauth2 from '@fastify/oauth2';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import 'dotenv/config';
import Fastify from 'fastify';
import sqlite from './plugins/sqlite.js';
import uuid from './plugins/uuid.js';
import authRoutes from './routes/auth.route.js';
import categoriesRoutes from './routes/categories.route.js';
import homesRoutes from './routes/homes.route.js';
import ledgersRoutes from './routes/ledgers.route.js';
import usersRoutes from './routes/users.route.js';
import { swaggerConfig, swaggerUiConfig } from './utils.js';

const server = Fastify({
  logger: true,
});

// Register plugins
server.register(sqlite);
server.register(uuid);

// JWT setup
server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
  sign: {
    expiresIn: '7d',
  },
});

// Authentication decorator
server.decorate('authenticate', async (req, reply) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    reply.status(401).send({
      success: false,
      error: 'Invalid or expired token',
    });
  }
});

// Documentation
server.register(fastifySwagger, swaggerConfig);
server.register(fastifySwaggerUi, swaggerUiConfig);

// OAuth2
server.register(fastifyOauth2, {
  name: 'googleOAuth2',
  credentials: {
    client: {
      id: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_CLIENT_SECRET,
    },
    auth: fastifyOauth2.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: '/api/auth/google',
  callbackUri: 'http://localhost:3000/api/auth/google/callback',
});

// Register routes
server.register(authRoutes);
server.register(usersRoutes);
server.register(homesRoutes);
server.register(ledgersRoutes);
server.register(categoriesRoutes);

server.setErrorHandler((err, req, reply) => {
  if (err instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
    server.log.error(err);
    reply.status(500).send({ message: 'Internal server error' });
  } else {
    reply.send(err);
  }
});

const start = async () => {
  try {
    await server.listen({ host: 'localhost', port: 3000 });
    console.log(`Server running at http://localhost:3000`);
    console.log(`Documentation available at http://localhost:3000/`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

export default start;
