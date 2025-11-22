import * as LedgerHandlers from '../handlers/ledgers.handlers.js';
import { AppError, idParam, idProp } from '../utils.js';

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
      preHandler: [app.authenticate],
      schema: {
        querystring: queryParams,
        response: { 200: { type: 'array', items: ledgerResp } },
        tags,
      },
    },
    async (req) => {
      req.query.userId = req.user.userId;
      return await LedgerHandlers.getLedgers(req, app.sqlite);
    }
  );

  app.post(
    '/ledgers',
    {
      preHandler: [app.authenticate],
      schema: {
        body: {
          ...ledgerBody,
          required: ['name', 'amount', 'date', 'type', 'homeId', 'categoryId'],
        },
        response: { 200: ledgerResp },
        tags,
      },
    },
    async (req) => {
      req.body.userId = req.user.userId;
      return await LedgerHandlers.createLedger(req, app);
    }
  );

  app.get(
    '/ledgers/:id',
    {
      preHandler: [app.authenticate],
      schema: {
        params: idParam,
        response: { 200: ledgerResp },
        tags,
      },
    },
    async (req) => {
      const ledger = await LedgerHandlers.getLedger(req, app.sqlite);
      if (ledger && ledger.userId !== req.user.userId) {
        throw new AppError(403, 'Access denied');
      }
      return ledger;
    }
  );

  app.put(
    '/ledgers/:id',
    {
      preHandler: [app.authenticate],
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
    async (req) => {
      const ledger = await LedgerHandlers.getLedger(req, app.sqlite);
      if (ledger && ledger.userId !== req.user.userId) {
        throw new AppError(403, 'Cannot update other users ledgers');
      }
      return await LedgerHandlers.updateLedger(req, app.sqlite);
    }
  );

  app.delete(
    '/ledgers/:id',
    {
      preHandler: [app.authenticate],
      schema: { params: idParam, tags },
    },
    async (req) => {
      const ledger = await LedgerHandlers.getLedger(req, app.sqlite);
      if (ledger && ledger.userId !== req.user.userId) {
        throw new AppError(403, 'Cannot delete other users ledgers');
      }
      return await LedgerHandlers.deleteLedger(req, app.sqlite);
    }
  );
};
export default ledgersRoutes;
