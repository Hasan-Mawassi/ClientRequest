import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/config.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: config.clientUrl }));
app.use(express.json());
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

export default app;
