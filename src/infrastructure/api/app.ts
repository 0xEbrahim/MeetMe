import express from "express";
import morgan from "morgan";
import cors from "cors";
import env from "../../shared/constant/env";
import routes from "./routes/routes";
import "../../shared/container/index";
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(cors());

app.use("/api/v1", routes);

export default app;
