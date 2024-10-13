import { Hono } from "hono";
import {
  logoutUser,
  signInUser,
  signUpUser,
} from "../controllers/auth.controller";

export const authRouter = new Hono();

authRouter.post("/signup", signUpUser);
authRouter.post("/signin", signInUser);
authRouter.post("/logout", logoutUser);
