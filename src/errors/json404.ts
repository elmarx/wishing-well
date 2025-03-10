import { Handler } from "express";

/**
 * return 404 error handler
 *
 * @param disableHtml404Handler disable the default HTML 404 handler from express
 */
export function initJson404Handler(disableHtml404Handler = true): Handler {
  return (req, res, next) => {
    if (disableHtml404Handler || req.header("application/json")) {
      res.status(404).json({ error: "not found" });
    } else {
      next();
    }
  };
}
