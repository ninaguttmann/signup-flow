import { personalInfoSchema, type PersonalInfoFormData } from './validation';

export const PASSWORD_HELPER_TEXT =
  'Must include at least one uppercase letter, one lowercase letter, one number, and one special character.';
export const formatFieldError = (field: string) =>
  `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;

export const validateField = (fieldName: keyof PersonalInfoFormData, value: string | boolean) => {
  try {
    const fieldSchema =
      personalInfoSchema.shape[fieldName as keyof typeof personalInfoSchema.shape];
    fieldSchema.parse(value);
    return null;
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> };
      return zodError.issues[0]?.message || null;
    }
    return null;
  }
};

export const validateFormForSubmit = (formData: PersonalInfoFormData) => {
  try {
    personalInfoSchema.parse(formData);
    return { isValid: true, errors: {} as Record<string, string> };
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      const zodError = error as { issues: Array<{ path: (string | number)[]; message: string }> };
      const newErrors: Record<string, string> = {};

      zodError.issues.forEach((issue) => {
        if (issue.path.length > 0) {
          const field = issue.path[0] as string;
          const value = formData[field as keyof PersonalInfoFormData];

          if (
            (typeof value === 'string' && value.trim() === '') ||
            (typeof value === 'boolean' && !value)
          ) {
            newErrors[field] = formatFieldError(field);
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
