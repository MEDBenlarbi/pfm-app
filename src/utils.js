export class AppError extends Error {
  constructor(code, message) {
    super(message);
    this.statusCode = code;
  }
}
export const idProp = { id: { type: 'string' } };
export const idParam = {
  type: 'object',
  properties: { ...idProp },
};

/**
 * @type { import('@fastify/swagger').SwaggerOptions }
 */
export const swaggerConfig = {
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
    tags: ['homes', 'users', 'ledgers'],
    components: {
      securitySchemes: {
        apiKey: {},
      },
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
  },
};

/**
 * @type {import('@fastify/swagger-ui').FastifySwaggerUiOptions}
 */
export const swaggerUiConfig = {
  routePrefix: '/',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
  },
  uiHooks: {
    onRequest: (request, reply, next) => next(),
    preHandler: (request, reply, next) => next(),
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => swaggerObject,
  transformSpecificationClone: true,
};
