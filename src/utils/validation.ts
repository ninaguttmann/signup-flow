import { z } from 'zod';
import type { CountryCode, AccountType } from '@/types/onboarding';

const PASSWORD_PATTERNS = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  numbers: /[0-9]/,
  special: /[^A-Za-z0-9]/,
} as const;

const VALIDATION_RULES = {
  name: { min: 2, max: 50 },
  address: { min: 5, max: 200 },
  password: { min: 8 },
  team: { maxMembers: 5 },
} as const;

const ERROR_MESSAGES = {
  email: 'Invalid email format',
  teamMax: 'Maximum 5 teammates allowed',
  duplicates: 'Duplicate email addresses are not allowed',
  ownEmail: 'You cannot add your own email to the team',
} as const;

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format');
const accountTypes = ['individual', 'business'] satisfies AccountType[];
const countryCodes = ['SI', 'US', 'EN'] satisfies Exclude<CountryCode, null>[];

export const personalInfoSchema = z.object({
  name: z
    .string()
    .min(VALIDATION_RULES.name.min, `Name must be at least ${VALIDATION_RULES.name.min} characters`)
    .max(VALIDATION_RULES.name.max, `Name cannot exceed ${VALIDATION_RULES.name.max} characters`)
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: emailSchema,
  password: z
    .string()
    .min(
      VALIDATION_RULES.password.min,
      `Password must be at least ${VALIDATION_RULES.password.min} characters`
    )
    .regex(PASSWORD_PATTERNS.uppercase, 'Must include at least one uppercase letter')
    .regex(PASSWORD_PATTERNS.lowercase, 'Must include at least one lowercase letter')
    .regex(PASSWORD_PATTERNS.numbers, 'Must include at least one number')
    .regex(PASSWORD_PATTERNS.special, 'Must include at least one special character'),
  termsAccepted: z.boolean().refine((val) => val, 'You must accept the terms and conditions'),
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
  country: z.enum(countryCodes, { message: 'Please select a country' }),
});

const createTeamValidation = (userEmail?: string) => (emails: string[]) => {
  if (emails.length === 0) return true;
  const uniqueEmails = new Set(emails.map((email) => email.toLowerCase()));
  if (uniqueEmails.size !== emails.length) return false;
  if (userEmail && emails.some((email) => email.toLowerCase() === userEmail.toLowerCase()))
    return false;
  return true;
};

export const teamSchema = z.object({
  team: z
    .array(emailSchema)
    .max(VALIDATION_RULES.team.maxMembers, ERROR_MESSAGES.teamMax)
    .refine(createTeamValidation(), ERROR_MESSAGES.duplicates)
    .optional(),
});

export const createTeamSchema = (userEmail: string) =>
  z.object({
    team: z
      .array(emailSchema)
      .max(VALIDATION_RULES.team.maxMembers, ERROR_MESSAGES.teamMax)
      .refine(createTeamValidation(userEmail), ERROR_MESSAGES.ownEmail)
      .optional(),
  });

export const onboardingSchema = personalInfoSchema.and(residencyInfoSchema).and(
  z.object({
    accountType: z.enum(accountTypes),
    team: teamSchema.shape.team,
  })
);

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type ResidencyInfoFormData = z.infer<typeof residencyInfoSchema>;
export type TeamFormData = z.infer<typeof teamSchema>;
export type OnboardingFormData = z.infer<typeof onboardingSchema>;
