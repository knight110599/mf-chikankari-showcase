import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middlewares/error.middleware.js";
import apiRouter from "./routes/index.js";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(
  express.urlencoded({
    extended: true,
  }),
);

if (
  process.env.NODE_ENV === "development"
) {
  app.use(morgan("dev"));
}

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message:
      "MF Chikankari API is running.",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/users", userRouter);
app.use("/api", apiRouter);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message:
      "API endpoint not found.",
  });
});

app.use(errorHandler);

export default app;