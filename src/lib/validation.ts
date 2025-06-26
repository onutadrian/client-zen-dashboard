
import { z } from 'zod';

// URL validation schema
const urlSchema = z.string().url().or(z.literal(''));

// Email validation schema  
const emailSchema = z.string().email();

// Safe text schema (prevents basic XSS)
const safeTextSchema = z.string().max(1000).refine(
  (text) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(text),
  { message: 'HTML script tags are not allowed' }
);

// Client validation schemas
export const clientValidationSchema = z.object({
  name: z.string().min(1, 'Client name is required').max(100),
  price: z.number().min(0, 'Price must be positive'),
  priceType: z.enum(['hour', 'project', 'day']),
  status: z.enum(['active', 'inactive']).default('active'),
  currency: z.string().min(3).max(3).default('USD'),
  notes: safeTextSchema.optional(),
  documents: z.array(urlSchema).optional(),
  links: z.array(urlSchema).optional(),
  people: z.array(z.object({
    name: z.string().min(1).max(100),
    email: emailSchema.optional(),
    role: z.string().max(50).optional()
  })).optional(),
  invoices: z.array(z.object({
    amount: z.number().min(0),
    date: z.string(),
    description: safeTextSchema.optional()
  })).optional()
});

// Project validation schemas
export const projectValidationSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  clientId: z.number().int().positive(),
  startDate: z.string().min(1, 'Start date is required'),
  estimatedEndDate: z.string().min(1, 'Estimated end date is required'),
  endDate: z.string().optional(),
  status: z.enum(['active', 'completed', 'on-hold', 'cancelled']).default('active'),
  pricingType: z.enum(['fixed', 'hourly', 'daily']).default('fixed'),
  fixedPrice: z.number().min(0).optional(),
  hourlyRate: z.number().min(0).optional(),
  dailyRate: z.number().min(0).optional(),
  estimatedHours: z.number().int().min(0).optional(),
  currency: z.string().min(3).max(3).default('USD'),
  notes: safeTextSchema.optional(),
  documents: z.array(urlSchema).optional(),
  team: z.array(z.string().max(100)).optional()
});

// Task validation schemas
export const taskValidationSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200),
  description: safeTextSchema.optional(),
  clientId: z.number().int().positive(),
  clientName: z.string().min(1).max(100),
  projectId: z.string().min(1, 'Project is required'),
  status: z.enum(['pending', 'in-progress', 'completed', 'cancelled']).default('pending'),
  estimatedHours: z.number().int().min(0).optional(),
  actualHours: z.number().int().min(0).optional(),
  workedHours: z.number().min(0).default(0),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  notes: safeTextSchema.optional(),
  assets: z.array(urlSchema).optional()
});

// Subscription validation schemas
export const subscriptionValidationSchema = z.object({
  name: z.string().min(1, 'Subscription name is required').max(100),
  category: z.string().max(50).default('Software'),
  price: z.number().min(0, 'Price must be positive'),
  currency: z.string().min(3).max(3).default('USD'),
  billingDate: z.string().min(1, 'Billing date is required'),
  status: z.enum(['active', 'cancelled', 'paused']).default('active'),
  seats: z.number().int().min(1).default(1),
  loginEmail: emailSchema.optional(),
  secureNotes: safeTextSchema.optional()
});

// User validation schemas
export const userValidationSchema = z.object({
  email: emailSchema,
  fullName: z.string().min(1, 'Full name is required').max(100),
  role: z.enum(['admin', 'standard']).default('standard')
});

// Invite validation schemas
export const inviteValidationSchema = z.object({
  email: emailSchema,
  role: z.enum(['admin', 'standard']).default('standard')
});

// Hour entry validation schemas
export const hourEntryValidationSchema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  clientId: z.number().int().positive(),
  milestoneId: z.string().optional(),
  hours: z.number().min(0.1, 'Hours must be greater than 0').max(24, 'Hours cannot exceed 24'),
  date: z.string().min(1, 'Date is required'),
  description: safeTextSchema.optional(),
  billed: z.boolean().default(false)
});

// Milestone validation schemas
export const milestoneValidationSchema = z.object({
  title: z.string().min(1, 'Milestone title is required').max(200),
  description: safeTextSchema.optional(),
  projectId: z.string().min(1, 'Project is required'),
  targetDate: z.string().min(1, 'Target date is required'),
  status: z.enum(['pending', 'in-progress', 'completed', 'cancelled']).default('pending'),
  amount: z.number().min(0).optional(),
  currency: z.string().min(3).max(3).default('USD'),
  estimatedHours: z.number().int().min(0).optional(),
  completionPercentage: z.number().int().min(0).max(100).default(0)
});

// Invoice validation schemas
export const invoiceValidationSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().min(3).max(3).default('USD'),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['pending', 'sent', 'paid', 'overdue', 'cancelled']).default('pending'),
  description: safeTextSchema.optional(),
  clientId: z.number().int().positive().optional(),
  projectId: z.string().optional(),
  milestoneId: z.string().optional()
});

// Validation helper function
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};

// Input sanitization helpers
export const sanitizeText = (text: string): string => {
  // Basic HTML tag removal and XSS prevention
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

export const sanitizeUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return '';
    }
    return url;
  } catch {
    return '';
  }
};
