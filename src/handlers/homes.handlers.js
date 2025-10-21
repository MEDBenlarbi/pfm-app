/**
 *
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 *
 */

export const getHomes = async (req, db) => {
  let query = "SELECT * FROM Homes WHERE 1=1";
  const params = [];

  if (req.query.userId) {
    query += " AND userId = ?";
    params.push(req.query.userId);
  }

  if (req.query.name) {
    query += " AND name = ?";
    params.push(req.query.name);
  }

  try {
    const resp = await db.all(query, params);
    return resp;
  } catch (err) {
    throw err;
  }
};
export const getHome = async (req, db) => {
  let query = "SELECT * FROM homes WHERE id = ?";

  try {
    return await db.get(query, [req.params.id]);
  } catch (err) {
    throw err;
  }
};

export const createHome = async (req, app) => {
  try {
    let query =
      "INSERT INTO homes (id, name, description, createdAt, updatedAt) VALUES (?,?, ?, ?, ?)";
    const result = await app.sqlite.run(query, [
      app.uuid(),
      req.body.name,
      req.body.description,
      Date.now(),
      Date.now(),
    ]);
    query = "SELECT * FROM homes WHERE id = ?";

    return await app.sqlite.get(query, [result.lastID]);
  } catch (err) {
    throw err;
  }
};

export const updateHome = async (req, db) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const now = Date.now();
  const query = `
    UPDATE homes
    SET name = ?,
        description = ?,
        updatedAt = ?
    WHERE id = ?
  `;
  const result = await db.run(query, [name, description, now, id]);
  return result;
};

export const deleteHome = async (req, db) => {
  const { id } = req.params;

  const result = await db.run("DELETE FROM homes WHERE id = ?", [id]);
  return { deleted: result.changes ? true : false };
};
