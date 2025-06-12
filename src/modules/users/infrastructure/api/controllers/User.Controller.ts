import { Request, Response, NextFunction } from "express";
import { container, injectable } from "tsyringe";
import asyncHandler from "../../../../../shared/utils/asyncHandler";
import ApiResponse from "../../../../../shared/utils/ApiResponse";
import { IResponse } from "../../../../../shared/types/IResponse";
import UserService from "../../../services/User.Service";
@injectable()
export default class UserController {
  public register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, email, password } = req.body;
      const userService = container.resolve(UserService);
      const response: IResponse = await userService.registerUser({
        name,
        email,
        password,
      });
      ApiResponse.send(response, res);
    }
  );

  public find = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userService = container.resolve(UserService);
      const response: IResponse = await userService.findUsers(req.query);
      return ApiResponse.send(response, res);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userService = container.resolve(UserService);
      const response: IResponse = await userService.deleteUser(req.params.id);
      ApiResponse.send(response, res);
    }
  );
}
