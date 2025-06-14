import { NextFunction, Request, Response } from "express";
import { STATUS } from "../constant/responseStatus";
import AppError from "./AppError";

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  const appErr = AppError.from(err) || err;
  const statusCode = appErr.statusCode || 500;
  const status = statusCode === 500 ? STATUS.FAIL : STATUS.ERROR;
  res
    .status(statusCode)
    .json({
      status: status,
      message: err.message,
      isOperational: err.isOperational,
    });
};
