import crypto from "crypto";
import { inject, injectable } from "tsyringe";
import RoomRepository from "../infrastructure/database/repositories/RoomRepository";
import { ICreateRoom } from "../domain/models/ICreateRoom";
import ApiResponse from "../../../shared/utils/ApiResponse";
import { IRoom } from "../domain/models/IRoom";
import { IResponse } from "../../../shared/types/IResponse";
import { IUpdateRoom } from "../domain/models/IUpdateRoom";
import { IFindRooms } from "../domain/models/IFindRooms";
import { IDeleteRoom } from "../domain/models/IDeleteRoom";
import { IJoinRoom } from "../domain/models/IJoinRoom";
import { Room_Participant } from "../infrastructure/database/models/room.model";

@injectable()
class RoomService {
  constructor(
    @inject("RoomRepository") private readonly RoomRepository: RoomRepository
  ) {}

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
    return ApiResponse.Created({ room });
  }

  async getRoomById(id: string): Promise<IResponse> {
    const room: IRoom | null = await this.RoomRepository.findById(id);
    if (!room) return ApiResponse.NotFound("Room", id);
    return ApiResponse.OK({ room });
  }
  async getRooms(query: IFindRooms): Promise<IResponse> {
    const rooms = await this.RoomRepository.find(query);
    return ApiResponse.OK({ rooms });
  }

  async getRoomByCode(code: string): Promise<IResponse> {
    const room: IRoom | null = await this.RoomRepository.findByCode(code);
    if (!room) return ApiResponse.NotFound("Room", code);
    return ApiResponse.OK({ room });
  }
  async getUserRooms(userId: string, query: IFindRooms): Promise<IResponse> {
    const rooms = await this.RoomRepository.findByCreator(userId, query);
    return ApiResponse.OK({ rooms });
  }
  async getActiveRooms(query: IFindRooms): Promise<IResponse> {
    const rooms = await this.RoomRepository.findActive(query);
    return ApiResponse.OK({ rooms });
  }

  async updateRoom(id: string, data: IUpdateRoom): Promise<IResponse> {
    let room = await this.RoomRepository.findById(id);
    if (!room) return ApiResponse.NotFound("Room", id);
    if (room.created_by.toString() !== data.userId.toString())
      return ApiResponse.Forbidden("Only room creator can perform this action");
    room = await this.RoomRepository.update(id, data);
    if (!room) return ApiResponse.NotFound("Room", id);
    return ApiResponse.OK({ room });
  }

  async deleteRoom(data: IDeleteRoom): Promise<IResponse> {
    const room = await this.RoomRepository.findById(data.id);
    if (!room) return ApiResponse.NotFound("Room", data.id);
    if (room.created_by.toString() !== data.userId.toString())
      return ApiResponse.Forbidden("Only room creator can perform this action");
    await this.RoomRepository.delete(data.id);
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
