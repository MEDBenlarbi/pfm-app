import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';
import sqlite from './plugins/sqlite.js';
import uuid from './plugins/uuid.js';
import homesRoutes from './routes/homes.route.js';

const server = Fastify({
  logger: true,
});

//documentation
server.register(fastifySwagger, {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'Personal Finance Manager',
      description: 'Testing the Fastify swagger API',
      version: '0.1.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'http://127.0.0.1:3000',
        description: 'Development server',
      },
    ],
    tags: [],
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'apiKey',
          in: 'header',
        },
      },
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
  },
});
server.register(fastifySwaggerUi, {
  routePrefix: '/',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  uiHooks: {
    onRequest: (request, reply, next) => next(),
    preHandler: (request, reply, next) => next(),
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => swaggerObject,
  transformSpecificationClone: true,
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

const start = async () => {
  try {
    await server.listen({ host: 'localhost', port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
export default start;
