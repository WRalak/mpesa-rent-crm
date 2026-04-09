import { z } from "zod";

// Phone number validation
export const phoneSchema = z
  .string()
  .min(10, "Phone number must have at least 10 digits")
  .max(15, "Phone number must not exceed 15 digits")
  .transform((value) => value.replace(/\D/g, ""))
  .refine((value) => value.length >= 10, "Phone number must have at least 10 digits")
  .refine((value) => value.length <= 15, "Phone number must not exceed 15 digits");

// Amount validation
export const amountSchema = z
  .number()
  .positive("Amount must be greater than 0")
  .max(1000000, "Amount cannot exceed 1,000,000")
  .refine((value) => Number.isFinite(value), "Invalid amount format");

// Property validation
export const propertySchema = z.object({
  name: z
    .string()
    .min(1, "Property name is required")
    .max(100, "Property name cannot exceed 100 characters")
    .trim(),
  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location cannot exceed 200 characters")
    .trim(),
  unitCount: z
    .number()
    .int("Unit count must be a whole number")
    .min(1, "Property must have at least 1 unit")
    .max(1000, "Property cannot have more than 1000 units"),
});

// Tenant validation
export const tenantSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must have at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .trim()
    .refine((value) => /^[a-zA-Z\s]+$/.test(value), "Full name can only contain letters and spaces"),
  phone: phoneSchema,
  unitNumber: z
    .string()
    .min(1, "Unit number is required")
    .max(20, "Unit number cannot exceed 20 characters")
    .trim(),
  rentAmount: amountSchema,
  propertyId: z
    .string()
    .min(1, "Property is required")
    .cuid("Invalid property selection"),
});

// Payment validation
export const paymentSchema = z.object({
  tenantId: z
    .string()
    .min(1, "Tenant is required")
    .cuid("Invalid tenant selection"),
  amount: amountSchema,
  phoneNumber: phoneSchema,
});

// User registration validation
export const registrationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must have at least 2 characters")
    .max(100, "Name cannot exceed 100 characters")
    .trim()
    .refine((value) => /^[a-zA-Z\s]+$/.test(value), "Name can only contain letters and spaces"),
  phone: phoneSchema,
  email: z
    .string()
    .email("Invalid email address")
    .max(100, "Email cannot exceed 100 characters")
    .optional(),
});

// OTP validation
export const otpSchema = z
  .string()
  .length(6, "OTP must be exactly 6 digits")
  .refine((value) => /^\d{6}$/.test(value), "OTP must contain only numbers");

// Login validation
export const loginSchema = z.object({
  phone: phoneSchema,
  otp: otpSchema.optional(),
});

// Search validation
export const searchSchema = z.object({
  query: z
    .string()
    .min(1, "Search query is required")
    .max(100, "Search query cannot exceed 100 characters")
    .trim(),
  limit: z
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .default(10),
  offset: z
    .number()
    .int()
    .min(0, "Offset cannot be negative")
    .default(0),
});

// Date range validation
export const dateRangeSchema = z.object({
  startDate: z
    .string()
    .datetime("Invalid start date")
    .optional(),
  endDate: z
    .string()
    .datetime("Invalid end date")
    .optional(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, "End date must be after start date");

// Export types for use in components
export type PropertyInput = z.infer<typeof propertySchema>;
export type TenantInput = z.infer<typeof tenantSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type RegistrationInput = z.infer<typeof registrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type DateRangeInput = z.infer<typeof dateRangeSchema>;
