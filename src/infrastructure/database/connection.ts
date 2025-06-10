import mongoose from "mongoose";
import env from "../../shared/constant/env";

export const dbConnection = async () => {
  const DB_URI =
    env.NODE_ENV === "production"
      ? `mongodb://${env.MONGO_USERNAME}:${env.MONGO_PASSWORD}@${env.MONGO_DB_HOST}:${env.MONGO_DB_PORT}/`
      : `${env.LOCAL_DB_URI}`;
  await mongoose
    .connect(DB_URI)
    .then(() => {
      console.log("Database connected successfully.");
    })
    .catch((err) => console.log(err));
};
