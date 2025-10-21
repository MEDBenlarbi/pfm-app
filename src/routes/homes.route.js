import * as HomeHandlers from "../handlers/homes.handlers.js";
import { idParam, idProp } from "../utils.js";

/**
 * @param {import('fastify').FastifyInstance} app
 */
const homesRoutes = (app) => {
  const queryParams = {
    type: "object",
    properties: { name: { type: "string" }, userId: { type: "string" } },
  };

  const homeResp = {
    type: "object",
    properties: {
      ...idProp,
      name: { type: "string" },
      email: { type: "string" },
      description: { type: "string" },
      createdAt: { type: "number" },
      updatedAt: { type: "number" },
    },
  };

  const homeBody = {
    type: "object",
    properties: {
      name: { type: "string" },
      description: { type: "string" },
    },
  };

  app.get(
    "/homes",
    {
      schema: {
        querystring: queryParams,
        response: {
          200: { type: "array", items: homeResp },
        },
      },
    },
    async (req) => await HomeHandlers.getHomes(req, app.sqlite)
  );

  app.get(
    "/homes/:id",
    {
      schema: {
        params: idParam,
        response: {
          200: homeResp,
        },
      },
    },
    async (req) => await HomeHandlers.getHome(req, app.sqlite)
  );
  app.post(
    "/homes",
    {
      schema: {
        body: homeBody,
        response: {
          200: homeResp,
        },
      },
    },
    async (req) => await HomeHandlers.createHome(req, app)
  );
  app.put(
    "/homes/:id",
    {
      schema: {
        params: idParam,
        body: { ...homeBody },
        response: {
          200: homeResp,
        },
      },
    },
    async (req) => await HomeHandlers.updateHome(req, app.sqlite)
  );
  app.delete(
    "/homes/:id",
    {
      schema: {
        params: idParam,
      },
    },
    async (req) => await HomeHandlers.deleteHome(req, app.sqlite)
  );
};
export default homesRoutes;
