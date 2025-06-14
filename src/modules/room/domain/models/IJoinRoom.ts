import mongoose from "mongoose";

export interface IJoinRoom {
  userId: mongoose.Schema.Types.ObjectId;
  code: string;
}
