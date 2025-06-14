import express from "express";
import { UserRouter } from "../../../modules/users/infrastructure/api/routes/user.routes";
import { AuthRouter } from "../../../modules/auth/infrastructure/api/routes/auth.routes";
import { RoomRouter } from "../../../modules/room/infrastructure/api/routes/room.routes";

const router = express.Router();

router.use("/users", UserRouter);
router.use("/auth", AuthRouter);
router.use("/rooms", RoomRouter);

export default router;
