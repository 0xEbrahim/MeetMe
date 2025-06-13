import { container, injectable } from "tsyringe";
import { ILoginUser } from "../../../domain/models/ILoginUser";
import AuthService from "../../../services/Auth.Service";
import asyncHandler from "../../../../../shared/utils/asyncHandler";
import { IRequest } from "../../../../../shared/types/IRequest";
import { NextFunction, Response } from "express";
import env from "../../../../../shared/constant/env";
import ApiResponse from "../../../../../shared/utils/ApiResponse";

@injectable()
class AuthController {
  login = asyncHandler(
    async (req: IRequest, res: Response, next: NextFunction) => {
      const authService = container.resolve(AuthService);
      const { accessToken, refreshToken, user } = await authService.login(
        req.body
      );
      res.cookie("jwt", refreshToken, {
        secure: env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      ApiResponse.send(ApiResponse.OK({ user, accessToken }), res);
    }
  );
}

export default AuthController;
