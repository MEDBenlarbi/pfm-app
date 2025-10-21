/**
 *
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 */
export const getHomes = async (req, db) => {
  let query = 'SELECT * FROM Homes WHERE 1=1';
  const params = [];

  if (req.query.userId) {
    query += ' AND userId = ?';
    params.push(req.query.userId);
  }

  if (req.query.name) {
    query += ' AND name = ?';
    params.push(req.query.name);
  }

  try {
    const resp = await db.all(query, params);
    return resp;
  } catch (err) {
    throw err;
  }
};

/**
 *
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('fastify').FastifyInstance} app
 */
export const createHome = async (req, app) => {
  try {
    const uuid = app.uuid();
    const timeStamp = Date.now();

    const stmt = await app.sqlite.prepare(
      'INSERT INTO homes (id, name, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?) RETURNING *'
    );

    return await stmt.get(
      uuid,
      req.body.name,
      req.body.description,
      timeStamp,
      timeStamp
    );
  } catch (err) {
    throw err;
  }
};

/**
 *
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 */
export const getHome = async (req, db) => {
  try {
    let query = 'SELECT * FROM homes WHERE id = ?';
    return await db.get(query, [req.params.id]);
  } catch (err) {
    throw err;
  }
};

/**
 *
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 */
export const updateHome = async (req, db) => {
  try {
    const params = [Date.now()];

    let query = 'UPDATE homes SET updatedAt = ?';

    if (req.body.name) {
      query += ', name = ?';
      params.push(req.body.name);
    }

    if (req.body.description) {
      query += ', description = ?';
      params.push(req.body.description);
    }

    query += ' WHERE id = ? RETURNING *';
    params.push(req.params.id);

    const stmt = await db.prepare(query);

    return await stmt.get(params);
  } catch (err) {
    throw err;
  }
};

/**
 *
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 */
export const deleteHome = async (req, db) => {
  const { id } = req.params;

  const result = await db.run('DELETE FROM homes WHERE id = ?', [id]);
  return { deleted: result.changes ? true : false };
};
