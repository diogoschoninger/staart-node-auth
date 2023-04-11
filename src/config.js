import dotenv from "dotenv";
const immutable = Object.freeze;

dotenv.config();

const database = immutable({
  client: "mysql2",
  connection: immutable({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  }),
  migrations: immutable({
    tableName: "migrations",
  }),
});

export const encryption = immutable({
  salt: "salt",
  iterations: 100000,
  keyLength: 64,
  digest: "sha512",
});

export const jwtConfig = immutable({
  secret: "staart",
  expiration: "4h",
  audience: "urn:api:client",
  issuer: "urn:api:issuer",
});

export default database;
