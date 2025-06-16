import { container, injectable } from "tsyringe";
import AuthService from "../../../services/Auth.Service";
import asyncHandler from "../../../../../shared/utils/asyncHandler";
import { NextFunction, Request, Response } from "express";
import env from "../../../../../shared/constant/env";
import ApiResponse from "../../../../../shared/utils/ApiResponse";
import { IResponse } from "../../../../../shared/types/IResponse";

@injectable()
class AuthController {
  login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const authService = container.resolve(AuthService);
      const result: IResponse = await authService.login(req.body);
      res.cookie("jwt", result.refreshToken, {
        secure: env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      result.refreshToken = undefined;
      ApiResponse.send(result, res);
    }
  );

  refresh = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const authService = container.resolve(AuthService);
      const result = await authService.refreshToken({
        token: req.cookies.jwt ?? "",
      });
      ApiResponse.send(result, res);
    }
  );
}

export default AuthController;
