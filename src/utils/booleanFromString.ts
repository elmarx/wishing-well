import * as t from "io-ts";
import { chain } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/function";

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
