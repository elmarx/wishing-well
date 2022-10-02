import { PathReporter } from "io-ts/PathReporter";
import { Left } from "fp-ts/Either";
import { Errors } from "io-ts";

export function isWishingWellError(o: unknown): o is WishingWellError {
  return o instanceof WishingWellError;
}

export class WishingWellError extends Error {
  public readonly statusCode: number = 500;
  public readonly errorCode?: number;

  constructor(message: string, cause?: Error) {
    super(message, cause ? { cause } : {});
  }
}

export class BadRequestError extends WishingWellError {
  public readonly statusCode = 400;

  constructor(params: Left<Errors>) {
    super(
      PathReporter.report(params).join("\n"),
      new AggregateError(params.left),
    );
  }
}
