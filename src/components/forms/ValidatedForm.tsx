
import React, { ReactNode } from 'react';
import { z } from 'zod';
import { validateData } from '@/lib/validation';
import { useSecurityAudit } from '@/hooks/useSecurityAudit';
import { useToast } from '@/hooks/use-toast';

interface ValidatedFormProps<T> {
  schema: z.ZodSchema<T>;
  onSubmit: (data: T) => void | Promise<void>;
  onValidationError?: (errors: string[]) => void;
  children: ReactNode;
  className?: string;
  formName: string;
}

export function ValidatedForm<T>({
  schema,
  onSubmit,
  onValidationError,
  children,
  className,
  formName
}: ValidatedFormProps<T>) {
  const { trackValidationError, validateInput } = useSecurityAudit();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    // Additional security validation for text inputs
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string' && !validateInput(value, `${formName}_${key}`)) {
        toast({
          title: "Security Error",
          description: "Invalid input detected. Please check your data and try again.",
          variant: "destructive",
        });
        return;
      }
    }

    const validation = validateData(schema, data);
    
    if (validation.success) {
      try {
        await onSubmit(validation.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while submitting the form. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      // Now validation is properly typed as { success: false; errors: string[] }
      const validationErrors = validation.errors;
      
      // Track validation errors for security monitoring
      validationErrors.forEach(error => {
        const fieldMatch = error.match(/^([^:]+):/);
        const fieldName = fieldMatch ? fieldMatch[1] : 'unknown';
        trackValidationError(fieldName, error, data);
      });

      if (onValidationError) {
        onValidationError(validationErrors);
      } else {
        toast({
          title: "Validation Error",
          description: validationErrors[0] || "Please check your input and try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}
