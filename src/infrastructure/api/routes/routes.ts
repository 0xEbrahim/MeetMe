import express from "express";
import { UserRouter } from "../../../modules/users/infrastructure/api/routes/user.routes";
import { AuthRouter } from "../../../modules/auth/infrastructure/api/routes/auth.routes";

const router = express.Router();

router.use("/users", UserRouter);
router.use("/auth", AuthRouter);

export default router;
