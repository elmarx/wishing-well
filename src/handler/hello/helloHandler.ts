import { Request, Response, Router } from "express";
import { HelloBodyParams } from "./codecs";
import * as E from "fp-ts/Either";
import logger from "../../logging";
import { InputDecodingFailedError } from "../../errors/input";

export function initHelloHandler(defaultName: string) {
  const r = Router();

  r.get(
    "/",
    (
      req: Request<unknown, unknown, unknown, { name?: string }>,
      res: Response,
    ) => {
      const name = req.query.name ?? defaultName;
      res.end(`Hello ${name}`);
    },
  );

  r.get(
    "/:name",
    (
      req: Request<{ name: string }, unknown, unknown, unknown>,
      res: Response,
    ) => {
      const name = req.params.name;
      res.end(`Hello ${name}`);
    },
  );

  r.post("/", (req: Request<unknown, unknown, unknown>, res: Response) => {
    const body = HelloBodyParams.decode(req.body);

    // check if the input is valid
    if (E.isLeft(body)) {
      logger.info("Got invalid request, returning error");
      // instead of throwing, we could also use
      // `return next(…)`
      throw new InputDecodingFailedError(body);
    }

    res.json({ msg: `Hello ${body.right.name}` });
  });

  return r;
}
