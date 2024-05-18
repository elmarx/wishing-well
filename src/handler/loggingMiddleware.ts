import { Handler } from "express";
import { context, httpLogger } from "../logging";

const contextMiddleware: Handler = (req, _res, next) => {
  return context.run({ logger: req.log }, next);
};

export const loggingMiddleware = [httpLogger, contextMiddleware];
