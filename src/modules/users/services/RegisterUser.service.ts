import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../domain/repositories/IUserRepository";
import { IRegisterUser } from "../domain/models/IRegisterUser";
import { IUser } from "../domain/models/IUser";
import AppError from "../../../shared/errors/AppError";

@injectable()
class RegisterUserService {
  constructor(
    @inject("UserRepository") private readonly UserRepository: IUserRepository
  ) {}

  async exec({ name, email, password }: IRegisterUser): Promise<IUser> {
    const emailExist = await this.UserRepository.findByEmail(email);
    if (emailExist) throw new AppError("This email already registered", 409);
    const user: IUser = await this.UserRepository.register({
      name,
      email,
      password,
    });
    return user;
  }
}
export default RegisterUserService;
