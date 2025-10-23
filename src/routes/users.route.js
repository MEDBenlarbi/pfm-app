import * as UserHandlers from '../handlers/users.handlers.js';
import { idParam, idProp } from '../utils.js';

/**
 * @param {import('fastify').FastifyInstance} app
 */
const usersRoutes = (app) => {
  const queryParams = {
    type: 'object',
    properties: { homeId: { type: 'string' }, email: { type: 'string' } },
  };

  const userResp = {
    type: 'object',
    properties: {
      ...idProp,
      fullName: { type: 'string' },
      email: { type: 'string' },
      homeId: { type: 'string' },
      createdAt: { type: 'number' },
      updatedAt: { type: 'number' },
    },
  };

  const userBody = {
    type: 'object',
    properties: {
      fullName: { type: 'string', minLength: 3 },
      email: { type: 'string', format: 'email' },
      homeId: { type: 'string' },
    },
  };

  app.get(
    '/users',
    {
      schema: {
        querystring: queryParams,
        response: { 200: { type: 'array', items: userResp } },
      },
    },
    async (req) => await UserHandlers.getUsers(req, app.sqlite)
  );

  app.post(
    '/users',
    {
      schema: {
        body: { ...userBody, required: ['fullName', 'email', 'homeId'] },
        response: { 200: userResp },
      },
    },
    async (req) => await UserHandlers.createUser(req, app)
  );

  app.get(
    '/users/:id',
    { schema: { params: idParam, response: { 200: userResp } } },
    async (req) => await UserHandlers.getUser(req, app.sqlite)
  );

  app.put(
    '/users/:id',
    {
      schema: {
        params: idParam,
        body: {
          ...userBody,
          anyOf: [{ required: ['fullName'] }, { required: ['email'] }],
        },
        response: { 200: userResp },
      },
    },
    async (req) => await UserHandlers.updateUser(req, app.sqlite)
  );

  app.delete(
    '/users/:id',
    { schema: { params: idParam } },
    async (req) => await UserHandlers.deleteUser(req, app.sqlite)
  );
};
export default usersRoutes;
