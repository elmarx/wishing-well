import * as t from "io-ts";
import { withFallback } from "io-ts-types";
import { Space } from "./codecs";

// "exact" strips away values not defined here
export const Env = t.exact(
  t.type({
    SPACE: withFallback(Space, "dev"),
    PORT: withFallback(t.number, 8080),
    GIT_REVISION: withFallback(t.string, "unknown"),

    DEFAULT_NAME: withFallback(t.string, "World"),
  }),
);
