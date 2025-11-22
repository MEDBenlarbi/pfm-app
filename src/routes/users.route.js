import * as UserHandlers from '../handlers/users.handlers.js';
import { AppError, idParam, idProp } from '../utils.js';

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

  const tags = ['users'];

  app.get(
    '/users',
    {
      preHandler: [app.authenticate],
      schema: {
        querystring: queryParams,
        response: { 200: { type: 'array', items: userResp } },
        tags,
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
        tags,
      },
    },
    async (req) => await UserHandlers.createUser(req, app)
  );

  app.get(
    '/users/:id',
    {
      preHandler: [app.authenticate],
      schema: { params: idParam, response: { 200: userResp }, tags },
    },
    async (req) => {
      if (req.params.id !== req.user.userId) {
        throw new AppError(403, 'Cannot access other users data');
      }
      return await UserHandlers.getUser(req, app.sqlite);
    }
  );

  app.put(
    '/users/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        params: idParam,
        body: {
          ...userBody,
          anyOf: [{ required: ['fullName'] }, { required: ['email'] }],
        },
        response: { 200: userResp },
        tags,
      },
    },
    async (req) => {
      if (req.params.id !== req.user.userId) {
        throw new AppError(403, 'Cannot update other users');
      }
      return await UserHandlers.updateUser(req, app.sqlite);
    }
  );

  app.delete(
    '/users/:id',
    {
      preHandler: [app.authenticate],
      schema: { params: idParam, tags },
    },
    async (req) => {
      if (req.params.id !== req.user.userId) {
        throw new AppError(403, 'Cannot delete other users');
      }
      return await UserHandlers.deleteUser(req, app.sqlite);
    }
  );

  app.get(
    '/me',
    {
      preHandler: [app.authenticate],
      schema: {
        response: { 200: userResp },
        tags: ['users'],
      },
    },
    async (req) => {
      return await UserHandlers.getUser(
        { params: { id: req.user.userId } },
        app.sqlite
      );
    }
  );
};

export default usersRoutes;
