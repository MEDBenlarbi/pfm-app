import * as CategoryHandlers from '../handlers/categories.handlers.js';
import { idParam, idProp } from '../utils.js';

/**
 * @param {import('fastify').FastifyInstance} app
 */
const categoriesRoutes = (app) => {
  const queryParams = {
    type: 'object',
    properties: { name: { type: 'string' } },
  };

  const categoryResp = {
    type: 'object',
    properties: {
      ...idProp,
      name: { type: 'string' },
      description: { type: 'string' },
      createdAt: { type: 'number' },
      updatedAt: { type: 'number' },
    },
  };

  const categoryBody = {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 3 },
      description: { type: 'string' },
    },
  };

  app.get(
    '/categories',
    {
      schema: {
        querystring: queryParams,
        response: { 200: { type: 'array', items: categoryResp } },
      },
    },
    async (req) => await CategoryHandlers.getCategories(req, app.sqlite)
  );

  app.post(
    '/categories',
    {
      schema: {
        body: { ...categoryBody, required: ['name'] },
        response: { 200: categoryResp },
      },
    },
    async (req) => await CategoryHandlers.createCategory(req, app)
  );

  app.get(
    '/categories/:id',
    { schema: { params: idParam, response: { 200: categoryResp } } },
    async (req) => await CategoryHandlers.getCategory(req, app.sqlite)
  );

  app.put(
    '/categories/:id',
    {
      schema: {
        params: idParam,
        body: {
          ...categoryBody,
          anyOf: [{ required: ['name'] }, { required: ['description'] }],
        },
        response: { 200: categoryResp },
      },
    },
    async (req) => await CategoryHandlers.updateCategory(req, app.sqlite)
  );

  app.delete(
    '/categories/:id',
    { schema: { params: idParam } },
    async (req) => await CategoryHandlers.deleteCategory(req, app.sqlite)
  );
};
export default categoriesRoutes;
