import "reflect-metadata";
import express from "express";
import path from "path";
import morgan from "morgan";
import cors from "cors";
import env from "../../shared/constant/env";
import routes from "./routes/routes";
import "../../shared/container/index";
import errorHandler from "../../shared/errors/errorHandler";
import cookieParser from "cookie-parser";
const app = express();

app.set("views", path.join(__dirname, "../../views"));
app.set("view engine", "ejs");
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(cors());
app.use("/api/v1", routes);
app.use(errorHandler);
app.all(/(.*)/, (req, res, next) => {
  res
    .status(404)
    .json({ status: "ERROR", message: `${req.originalUrl} not found` });
});
export default app;
