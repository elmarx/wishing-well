import * as t from "io-ts";
import { withFallback } from "io-ts-types";
import { BooleanFromString } from "../utils/booleanFromString";

export const Space = t.union([
  t.literal("dev"),
  t.literal("staging"),
  t.literal("prod"),
]);
export type Space = t.TypeOf<typeof Space>;

export const LogPretty = withFallback(BooleanFromString, false);
