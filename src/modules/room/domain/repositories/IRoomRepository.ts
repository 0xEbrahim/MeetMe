import { ICreateRoom } from "../models/ICreateRoom";
import { IFindRooms } from "../models/IFindRooms";
import { IRoom, IRoom_Participants } from "../models/IRoom";
import { IUpdateRoom } from "../models/IUpdateRoom";

export interface IRoomRepository {
  create(data: ICreateRoom): Promise<IRoom>;
  findById(id: string): Promise<IRoom | null>;
  findByCode(code: string): Promise<IRoom | null>;
  findByCreator(creatorId: string, query: IFindRooms): Promise<IRoom[]>;
  findActive(query: IFindRooms): Promise<IRoom[]>;
  find(query: IFindRooms): Promise<IRoom[]>;
  delete(id: string): Promise<IRoom | null>;
  update(id: string, data: IUpdateRoom): Promise<IRoom | null>;
  isRoomParticipant(roomId: string, userId: string): Promise<boolean>;
  joinRoom(roomId: string, userId: string): Promise<IRoom_Participants>;
}
