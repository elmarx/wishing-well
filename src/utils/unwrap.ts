/**
 * unwrap an Either. This throws if ma is left, but returns the value otherwise
 *
 * (it's inspired by rust's unwrap: sometimes the best error-handling is just to throw and crash, e.g. during startup)
 * @param ma
 */
import { Either, isRight, toError } from "fp-ts/Either";

export function unwrap<E extends Error, A>(ma: Either<E, A>): A {
  if (isRight(ma)) {
    return ma.right;
  }

  throw toError(ma.left);
}
