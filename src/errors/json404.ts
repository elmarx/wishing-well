import { Handler } from "express";

export function initJson404Handler(): Handler {
  return (req, res, next) => {
    // check if this is a JSON request.
    // if this is a pure JSON-Microservice, this condition could be omitted
    if (req.header("application/json")) {
      return res.status(404).json({ error: "not found" });
    }
    return next();
  };
}
