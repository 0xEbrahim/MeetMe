import { z } from "zod";

export const LoginBodySchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required." })
    .email({ message: "Provide a valid email format." }),
  password: z.string().nonempty({ message: "Password is required." }),
});
