--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS homes (
  id UUID PRIMARY KEY,
  name TINYTEXT UNIQUE NOT NULL,
  description TEXT,
  createdAt TIMESTAMP NOT NULL,
  updatedAT TIMESTAMP NOT NULL
)

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  fullName TINYTEXT NOT NULL,
  email UNIQUE NOT NULL,
  createdAt TIMESTAMP NOT NULL,
  updatedAT TIMESTAMP NOT NULL
)

CREATE TABLE IF NOT EXISTS homeUsers (
  userId UUID NOT NULL,
  homeId UUID NOT NULL,
  createdAt TIMESTAMP NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
  FOREIGN KEY (homeId) REFERENCES homes(homeId) ON DELETE CASCADE
)


CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY,
  name TINYTEXT UNIQUE NOT NULL,
  description TEXT,
  createdAt TIMESTAMP NOT NULL,
  updatedAT TIMESTAMP NOT NULL
)

CREATE TABLE IF NOT EXISTS ledgers (
  id UUID PRIMARY KEY,
  name TINYTEXT UNIQUE NOT NULL,
  description TEXT,
  amount DEC(10, 2),
  date TIMESTAMP NOT NULL,
  type TINYTEXT NOT NULL CHECK(type IN ('CREDIT', 'DEBIT')),
  createdAt TIMESTAMP NOT NULL,
  updatedAT TIMESTAMP NOT NULL,
  userId UUID NOT NULL,
  homeId UUID NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
  FOREIGN KEY (homeId) REFERENCES homes(homeId) ON DELETE CASCADE,
  FOREIGN KEY (categoryId) REFERENCES categories(categoryId) ON DELETE CASCADE
)

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------_

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS homes;
DROP TABLE IF EXISTS ledgers;
DROP TABLE IF EXISTS categories;