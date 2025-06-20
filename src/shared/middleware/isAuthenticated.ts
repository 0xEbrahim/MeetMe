import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";
import User from "../../modules/users/infrastructure/database/models/user.model";
import { IUser } from "../../modules/users/domain/models/IUser";
import { verifyAccessToken } from "../utils/JWT/token";
import { jwtPayload } from "../types/jwtPayload";

export default asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer"))
      return ApiResponse.UnAuthorized("JsonWebToken not present.");
    token = token.split(" ")[1].trim();
    const decoded: jwtPayload = verifyAccessToken(token) as jwtPayload;
    if (!decoded) return ApiResponse.UnAuthorized("Invalid JsonWebToken.");
    const user: IUser | null = await User.findById(decoded.id);

    if (!user) return ApiResponse.UnAuthorized("Invalid JsonWebToken.");
    req.user = {
      id: user.id,
    };
    next();
  }
);
