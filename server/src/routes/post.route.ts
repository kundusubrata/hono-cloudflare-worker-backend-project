import { Hono } from "hono";
import {
  allPost,
  createPost,
  deleteMyPost,
  editMyPost,
  getMyAllPost,
  getSinglePost,
} from "../controllers/post.controller";
import { authMiddleware } from "../middlewares/auth";

export const postRouter = new Hono();

postRouter.post("/createpost", authMiddleware, createPost);
postRouter.get("/allpost", allPost);
postRouter.get("/allpost/:id", getSinglePost);
postRouter.get("/myallpost", authMiddleware, getMyAllPost);
postRouter.put("/myallpost/:id", authMiddleware, editMyPost);
postRouter.delete("/myallpost/:id", authMiddleware, deleteMyPost);
