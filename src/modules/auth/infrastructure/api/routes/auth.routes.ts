import express from "express";
import { container } from "tsyringe";
import AuthController from "../controllers/Auth.Controller";

const router = express.Router();
const authController = container.resolve(AuthController);

router.post("/login", authController.login);

export const AuthRouter = router;
