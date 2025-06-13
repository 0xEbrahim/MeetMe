import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId format",
  });
export const RegisterBodySchema = z.object({
  name: z
    .string()
    .nonempty({ message: "Name is required." })
    .min(4, { message: "Name cann't be less than 4 characters." })
    .max(25, { message: "Name cannot be more than 25 character." }),
  email: z
    .string()
    .nonempty({ message: "Email is required." })
    .email({ message: "Provide a valid email format." }),
  password: z.string().nonempty({ message: "Password is required." }),
});

export const FindUserQuery = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
  sort: z.string().optional(),
  limitFields: z.string().optional(),
});

export const IDParam = z.object({
  id: objectIdSchema,
});
