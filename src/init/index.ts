import { Space } from "./codecs";
import { ErrorRequestHandler, Handler, Router } from "express";

export type Config = {
  port: number | string;
  space: Space;
  defaultName: string;
};

export type Dependencies = {
  errorMiddleware: ErrorRequestHandler;
  loggingMiddleware: Handler[];
  helloHandler: Router;
};
