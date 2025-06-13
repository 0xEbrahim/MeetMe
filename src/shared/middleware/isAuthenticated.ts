import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { IRequest } from "../types/IRequest";
import ApiResponse from "../utils/ApiResponse";
import env from "../constant/env";
import User from "../../modules/users/infrastructure/database/models/user.model";
import { IUser } from "../../modules/users/domain/models/IUser";
import { verfiyAccessToken } from "../utils/JWT/token";

interface jwtPayload extends JwtPayload {
  id: string;
}

export default asyncHandler(
  async (req: IRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer"))
      return next(ApiResponse.UnAuthorized("JsonWebToken not present."));
    const decoded: jwtPayload = await verfiyAccessToken(token);
    if (!decoded)
      return next(ApiResponse.UnAuthorized("Invalid JsonWebToken."));
    const user: IUser = (await User.findById(decoded.id)) as IUser;
    if (!user) return next(ApiResponse.UnAuthorized("Invalid JsonWebToken."));
    req.User = user;
    next();
  }
);
