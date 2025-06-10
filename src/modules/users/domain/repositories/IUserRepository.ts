import { IRegisterUser } from "../models/IRegisterUser";
import { IUser } from "../models/IUser";

export interface IUserRepository {
  register(data: IRegisterUser): Promise<IUser>;
  findByEmail(email: string): Promise<boolean>;
}
