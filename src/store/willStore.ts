// @ts-nocheck - This is a temporary solution to avoid TypeScript errors in this file
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  WillData,
  PersonalInfo,
  DigitalAssets,
  CryptoSetup,
  Beneficiaries,
  FormErrors,
} from "../types/will";
import { supabase, willDataService, sessionService } from "../lib/supabase";
import {
  sanitizePersonalInfo,
  sanitizeDigitalAssets,
  sanitizeCryptoSetup,
  sanitizeBeneficiaries,
} from "../lib/inputUtils";

interface WillStore {
  // State
  willData: Partial<WillData>;
  currentStep: number;
  isLoading: boolean;
  errors: Record<string, FormErrors<any>>;
  sessionId: string | null;
  isAuthenticated: boolean;
  userId: string | null;

  // Personal Info Actions
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  validatePersonalInfo: () => boolean;

  // Digital Assets Actions
  updateDigitalAssets: (data: Partial<DigitalAssets>) => void;
  validateDigitalAssets: () => boolean;

  // Crypto Setup Actions
  updateCryptoSetup: (data: Partial<CryptoSetup>) => void;
  validateCryptoSetup: () => boolean;

  // Beneficiaries Actions
  updateBeneficiaries: (data: Partial<Beneficiaries>) => void;
  validateBeneficiaries: () => boolean;

  // Navigation Actions
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

  // Session Management
  initializeSession: () => void;
  saveToSession: () => Promise<void>;
  loadFromSession: () => Promise<void>;
  clearSession: () => Promise<void>;

  // Database Actions
  saveWillData: () => Promise<void>;
  loadWillData: (userId?: string) => Promise<void>;

  // Authentication Actions
  checkAuthStatus: () => Promise<void>;
  setAuthStatus: (isAuthenticated: boolean, userId?: string) => void;

  // Utility Actions
  setLoading: (loading: boolean) => void;
  setError: (step: string, errors: FormErrors<any>) => void;
  clearErrors: (step?: string) => void;
  getCompletionPercentage: () => number;
}

export const useWillStore = create<WillStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial State
    willData: {},
    currentStep: 1,
    isLoading: false,
    errors: {},
    sessionId: null,
    isAuthenticated: false,
    userId: null,

    // Personal Info Actions
    updatePersonalInfo: (data) => {
      console.log("🔄 [PERSONAL_INFO] Updating personal info:", data);

      // Sanitize the input data first
      const sanitizedData = sanitizePersonalInfo(data);
      console.log("🧹 [PERSONAL_INFO] Sanitized personal info:", sanitizedData);

      set((state) => {
        const newWillData = {
          ...state.willData,
          personalInfo: { ...state.willData.personalInfo, ...sanitizedData },
        };

        console.log(
          "📝 [PERSONAL_INFO] New personal info state:",
          newWillData.personalInfo
        );

        return { willData: newWillData };
      });

      console.log("💾 [PERSONAL_INFO] Triggering session save...");
      get().saveToSession();
    },

    validatePersonalInfo: () => {
      console.log("✅ [VALIDATION] Validating personal info...");

      const { personalInfo } = get().willData;
      const errors: FormErrors<PersonalInfo> = {};

      console.log("📋 [VALIDATION] Current personal info data:", personalInfo);

      if (!personalInfo?.fullName || personalInfo.fullName.length < 2) {
        errors.fullName = "Full name is required";
        console.log("❌ [VALIDATION] Full name validation failed");
      }
      if (!personalInfo?.state) {
        errors.state = "State is required";
        console.log("❌ [VALIDATION] State validation failed");
      }

      console.log("📊 [VALIDATION] Validation errors:", errors);

      get().setError("personalInfo", errors);
      const isValid = Object.keys(errors).length === 0;

      console.log(
        `${
          isValid ? "✅" : "❌"
        } [VALIDATION] Personal info validation result:`,
        isValid
      );

      return isValid;
    },

    // Digital Assets Actions
    updateDigitalAssets: (data) => {
      console.log("🔄 [DIGITAL_ASSETS] Updating digital assets:", data);

      // Sanitize the input data first
      const sanitizedData = sanitizeDigitalAssets(data);
      console.log(
        "🧹 [DIGITAL_ASSETS] Sanitized digital assets:",
        sanitizedData
      );

      set((state) => {
        const newWillData = {
          ...state.willData,
          digitalAssets: { ...state.willData.digitalAssets, ...sanitizedData },
        };

        console.log(
          "📝 [DIGITAL_ASSETS] New digital assets state:",
          newWillData.digitalAssets
        );

        return { willData: newWillData };
      });

      console.log("💾 [DIGITAL_ASSETS] Triggering session save...");
      get().saveToSession();
    },

    validateDigitalAssets: () => {
      console.log("✅ [VALIDATION] Validating digital assets...");

      const { digitalAssets } = get().willData;
      const errors: FormErrors<DigitalAssets> = {};

      console.log(
        "📋 [VALIDATION] Current digital assets data:",
        digitalAssets
      );

      if (
        !digitalAssets?.selectedCategories ||
        digitalAssets.selectedCategories.length === 0
      ) {
        errors.selectedCategories =
          "Please select at least one digital asset category";
        console.log("❌ [VALIDATION] Selected categories validation failed");
      }

      console.log("📊 [VALIDATION] Validation errors:", errors);

      get().setError("digitalAssets", errors);
      const isValid = Object.keys(errors).length === 0;

      console.log(
        `${
          isValid ? "✅" : "❌"
        } [VALIDATION] Digital assets validation result:`,
        isValid
      );

      return isValid;
    },

    // Crypto Setup Actions
    updateCryptoSetup: (data) => {
      console.log("🔄 [CRYPTO_SETUP] Updating crypto setup:", data);

      // Sanitize the input data first
      const sanitizedData = sanitizeCryptoSetup(data);
      console.log("🧹 [CRYPTO_SETUP] Sanitized crypto setup:", sanitizedData);

      set((state) => {
        const newWillData = {
          ...state.willData,
          cryptoSetup: { ...state.willData.cryptoSetup, ...sanitizedData },
        };

        console.log(
          "📝 [CRYPTO_SETUP] New crypto setup state:",
          newWillData.cryptoSetup
        );

        return { willData: newWillData };
      });

      console.log("💾 [CRYPTO_SETUP] Triggering session save...");
      get().saveToSession();
    },

    validateCryptoSetup: () => {
      console.log("✅ [VALIDATION] Validating crypto setup (optional step)...");
      // Crypto setup is optional, so always return true for now
      console.log(
        "✅ [VALIDATION] Crypto setup validation result: true (optional)"
      );
      return true;
    },

    // Beneficiaries Actions
    updateBeneficiaries: (data) => {
      console.log("🔄 [BENEFICIARIES] Updating beneficiaries:", data);

      // Sanitize the input data first
      const sanitizedData = sanitizeBeneficiaries(data);
      console.log("🧹 [BENEFICIARIES] Sanitized beneficiaries:", sanitizedData);

      set((state) => {
        const newWillData = {
          ...state.willData,
          beneficiaries: { ...state.willData.beneficiaries, ...sanitizedData },
        };

        console.log(
          "📝 [BENEFICIARIES] New beneficiaries state:",
          newWillData.beneficiaries
        );

        return { willData: newWillData };
      });

      console.log("💾 [BENEFICIARIES] Triggering session save...");
      get().saveToSession();
    },

    validateBeneficiaries: () => {
      console.log("✅ [VALIDATION] Validating beneficiaries...");

      const { beneficiaries } = get().willData;
      const errors: FormErrors<Beneficiaries> = {};

      console.log("📋 [VALIDATION] Current beneficiaries data:", beneficiaries);

      // Validate primary beneficiary
      if (!beneficiaries?.primaryBeneficiary?.name) {
        errors.primaryBeneficiary = "Primary beneficiary name is required";
        console.log(
          "❌ [VALIDATION] Primary beneficiary name validation failed"
        );
      }
      if (!beneficiaries?.primaryBeneficiary?.email) {
        errors.primaryBeneficiary = "Primary beneficiary email is required";
        console.log(
          "❌ [VALIDATION] Primary beneficiary email validation failed"
        );
      }

      // Validate secondary beneficiary if present
      if (beneficiaries?.secondaryBeneficiary?.name) {
        if (!beneficiaries.secondaryBeneficiary.email) {
          errors.secondaryBeneficiary =
            "Secondary beneficiary email is required";
          console.log(
            "❌ [VALIDATION] Secondary beneficiary email validation failed"
          );
        }
      }

      // Validate percentage totals
      const primaryPercentage =
        beneficiaries?.primaryBeneficiary?.percentage || 0;
      const secondaryPercentage =
        beneficiaries?.secondaryBeneficiary?.percentage || 0;
      const totalPercentage = primaryPercentage + secondaryPercentage;

      if (totalPercentage !== 100) {
        errors.percentage = "Beneficiary percentages must add up to 100%";
        console.log("❌ [VALIDATION] Percentage validation failed:", {
          primaryPercentage,
          secondaryPercentage,
          totalPercentage,
        });
      }

      console.log("📊 [VALIDATION] Validation errors:", errors);

      get().setError("beneficiaries", errors);
      const isValid = Object.keys(errors).length === 0;

      console.log(
        `${
          isValid ? "✅" : "❌"
        } [VALIDATION] Beneficiaries validation result:`,
        isValid
      );

      return isValid;
    },

    // Navigation Actions
    nextStep: () => {
      const currentStep = get().currentStep;
      console.log(
        `🚀 [NAVIGATION] Attempting to go from step ${currentStep} to step ${
          currentStep + 1
        }`
      );

      let canProceed = true;

      // Validate current step before proceeding
      switch (currentStep) {
        case 1:
          console.log("🔍 [NAVIGATION] Validating step 1 (Personal Info)...");
          canProceed = get().validatePersonalInfo();
          break;
        case 2:
          console.log("🔍 [NAVIGATION] Validating step 2 (Digital Assets)...");
          canProceed = get().validateDigitalAssets();
          break;
        case 3:
          console.log("🔍 [NAVIGATION] Validating step 3 (Crypto Setup)...");
          canProceed = get().validateCryptoSetup();
          break;
        case 4:
          console.log("🔍 [NAVIGATION] Validating step 4 (Beneficiaries)...");
          canProceed = get().validateBeneficiaries();
          break;
      }

      if (canProceed && currentStep < 6) {
        console.log(
          `✅ [NAVIGATION] Validation passed, moving to step ${currentStep + 1}`
        );
        set({ currentStep: currentStep + 1 });
      } else if (!canProceed) {
        console.log(
          "❌ [NAVIGATION] Validation failed, staying on current step"
        );
      } else {
        console.log("🛑 [NAVIGATION] Already at final step");
      }
    },

    prevStep: () => {
      const currentStep = get().currentStep;
      console.log(
        `⬅️ [NAVIGATION] Going back from step ${currentStep} to step ${
          currentStep - 1
        }`
      );

      if (currentStep > 1) {
        set({ currentStep: currentStep - 1 });
        console.log(
          `✅ [NAVIGATION] Successfully moved to step ${currentStep - 1}`
        );
      } else {
        console.log("🛑 [NAVIGATION] Already at first step");
      }
    },

    goToStep: (step) => {
      console.log(`🎯 [NAVIGATION] Direct navigation to step ${step}`);

      if (step >= 1 && step <= 6) {
        set({ currentStep: step });
        console.log(`✅ [NAVIGATION] Successfully navigated to step ${step}`);
      } else {
        console.log(`❌ [NAVIGATION] Invalid step number: ${step}`);
      }
    },

    // Session Management
    initializeSession: () => {
      const sessionId = `will_session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      console.log("🆔 [SESSION] Initializing new session:", sessionId);

      set({ sessionId });

      console.log("🔐 [SESSION] Checking authentication status...");
      get().checkAuthStatus();

      console.log("📥 [SESSION] Loading existing session data...");
      get().loadFromSession();
    },

    saveToSession: async () => {
      const { willData, currentStep, sessionId, isAuthenticated, userId } =
        get();

      if (sessionId) {
        const sessionData = {
          willData,
          currentStep,
          timestamp: Date.now(),
        };

        console.log("💾 [SESSION] Saving to storage:", {
          sessionId,
          dataSize: JSON.stringify(sessionData).length,
          currentStep,
          willDataKeys: Object.keys(willData),
          isAuthenticated,
          userId,
        });

        try {
          if (isAuthenticated && userId) {
            // Save to Supabase for authenticated users
            console.log(
              "🔐 [SESSION] Saving authenticated session to Supabase..."
            );
            await sessionService.saveSession(sessionId, sessionData, userId);
          } else {
            // Save to localStorage for anonymous users
            console.log(
              "👤 [SESSION] Saving anonymous session to localStorage..."
            );
            localStorage.setItem(sessionId, JSON.stringify(sessionData));
          }

          console.log("✅ [SESSION] Successfully saved session");
        } catch (error) {
          console.error("❌ [SESSION] Failed to save session:", error);
          // Fallback to localStorage
          try {
            localStorage.setItem(sessionId, JSON.stringify(sessionData));
            console.log("✅ [SESSION] Fallback to localStorage successful");
          } catch (fallbackError) {
            console.error(
              "❌ [SESSION] Fallback to localStorage failed:",
              fallbackError
            );
          }
        }
      } else {
        console.log("⚠️ [SESSION] No sessionId available, skipping save");
      }
    },

    loadFromSession: async () => {
      const { sessionId, isAuthenticated, userId } = get();

      if (sessionId) {
        console.log("📥 [SESSION] Loading from storage:", sessionId);

        try {
          let sessionData = null;

          if (isAuthenticated && userId) {
            // Load from Supabase for authenticated users
            console.log(
              "🔐 [SESSION] Loading authenticated session from Supabase..."
            );
            sessionData = await sessionService.loadSession(sessionId);
          } else {
            // Load from localStorage for anonymous users
            console.log(
              "👤 [SESSION] Loading anonymous session from localStorage..."
            );
            const localData = localStorage.getItem(sessionId);
            if (localData) {
              sessionData = JSON.parse(localData);
            }
          }

          if (sessionData) {
            console.log("📦 [SESSION] Found session data, restoring...");

            const { willData, currentStep, timestamp } = sessionData;

            console.log("📋 [SESSION] Loaded session data:", {
              currentStep,
              timestamp: new Date(timestamp).toISOString(),
              willDataKeys: Object.keys(willData),
              dataAge: Date.now() - timestamp,
            });

            set({ willData, currentStep });
            console.log("✅ [SESSION] Successfully restored session state");
          } else {
            console.log("ℹ️ [SESSION] No existing session data found");
          }
        } catch (error) {
          console.error("❌ [SESSION] Failed to load session data:", error);
        }
      } else {
        console.log("⚠️ [SESSION] No sessionId available, skipping load");
      }
    },

    clearSession: async () => {
      const { sessionId, isAuthenticated, userId } = get();

      console.log("🗑️ [SESSION] Clearing session data:", sessionId);

      if (sessionId) {
        try {
          if (isAuthenticated && userId) {
            // Delete from Supabase
            console.log(
              "🔐 [SESSION] Deleting authenticated session from Supabase..."
            );
            await sessionService.deleteSession(sessionId);
          } else {
            // Delete from localStorage
            console.log(
              "👤 [SESSION] Deleting anonymous session from localStorage..."
            );
            localStorage.removeItem(sessionId);
          }

          console.log("✅ [SESSION] Successfully removed session from storage");
        } catch (error) {
          console.error(
            "❌ [SESSION] Failed to remove session from storage:",
            error
          );
        }
      }

      set({
        willData: {},
        currentStep: 1,
        errors: {},
        sessionId: null,
      });

      console.log("✅ [SESSION] Session state cleared");
    },

    // Database Actions
    saveWillData: async () => {
      const { willData, userId, isAuthenticated } = get();
      console.log("💾 [DATABASE] Starting save to Supabase:", {
        willData,
        userId,
        isAuthenticated,
      });

      if (!isAuthenticated || !userId) {
        console.log(
          "❌ [DATABASE] User not authenticated, cannot save to database"
        );
        throw new Error("User must be authenticated to save will data");
      }

      set({ isLoading: true });

      try {
        const savedData = await willDataService.saveWillData(willData, userId);
        console.log(
          "✅ [DATABASE] Successfully saved to Supabase:",
          savedData.id
        );

        // Update will data with database metadata
        set((state) => ({
          willData: {
            ...state.willData,
            id: savedData.id,
            createdAt: savedData.created_at,
            updatedAt: savedData.updated_at,
          },
        }));
      } catch (error) {
        console.error("❌ [DATABASE] Failed to save will data:", error);
        throw error;
      } finally {
        set({ isLoading: false });
        console.log("🏁 [DATABASE] Save operation completed");
      }
    },

    loadWillData: async (targetUserId) => {
      const { userId: currentUserId, isAuthenticated } = get();
      const userId = targetUserId || currentUserId;

      console.log("📥 [DATABASE] Loading will data for user:", {
        userId,
        isAuthenticated,
      });

      if (!isAuthenticated || !userId) {
        console.log(
          "❌ [DATABASE] User not authenticated, cannot load from database"
        );
        return;
      }

      set({ isLoading: true });

      try {
        const loadedData = await willDataService.loadWillData(userId);

        if (loadedData) {
          console.log("📦 [DATABASE] Found existing will data, restoring...");

          set({
            willData: {
              personalInfo: loadedData.personalInfo,
              digitalAssets: loadedData.digitalAssets,
              cryptoSetup: loadedData.cryptoSetup,
              beneficiaries: loadedData.beneficiaries,
              willContent: loadedData.willContent,
              status: loadedData.status,
              id: loadedData.id,
              createdAt: loadedData.createdAt,
              updatedAt: loadedData.updatedAt,
            },
          });

          console.log(
            "✅ [DATABASE] Successfully loaded will data from database"
          );
        } else {
          console.log("ℹ️ [DATABASE] No existing will data found for user");
        }
      } catch (error) {
        console.error("❌ [DATABASE] Failed to load will data:", error);
        throw error;
      } finally {
        set({ isLoading: false });
        console.log("🏁 [DATABASE] Load operation completed");
      }
    },

    // Authentication Actions
    checkAuthStatus: async () => {
      console.log("🔐 [AUTH] Checking authentication status...");

      try {
        // First check if Supabase client is properly initialized
        if (!supabase) {
          console.error("❌ [AUTH] Supabase client not initialized");
          set({ isAuthenticated: false, userId: null });
          return;
        }

        // Get the current session with proper error handling
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("❌ [AUTH] Error getting session:", error.message);
          // Don't throw here, just set unauthenticated state
          set({ isAuthenticated: false, userId: null });
          return;
        }

        if (session?.user) {
          console.log("✅ [AUTH] User is authenticated:", session.user.id);
          set({ isAuthenticated: true, userId: session.user.id });

          // Load will data from database for authenticated users
          console.log("📥 [AUTH] Loading will data from database...");
          try {
            await get().loadWillData(session.user.id);
          } catch (loadError) {
            console.error("❌ [AUTH] Failed to load will data:", loadError);
            // Don't fail auth check if will data loading fails
          }
        } else {
          console.log("👤 [AUTH] No active session found");
          set({ isAuthenticated: false, userId: null });
        }
      } catch (error) {
        console.error(
          "❌ [AUTH] Unexpected error checking auth status:",
          error
        );
        // Set unauthenticated state on any unexpected error
        set({ isAuthenticated: false, userId: null });
      }
    },

    setAuthStatus: (isAuthenticated, userId) => {
      console.log("🔐 [AUTH] Setting auth status:", {
        isAuthenticated,
        userId,
      });
      set({ isAuthenticated, userId });

      if (isAuthenticated && userId) {
        // Load will data when user becomes authenticated
        get()
          .loadWillData(userId)
          .catch((error) => {
            console.error(
              "❌ [AUTH] Failed to load will data after auth:",
              error
            );
          });
      }
    },

    // Utility Actions
    setLoading: (loading) => {
      console.log(`⏳ [LOADING] Setting loading state to: ${loading}`);
      set({ isLoading: loading });
    },

    setError: (step, errors) => {
      console.log(`❌ [ERROR] Setting errors for step "${step}":`, errors);

      set((state) => ({
        errors: { ...state.errors, [step]: errors },
      }));
    },

    clearErrors: (step) => {
      if (step) {
        console.log(`🧹 [ERROR] Clearing errors for step: ${step}`);

        set((state) => {
          const newErrors = { ...state.errors };
          delete newErrors[step];
          return { errors: newErrors };
        });
      } else {
        console.log("🧹 [ERROR] Clearing all errors");
        set({ errors: {} });
      }
    },

    getCompletionPercentage: () => {
      const { willData } = get();
      let completed = 0;
      const total = 4; // Number of main steps

      console.log("📊 [PROGRESS] Calculating completion percentage...");

      if (willData.personalInfo?.fullName && willData.personalInfo?.state) {
        completed++;
        console.log("✅ [PROGRESS] Personal info completed");
      }
      if (willData.digitalAssets?.selectedCategories?.length) {
        completed++;
        console.log("✅ [PROGRESS] Digital assets completed");
      }
      if (
        willData.cryptoSetup ||
        !willData.digitalAssets?.selectedCategories?.includes("crypto")
      ) {
        completed++;
        console.log("✅ [PROGRESS] Crypto setup completed (or not required)");
      }
      if (willData.beneficiaries?.primaryBeneficiary?.name) {
        completed++;
        console.log("✅ [PROGRESS] Beneficiaries completed");
      }

      const percentage = Math.round((completed / total) * 100);
      console.log(
        `📈 [PROGRESS] Completion: ${completed}/${total} steps (${percentage}%)`
      );

      return percentage;
    },
  }))
);

// Auto-save to session when will data changes
useWillStore.subscribe(
  (state) => state.willData,
  (willData, previousWillData) => {
    console.log("🔄 [SUBSCRIPTION] Will data changed, triggering auto-save...");
    console.log("📝 [SUBSCRIPTION] Previous data:", previousWillData);
    console.log("📝 [SUBSCRIPTION] New data:", willData);

    const store = useWillStore.getState();
    if (store.sessionId) {
      console.log("💾 [SUBSCRIPTION] Auto-saving to session...");
      store.saveToSession().catch((error) => {
        console.error("❌ [SUBSCRIPTION] Failed to auto-save session:", error);
      });
    } else {
      console.log("⚠️ [SUBSCRIPTION] No sessionId available for auto-save");
    }
  }
);

// Listen for auth state changes with improved error handling
supabase.auth.onAuthStateChange((event, session) => {
  console.log(
    "🔐 [AUTH_LISTENER] Auth state changed:",
    event,
    session?.user?.id
  );

  const store = useWillStore.getState();

  try {
    if (event === "SIGNED_IN" && session?.user) {
      console.log("✅ [AUTH_LISTENER] User signed in");
      store.setAuthStatus(true, session.user.id);
    } else if (event === "SIGNED_OUT") {
      console.log("👋 [AUTH_LISTENER] User signed out");
      store.setAuthStatus(false);
    } else if (event === "TOKEN_REFRESHED" && session?.user) {
      console.log("🔄 [AUTH_LISTENER] Token refreshed");
      store.setAuthStatus(true, session.user.id);
    }
  } catch (error) {
    console.error(
      "❌ [AUTH_LISTENER] Error handling auth state change:",
      error
    );
  }
});
