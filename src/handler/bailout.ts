import { Router } from "express";

/**
 * router to quickly bailout from "verbose" requests like e.g. favicon
 */
export function initBailoutHandler(): Router {
  const r = Router();
  r.get("/favicon.ico", (_req, res) => {
    res.status(204).end();
  });

  return r;
}
