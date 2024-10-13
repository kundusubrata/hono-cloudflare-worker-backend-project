import { Context, Next } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { hashPassword, comparePassword } from "../utils/hashedPassword";
import { signinInput, signupInput } from "@kundusubrata/pinnacleblog";

// Register a new user ==>> /api/v1/auth/signup
export const signUpUser = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if (!success) {
      return c.json({ error: "Inputs are not correct" }, 400);
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return c.json({ message: "Email already exists." }, 409);
    }

    const hashedPassword = await hashPassword(body.password);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      },
    });

    const token = await sign(
      {
        id: user.id,
        exp: Math.floor(Date.now()) / 1000 + 2 * 24 * 60 * 60,
      },
      c.env.JWT_SECRET
    );

    return c.json({ message: "Signup Successful", user, token }, 201);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Signup Error" }, 500);
  }
};

// Login user  ==>> /api/v1/auth/sigin
export const signInUser = async (c: Context, next: Next) => {
  try {
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if (!success) {
      return c.json({ error: "Inputs are not correct" }, 400);
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      return c.json({ message: "Invalid email" }, 403);
    }

    const isValidPassword = await comparePassword(body.password, user.password);
    if (!isValidPassword) {
      return c.json({ message: "Invalid email or password" }, 403);
    }

    const token = await sign(
      {
        id: user.id,
        exp: Math.floor(Date.now()) / 1000 + 2 * 24 * 60 * 60,
      },
      c.env.JWT_SECRET
    );

    return c.json({ message: "Signin Successful", user, token }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Sigin Error" }, 500);
  }
};

// logout user  ==>> /api/v1/auth/logout
export const logoutUser = async (c: Context, next: Next) => {
  return c.json(
    {
      message: "Logout Successfull",
    },
    200
  );
};
