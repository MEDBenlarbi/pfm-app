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
  try {
    const resp = await db.all(query, params);
    return resp;
  } catch (err) {
    throw err;
  }
};

export const createHome = async (req, db) => {
  const { name, description } = req.body;

  if (!name) {
    throw new Error("Name is required");
  }
  const now = Date.now();
  const query =
    "INSERT INTO homes (name, description, createdAt, updatedAt) VALUES (?, ?, ?, ?)";
  const result = await db.run(query, [name, description, now, now]);

  return {
    id: result.lastID,
    name,
    description,
    createdAt: now,
    updatedAt: now,
  };
};

export const updateHome = async (req, db) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!id) {
    throw new Error("ID is required");
  }

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
  if (!id) throw new Error("ID is required");

  const result = await db.run("DELETE FROM homes WHERE id = ?", [id]);
  return { deleted: result.changes ? true : false };
};
