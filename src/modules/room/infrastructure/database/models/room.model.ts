import mongoose from "mongoose";
import { IRoom } from "../../../domain/models/IRoom";

/**
 *  TODO:
 *  1 - Continue Auth
 *  2 - Unit testing The User & Auth
 *  3 - Implement rooms
 */

const roomSchema = new mongoose.Schema<IRoom>({
  name: {
    type: String,
    required: true,
  },
  room_code: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  max_participants: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const room_participants = new mongoose.Schema({});
