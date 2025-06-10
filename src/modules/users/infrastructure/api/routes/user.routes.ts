import express from "express";
import { container } from "tsyringe";
import UserController from "../controllers/User.Controller";

const router = express.Router();
const userController = container.resolve(UserController);

router.post("/signup", userController.register);

export const UserRouter = router;
