import { Request, Response, NextFunction } from "express";
import { container, injectable } from "tsyringe";
import RegisterUserService from "../../../services/RegisterUser.service";
import asyncHandler from "../../../../../shared/utils/asyncHandler";
import ApiResponse from "../../../../../shared/utils/ApiResponse";
import { IResponse } from "../../../../../shared/types/IResponse";
import FindUserService from "../../../services/FindUsers.Service";
import DeleteUserService from "../../../services/DeleteUser.Service";

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

  public find = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const findUsers = container.resolve(FindUserService);
      const response: IResponse = await findUsers.exec(req.query);
      return ApiResponse.send(response, res);
    }
  );

  public delete = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const deleteUser = container.resolve(DeleteUserService);
      const response: IResponse = await deleteUser.exec(req.params.id);
      ApiResponse.send(response, res);
    }
  );
}
