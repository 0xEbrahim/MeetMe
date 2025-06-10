import mongoose from "mongoose";
import bcrypt from "bcrypt";
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
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password ?? "", salt);
  this.password = hash;
  next();
});

const User: mongoose.Model<IUser, {}> = mongoose.model("User", userSchema);

export default User;
