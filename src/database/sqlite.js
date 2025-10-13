import fastifyPlugin from "fastify-plugin";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { open } from "sqlite";
import sqlite3 from "sqlite3";

/**
 *
 * @param {import('fastify').FastifyInstance} app
 * @param {{dbFile: string}} opts
 */
const sqliteConnector = async (app, opts) => {
  const dir = dirname(fileURLToPath(import.meta.url));
  try {
    if (app.sqlite) {
      throw new Error("sqlite has been already registered");
    }

    const sqlite = await open({
      filename: opts.dbFile ?? "./db.sqlite",
      driver: sqlite3.Database,
    });

    await sqlite.migrate({ migrationPath: resolve(dir, "./migration") });

    return app.decorate("sqlite", sqlite);
  } catch (err) {
    return err;
  }
};

export default fastifyPlugin(sqliteConnector);
