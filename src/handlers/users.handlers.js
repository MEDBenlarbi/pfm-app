/**
 *
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 *
 */

export const getUsers = async (req, db) => {
  let query = "SELECT * FROM users WHERE 1=1";
  const params = [];

  if (req.query.email) {
    query += " AND email = ?";
    params.push(req.query.email);
  }

  if (req.query.fullName) {
    query += " AND fullName LIKE ?";
    params.push(`%${req.query.fullName}%`);
  }

  try {
    const resp = await db.all(query, params);
    return resp;
  } catch (err) {
    throw err;
  }
};

export const createUser = async (req, db) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new Error("Full name and email are required");
  }

  const now = Date.now();
  const query =
    "INSERT INTO users (fullName, email, createdAt, updatedAt) VALUES (?, ?, ?, ?)";
  const result = await db.run(query, [fullName, email, now, now]);

  return {
    id: result.lastID,
    fullName,
    email,
    createdAt: now,
    updatedAt: now,
  };
};

export const updateUser = async (req, db) => {
  const { id } = req.params;
  const { fullName, email } = req.body;

  if (!id) {
    throw new Error("ID is required");
  }

  const now = Date.now();
  const query = `
    UPDATE users
    SET fullName = ?,
        email = ?,
        updatedAt = ?
    WHERE id = ?
  `;
  const result = await db.run(query, [fullName, email, now, id]);
  return result;
};

export const deleteUser = async (req, db) => {
  const { id } = req.params;
  if (!id) throw new Error("ID is required");

  const result = await db.run("DELETE FROM users WHERE id = ?", [id]);
  return { deleted: result.changes ? true : false };
};
