import {
  PersonalInfo,
  DigitalAssets,
  CryptoSetup,
  Beneficiaries,
} from "../types/will";
import { sanitizeString } from "../hooks/useDebounce";

/**
 * Validates and sanitizes personal information
 * @param data Personal information data from form
 * @returns Sanitized personal information
 */
export function sanitizePersonalInfo(
  data: Partial<PersonalInfo>
): Partial<PersonalInfo> {
  if (!data) return {};

  return {
    fullName: data.fullName ? sanitizeString(data.fullName) : data.fullName,
    state: data.state ? sanitizeString(data.state) : data.state,
    dateOfBirth: data.dateOfBirth
      ? sanitizeString(data.dateOfBirth)
      : data.dateOfBirth,
    address: data.address
      ? {
          street: sanitizeString(data.address.street || ""),
          city: sanitizeString(data.address.city || ""),
          zipCode: sanitizeString(data.address.zipCode || ""),
        }
      : undefined,
  };
}

/**
 * Validates and sanitizes digital assets
 * @param data Digital assets data from form
 * @returns Sanitized digital assets data
 */
export function sanitizeDigitalAssets(
  data: Partial<DigitalAssets>
): Partial<DigitalAssets> {
  if (!data) return {};

  // For arrays of strings, sanitize each item
  const sanitizedCategories = data.selectedCategories?.map((category) =>
    sanitizeString(category)
  );

  return {
    selectedCategories: sanitizedCategories,
    // Sanitize nested objects if present
    cryptoAssets: data.cryptoAssets?.map((asset) => ({
      type: sanitizeString(asset.type),
      platform: sanitizeString(asset.platform),
      estimatedValue: asset.estimatedValue
        ? sanitizeString(asset.estimatedValue)
        : undefined,
    })),
    cloudStorage: data.cloudStorage?.map((storage) => ({
      provider: sanitizeString(storage.provider),
      accountEmail: storage.accountEmail
        ? sanitizeString(storage.accountEmail)
        : undefined,
    })),
    socialMedia: data.socialMedia?.map((social) => ({
      platform: sanitizeString(social.platform),
      username: social.username ? sanitizeString(social.username) : undefined,
      preference: social.preference,
    })),
    digitalBusiness: data.digitalBusiness?.map((business) => ({
      type: sanitizeString(business.type),
      name: business.name ? sanitizeString(business.name) : undefined,
      estimatedValue: business.estimatedValue
        ? sanitizeString(business.estimatedValue)
        : undefined,
    })),
  };
}

/**
 * Validates and sanitizes crypto setup data
 * @param data Crypto setup data from form
 * @returns Sanitized crypto setup data
 */
export function sanitizeCryptoSetup(
  data: Partial<CryptoSetup>
): Partial<CryptoSetup> {
  if (!data) return {};

  return {
    wallets: data.wallets?.map((wallet) => ({
      type: wallet.type,
      cryptocurrency: sanitizeString(wallet.cryptocurrency),
      estimatedValue: wallet.estimatedValue
        ? sanitizeString(wallet.estimatedValue)
        : undefined,
      accessInstructions: {
        recoveryPhrase: wallet.accessInstructions.recoveryPhrase
          ? sanitizeString(wallet.accessInstructions.recoveryPhrase)
          : undefined,
        hardwareAccess: wallet.accessInstructions.hardwareAccess
          ? sanitizeString(wallet.accessInstructions.hardwareAccess)
          : undefined,
        exchangeDetails: wallet.accessInstructions.exchangeDetails
          ? sanitizeString(wallet.accessInstructions.exchangeDetails)
          : undefined,
        specialInstructions: wallet.accessInstructions.specialInstructions
          ? sanitizeString(wallet.accessInstructions.specialInstructions)
          : undefined,
      },
    })),
  };
}

/**
 * Validates and sanitizes beneficiaries data
 * @param data Beneficiaries data from form
 * @returns Sanitized beneficiaries data
 */
export function sanitizeBeneficiaries(
  data: Partial<Beneficiaries>
): Partial<Beneficiaries> {
  if (!data) return {};

  // Create deep sanitized copy of the data
  return {
    primaryBeneficiary: data.primaryBeneficiary
      ? {
          name: sanitizeString(data.primaryBeneficiary.name || ""),
          email: sanitizeString(data.primaryBeneficiary.email || ""),
          relationship: sanitizeString(
            data.primaryBeneficiary.relationship || ""
          ),
          phone: sanitizeString(data.primaryBeneficiary.phone || ""),
          percentage: data.primaryBeneficiary.percentage,
        }
      : undefined,

    secondaryBeneficiary: data.secondaryBeneficiary
      ? {
          name: sanitizeString(data.secondaryBeneficiary.name || ""),
          email: sanitizeString(data.secondaryBeneficiary.email || ""),
          relationship: sanitizeString(
            data.secondaryBeneficiary.relationship || ""
          ),
          phone: sanitizeString(data.secondaryBeneficiary.phone || ""),
          percentage: data.secondaryBeneficiary.percentage,
        }
      : undefined,

    digitalExecutor: data.digitalExecutor
      ? {
          type: data.digitalExecutor.type,
          name: data.digitalExecutor.name
            ? sanitizeString(data.digitalExecutor.name)
            : undefined,
          email: data.digitalExecutor.email
            ? sanitizeString(data.digitalExecutor.email)
            : undefined,
          phone: data.digitalExecutor.phone
            ? sanitizeString(data.digitalExecutor.phone)
            : undefined,
          techExperience: data.digitalExecutor.techExperience
            ? sanitizeString(data.digitalExecutor.techExperience)
            : undefined,
        }
      : undefined,

    emergencySettings: data.emergencySettings
      ? {
          waitingPeriod: sanitizeString(data.emergencySettings.waitingPeriod),
          verificationMethods: data.emergencySettings.verificationMethods.map(
            (method) => sanitizeString(method)
          ),
        }
      : undefined,
  };
}

/**
 * Email validation utility
 * @param email Email to validate
 * @returns True if the email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Percentage validation utility
 * @param value Percentage value to validate
 * @returns True if the percentage is valid (0-100), false otherwise
 */
export function isValidPercentage(value: number): boolean {
  return !isNaN(value) && value >= 0 && value <= 100;
}

/**
 * Checks if two percentage values add up to 100%
 * @param percentages Array of percentage values
 * @returns True if the sum is 100, false otherwise
 */
export function validatePercentagesTotal(percentages: number[]): boolean {
  const sum = percentages.reduce((total, current) => total + current, 0);
  return Math.abs(sum - 100) < 0.001; // Allow for floating point imprecision
}
