import express from "express";
import { container } from "tsyringe";
import AuthController from "../controllers/Auth.Controller";
import validationMiddleware from "../../../../../shared/middleware/validationMiddleware";
import { LoginBodySchema } from "../../../domain/validation/schemas/auth.schema";

const router = express.Router();
const authController = container.resolve(AuthController);

router.post(
  "/login",
  validationMiddleware({ body: LoginBodySchema }),
  authController.login
);
router.post("/refresh", authController.refresh);

export const AuthRouter = router;
