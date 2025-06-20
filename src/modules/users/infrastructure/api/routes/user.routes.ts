import express from "express";
import { container } from "tsyringe";
import UserController from "../controllers/User.Controller";
import validationMiddleware from "../../../../../shared/middleware/validationMiddleware";
import {
  FindUserQuery,
  IDParam,
  RegisterBodySchema,
} from "../../../domain/validation/schemas/User.schema";
import RoomController from "../../../../room/infrastructure/api/controllers/room.controller";
import { roomQuery } from "../../../../room/domain/validation/schemas/room.schema";
import isAuthenticated from "../../../../../shared/middleware/isAuthenticated";

const router = express.Router();
const userController = container.resolve(UserController);
const roomController = container.resolve(RoomController);

router.post(
  "/signup",
  validationMiddleware({ body: RegisterBodySchema }),
  userController.register
);
router.get(
  "/",
  isAuthenticated,
  validationMiddleware({ query: FindUserQuery }),
  userController.find
);
router.get(
  "/me/rooms",
  isAuthenticated,
  validationMiddleware({ query: roomQuery }),
  roomController.findByCreator
);
router.get(
  "/:id",
  isAuthenticated,
  validationMiddleware({ params: IDParam }),
  userController.findOne
);
router.delete(
  "/:id",
  isAuthenticated,
  validationMiddleware({ params: IDParam }),
  userController.delete
);

export const UserRouter = router;
