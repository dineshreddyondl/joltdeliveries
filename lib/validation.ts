import { z } from "zod";

/** 6-digit Indian PIN code */
const pin = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "PIN code must be 6 digits");

const weightKg = z.number().positive("Weight must be positive").max(1000, "Max 1000 kg per shipment");

/* POST /api/serviceability */
export const serviceabilitySchema = z.object({
  originPin: pin,
  destPin: pin,
  weightKg,
});

/* POST /api/pilot */
export const pilotSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  company: z.string().trim().min(2, "Company is required"),
  email: z.string().trim().email("Valid email required"),
  phone: z.string().trim().min(10).max(15),
  origin: z.string().trim().min(2),
  destination: z.string().trim().min(2),
  notes: z.string().trim().max(500).optional(),
});

/* POST /api/estimate */
export const estimateSchema = z.object({
  originPin: pin,
  destPin: pin,
  weightKg,
  volumeCft: z.number().positive().optional(),
});

export type ServiceabilityInput = z.infer<typeof serviceabilitySchema>;
export type PilotInput = z.infer<typeof pilotSchema>;
export type EstimateInput = z.infer<typeof estimateSchema>;
