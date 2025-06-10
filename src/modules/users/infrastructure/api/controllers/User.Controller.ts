import { Request, Response, NextFunction } from "express";
import { container, injectable } from "tsyringe";
import RegisterUserService from "../../../services/RegisterUser.service";
import asyncHandler from "../../../../../shared/utils/asyncHandler";
import ApiResponse from "../../../../../shared/utils/ApiResponse";
import { IResponse } from "../../../../../shared/types/IResponse";

@injectable()
export default class UserController {
  public register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { name, email, password } = req.body;
      const createUser = container.resolve(RegisterUserService);
      const response: IResponse = await createUser.exec({
        name,
        email,
        password,
      });
      ApiResponse.send(response, res);
    }
  );
}
