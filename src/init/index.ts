import { Space } from "./codecs";
import { SentryConfig } from "../sentry";
import { ErrorRequestHandler, Handler, Router } from "express";

export type Config = {
  port: number | string;
  space: Space;
  sentry: SentryConfig;
  defaultName: string;
};

export type Dependencies = {
  errorMiddleware: ErrorRequestHandler;
  loggingMiddleware: Handler[];
  helloHandler: Router;
};
