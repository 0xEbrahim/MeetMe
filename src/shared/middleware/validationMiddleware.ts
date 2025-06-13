import { NextFunction, Request, Response } from "express";
import { ZodSchema, z } from "zod";
import { STATUS } from "../constant/responseStatus";
import AppError from "../errors/AppError";

function parse<T>(
  schema: ZodSchema<T>,
  vData: any,
  res: Response
): T | undefined {
  const { error, data } = schema.safeParse(vData);
  if (error) {
    res.status(422).json({
      status: STATUS.ERROR,
      message: error.message,
    });
    return;
  }
  return data;
}

export default <B, R, Q, P>(schema: {
  body?: ZodSchema<B>;
  response?: ZodSchema<R>;
  query?: ZodSchema<Q>;
  params?: ZodSchema<P>;
}) => {
  return (req: Request<P, R, B, Q>, res: Response, next: NextFunction) => {
    Object.defineProperty(req, "params", {
      value: req.params,
      writable: true,
    });
    Object.defineProperty(req, "query", {
      value: req.query,
      writable: true,
    });
    Object.defineProperty(req, "body", {
      value: req.body,
      writable: true,
    });

    if (schema.params) {
      req.params = schema.params.parse(req.params);
    }

    if (schema.query) {
      req.query = schema.query.parse(req.query);
    }

    if (schema.body) {
      req.body = schema.body.parse(req.body);
    }

    next();
  };
};
