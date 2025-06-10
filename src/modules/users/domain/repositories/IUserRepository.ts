import { DeleteResult } from "mongoose";
import { IFindUsers } from "../models/IFindUsers";
import { IRegisterUser } from "../models/IRegisterUser";
import { IUser } from "../models/IUser";

export interface IUserRepository {
  register(data: IRegisterUser): Promise<IUser>;
  findByEmail(email: string): Promise<boolean>;
  findOne(id: string): Promise<IUser | null>;
  find(data: IFindUsers): Promise<IUser[]>;
  // update(id: string, data:)
  delete(id: string): Promise<IUser | null>;
}
