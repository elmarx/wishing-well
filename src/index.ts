import express, { Application, json, urlencoded } from "express";
import cors from "cors";
import { wire } from "./init/wire";
import { initConfig } from "./init/config";
import logger from "./logging";
import { unwrap } from "./utils/unwrap";
import { initBailoutHandler } from "./handler/bailout";

async function main(): Promise<void> {
  const app: Application = express();

  // if the config is invalid just throw, i.e. exit at startup
  const config = unwrap(initConfig());
  const { loggingMiddleware, errorMiddleware, helloHandler } = wire(config);

  app.use(initBailoutHandler());
  app.use(loggingMiddleware);
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use("/hello-world", helloHandler);
  app.use("/", (_req, res) => res.redirect("/hello-world", 307));

  app.use(errorMiddleware);
  app.listen(config.port, (): void => {
    logger.info(`Server started on port ${config.port}`);
  });
}

if (require.main === module) {
  main().catch((err) => {
    logger.error(err, "Error executing main()");
  });
}
