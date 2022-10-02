import { Config, Dependencies } from "./index";
import { loggingMiddleware } from "../handler/loggingMiddleware";
import { initHelloHandler } from "../handler/hello/helloHandler";
import { errorMiddleware } from "../handler/errorMiddleware";

export function wire(config: Config): Dependencies {
  const helloHandler = initHelloHandler(config.defaultName);

  return {
    helloHandler,
    loggingMiddleware,
    errorMiddleware,
  };
}
