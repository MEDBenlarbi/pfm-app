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
export const fetchGoogleUser = async (accessToken) => {
  const response = await fetch(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  return await response.json();
};

export const findOrCreateUser = async (server, googleUser) => {
  const { email, name } = googleUser;

  let user = await server.sqlite.get('SELECT * FROM users WHERE email = ?', [
    email,
  ]);

  if (!user) {
    const id = server.uuid();
    const timeStamp = Date.now();

    await server.sqlite.run(
      'INSERT INTO users (id, fullName, email, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, timeStamp, timeStamp]
    );

    user = await server.sqlite.get('SELECT * FROM users WHERE email = ?', [
      email,
    ]);
  }

  return user;
};

export const generateJwt = (server, user) => {
  return server.jwt.sign({
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
  });
};
