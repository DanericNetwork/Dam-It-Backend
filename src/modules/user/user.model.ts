import mongoose from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model<IUser>("User", userSchema);