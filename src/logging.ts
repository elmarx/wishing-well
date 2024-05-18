import { AsyncLocalStorage } from "async_hooks";
import { pinoHttp } from "pino-http";
import { Logger } from "pino";
import { randomUUID } from "crypto";
import { LogPretty } from "./init/codecs";
import { getOrElse } from "fp-ts/Either";
import { pipe } from "fp-ts/function";

// if LOG_PRETTY is set to a truthy value, use pino-pretty as log transport
const logPretty = pipe(
  LogPretty.decode(process.env["LOG_PRETTY"]),
  getOrElse(() => false),
);

export const context = new AsyncLocalStorage<{ logger: Logger }>();
export const httpLogger = pinoHttp({
  // disable logging in tests
  enabled: !process.env["JEST_WORKER_ID"],
  // change the message key appropriate for logging backend. The default is "msg", other systems like "message".
  messageKey: "message",
  genReqId: (req) => req.headers["x-request-id"] ?? randomUUID(),
  quietReqLogger: true, // do not log request/response in child-loggers
  formatters: {
    level(label) {
      return { level: label.toUpperCase() };
    },
  },
  ...(logPretty && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
      },
    },
  }),
});

// logger needs to be a const export, so we can simply import this (initialized) logger in all modules without passing it around
const logger: Logger = new Proxy(httpLogger.logger, {
  get(target, property, receiver) {
    return Reflect.get(
      context.getStore()?.logger || target,
      property,
      receiver,
    ) as Logger;
  },
});

export default logger;
