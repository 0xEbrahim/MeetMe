import ApiFeatures from "../../../../../shared/utils/ApiFeatures";
import { IFindUsers } from "../../../domain/models/IFindUsers";
import { IRegisterUser } from "../../../domain/models/IRegisterUser";
import { IUser } from "../../../domain/models/IUser";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import User from "../models/user.model";
class UserRepository implements IUserRepository {
  async delete(id: string): Promise<IUser | null> {
    const user: IUser | null = await User.findByIdAndDelete(id);
    return user;
  }
  async findOne(id: string): Promise<IUser | null> {
    const user: IUser | null = await User.findById(id);
    return user;
  }
  async find(data: IFindUsers): Promise<IUser[]> {
    const query = new ApiFeatures(User.find({}), data)
      .filter()
      .limit()
      .paginate()
      .sort();
    const users = await query.exec();
    return users;
  }
  async findByEmail(email: string): Promise<IUser | null> {
    const user: IUser | null = await User.findOne({ email: email });
    return user;
  }
  async register({ name, email, password }: IRegisterUser): Promise<IUser> {
    const user: IUser = await User.create({ name, email, password });
    return user;
  }
}

export default UserRepository;
