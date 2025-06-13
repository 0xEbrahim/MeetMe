import { Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  room_code: string;
  isActive: boolean;
  max_participants: number;
}
