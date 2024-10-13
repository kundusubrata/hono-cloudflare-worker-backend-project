import { z } from "zod";

export const signupInput = z.object({
  name: z.string().min(3, { message: "name must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(3, { message: "password must be at least 3 character" }),
});

export const signinInput = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(3, { message: "password must be at least 3 character" }),
});

export const updateProfileInput = z.object({
  name: z.string().min(3, { message: "name must be at least 3 characters" }).optional(),
  email: z.string().email({ message: "Invalid email address." }).optional(),
  password: z.string().min(3, { message: "password must be at least 3 character" }).optional(),
});

export const createPostInput = z.object({
  title: z.string({ message: "Title must be in string." }),
  content: z.string({ message: "Content must be in string." }),
})

export const allPostInput = z.object({
  page: z.string().optional().transform((val) => parseInt(val || "1")),
  limit: z.string().optional().transform((val) => parseInt(val || "5")),
});

export const editPostInput = z.object({
  title: z.string({ message: "Title must be in string." }).optional(),
  content: z.string({ message: "Content must be in string." }).optional(),
})
  



export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type UpdateProfileInput = z.infer<typeof updateProfileInput>;
export type CraetePostInput = z.infer<typeof createPostInput>;
export type AllPostInput = z.infer<typeof allPostInput>;
export type EditPostInput = z.infer<typeof editPostInput>;