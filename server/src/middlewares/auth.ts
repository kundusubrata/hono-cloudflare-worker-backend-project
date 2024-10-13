import { Context, Next } from "hono";
import { verify } from "hono/jwt";

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Login first to access this resource | Missing or invalid Authorization header" }, 401);
    }

    const token = authHeader.split(" ")[1];

    const decodedPayload = await verify(token, c.env.JWT_SECRET);

    // Check token has expired or not
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedPayload.exp && decodedPayload.exp < currentTime) {
      return c.json({ error: "Token has expired" }, 401);
    }

    console.log(decodedPayload);
    c.set("userId",decodedPayload.id);

    await next();
  } catch (error) {
    console.error(error);
    return c.json({ message: "Auth middleware Error" }, 500);
  }
};
