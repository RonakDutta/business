import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env.js";
import apiRoutes from "./routes/index.js";
import { notFound, handleErrors } from "./middleware/error.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.clientOrigins }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  if (!env.isProd) app.use(morgan("dev"));

  app.get("/", (req, res) => res.json({ name: "Business 4.0 API" }));
  app.use("/api", apiRoutes);

  app.use(notFound);
  app.use(handleErrors);

  return app;
}
