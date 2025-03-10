import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { isWishingWellError } from "../errors";
import logger from "../logging";

export const errorMiddleware: ErrorRequestHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (isWishingWellError(error)) {
    res
      .status(error.statusCode)
      .json({ message: error.message, errorCode: error.errorCode });
    return;
  }

  logger.error(error, "Unknown error occurred");
  res.status(500).json({ error, message: "Unknown error" });
};
