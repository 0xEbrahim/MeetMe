import ApiFeatures from "../../../../../shared/utils/ApiFeatures";
import { ICreateRoom } from "../../../domain/models/ICreateRoom";
import { IFindRooms } from "../../../domain/models/IFindRooms";
import { IRoom } from "../../../domain/models/IRoom";
import { IUpdateRoom } from "../../../domain/models/IUpdateRoom";
import { IRoomRepository } from "../../../domain/repositories/IRoomRepository";
import { Room } from "../models/room.model";

type nullableRoom = IRoom | null;

export class RoomRepository implements IRoomRepository {
  async findByCode(code: string): Promise<IRoom | null> {
    const room: nullableRoom = await Room.findOne({ room_code: code });
    return room;
  }
  async findByCreator(creatorId: string, query: IFindRooms): Promise<IRoom[]> {
    const q = new ApiFeatures(Room.find({ created_by: creatorId }), query)
      .filter()
      .limit()
      .paginate()
      .sort();
    const rooms = await q.exec();
    return rooms;
  }
  async findActive(query: IFindRooms): Promise<IRoom[]> {
    const q = new ApiFeatures(Room.find({ is_active: true }), query)
      .filter()
      .limit()
      .paginate()
      .sort();
    const rooms = await q.exec();
    return rooms;
  }
  async find(query: IFindRooms): Promise<IRoom[]> {
    const q = new ApiFeatures(Room.find(), query)
      .filter()
      .limit()
      .paginate()
      .sort();
    const rooms = await q.exec();
    return rooms;
  }
  async delete(id: string): Promise<nullableRoom> {
    const room: nullableRoom = await Room.findByIdAndDelete(id);
    return room;
  }
  async update(id: string, data: IUpdateRoom): Promise<nullableRoom> {
    const room = await Room.findByIdAndUpdate(id, data, { new: true });
    return room;
  }
  async create(data: ICreateRoom): Promise<IRoom> {
    const room: nullableRoom = await Room.create({
      name: data.name,
      created_by: data.created_by,
      max_participants: data.max_participants,
      room_code: data.room_code,
    });
    return room;
  }
  async findById(id: string): Promise<nullableRoom> {
    const room: nullableRoom = await Room.findById(id);
    return room;
  }
}

export default RoomRepository;
