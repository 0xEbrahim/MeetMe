import "reflect-metadata";
import app from "./app";
import { dbConnection } from "../database/connection";
import env from "../../shared/constant/env";

app.listen(env.PORT, () => {
  console.log(`Server started successfully at port ${env.PORT}.`);
  dbConnection();
});
