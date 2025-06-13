import express from "express";
import { container } from "tsyringe";
import UserController from "../controllers/User.Controller";

const router = express.Router();
const userController = container.resolve(UserController);

router.post("/signup", userController.register);
router.get("/", userController.find);
router.get("/:id", userController.findOne);
router.delete("/:id", userController.delete);

export const UserRouter = router;
