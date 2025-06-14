import mongoose, { Model } from "mongoose";
import { IRoom, IRoom_Participants } from "../../../domain/models/IRoom";

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
    participants_number: {
      type: Number,
      required: true,
      default: 0,
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
const RoomParticipant = new mongoose.Schema<IRoom_Participants>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    joined_at: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

RoomParticipant.index({ roomId: 1, userId: 1 }, { unique: true });

export const Room_Participant: Model<IRoom_Participants, {}> = mongoose.model(
  "Room_Part",
  RoomParticipant
);
