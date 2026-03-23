import { z } from 'zod';
import type { CountryCode, AccountType } from '@/types/onboarding';

export const PASSWORD_PATTERNS = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  numbers: /[0-9]/,
  special: /[^A-Za-z0-9]/,
} as const;

export const VALIDATION_RULES = {
  name: { min: 5, max: 50 },
  address: { min: 5, max: 200 },
  password: { min: 8 },
  team: { maxMembers: 5 },
} as const;

export const ERROR_MESSAGES = {
  email: 'Invalid email format',
  teamMax: 'Maximum 5 teammates allowed',
  duplicates: 'Duplicate email addresses are not allowed',
  ownEmail: 'You cannot add your own email to the team',
  required: 'This field is required',
  nameChars: 'Name can only contain letters and spaces',
  termsRequired: 'You must accept the terms and conditions',
  countryRequired: 'Please select a country',
  password: {
    uppercase: 'Must include at least one uppercase letter',
    lowercase: 'Must include at least one lowercase letter',
    numbers: 'Must include at least one number',
    special: 'Must include at least one special character',
  },
} as const;

export const emailSchema = z
  .string()
  .min(1, ERROR_MESSAGES.required)
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, ERROR_MESSAGES.email);

export const ACCOUNT_TYPES = ['individual', 'business'] satisfies AccountType[];
export const COUNTRY_CODES = ['SI', 'US', 'EN'] satisfies Exclude<CountryCode, null>[];

export const personalInfoSchema = z.object({
  name: z
    .string()
    .min(VALIDATION_RULES.name.min, `Name must be at least ${VALIDATION_RULES.name.min} characters`)
    .max(VALIDATION_RULES.name.max, `Name cannot exceed ${VALIDATION_RULES.name.max} characters`)
    .regex(/^[a-zA-Z\s]+$/, ERROR_MESSAGES.nameChars),
  email: emailSchema,
  password: z
    .string()
    .min(
      VALIDATION_RULES.password.min,
      `Password must be at least ${VALIDATION_RULES.password.min} characters`
    )
    .regex(PASSWORD_PATTERNS.uppercase, ERROR_MESSAGES.password.uppercase)
    .regex(PASSWORD_PATTERNS.lowercase, ERROR_MESSAGES.password.lowercase)
    .regex(PASSWORD_PATTERNS.numbers, ERROR_MESSAGES.password.numbers)
    .regex(PASSWORD_PATTERNS.special, ERROR_MESSAGES.password.special),
  termsAccepted: z.boolean().refine((val) => val, ERROR_MESSAGES.termsRequired),
});

export const residencyInfoSchema = z.object({
  address: z
    .string()
    .min(
      VALIDATION_RULES.address.min,
      `Address must be at least ${VALIDATION_RULES.address.min} characters`
    )
    .max(
      VALIDATION_RULES.address.max,
      `Address cannot exceed ${VALIDATION_RULES.address.max} characters`
    ),
  country: z.enum(['', ...COUNTRY_CODES], { message: ERROR_MESSAGES.countryRequired }),
});

const hasDuplicates = (emails: string[]): boolean => {
  const normalized = emails.map((email) => email.toLowerCase());
  return new Set(normalized).size !== emails.length;
};

const containsUserEmail = (emails: string[], userEmail: string): boolean => {
  return emails.some((email) => email.toLowerCase() === userEmail.toLowerCase());
};

const checkDuplicates = (emails: string[]) => !hasDuplicates(emails);
const checkOwnEmail = (emails: string[], userEmail: string) =>
  !containsUserEmail(emails, userEmail);

export const teamSchema = z.object({
  team: z
    .array(emailSchema)
    .max(VALIDATION_RULES.team.maxMembers, ERROR_MESSAGES.teamMax)
    .refine(checkDuplicates, ERROR_MESSAGES.duplicates)
    .optional(),
});

export const createTeamSchema = (userEmail: string) =>
  z.object({
    team: z
      .array(emailSchema)
      .max(VALIDATION_RULES.team.maxMembers, ERROR_MESSAGES.teamMax)
      .refine(checkDuplicates, ERROR_MESSAGES.duplicates)
      .refine((emails) => checkOwnEmail(emails, userEmail), ERROR_MESSAGES.ownEmail)
      .optional(),
  });

export const onboardingSchema = personalInfoSchema.and(residencyInfoSchema).and(
  z.object({
    accountType: z.enum(ACCOUNT_TYPES),
    team: teamSchema.shape.team,
  })
);

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type ResidencyInfoFormData = z.infer<typeof residencyInfoSchema>;
export type TeamFormData = z.infer<typeof teamSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
