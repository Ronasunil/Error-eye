import mongoose from "mongoose";

import { app } from "./app.js";

import { captureEvents } from "./sentry.js";
import dotenv from "dotenv";
import path from "path";

const __dirname = path.resolve();
const PORT = 2000;

dotenv.config({ path: path.join(__dirname, "config.env") });

const dbConnection = async function () {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/sample-sentry");
    console.log("mongodb connection successfull");
    captureEvents("Mongodb connection susccessfull", "", "info");
  } catch (err) {
    console.log("Failed connecting to mongodb");
    console.log(err);
  }
};

const startServer = async function () {
  try {
    app.listen(PORT, () => {
      console.log(`started server on port:${PORT}`);
    });
    await dbConnection();
  } catch (err) {
    console.log(err);
  }
};

startServer();
