import mongoose, { Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  room_code: string;
  is_active: boolean;
  created_by: mongoose.Schema.Types.ObjectId;
  max_participants: number;
  participants_number: number;
}

export interface IRoom_Participants extends Document {
  is_active: boolean;
  joined_at: Date;
  userId: mongoose.Schema.Types.ObjectId;
  roomId: mongoose.Schema.Types.ObjectId;
}
