import { Handler } from "express";
import { context, httpLogger } from "../logging";

const contextMiddleware: Handler = (req, _res, next) => {
  // @ts-expect-error typings for run seem wrong, they require third argument, but it is optional (and not needed here)
  return context.run({ logger: req.log }, next);
};

export const loggingMiddleware = [httpLogger, contextMiddleware];
