// Call this file in every function you want to use Sentry in.
// This initializes Sentry and sets the current stage as well as
// the project name. This way you can instantly see what's
// happening in the Sentry dashboard.
import * as Sentry from "@sentry/node";
import logger from "./logging";
import { Space } from "./init/codecs";
import * as t from "io-ts";

export type SentryConfig = {
  dsn?: string;
  space?: t.TypeOf<typeof Space>;
  packageVersion?: string;
};

export function sentryInit({ dsn, space, packageVersion }: SentryConfig): void {
  if (!dsn) {
    logger.warn(
      "WARNING, no Sentry DSN set and thus not logging to Sentry right now!",
    );
    return;
  }

  const release = `wishing-well@${packageVersion ?? "unknown"}`;
  Sentry.init({ dsn, environment: space, release });
}
