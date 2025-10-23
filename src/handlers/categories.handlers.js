/**
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 */
export const getCategories = async (req, db) => {
  let query = 'SELECT * FROM categories WHERE 1=1';
  const params = [];

  if (req.query.name) {
    query += ' AND name = ?';
    params.push(req.query.name);
  }

  try {
    return await db.all(query, params);
  } catch (err) {
    throw err;
  }
};
/**
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('fastify').FastifyInstance} app
 */
export const createCategory = async (req, app) => {
  try {
    const uuid = app.uuid();
    const timeStamp = Date.now();

    const stmt = await app.sqlite.prepare(
      'INSERT INTO categories (id, name, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?) RETURNING *'
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
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 */
export const getCategory = async (req, db) => {
  return await db.get('SELECT * FROM categories WHERE id = ?', [req.params.id]);
};

/**
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 */
export const updateCategory = async (req, db) => {
  try {
    const params = [Date.now()];
    let query = 'UPDATE categories SET updatedAt = ?';

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
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 */
export const deleteCategory = async (req, db) => {
  const result = await db.run('DELETE FROM categories WHERE id = ?', [
    req.params.id,
  ]);
  return { deleted: result.changes ? true : false };
};
