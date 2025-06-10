import path from "path";
import dotenv from "dotenv";
import env from "env-var";

dotenv.config();

export default {
  NODE_ENV: env.get("NODE_ENV").required().asString(),
  PORT: env.get("PORT").required().asPortNumber(),
  MONGO_USERNAME: env.get("MONGO_INITDB_ROOT_USERNAME").required().asString(),
  MONGO__PASSWORD: env
    .get("ME_CONFIG_MONGODB_ADMINPASSWORD")
    .required()
    .asString(),
  ME_USERNAME: env.get("ME_CONFIG_MONGODB_ADMINUSERNAME").required().asString(),
  ME_PASSWORD: env.get("ME_CONFIG_MONGODB_ADMINPASSWORD").required().asString(),
  ME_URI: env.get("ME_CONFIG_MONGODB_URL").required().asString(),
  ME_AUTH: env.get("ME_CONFIG_BASICAUTH").required().asBool(),
};
