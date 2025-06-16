import crypto from "crypto";
import { container, inject, injectable } from "tsyringe";
import { ICreateRoom } from "../domain/models/ICreateRoom";
import ApiResponse from "../../../shared/utils/ApiResponse";
import { IRoom } from "../domain/models/IRoom";
import { IResponse } from "../../../shared/types/IResponse";
import { IUpdateRoom } from "../domain/models/IUpdateRoom";
import { IFindRooms } from "../domain/models/IFindRooms";
import { IDeleteRoom } from "../domain/models/IDeleteRoom";
import { IJoinRoom } from "../domain/models/IJoinRoom";
import { IRoomRepository } from "../domain/repositories/IRoomRepository";
import RedisService from "../../../infrastructure/redis/Services/Redis.Service";

@injectable()
class RoomService {
  constructor(
    @inject("RoomRepository") private readonly RoomRepository: IRoomRepository
  ) {}

  private async _INVALIDATE_CACHE() {
    const redis = container.resolve(RedisService);
    await redis.delete("rooms", "*");
    await redis.delete("rooms:user", "*");
    await redis.delete("rooms:active", "*");
  }

  private async _GenerateUniqueRoomCode(): Promise<string> {
    let code: string;
    let exists: boolean;

    do {
      code = crypto.randomBytes(4).toString("hex").toUpperCase();
      exists = (await this.RoomRepository.findByCode(code)) !== null;
    } while (exists);

    return code;
  }
  async createRoom({
    created_by,
    name,
    room_code,
    max_participants,
  }: ICreateRoom): Promise<IResponse> {
    room_code = await this._GenerateUniqueRoomCode();
    const room: IRoom = await this.RoomRepository.create({
      created_by,
      name,
      room_code,
      max_participants,
    });
    if (!room) return ApiResponse.InternalServerError();
    await this._INVALIDATE_CACHE();
    return ApiResponse.Created({ room });
  }

  async getRoomById(id: string): Promise<IResponse> {
    const room: IRoom | null = await this.RoomRepository.findById(id);
    if (!room) return ApiResponse.NotFound("Room", id);
    return ApiResponse.OK({ room });
  }
  async getRooms(query: IFindRooms): Promise<IResponse> {
    const redis = container.resolve(RedisService);
    let cachedData = await redis.get("rooms", query);
    if (cachedData) {
      cachedData = JSON.parse(cachedData);
      return ApiResponse.OK({ rooms: cachedData });
    }
    const rooms = await this.RoomRepository.find(query);
    await redis.set("rooms", query, rooms);
    return ApiResponse.OK({ rooms });
  }

  async getRoomByCode(code: string): Promise<IResponse> {
    const room: IRoom | null = await this.RoomRepository.findByCode(code);
    if (!room) return ApiResponse.NotFound("Room", code);
    return ApiResponse.OK({ room });
  }
  async getUserRooms(userId: string, query: IFindRooms): Promise<IResponse> {
    const redis = container.resolve(RedisService);
    let cachedData = await redis.get("rooms:user", query);
    if (cachedData) {
      cachedData = JSON.parse(cachedData);
      return ApiResponse.OK({ rooms: cachedData });
    }
    const rooms = await this.RoomRepository.findByCreator(userId, query);
    await redis.set("rooms:user", query, rooms);
    return ApiResponse.OK({ rooms });
  }
  async getActiveRooms(query: IFindRooms): Promise<IResponse> {
    const redis = container.resolve(RedisService);
    let cachedData = await redis.get("rooms:active", query);
    if (cachedData) {
      cachedData = JSON.parse(cachedData);
      return ApiResponse.OK({ rooms: cachedData });
    }
    const rooms = await this.RoomRepository.findActive(query);
    await redis.set("rooms:active", query, rooms);
    return ApiResponse.OK({ rooms });
  }

  async updateRoom(id: string, data: IUpdateRoom): Promise<IResponse> {
    let room = await this.RoomRepository.findById(id);
    if (!room) return ApiResponse.NotFound("Room", id);
    if (room.created_by.toString() !== data.userId.toString())
      return ApiResponse.Forbidden("Only room creator can perform this action");
    room = await this.RoomRepository.update(id, data);
    if (!room) return ApiResponse.NotFound("Room", id);
    await this._INVALIDATE_CACHE();
    return ApiResponse.OK({ room });
  }

  async deleteRoom(data: IDeleteRoom): Promise<IResponse> {
    const room = await this.RoomRepository.findById(data.id);
    if (!room) return ApiResponse.NotFound("Room", data.id);
    if (room.created_by.toString() !== data.userId.toString())
      return ApiResponse.Forbidden("Only room creator can perform this action");
    await this.RoomRepository.delete(data.id);
    await this._INVALIDATE_CACHE();
    return ApiResponse.OK({ room });
  }

  async joinRoom({ code, userId }: IJoinRoom): Promise<IResponse> {
    const room = await this.RoomRepository.findByCode(code);
    if (!room) return ApiResponse.NotFound("Room", code);
    if (!room.is_active)
      return ApiResponse.BadRequest("This room is not active.");
    if (room.participants_number === room.max_participants)
      return ApiResponse.BadRequest("Room is full.");
    const alreadyJoined = await this.RoomRepository.isRoomParticipant(
      room.id.toString(),
      userId.toString()
    );
    if (alreadyJoined)
      return ApiResponse.BadRequest(
        "You have already joined this room before."
      );
    const roomJoined = await this.RoomRepository.joinRoom(
      room.id.toString(),
      userId.toString()
    );
    return ApiResponse.Created({ roomJoined });
  }
}
export default RoomService;
