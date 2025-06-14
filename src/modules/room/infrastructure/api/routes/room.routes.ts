import express from "express";
import { container } from "tsyringe";
import RoomController from "../controllers/room.controller";
import validationMiddleware from "../../../../../shared/middleware/validationMiddleware";
import {
  createRoomBodySchema,
  getRoomByCodeParamsSchema,
  joinRoomParamSchema,
  IdParamSchema,
  roomQuery,
  updateRoomBodySchema,
} from "../../../domain/validation/schemas/room.schema";
import isAuthenticated from "../../../../../shared/middleware/isAuthenticated";

const roomController = container.resolve(RoomController);
const router = express.Router();

router.use(isAuthenticated);

// POST
router.post(
  "/",
  validationMiddleware({ body: createRoomBodySchema }),
  roomController.createRoom
);
router.post(
  "/join/:code",
  validationMiddleware({ params: joinRoomParamSchema }),
  roomController.joinRoom
);

//  GET
router.get(
  "/",
  validationMiddleware({ query: roomQuery }),
  roomController.findRooms
);
router.get(
  "/active",
  validationMiddleware({ query: roomQuery }),
  roomController.findActive
);
router.get(
  "/code/:code",
  validationMiddleware({ params: getRoomByCodeParamsSchema }),
  roomController.findByCode
);
router.get(
  "/:id",
  validationMiddleware({ params: IdParamSchema }),
  roomController.findOne
);

router.put(
  "/:id",
  validationMiddleware({ body: updateRoomBodySchema, params: IdParamSchema }),
  roomController.updateRoom
);
router.delete(
  "/:id",
  validationMiddleware({ params: IdParamSchema }),
  roomController.deleteRoom
);

export const RoomRouter = router;
