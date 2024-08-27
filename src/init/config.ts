import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { Env } from "./env";
import { Config } from "./index";

/**
 * initialize service configuration
 */
export function initConfig(): E.Either<AggregateError, Config> {
  return pipe(
    Env.decode(process.env),
    E.map((env): Config => {
      return {
        space: env.SPACE,
        port: env.PORT,
        defaultName: env.DEFAULT_NAME,
      };
    }),
    E.mapLeft((e) => new AggregateError(e, "Invalid config")),
  );
}
