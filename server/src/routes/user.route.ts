import { Hono } from "hono";
import {
  deleteProfile,
  getMyProfile,
  updateProfile,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth";

export const userRouter = new Hono();

userRouter.get("/myprofile", authMiddleware, getMyProfile);
userRouter.put("/updateprofile", authMiddleware, updateProfile);
userRouter.delete("/deleteprofile", authMiddleware, deleteProfile);
