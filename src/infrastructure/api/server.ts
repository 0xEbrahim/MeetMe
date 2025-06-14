import "reflect-metadata";
import app from "./app";
import { dbConnection } from "../database/connection";
import env from "../../shared/constant/env";

process.on("uncaughtException", (err) => {
  server.close(() => {
    process.exit(1);
  });
});

const server = app.listen(env.PORT, () => {
  console.log(`Server started successfully at port ${env.PORT}.`);
  dbConnection();
});
process.on("unhandledRejection", (reason) => {
  server.close(() => {
    process.exit(1);
  });
});
