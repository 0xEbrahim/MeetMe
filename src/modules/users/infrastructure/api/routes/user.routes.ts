import express from "express";
import { container } from "tsyringe";
import UserController from "../controllers/User.Controller";
import validationMiddleware from "../../../../../shared/middleware/validationMiddleware";
import {
  FindUserQuery,
  IDParam,
  RegisterBodySchema,
} from "../../../domain/validation/schemas/User.schema";

const router = express.Router();
const userController = container.resolve(UserController);

router.post(
  "/signup",
  validationMiddleware({ body: RegisterBodySchema }),
  userController.register
);
router.get(
  "/",
  validationMiddleware({ query: FindUserQuery }),
  userController.find
);
router.get(
  "/:id",
  validationMiddleware({ params: IDParam }),
  userController.findOne
);
router.delete(
  "/:id",
  validationMiddleware({ params: IDParam }),
  userController.delete
);

export const UserRouter = router;
