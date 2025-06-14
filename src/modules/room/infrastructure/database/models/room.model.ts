import mongoose, { Model } from "mongoose";
import { IRoom } from "../../../domain/models/IRoom";

const roomSchema = new mongoose.Schema<IRoom>(
  {
    name: {
      type: String,
      required: true,
    },
    room_code: {
      type: String,
      required: true,
      unique: true,
    },
    max_participants: {
      type: Number,
      required: true,
      default: 10,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Room: mongoose.Model<IRoom, {}> = mongoose.model<IRoom>(
  "Room",
  roomSchema
);
