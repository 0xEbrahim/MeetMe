import mongoose from "mongoose";
import { IUser } from "../../../domain/models/IUser";

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const User: mongoose.Model<IUser, {}> = mongoose.model("User", userSchema);

export default User;
