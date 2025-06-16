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
import RedisService from "../../../infrastructure/redis/Services/Redis.Service";

@injectable()
class UserService {
  constructor(
    @inject("UserRepository") private readonly UserRepository: IUserRepository
  ) {}

  private async _INVALIDATE_CACHE() {
    const redis = container.resolve(RedisService);
    await redis.delete("users", "*");
  }

  async deleteUser(id: string) {
    const user = await this.UserRepository.findOne(id);
    if (!user) return ApiResponse.NotFound("User", id);
    const result = await this.UserRepository.delete(id);
    await this._INVALIDATE_CACHE();
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
    await this._INVALIDATE_CACHE();
    return ApiResponse.Created({ user });
  }

  async findUsers(data: IFindUsers) {
    const redis = container.resolve(RedisService);
    const cachedData = await redis.get("users", data);
    if (cachedData) {
      const dataObj = JSON.parse(cachedData);
      return ApiResponse.OK({ users: dataObj });
    }
    const users = await this.UserRepository.find(data);
    await redis.set("users", data, users);
    return ApiResponse.OK({ users });
  }
}

export default UserService;
