import { ILoginUser } from "../../../domain/models/ILoginUser";
import { IRegisterUser } from "../../../domain/models/IRegisterUser";
import { IUser } from "../../../domain/models/IUser";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

class UserRepository implements IUserRepository {
  async register(data: IRegisterUser): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
  async login(data: ILoginUser): Promise<IUser> {
    throw new Error("Method not implemented.");
  }
}

export default UserRepository;
