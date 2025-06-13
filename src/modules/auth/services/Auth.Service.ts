import { inject, injectable } from "tsyringe";
import { IAuthRepository } from "../domain/repositories/IAuthRepository";
import { ILoginUser } from "../domain/models/ILoginUser";
import ApiResponse from "../../../shared/utils/ApiResponse";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../shared/utils/JWT/token";

@injectable()
class AuthService {
  constructor(
    @inject("AuthRepository") private readonly AuthRepository: IAuthRepository
  ) {}

  async login({ email, password }: ILoginUser) {
    const user = await this.AuthRepository.findByEmail(email);
    if (!user || !(await user.matchPassword(password)))
      return ApiResponse.BadRequest("Invalid email or password.");
    const accessToken = await generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);
    return { user, accessToken, refreshToken };
  }
}

export default AuthService;
