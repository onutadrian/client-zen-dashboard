
import { z } from 'zod';

// Client validation schema
export const clientSchema = z.object({
  name: z.string().min(1, 'Client name is required').max(255, 'Name too long'),
  price: z.number().min(0, 'Price must be positive'),
  priceType: z.enum(['hourly', 'fixed', 'daily'], {
    errorMap: () => ({ message: 'Invalid price type' })
  }),
  status: z.enum(['active', 'inactive', 'completed'], {
    errorMap: () => ({ message: 'Invalid status' })
  }),
  currency: z.string().min(3, 'Currency code required').max(3,   'Invalid currency code'),
  notes: z.string().optional(),
  documents: z.array(z.string().url('Invalid document URL')).optional(),
  links: z.array(z.string().url('Invalid link URL')).optional(),
  people: z.array(z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
    email: z.string().email('Invalid email format'),
    title: z.string().max(255, 'Title too long').optional()
  })).optional()
});

// Project validation schema
export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(255, 'Name too long'),
  clientId: z.number().positive('Client ID is required'),
  pricingType: z.enum(['hourly', 'fixed', 'daily']),
  fixedPrice: z.number().min(0, 'Fixed price must be positive').optional(),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive').optional(),
  dailyRate: z.number().min(0, 'Daily rate must be positive').optional(),
  estimatedHours: z.number().min(0, 'Estimated hours must be positive').optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid start date'),
  estimatedEndDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid end date'),
  currency: z.string().min(3, 'Currency code required').max(3, 'Invalid currency code'),
  status: z.enum(['active', 'completed', 'on-hold', 'cancelled']),
  notes: z.string().optional(),
  team: z.array(z.string().email('Invalid team member email')).optional(),
  documents: z.array(z.string().url('Invalid document URL')).optional()
});

// Subscription validation schema
export const subscriptionSchema = z.object({
  name: z.string().min(1, 'Subscription name is required').max(255, 'Name too long'),
  price: z.number().min(0, 'Price must be positive'),
  seats: z.number().min(1, 'Must have at least 1 seat'),
  billingDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid billing date'),
  loginEmail: z.string().email('Invalid email format').optional(),
  secureNotes: z.string().optional(),
  category: z.string().min(1, 'Category is required').max(100, 'Category too long'),
  totalPaid: z.number().min(0, 'Total paid must be positive'),
  status: z.enum(['active', 'cancelled', 'suspended']),
  currency: z.string().min(3, 'Currency code required').max(3, 'Invalid currency code')
});

// Task validation schema
export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(255, 'Title too long'),
  description: z.string().optional(),
  projectId: z.string().uuid('Invalid project ID'),
  clientId: z.number().positive('Client ID is required'),
  clientName: z.string().min(1, 'Client name is required'),
  estimatedHours: z.number().min(0, 'Estimated hours must be positive').optional(),
  actualHours: z.number().min(0, 'Actual hours must be positive').optional(),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid start date').optional(),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid end date').optional(),
  status: z.enum(['pending', 'in-progress', 'completed', 'cancelled']),
  notes: z.string().optional(),
  assets: z.array(z.string().url('Invalid asset URL')).optional()
});

// Hour entry validation schema
export const hourEntrySchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  clientId: z.number().positive('Client ID is required'),
  hours: z.number().min(0, 'Hours must be positive').max(24, 'Hours cannot exceed 24 per day'),
  description: z.string().optional(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  billed: z.boolean()
});

// Invoice validation schema
export const invoiceSchema = z.object({
  projectId: z.string().uuid('Invalid project ID').optional(),
  clientId: z.number().positive('Client ID is required').optional(),
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.string().min(3, 'Currency code required').max(3, 'Invalid currency code'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  status: z.enum(['pending', 'paid', 'overdue']),
  description: z.string().optional(),
  milestoneId: z.string().uuid('Invalid milestone ID').optional()
});

// Milestone validation schema
export const milestoneSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  title: z.string().min(1, 'Milestone title is required').max(255, 'Title too long'),
  description: z.string().optional(),
  targetDate: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid target date'),
  status: z.enum(['pending', 'in-progress', 'completed']),
  amount: z.number().min(0, 'Amount must be positive').optional(),
  currency: z.string().min(3, 'Currency code required').max(3, 'Invalid currency code').optional()
});

// Validation helper functions
export const validateClient = (data: unknown) => clientSchema.parse(data);
export const validateProject = (data: unknown) => projectSchema.parse(data);
export const validateSubscription = (data: unknown) => subscriptionSchema.parse(data);
export const validateTask = (data: unknown) => taskSchema.parse(data);
export const validateHourEntry = (data: unknown) => hourEntrySchema.parse(data);
export const validateInvoice = (data: unknown) => invoiceSchema.parse(data);
export const validateMilestone = (data: unknown) => milestoneSchema.parse(data);

// Safe validation functions that return errors instead of throwing
export const safeValidateClient = (data: unknown) => clientSchema.safeParse(data);
export const safeValidateProject = (data: unknown) => projectSchema.safeParse(data);
export const safeValidateSubscription = (data: unknown) => subscriptionSchema.safeParse(data);
export const safeValidateTask = (data: unknown) => taskSchema.safeParse(data);
export const safeValidateHourEntry = (data: unknown) => hourEntrySchema.safeParse(data);
export const safeValidateInvoice = (data: unknown) => invoiceSchema.safeParse(data);
export const safeValidateMilestone = (data: unknown) => milestoneSchema.safeParse(data);
