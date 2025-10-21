import fastifyPlugin from "fastify-plugin";
import { v4 } from "uuid";

const generateUUID = (app) => {
  if (app.uuid) {
    throw new AppError(500, "uuid has been already registered");
  }
  return app.decorate("uuid", v4);
};

export default fastifyPlugin(generateUUID);
