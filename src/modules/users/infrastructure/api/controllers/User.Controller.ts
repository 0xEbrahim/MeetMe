import { Request, Response, NextFunction } from "express";
import { container, injectable } from "tsyringe";
import RegisterUserService from "../../../services/RegisterUser.service";

@injectable()
export default class UserController {
  public register = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    const createUser = container.resolve(RegisterUserService);
    const user = await createUser.exec({ name, email, password });
    res.json(user);
  };
}
