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
