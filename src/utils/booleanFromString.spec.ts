import { BooleanFromStringSchema } from "./booleanFromString";
import { Schema } from "@effect/schema";
import { Either } from "effect";

describe("booleanFromString", () => {
  test("decoding 'yes'", () => {
    const decode = Schema.decodeUnknownEither(BooleanFromStringSchema);
    const actual = decode("yes");

    expect(Either.isRight(actual)).toBe(true);
  });
});
