import { Request } from "express";
import { IUser } from "../../modules/users/domain/models/IUser";

export interface IRequest extends Request {
  User?: IUser;
}
