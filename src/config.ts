require("dotenv").config();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_CONNECTION_STRING,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  root: process.env.ROOT,
  storeId: process.env.STORE_ID,
  storeSecret: process.env.STORE_PASSWORD,
};

export const config = Object.freeze(_config);
