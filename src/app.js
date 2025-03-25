import express, { json, urlencoded } from "express";
import * as Sentry from "@sentry/node";

import { userRouter } from "./routes/userRouter.js";
import "./sentry.js";

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

// N0 api version
app.use(userRouter);

app.get("/", (req, res) => {
  throw new Error("Something went wrong");
});

app.use((err, req, res, next) => {
  console.log(err?.message);
  Sentry.captureException(err);
  console.log(err);
  res.status(500).json({ message: "Internal server error" });
});

const sampleLoop = function () {
  Sentry.profiler.startProfiler();
  for (let i = 0; i < 100000; i++) {}
  Sentry.profiler.stopProfiler();
  console.log("finish");
};

sampleLoop();

export { app };
