import AppError from "../errors/AppError";
import { IResponse, ResponseMetadata } from "../types/IResponse";
import { Response } from "express";
import { STATUS } from "../constant/responseStatus";

class ApiResponse<T> {
  static format = <T extends object | undefined>(
    data: T,
    message?: string,
    statusCode: number = 200,
    metadata?: ResponseMetadata
  ) => {
    const response: IResponse = {
      status: STATUS.SUCCESS,
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
    throw AppError.throw(404, message);
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
