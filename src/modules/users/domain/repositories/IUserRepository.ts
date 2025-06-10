import { ILoginUser } from "../models/ILoginUser";
import { IRegisterUser } from "../models/IRegisterUser";
import { IUser } from "../models/IUser";

export interface IUserRepository {
  register(data: IRegisterUser): Promise<IUser>;
  login(data: ILoginUser): Promise<IUser>;
}
