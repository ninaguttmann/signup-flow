import { residencyInfoSchema, type ResidencyInfoFormData } from './validation';

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

interface ZodValidationError {
  issues: Array<{
    path: (string | number)[];
    message: string;
  }>;
}

const isZodError = (error: unknown): error is ZodValidationError => {
  return error instanceof Error && 'issues' in error;
};

export const validateResidencyField = (
  fieldName: keyof ResidencyInfoFormData,
  value: string
): string | null => {
  try {
    const fieldSchema =
      residencyInfoSchema.shape[fieldName as keyof typeof residencyInfoSchema.shape];
    fieldSchema.parse(value);
    return null;
  } catch (error) {
    if (isZodError(error)) {
      return error.issues[0]?.message || null;
    }
    return null;
  }
};

export const validateResidencyFormForSubmit = (
  formData: ResidencyInfoFormData
): ValidationResult => {
  try {
    residencyInfoSchema.parse(formData);
    return { isValid: true, errors: {} as Record<string, string> };
  } catch (error) {
    if (isZodError(error)) {
      const newErrors: Record<string, string> = {};

      error.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          const field = issue.path[0] as string;
          const value = formData[field as keyof ResidencyInfoFormData];

          if (value.trim() === '') {
            newErrors[field] = formatAddressFieldError(field);
          } else {
            newErrors[field] = issue.message;
          }
        }
      });

      return { isValid: false, errors: newErrors };
    }
    return { isValid: false, errors: {} as Record<string, string> };
  }
};

export const formatAddressFieldError = (field: string): string => {
  if (field === 'address') return 'Address is required';
  if (field === 'country') return 'Country is required';
  return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
};

export const COUNTRY_OPTIONS = [
  { value: 'SI', label: 'Slovenia' },
  { value: 'US', label: 'USA' },
  { value: 'EN', label: 'England' },
] as const;

export type CountryOption = (typeof COUNTRY_OPTIONS)[number];
