import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const eventSchema = z.object({
  name: z
    .string()
    .min(2, "Event name must be at least 2 characters")
    .max(100, "Event name cannot exceed 100 characters"),
  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(), // Make description optional
  date: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Please enter a valid date",
  }),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location cannot exceed 100 characters"),
});

export const cancellationSchema = z.object({
  reason: z
    .string()
    .min(5, "Reason must be at least 5 characters")
    .max(200, "Reason cannot exceed 200 characters"),
});

export const eventFilterSchema = z.object({
  search: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
