import Fastify from "fastify";

const server = Fastify({
  logger: true,
});

server.setErrorHandler((err, req, res) => {
  if (err instanceof Fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
    this.log.error(err);
    res.status(500).send({ message: "internal server error" });
  } else {
    res.send(err);
  }
});

const start = async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
export default start;
