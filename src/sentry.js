import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import dotenv from "dotenv";
import path from "path";

const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, "config.env") });

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [nodeProfilingIntegration()],
  profileSessionSampleRate: 1.0,
  profileLifecycle: "manual",
  environment: "Development",
  tracesSampleRate: 1.0,
});

export const captureEvents = function (message, id, level) {
  Sentry.captureEvent({
    message,
    user: id,
    level,
  });
};
