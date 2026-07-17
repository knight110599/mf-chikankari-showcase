import "dotenv/config";
import app from "./app.js";

const port = Number(process.env.PORT) || 5000;

const server = app.listen(port, () => {
  console.log(`MF Chikankari API running on http://localhost:${port}`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} received. Closing server...`);

  server.close(() => {
    console.log("Server closed successfully.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));