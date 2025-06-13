import dotenv from "dotenv";
import env from "env-var";

dotenv.config();
const prod = `redis://${env.get("REDIS_PROD_HOST").required().asString()}:${env
  .get("REDIS_PORT")
  .required()
  .asPortNumber()}`;
const dev = env.get("REDIS_DEV_HOST").required().asString();
const redisHost =
  env.get("NODE_ENV").required().asString() === "development" ||
  env.get("NODE_ENV").required().asString() === "testing"
    ? dev
    : prod;

export default {
  NODE_ENV: env.get("NODE_ENV").required().asString(),
  DEV_URL: env.get("DEV_URL").required().asString(),
  PORT: env.get("APP_PORT").required().asPortNumber(),
  MONGO_USERNAME: env.get("MONGO_INITDB_ROOT_USERNAME").required().asString(),
  MONGO_PASSWORD: env.get("MONGO_INITDB_ROOT_PASSWORD").required().asString(),
  ACCESS_TOKEN_SECRET: env.get("ACCESS_TOKEN_SECRET").required().asString(),
  REFRESH_TOKEN_SECRET: env.get("REFRESH_TOKEN_SECRET").required().asString(),
  MONGO_DB_HOST: env.get("MONGO_DB_HOST").required().asString(),
  MONGO_DB_PORT: env.get("MONGO_DB_PORT").required().asPortNumber(),
  TESTING_DB_URI: env.get("TESTING_DB_URI").required().asString(),
  ME_USERNAME: env.get("ME_CONFIG_MONGODB_ADMINUSERNAME").required().asString(),
  ME_PASSWORD: env.get("ME_CONFIG_MONGODB_ADMINPASSWORD").required().asString(),
  ME_URI: env.get("ME_CONFIG_MONGODB_URL").required().asString(),
  ME_AUTH: env.get("ME_CONFIG_BASICAUTH").required().asBool(),
  LOCAL_DB_URI: env.get("LOCAL_DB_URI").required().asString(),
  SMTP_HOST: env.get("SMTP_HOST").required().asString(),
  SMTP_PORT: env.get("SMTP_PORT").required().asPortNumber(),
  SMTP_USER: env.get("SMTP_USER").required().asString(),
  SMTP_PASS: env.get("SMTP_PASS").required().asString(),
  REDIS_URI: redisHost,
};
