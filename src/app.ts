import express from "express";
import morgan from "morgan";
import env from "./shared/constant/env";
import mongoose from "mongoose";
import { User } from "./infrastructure/models/User";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

app.get("/", async (req, res, next) => {
  await User.insertOne({ name: "Ebrahim" });
  const user = await User.findOne({ name: "Ebrahim" });
  res.json(user);
});

export default app;
