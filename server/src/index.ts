import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRouter } from "./routes/auth.route";
import { userRouter } from "./routes/user.route";
import { postRouter } from "./routes/post.route";

const app = new Hono();

app.use("/*", cors());
app.get("/", (c) => {
  return c.text("hello hono");
});
app.route("/api/v1/auth", authRouter);
app.route("/api/v1/user", userRouter);
app.route("/api/v1/post", postRouter);

export default app;

//* User Dashboard section for user */
// get my profile  ==>> /api/v1/user/profile  // update profile details  ==>> /api/v1/user/profile/:userId
// create post ==>> /api/v1/user/create
// My all post  ==>> /api/v1/user/myallpost   // update post  ==>> /api/v1/user/myallpost/:postId // delete post  ==>> /api/v1/user/myallpost/
// Bookmarks   ==>> /api/v1/user/saved/:postId

//* homepage  */
// show all post in home page ==>> /api/v1/posts/
// show specific post  ==>> /api/v1/posts/:postId
// comment post     ==
// like post        == relationship with userid and postid , add fileds likes , comment ,bookmark
// add bookmark

//* Admin Dashboard section for admin */
// ------------- Admin ------------- (user model add role[admin, user]) == if admin login this or user login that
// Dashboard
// All Admins
// All Users
// All Posts
