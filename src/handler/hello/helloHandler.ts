import { Request, Response } from "express";
import PromiseRouter from "express-promise-router";
import { HelloBodyParams } from "./codecs";
import * as E from "fp-ts/Either";
import logger from "../../logging";
import { InputDecodingFailedError } from "../../errors/input";

export function initHelloHandler(defaultName: string) {
  const r = PromiseRouter();

  r.get(
    "/",
    (req: Request<{}, unknown, unknown, { name?: string }>, res: Response) => {
      const name = req.query.name ?? defaultName;
      res.end(`Hello ${name}`);
    },
  );

  r.post("/", (req: Request<{}, unknown, unknown>, res: Response) => {
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
