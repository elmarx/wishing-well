import * as t from "io-ts";
import { chain } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/function";

import { ParseResult, Schema } from "@effect/schema";

export const BooleanFromStringSchema: Schema.Schema<boolean, string> =
  Schema.transformOrFail(Schema.String, Schema.Boolean, {
    // define a function that converts a string into a boolean
    decode: (s) =>
      s === "true" || s === "1" || s.toLowerCase() === "yes"
        ? ParseResult.succeed(true)
        : s === "false" || s === "0" || s === "no"
          ? ParseResult.succeed(false)
          : ParseResult.fail(
              new ParseResult.Type(
                Schema.Literal("true", "1", "yes", "false", "0", "no").ast,
                s,
              ),
            ),
    // define a function that converts a boolean into a string
    encode: (b) => ParseResult.succeed(String(b)),
  });

export type BooleanFromStringC = t.Type<boolean, string, unknown>;
/**
 * Boolean to string with multiple typical values for truthiness: true, 1, yes
 * adapted from https://github.com/gcanti/io-ts-types/blob/master/src/BooleanFromString.ts#L25
 */
export const BooleanFromString: BooleanFromStringC = new t.Type<
  boolean,
  string,
  unknown
>(
  "BooleanFromString",
  t.boolean.is,
  (u, c) =>
    pipe(
      t.string.validate(u, c),
      chain((s) =>
        s === "true" || s === "1" || s.toLocaleLowerCase() == "yes"
          ? t.success(true)
          : s === "false" || s === "0" || s.toLocaleLowerCase() == "no"
            ? t.success(false)
            : t.failure(u, c),
      ),
    ),
  String,
);
