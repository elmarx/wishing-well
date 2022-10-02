import * as t from "io-ts";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";
import { SentryConfig } from "../sentry";
import { join } from "path";
import { Env } from "./env";
import { Config } from "./index";

/**
 * initialize service configuration
 */
export function initConfig(): E.Either<t.Errors, Config> {
  return pipe(
    Env.decode(process.env),
    E.map((env): Config => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-var-requires
      const packageVersion: string | undefined = require(join(
        __dirname,
        "..",
        "..",
        "package.json",
      )).version;
      const sentry: SentryConfig = {
        dsn: env.SENTRY_DSN,
        space: env.SPACE,
        packageVersion,
      };

      return {
        space: env.SPACE,
        port: env.PORT,
        sentry,
        defaultName: env.DEFAULT_NAME,
      };
    }),
  );
}
