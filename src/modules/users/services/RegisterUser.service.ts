import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../domain/repositories/IUserRepository";
import { IRegisterUser } from "../domain/models/IRegisterUser";
import { IUser } from "../domain/models/IUser";
import AppError from "../../../shared/errors/AppError";
import ApiResponse from "../../../shared/utils/ApiResponse";
import User from "../infrastructure/database/models/user.model";
import { IResponse } from "../../../shared/types/IResponse";

@injectable()
class RegisterUserService {
  constructor(
    @inject("UserRepository") private readonly UserRepository: IUserRepository
  ) {}

  async exec({ name, email, password }: IRegisterUser): Promise<IResponse> {
    const emailExist = await this.UserRepository.findByEmail(email);
    if (emailExist) return ApiResponse.AlreadyExist("Email is already exists.");
    const user: IUser = await this.UserRepository.register({
      name,
      email,
      password,
    });
    return ApiResponse.Created({ User });
  }
}
export default RegisterUserService;
