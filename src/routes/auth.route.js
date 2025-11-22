import { googleCallbackHandler } from '../handlers/auth.handlers.js';
import { generateJwt } from '../utils.js';

const authRoutes = (server) => {
  server.get('/api/auth/google/callback', async (req, reply) => {
    return googleCallbackHandler(req, reply, server);
  });

  server.post(
    '/auth/refresh',
    {
      preHandler: [server.authenticate],
    },
    async (req, reply) => {
      const newToken = generateJwt(server, req.user);
      return { success: true, token: newToken };
    }
  );
};

export default authRoutes;
