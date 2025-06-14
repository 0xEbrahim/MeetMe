import express from "express";
import { container } from "tsyringe";
import RoomController from "../controllers/room.controller";

const roomController = container.resolve(RoomController);
const router = express.Router();

export const RoomRouter = router;
