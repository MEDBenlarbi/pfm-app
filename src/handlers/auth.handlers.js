import { fetchGoogleUser, findOrCreateUser, generateJwt } from '../utils.js';

export const googleCallbackHandler = async (req, reply, server) => {
  try {
    const token =
      await server.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(req);
    const googleUser = await fetchGoogleUser(token.token.access_token);
    const user = await findOrCreateUser(server, googleUser);
    const jwt = generateJwt(server, user);

    return reply.send({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
      token: jwt,
    });
  } catch (error) {
    server.log.error(error);
    return reply.status(500).send({
      success: false,
      error: 'Authentication failed',
    });
  }
};
