import { Context, Next } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { hashPassword } from "../utils/hashedPassword";
import { updateProfileInput } from "@kundusubrata/pinnacleblog";

// get my profile  ==>> /api/v1/user/myprofile
export const getMyProfile = async (c: Context, next: Next) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const authorId = c.get("userId");

    const user = await prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ message: "User Profile", user }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "My profile Error" }, 500);
  }
};

// update profile details  ==>> /api/v1/user/updateprofile
export const updateProfile = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();
    const { success } = updateProfileInput.safeParse(body);
    if (!success) {
      return c.json({ error: "Inputs are not correct" }, 400);
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const authorId = c.get("userId");

    const currentUser = await prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });

    if (!currentUser) {
      return c.json({ error: "User not found" }, 404);
    }

    const updateData = {
      name: body.name ?? currentUser.name,
      email: body.email ?? currentUser.email,
      password: body.password
        ? await hashPassword(body.password)
        : currentUser.password,
    };

    const updateUser = await prisma.user.update({
      where: {
        id: authorId,
      },
      data: updateData,
    });

    return c.json({ message: "Update User Profile", updateUser }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "My user profile Error" }, 500);
  }
};

// Delete my account   ==>> /api/v1/user/myprofile
export const deleteProfile = async (c: Context, next: Next) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const authorId = c.get("userId");

    const user = await prisma.user.delete({
      where: {
        id: authorId,
      },
    });

    return c.json({ message: "Deleted User Profile" }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Delete profile Error" }, 500);
  }
};
