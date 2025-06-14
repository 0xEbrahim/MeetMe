import { container, inject, injectable } from "tsyringe";
import ApiResponse from "../../../shared/utils/ApiResponse";
import { IRegisterUser } from "../domain/models/IRegisterUser";
import { IResponse } from "../../../shared/types/IResponse";
import { IUser } from "../domain/models/IUser";
import SendEmailService from "../../../infrastructure/email/services/SendEmail.Service";
import { IEmail } from "../../../infrastructure/email/models/models";
import env from "../../../shared/constant/env";
import { IFindUsers } from "../domain/models/IFindUsers";
import { IUserRepository } from "../domain/repositories/IUserRepository";

@injectable()
class UserService {
  constructor(
    @inject("UserRepository") private readonly UserRepository: IUserRepository
  ) {}

  async deleteUser(id: string) {
    const user = await this.UserRepository.findOne(id);
    if (!user) return ApiResponse.NotFound("User", id);
    const result = await this.UserRepository.delete(id);
    return ApiResponse.OK({ result });
  }

  async findOne(id: string) {
    const user = await this.UserRepository.findOne(id);
    if (!user) return ApiResponse.NotFound("User", id);
    return ApiResponse.OK({ user });
  }

  async registerUser({
    name,
    email,
    password,
  }: IRegisterUser): Promise<IResponse> {
    const emailExist = await this.UserRepository.findByEmail(email);
    if (emailExist) return ApiResponse.AlreadyExist("Email already exists.");
    const user: IUser = await this.UserRepository.register({
      name,
      email,
      password,
    });
    const SendEmail = container.resolve(SendEmailService);
    const emailData: IEmail = {
      to: user.email,
      subject: "Welcome to Our App!",
      template: "welcome-email",
      info: {
        username: user.name,
        appName: "MeetMe app",
        appUrl: env.DEV_URL,
      },
    };
    if (env.NODE_ENV !== "testing") {
      await SendEmail.exec(emailData);
    }
    return ApiResponse.Created({ user });
  }

  async findUsers(data: IFindUsers) {
    const users = await this.UserRepository.find(data);
    return ApiResponse.OK({ users });
  }
}

export default UserService;
