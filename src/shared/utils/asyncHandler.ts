import { NextFunction, Request, Response } from "express";

type handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export default (fn: handler) =>
  async (req: Request, res: Response, next: NextFunction) =>
    await fn(req, res, next).catch(next);
