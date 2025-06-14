import mongoose, { Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  room_code: string;
  is_active: boolean;
  created_by: mongoose.Schema.Types.ObjectId;
  max_participants: number;
}
