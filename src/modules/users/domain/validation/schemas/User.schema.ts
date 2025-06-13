import { z } from "zod";
import { IRegisterUser } from "../../models/IRegisterUser";

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

export const IFindUserQuery = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
  sort: z.string().optional(),
  limitFields: z.string().optional(),
});
