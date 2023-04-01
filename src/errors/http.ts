import { WishingWellError } from "./index";

export class BadRequestError extends WishingWellError {
  public readonly statusCode = 400;
}

export class UnprocessableEntityError extends WishingWellError {
  public readonly statusCode = 422;
}

export class InternalServerError extends WishingWellError {
  public readonly statusCode = 500;
}
