import { z } from 'zod';

// Personal Information Schema
export const PersonalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  state: z.string().min(2, 'State is required'),
  dateOfBirth: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
  }).optional(),
});

// Digital Assets Schema
export const DigitalAssetsSchema = z.object({
  selectedCategories: z.array(z.string()),
  cryptoAssets: z.array(z.object({
    type: z.string(),
    platform: z.string(),
    estimatedValue: z.string().optional(),
  })).optional(),
  cloudStorage: z.array(z.object({
    provider: z.string(),
    accountEmail: z.string().optional(),
  })).optional(),
  socialMedia: z.array(z.object({
    platform: z.string(),
    username: z.string().optional(),
    preference: z.enum(['memorialize', 'delete', 'transfer']).optional(),
  })).optional(),
  digitalBusiness: z.array(z.object({
    type: z.string(),
    name: z.string().optional(),
    estimatedValue: z.string().optional(),
  })).optional(),
});

// Crypto Setup Schema
export const CryptoSetupSchema = z.object({
  wallets: z.array(z.object({
    type: z.enum(['hardware', 'software', 'exchange', 'paper']),
    cryptocurrency: z.string(),
    estimatedValue: z.string().optional(),
    accessInstructions: z.object({
      recoveryPhrase: z.string().optional(),
      hardwareAccess: z.string().optional(),
      exchangeDetails: z.string().optional(),
      specialInstructions: z.string().optional(),
    }),
  })),
});

// Beneficiary Schema (for individual beneficiaries)
const BeneficiarySchema = z.object({
  name: z.string().min(2, 'Beneficiary name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  percentage: z.number().min(1).max(100),
});

// Beneficiaries Schema (updated to support multiple beneficiaries)
export const BeneficiariesSchema = z.object({
  primaryBeneficiary: BeneficiarySchema,
  secondaryBeneficiary: BeneficiarySchema.optional(),
  digitalExecutor: z.object({
    type: z.enum(['same', 'different']),
    name: z.string().optional(),
    techExperience: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }),
  emergencySettings: z.object({
    waitingPeriod: z.string(),
    verificationMethods: z.array(z.string()),
  }),
});

// Complete Will Data Schema
export const WillDataSchema = z.object({
  personalInfo: PersonalInfoSchema,
  digitalAssets: DigitalAssetsSchema,
  cryptoSetup: CryptoSetupSchema,
  beneficiaries: BeneficiariesSchema,
  status: z.enum(['draft', 'completed', 'paid']).default('draft'),
});

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type DigitalAssets = z.infer<typeof DigitalAssetsSchema>;
export type CryptoSetup = z.infer<typeof CryptoSetupSchema>;
export type Beneficiaries = z.infer<typeof BeneficiariesSchema>;
export type Beneficiary = z.infer<typeof BeneficiarySchema>;
export type WillData = z.infer<typeof WillDataSchema>;

// Form validation errors type
export type FormErrors<T> = Partial<Record<keyof T, string>>;