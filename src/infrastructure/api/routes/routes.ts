import express from "express";
import { UserRouter } from "../../../modules/users/infrastructure/api/routes/user.routes";

const router = express.Router();

router.use("/users", UserRouter);

export default router;
