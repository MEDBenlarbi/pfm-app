import fastifyOauth2 from '@fastify/oauth2';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import 'dotenv/config';
import Fastify from 'fastify';
import sqlite from './plugins/sqlite.js';
import uuid from './plugins/uuid.js';
import categoriesRoutes from './routes/categories.route.js';
import homesRoutes from './routes/homes.route.js';
import ledgersRoutes from './routes/ledgers.route.js';
import usersRoutes from './routes/users.route.js';
import { swaggerConfig, swaggerUiConfig } from './utils.js';

const server = Fastify({
  logger: true,
});

//documentation
server.register(fastifySwagger, swaggerConfig);
server.register(fastifySwaggerUi, swaggerUiConfig);

// Register OAuth2
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

server.get('/api/auth/google/callback', async function (req, reply) {
  const token = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
    req
  );

  const googleUser = await fetch(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      headers: { Authorization: `Bearer ${token.access_token}` },
    }
  ).then((res) => res.json());

  const { email, name } = googleUser;

  const user = await app.sqlite.get('SELECT * FROM users WHERE email = ?', [
    email,
  ]);

  if (!user) {
    const uuid = app.uuid();
    const timeStamp = Date.now();

    await app.sqlite.run(
      'INSERT INTO users (id, fullName, email, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
      [uuid, name, email, timeStamp, timeStamp]
    );
  }

  const jwt = app.jwt.sign({ userId: user.id, email: user.email });

  reply.send({ success: true, user: googleUser });
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Server running at ${address}`);
});

// Database
server.register(sqlite);
server.register(uuid);

server.setErrorHandler((err, req, res) => {
  if (err instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
    this.log.error(err);
    res.status(500).send({ message: 'internal server error' });
  } else {
    res.send(err);
  }
});

server.register(homesRoutes);
server.register(usersRoutes);
server.register(ledgersRoutes);
server.register(categoriesRoutes);

const start = async () => {
  try {
    await server.listen({ host: 'localhost', port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
export default start;
