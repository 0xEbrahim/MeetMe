import { ILoginUser } from "../../../domain/models/ILoginUser";
import { IRegisterUser } from "../../../domain/models/IRegisterUser";
import { IUser } from "../../../domain/models/IUser";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import User from "../models/user.model";

/**
 * TODO:
 *  asyncHandler
 *  errorHandlr
 *  not found
 *  responseFormatter
 */

class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<boolean> {
    const user = await User.findOne({ email: email });
    return user !== null;
  }
  async register({ name, email, password }: IRegisterUser): Promise<IUser> {
    const user: IUser = await User.create({ name, email, password });
    return user;
  }
}

export default UserRepository;
