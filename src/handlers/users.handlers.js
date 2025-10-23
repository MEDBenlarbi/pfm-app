/**
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 */
export const getUsers = async (req, db) => {
  let query = `
    SELECT users.*, homeUsers.homeId
    FROM users
    LEFT JOIN homeUsers ON users.id = homeUsers.userId
    WHERE 1=1
  `;
  const params = [];

  if (req.query.homeId) {
    query += ' AND homeUsers.homeId = ?';
    params.push(req.query.homeId);
  }

  if (req.query.email) {
    query += ' AND users.email = ?';
    params.push(req.query.email);
  }

  return await db.all(query, params);
};
/**
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('fastify').FastifyInstance} app
 */
export const createUser = async (req, app) => {
  const { fullName, email, homeId } = req.body;
  const uuid = app.uuid();
  const timeStamp = Date.now();

  try {
    const stmt = await app.sqlite.prepare(
      'INSERT INTO users (id, fullName, email, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?) RETURNING *'
    );
    const user = await stmt.get(uuid, fullName, email, timeStamp, timeStamp);

    const linkStmt = await app.sqlite.prepare(
      'INSERT INTO homeUsers (userId, homeId, createdAt) VALUES (?, ?, ?)'
    );
    await linkStmt.run(uuid, homeId, timeStamp);

    return user;
  } catch (err) {
    throw err;
  }
};

/**
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 */
export const getUser = async (req, db) => {
  const query = `
    SELECT users.*, homeUsers.homeId
    FROM users 
    LEFT JOIN homeUsers ON users.id = homeUsers.userId
    WHERE users.id = ?
  `;
  return await db.get(query, [req.params.id]);
};

/**
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 */
export const updateUser = async (req, db) => {
  const params = [Date.now()];
  let query = 'UPDATE users SET updatedAt = ?';

  if (req.body.fullName) {
    query += ', fullName = ?';
    params.push(req.body.fullName);
  }

  if (req.body.email) {
    query += ', email = ?';
    params.push(req.body.email);
  }

  query += ' WHERE id = ? RETURNING *';
  params.push(req.params.id);

  const stmt = await db.prepare(query);
  return await stmt.get(params);
};

/**
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 */
export const deleteUser = async (req, db) => {
  const { id } = req.params;
  const result = await db.run('DELETE FROM users WHERE id = ?', [id]);
  return { deleted: result.changes ? true : false };
};
