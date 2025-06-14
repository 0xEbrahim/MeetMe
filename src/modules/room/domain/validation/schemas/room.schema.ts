import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z.string().refine(
  (val) => {
    return mongoose.Types.ObjectId.isValid(val);
  },
  {
    message: "Invalid ObjectId format",
  }
);

export const createRoomBodySchema = z.object({
  name: z
    .string()
    .min(1, "Room name is required")
    .max(100, "Room name must be less than 100 characters")
    .trim(),
  max_participants: z.coerce
    .number()
    .int("Max participants must be an integer")
    .min(2, "Room must allow at least 2 participants")
    .max(50, "Room cannot exceed 50 participants")
    .default(10),
});

export const joinRoomBodySchema = z.object({
  code: z
    .string()
    .min(6, "Room code must be at least 6 characters")
    .max(8, "Room code must be at most 8 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Room code must contain only uppercase letters and numbers"
    )
    .trim(),
});
export const updateRoomBodySchema = z
  .object({
    name: z
      .string()
      .min(1, "Room name cannot be empty")
      .max(100, "Room name must be less than 100 characters")
      .trim()
      .optional(),
    max_participants: z
      .number()
      .int("Max participants must be an integer")
      .min(2, "Room must allow at least 2 participants")
      .max(50, "Room cannot exceed 50 participants")
      .optional(),
    is_active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const IdParamSchema = z.object({
  id: objectIdSchema,
});

export const roomQuery = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
  sort: z.string().optional(),
  limitFields: z.string().optional(),
});

export const getRoomByCodeParamsSchema = z.object({
  code: z
    .string()
    .min(6, "Room code must be at least 6 characters")
    .max(8, "Room code must be at most 8 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Room code must contain only uppercase letters and numbers"
    )
    .trim(),
});

export const joinRoomParamSchema = getRoomByCodeParamsSchema;
