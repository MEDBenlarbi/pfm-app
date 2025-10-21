--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS homes (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    fullName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS homeUsers (
    userId TEXT NOT NULL,
    homeId TEXT NOT NULL,
    createdAt INT NOT NULL,
    PRIMARY KEY (userId, homeId),
    FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (homeId) REFERENCES homes (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS ledgers (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    amount REAL NOT NULL,
    date INTEGER NOT NULL,
    type TEXT CHECK (type IN ('CREDIT', 'DEBIT')) NOT NULL,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL,
    userId TEXT NOT NULL,
    homeId TEXT NOT NULL,
    categoryId TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (homeId) REFERENCES homes (id) ON DELETE CASCADE FOREIGN KEY (categoryId) REFERENCES categories (id) ON DELETE CASCADE
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE IF EXISTS homes;

DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS homeUsers;

DROP TABLE IF EXISTS categories;

DROP TABLE IF EXISTS ledgers;