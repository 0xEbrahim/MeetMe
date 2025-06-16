import { container, injectable } from "tsyringe";
import asyncHandler from "../../../../../shared/utils/asyncHandler";
import { NextFunction, Request, Response } from "express";
import { IResponse } from "../../../../../shared/types/IResponse";
import RoomService from "../../../services/Room.Service";
import ApiResponse from "../../../../../shared/utils/ApiResponse";

@injectable()
class RoomController {
  createRoom = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const roomService = container.resolve(RoomService);
      const result: IResponse = await roomService.createRoom({
        name: req.body.name,
        created_by: req.user.id,
        room_code: "",
        max_participants: req.body.max_participants,
      });
      ApiResponse.send(result, res);
    }
  );

  findOne = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const roomService = container.resolve(RoomService);
      const result: IResponse = await roomService.getRoomById(req.params.id);
      ApiResponse.send(result, res);
    }
  );

  findRooms = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const roomService = container.resolve(RoomService);
      const result: IResponse = await roomService.getRooms(req.query);
      ApiResponse.send(result, res);
    }
  );
  findByCode = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const roomService = container.resolve(RoomService);
      const result: IResponse = await roomService.getRoomByCode(
        req.params.code
      );
      ApiResponse.send(result, res);
    }
  );

  findActive = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const roomService = container.resolve(RoomService);
      const result: IResponse = await roomService.getActiveRooms(req.query);
      ApiResponse.send(result, res);
    }
  );

  findByCreator = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const roomService = container.resolve(RoomService);
      const result: IResponse = await roomService.getUserRooms(
        req.user.id,
        req.query
      );
      ApiResponse.send(result, res);
    }
  );

  joinRoom = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const roomService = container.resolve(RoomService);
      const result: IResponse = await roomService.joinRoom({
        code: req.params.code,
        userId: req.user.id,
      });
      ApiResponse.send(result, res);
    }
  );

  deleteRoom = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const roomService = container.resolve(RoomService);
      const result: IResponse = await roomService.deleteRoom({
        id: req.params.id,
        userId: req.user.id,
      });
      ApiResponse.send(result, res);
    }
  );

  updateRoom = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const roomService = container.resolve(RoomService);
      const result: IResponse = await roomService.updateRoom(req.params.id, {
        userId: req.user.id,
        ...req.body,
      });
      ApiResponse.send(result, res);
    }
  );
}

export default RoomController;
