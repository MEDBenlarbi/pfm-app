import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
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
