import { inject, injectable } from "tsyringe";
import { IAuthRepository } from "../domain/repositories/IAuthRepository";
import { ILoginUser } from "../domain/models/ILoginUser";
import ApiResponse from "../../../shared/utils/ApiResponse";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../../shared/utils/JWT/token";
import { IResponse } from "../../../shared/types/IResponse";
import { IRefreshToken } from "../domain/models/IRefreshToken";
import { jwtPayload } from "../../../shared/types/jwtPayload";

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
    return ApiResponse.OK({user}, accessToken, refreshToken);
  }

  async refreshToken({ token }: IRefreshToken): Promise<IResponse> {
    if (!token) {
      return ApiResponse.UnAuthorized(
        "Session timed out, please login again then try."
      );
    }
    const decoded: jwtPayload = verifyRefreshToken(token) as jwtPayload;
    if (!decoded) return ApiResponse.UnAuthorized("Invalid JsonWebToken");
    const user = await this.AuthRepository.findOne(decoded.id);
    if (!user) return ApiResponse.UnAuthorized("Invalid JsonWebToken.");
    const accessToken = await generateAccessToken(user.id);
    return ApiResponse.OK(undefined, accessToken);
  }
}

export default AuthService;
