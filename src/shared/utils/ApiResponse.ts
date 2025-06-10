import { injectable } from "tsyringe";
import AppError from "../errors/AppError";
import { IResponse, ResponseMetadata } from "../types/IResponse";
import { Response } from "express";
import { token } from "morgan";
type reponse = {};

class ApiResponse<T> {
  static format = <T extends object | undefined>(
    data: T,
    message?: string,
    statusCode: number = 200,
    metadata?: ResponseMetadata
  ) => {
    const response: IResponse = {
      status: "Success",
      statusCode: statusCode,
      message: message || "Operation completed successfully",
    };
    if (data) {
      response.data = data;
    }
    if (metadata) {
      const meta: ResponseMetadata = {
        timestamp: new Date().toISOString(),
        ...metadata,
      };
      response.data = {
        ...response.data,
        metadata: meta,
      };
    }
    return response;
  };

  static Created = <T extends object | undefined>(
    data: T,
    message?: string,
    metadata?: ResponseMetadata
  ): IResponse => {
    return this.format(data, message, 201, metadata);
  };

  static OK = <T extends object | undefined>(
    data: T,
    message?: string,
    metadata?: ResponseMetadata
  ): IResponse => {
    return this.format(data, message, 200, metadata);
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
  static NotFound = (message: string) => {
    throw new AppError(message, 404);
  };
  static BadRequest = (message: string) => {
    throw new AppError(message, 400);
  };
  static UnAuthorized = (message: string) => {
    throw new AppError(message, 401);
  };
  static Forbidden = (message: string) => {
    throw new AppError(message, 403);
  };
  static AlreadyExist = (message: string) => {
    throw new AppError(message, 409);
  };
}

export default ApiResponse;
