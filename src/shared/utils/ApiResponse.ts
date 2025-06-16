import AppError from "../errors/AppError";
import { IResponse, ResponseMetadata } from "../types/IResponse";
import { Response } from "express";
import { STATUS } from "../constant/responseStatus";

class ApiResponse {
  static format = <T extends object | undefined>(
    data: T,
    message?: string,
    statusCode: number = 200,
    token?: string,
    refreshToken?: string
  ) => {
    const response: IResponse = {
      status: STATUS.SUCCESS,
      statusCode: statusCode,
      message: message || "Operation completed successfully",
    };
    if (data) {
      response.data = data;
    }
    if (token) response.token = token;
    if (refreshToken) response.refreshToken = refreshToken;
    return response;
  };

  static Created = <T extends object | undefined>(
    data: T,
    message?: string
  ): IResponse => {
    return this.format(data, message, 201);
  };

  static OK = <T extends object | undefined>(
    data: T,
    token?: string,
    refreshToken?: string,
    message?: string
  ): IResponse => {
    return this.format(data, message, 200, token, refreshToken);
  };

  static send = (response: IResponse, res: Response) => {
    res.status(response.statusCode).json({
      status: response.status,
      message: response.message,
      data: response.data,
      token: response.token,
      size: response.size,
    });
  };

  // Errors
  static InternalServerError = () => {
    throw AppError.throw(
      404,
      "Server error while processing request, please try again later."
    );
  };
  static NotFound = (type: string, id: string) => {
    throw AppError.throw(404, `${type} with id: ${id} not found.`);
  };
  static BadRequest = (message: string) => {
    throw AppError.throw(400, message);
  };
  static UnAuthorized = (message: string) => {
    throw AppError.throw(401, message);
  };
  static Forbidden = (message: string) => {
    throw AppError.throw(403, message);
  };
  static AlreadyExist = (message: string) => {
    throw AppError.throw(409, message);
  };
}

export default ApiResponse;
