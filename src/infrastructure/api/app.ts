import express from "express";
import morgan from "morgan";
import cors from "cors";
import env from "../../shared/constant/env";
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(cors());

export default app;
