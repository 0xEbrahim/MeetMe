import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly data: unknown;
  constructor(
    statusCode: number,
    message: string,
    data: unknown = undefined,
    isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.data = data;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }

  static throw(statusCode: number, message: string) {
    return new AppError(statusCode, message);
  }

  static from(err: any) {
    if (err instanceof ZodError) return this.fromZod(err);
    if (err.name === "JsonWebTokenError")
      return this.throw(401, "Invalid or expired JsonWebToken.");
    return err;
  }
  static fromZod(err: ZodError, statusCode: number = 400) {
    const formattedError = fromZodError(err);

    return new AppError(
      statusCode,
      formattedError.message,
      formattedError.details
    );
  }
}

export default AppError;
