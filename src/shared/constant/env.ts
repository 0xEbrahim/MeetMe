
import dotenv from "dotenv";
import env from "env-var";

dotenv.config();

export default {
  NODE_ENV: env.get("NODE_ENV").required().asString(),
  PORT: env.get("APP_PORT").required().asPortNumber(),
  MONGO_USERNAME: env.get("MONGO_INITDB_ROOT_USERNAME").required().asString(),
  MONGO_PASSWORD: env.get("MONGO_INITDB_ROOT_PASSWORD").required().asString(),
  // MONGO_DB_NAME: env.get("MONGO_INITDB_DATABASE").required().asString(),
  MONGO_DB_HOST: env.get("MONGO_DB_HOST").required().asString(),
  MONGO_DB_PORT: env.get("MONGO_DB_PORT").required().asPortNumber(),
  ME_USERNAME: env.get("ME_CONFIG_MONGODB_ADMINUSERNAME").required().asString(),
  ME_PASSWORD: env.get("ME_CONFIG_MONGODB_ADMINPASSWORD").required().asString(),
  ME_URI: env.get("ME_CONFIG_MONGODB_URL").required().asString(),
  ME_AUTH: env.get("ME_CONFIG_BASICAUTH").required().asBool(),
  LOCAL_DB_URI: env.get("LOCAL_DB_URI").required().asString(),
};
