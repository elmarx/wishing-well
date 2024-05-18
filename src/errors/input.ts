import { InternalServerError, UnprocessableEntityError } from "./http";
import { Left, toError } from "fp-ts/Either";
import { Errors } from "io-ts";
import { PathReporter } from "io-ts/PathReporter";

/**
 * error for failed io-ts-decoding
 */
export class InputDecodingFailedError extends UnprocessableEntityError {
  constructor(params: Left<Errors>) {
    super(
      PathReporter.report(params).join("\n"),
      new AggregateError(params.left),
    );
  }
}

export class UnknownError extends InternalServerError {
  constructor(cause: unknown) {
    const error = toError(cause);

    super("Unknown error occurred: " + error.message, error);
  }
}
