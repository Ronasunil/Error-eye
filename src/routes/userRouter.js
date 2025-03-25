import { Router } from "express";
import * as Sentry from "@sentry/node";

import { captureEvents } from "../sentry.js";
import { UserModel } from "../models/userSchema.js";

const userRouter = Router();

userRouter.post("/users", async (req, res) => {
  try {
    const user = new UserModel(req.body);
    Sentry.startSpan(
      {
        name: "DB Saving user",
        op: "db.metrics",
      },
      async () => {
        await user.save();
      }
    );

    res.status(201).send(user);

    captureEvents("User created", user._id, "info");
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
//Get all users
userRouter.get("/users", async (req, res) => {
  try {
    Sentry.profiler.startProfiler();
    const users = await UserModel.find();
    Sentry.profiler.stopProfiler();
    res.send(users);

    captureEvents("Getting all users", "All users", "info");
  } catch (error) {
    res.status(500).send(error);
  }
});

//  Get a user by ID
userRouter.get("/users/:id", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);

    captureEvents("Get user by id", user._id, "info");
  } catch (error) {
    res.status(500).send(error);
  }
});
// Update a user by ID
userRouter.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid updates!" });
    captureEvents("Updating user failed", user._id, "error");
    return;
  }
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
    captureEvents("User deleted", user._id, "info");
  } catch (error) {
    res.status(400).send(error);
  }
});
// Delete a user by ID
userRouter.delete("/users/:id", async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).send();
      captureEvents(`Cant delete user`, user._id, "error");
      return;
    }
    res.send(user);
    captureEvents("User deleted", user._id, "info");
  } catch (error) {
    res.status(500).send(error);
    captureEvents("User deletion failed", user._id, "error");
  }
});

export { userRouter };
