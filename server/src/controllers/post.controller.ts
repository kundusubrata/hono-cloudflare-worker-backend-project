import { Context, Next } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createPostInput, editPostInput } from "@kundusubrata/pinnacleblog";

// create new post  ==>> /api/v1/post/createpost
export const createPost = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();
    const { success } = createPostInput.safeParse(body);
    if (!success) {
      return c.json({ error: "Inputs are not correct" }, 400);
    }
    const authorId = c.get("userId");

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: authorId,
      },
    });

    return c.json({ message: "Created post", post }, 201);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Error in create post" }, 500);
  }
};

// show all post in home page ==>> /api/v1/posts/allpost
export const allPost = async (c: Context, next: Next) => {
  try {
    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "5");
    const skip = (page - 1) * limit;

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const post = await prisma.post.findMany({
      skip: skip,
      take: limit,
      orderBy: {
        created_at: "desc",
      },
      include:{
        author:{
          select:{
            name: true,
          }
        }
      }
    });

    return c.json({ message: "All post", post }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Error in all post" }, 500);
  }
};

// show specific post  ==>> /api/v1/post/allpost/:id
export const getSinglePost = async (c: Context, next: Next) => {
  try {
    const postId = c.req.param("id");

    if (!postId) {
      return c.json({ error: "PostId is required" }, 400);
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }

    return c.json({ message: "Single post", post }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Error in single post" }, 500);
  }
};

// get user all post  ==>> /api/v1/post/myallpost
export const getMyAllPost = async (c: Context, next: Next) => {
  try {
    const userId = c.get("userId");

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const userWithPost = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        posts: true,
      },
    });

    if (!userWithPost) {
      return c.json({ error: "User | Post not found" }, 404);
    }

    return c.json({ message: "User All Post", userWithPost }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Error in user all post" }, 500);
  }
};

// edit my post  ==>> /api/v1/post/myallpost/:id
export const editMyPost = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();
    const { success } = editPostInput.safeParse(body);
    if (!success) {
      return c.json({ error: "Inputs are not correct" }, 400);
    }
    const postId = c.req.param("id");

    if (!postId) {
      return c.json({ error: "PostId is required" }, 400);
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const currentPostData = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!currentPostData) {
      return c.json({ error: "User not found" }, 404);
    }

    const updatedData = {
      title: body.title ?? currentPostData?.title,
      content: body.content ?? currentPostData?.content,
    };

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: updatedData,
    });

    return c.json({ message: "Post updated successfully", updatedPost }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Error in user edit post" }, 500);
  }
};

// delete my post  ==>>  /api/v1/post/myallpost/:id
export const deleteMyPost = async (c: Context, next: Next) => {
  try {
    const postId = c.req.param("id");

    if (!postId) {
      return c.json({ error: "PostId is required" }, 400);
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const currentPostData = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!currentPostData) {
      return c.json({ error: "Post not found" }, 404);
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    // return c.json({ message: "Post deleted successfully" }, 200);
    return c.status(204); // 204 No Content for successful deletion
  } catch (error) {
    console.error(error);
    return c.json({ message: "Error in user delete post" }, 500);
  }
};
