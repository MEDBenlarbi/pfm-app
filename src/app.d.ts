import { Database } from "sqlite";

declare module "fastify" {
  interface FastifyInstance {
    sqlite: Database;
    uuid: () => string;
  }
}
