import * as LedgerHandlers from '../handlers/ledgers.handlers.js';
import { idParam, idProp } from '../utils.js';

/**
 * @param {import('fastify').FastifyInstance} app
 */
const ledgersRoutes = (app) => {
  const queryParams = {
    type: 'object',
    properties: {
      userId: { type: 'string' },
      homeId: { type: 'string' },
      categoryId: { type: 'string' },
    },
  };

  const ledgerResp = {
    type: 'object',
    properties: {
      ...idProp,
      name: { type: 'string' },
      description: { type: 'string' },
      amount: { type: 'number' },
      date: { type: 'number' },
      type: { type: 'string', enum: ['CREDIT', 'DEBIT'] },
      userId: { type: 'string' },
      homeId: { type: 'string' },
      categoryId: { type: 'string' },
      createdAt: { type: 'number' },
      updatedAt: { type: 'number' },
    },
  };

  const ledgerBody = {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 3 },
      description: { type: 'string' },
      amount: { type: 'number' },
      date: { type: 'number' },
      type: { type: 'string', enum: ['CREDIT', 'DEBIT'] },
      userId: { type: 'string' },
      homeId: { type: 'string' },
      categoryId: { type: 'string' },
    },
  };

  const tags = ['ledgers'];

  app.get(
    '/ledgers',
    {
      schema: {
        querystring: queryParams,
        response: { 200: { type: 'array', items: ledgerResp } },
        tags,
      },
    },
    async (req) => await LedgerHandlers.getLedgers(req, app.sqlite)
  );

  app.post(
    '/ledgers',
    {
      schema: {
        body: {
          ...ledgerBody,
          required: [
            'name',
            'amount',
            'date',
            'type',
            'userId',
            'homeId',
            'categoryId',
          ],
        },
        response: { 200: ledgerResp },
        tags,
      },
    },
    async (req) => await LedgerHandlers.createLedger(req, app)
  );

  app.get(
    '/ledgers/:id',
    {
      schema: {
        params: idParam,
        response: { 200: ledgerResp },
        tags,
      },
    },
    async (req) => await LedgerHandlers.getLedger(req, app.sqlite)
  );

  app.put(
    '/ledgers/:id',
    {
      schema: {
        params: idParam,
        body: {
          ...ledgerBody,
          anyOf: [
            { required: ['name'] },
            { required: ['amount'] },
            { required: ['type'] },
          ],
        },
        response: { 200: ledgerResp },
        tags,
      },
    },
    async (req) => await LedgerHandlers.updateLedger(req, app.sqlite)
  );

  app.delete(
    '/ledgers/:id',
    { schema: { params: idParam, tags } },
    async (req) => await LedgerHandlers.deleteLedger(req, app.sqlite)
  );
};
export default ledgersRoutes;
