import express from "express";
import { container } from "tsyringe";
import UserController from "../controllers/User.Controller";
import validationMiddleware from "../../../../../shared/middleware/validationMiddleware";
import { RegisterBodySchema } from "../../../domain/validation/schemas/User.schema";
import { z } from "zod";

const router = express.Router();
const userController = container.resolve(UserController);

router.post(
  "/signup",
  validationMiddleware({ body: RegisterBodySchema }),
  userController.register
);
router.get("/", userController.find);
router.get("/:id", userController.findOne);
router.delete("/:id", userController.delete);

export const UserRouter = router;
