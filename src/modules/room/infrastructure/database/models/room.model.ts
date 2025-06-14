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

roomSchema.statics.deleteRelatedDocs = async function (roomId: string) {
  await Room_Participant.deleteMany({ roomId: roomId });
};

roomSchema.post(/^findOneAndD/, async function (doc) {
  await doc.constructor.deleteRelatedDocs(doc.id.toString());
});

export const Room = mongoose.model<IRoom>("Room", roomSchema);

RoomParticipant.index({ roomId: 1, userId: 1 }, { unique: true });
RoomParticipant.index({ roomId: 1 });
RoomParticipant.index({ userId: 1 });
interface IRoomParticipantModel extends Model<IRoom_Participants> {
  calcRoomParticipate(roomId: string): Promise<void>;
}
RoomParticipant.statics.calcRoomParticipate = async function (roomId: string) {
  const count = await this.countDocuments({ roomId });
  await Room.findByIdAndUpdate(roomId, {
    participants_number: count,
  });
};

RoomParticipant.post("save", async function () {
  await (this.constructor as IRoomParticipantModel).calcRoomParticipate(
    this.roomId.toString()
  );
});
RoomParticipant.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calcRoomParticipate(doc.roomId.toString());
});
export const Room_Participant = mongoose.model<
  IRoom_Participants,
  IRoomParticipantModel
>("Room_Part", RoomParticipant);
