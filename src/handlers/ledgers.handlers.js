/**
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 */
export const getLedgers = async (req, db) => {
  let query = `
    SELECT ledgers.*, users.fullName AS userName, categories.name AS categoryName, homes.name AS homeName
    FROM ledgers 
    LEFT JOIN users ON ledgers.userId = users.id
    LEFT JOIN categories ON ledgers.categoryId = categories.id
    LEFT JOIN homes ON ledgers.homeId = homes.id
    WHERE 1=1
  `;
  const params = [];

  if (req.query.userId) {
    query += ' AND ledgers.userId = ?';
    params.push(req.query.userId);
  }

  if (req.query.homeId) {
    query += ' AND ledgers.homeId = ?';
    params.push(req.query.homeId);
  }

  if (req.query.categoryId) {
    query += ' AND ledgers.categoryId = ?';
    params.push(req.query.categoryId);
  }

  return await db.all(query, params);
};
/**
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('fastify').FastifyInstance} app
 */
export const createLedger = async (req, app) => {
  const { name, description, amount, date, type, userId, homeId, categoryId } =
    req.body;
  const uuid = app.uuid();
  const timeStamp = Date.now();

  try {
    const stmt = await app.sqlite.prepare(
      `INSERT INTO ledgers 
        (id, name, description, amount, date, type, createdAt, updatedAt, userId, homeId, categoryId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
    );

    return await stmt.get(
      uuid,
      name,
      description,
      amount,
      date,
      type,
      timeStamp,
      timeStamp,
      userId,
      homeId,
      categoryId
    );
  } catch (err) {
    throw err;
  }
};

/**
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 */
export const getLedger = async (req, db) => {
  const query = `
    SELECT ledgers.*, users.fullName AS userName, categories.name AS categoryName, homes.name AS homeName
    FROM ledgers
    LEFT JOIN users ON ledgers.userId = users.id
    LEFT JOIN categories ON ledgers.categoryId = categories.id
    LEFT JOIN homes ON ledgers.homeId = homes.id
    WHERE ledgers.id = ?
  `;
  return await db.get(query, [req.params.id]);
};

/**
 * @param {import ('fastify').FastifyRequest} req
 * @param {import ('sqlite').Database} db
 */
export const updateLedger = async (req, db) => {
  const params = [Date.now()];
  let query = 'UPDATE ledgers SET updatedAt = ?';

  const fields = [
    'name',
    'description',
    'amount',
    'date',
    'type',
    'userId',
    'homeId',
    'categoryId',
  ];
  for (const field of fields) {
    if (req.body[field] !== undefined) {
      query += `, ${field} = ?`;
      params.push(req.body[field]);
    }
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
export const deleteLedger = async (req, db) => {
  const result = await db.run('DELETE FROM ledgers WHERE id = ?', [
    req.params.id,
  ]);
  return { deleted: result.changes ? true : false };
};
