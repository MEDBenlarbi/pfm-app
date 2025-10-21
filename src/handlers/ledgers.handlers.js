/**
 *
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 *
 */

export const getLedgers = async (req, db) => {
  let query = "SELECT * FROM ledgers WHERE 1=1";
  const params = [];

  if (req.query.userId) {
    query += " AND userId = ?";
    params.push(req.query.userId);
  }

  if (req.query.homeId) {
    query += " AND homeId = ?";
    params.push(req.query.homeId);
  }

  if (req.query.categoryId) {
    query += " AND categoryId = ?";
    params.push(req.query.categoryId);
  }

  if (req.query.type) {
    query += " AND type = ?";
    params.push(req.query.type);
  }

  try {
    const resp = await db.all(query, params);
    return resp;
  } catch (err) {
    throw err;
  }
};

export const createLedger = async (req, db) => {
  const { name, description, amount, date, type, userId, homeId, categoryId } =
    req.body;

  if (!name || !amount || !date || !type || !userId || !homeId || !categoryId) {
    throw new Error("Missing required fields");
  }

  const now = Date.now();
  const query = `
    INSERT INTO ledgers (name, description, amount, date, type, createdAt, updatedAt, userId, homeId, categoryId) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const result = await db.run(query, [
    name,
    description,
    amount,
    date,
    type,
    now,
    now,
    userId,
    homeId,
    categoryId,
  ]);

  return {
    id: result.lastID,
    name,
    description,
    amount,
    date,
    type,
    createdAt: now,
    updatedAt: now,
    userId,
    homeId,
    categoryId,
  };
};

export const updateLedger = async (req, db) => {
  const { id } = req.params;
  const { name, description, amount, date, type, userId, homeId, categoryId } =
    req.body;

  if (!id) {
    throw new Error("ID is required");
  }

  const now = Date.now();
  const query = `
    UPDATE ledgers
    SET name = ?,
        description = ?,
        amount = ?,
        date = ?,
        type = ?,
        updatedAt = ?,
        userId = ?,
        homeId = ?,
        categoryId = ?
    WHERE id = ?
  `;
  const result = await db.run(query, [
    name,
    description,
    amount,
    date,
    type,
    now,
    userId,
    homeId,
    categoryId,
    id,
  ]);
  return result;
};

export const deleteLedger = async (req, db) => {
  const { id } = req.params;
  if (!id) throw new Error("ID is required");

  const result = await db.run("DELETE FROM ledgers WHERE id = ?", [id]);
  return { deleted: result.changes ? true : false };
};
