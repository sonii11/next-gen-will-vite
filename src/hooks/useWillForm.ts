import { useCallback } from 'react';
import { useWillStore } from '../store/willStore';
import { PersonalInfo, DigitalAssets, CryptoSetup, Beneficiaries } from '../types/will';

export const useWillForm = () => {
  const {
    willData,
    currentStep,
    isLoading,
    errors,
    updatePersonalInfo,
    updateDigitalAssets,
    updateCryptoSetup,
    updateBeneficiaries,
    validatePersonalInfo,
    validateDigitalAssets,
    validateCryptoSetup,
    validateBeneficiaries,
    nextStep,
    prevStep,
    goToStep,
    getCompletionPercentage,
    clearErrors,
  } = useWillStore();

  // Form handlers for each step
  const handlePersonalInfoSubmit = useCallback((data: Partial<PersonalInfo>) => {
    console.log('📝 [FORM_HOOK] Personal info submit triggered:', data);
    
    updatePersonalInfo(data);
    
    console.log('✅ [FORM_HOOK] Validating personal info before proceeding...');
    if (validatePersonalInfo()) {
      console.log('🚀 [FORM_HOOK] Validation passed, moving to next step');
      nextStep();
    } else {
      console.log('❌ [FORM_HOOK] Validation failed, staying on current step');
    }
  }, [updatePersonalInfo, validatePersonalInfo, nextStep]);

  const handleDigitalAssetsSubmit = useCallback((data: Partial<DigitalAssets>) => {
    console.log('📝 [FORM_HOOK] Digital assets submit triggered:', data);
    
    updateDigitalAssets(data);
    
    console.log('✅ [FORM_HOOK] Validating digital assets before proceeding...');
    if (validateDigitalAssets()) {
      console.log('🚀 [FORM_HOOK] Validation passed, moving to next step');
      nextStep();
    } else {
      console.log('❌ [FORM_HOOK] Validation failed, staying on current step');
    }
  }, [updateDigitalAssets, validateDigitalAssets, nextStep]);

  const handleCryptoSetupSubmit = useCallback((data: Partial<CryptoSetup>) => {
    console.log('📝 [FORM_HOOK] Crypto setup submit triggered:', data);
    
    updateCryptoSetup(data);
    
    console.log('✅ [FORM_HOOK] Validating crypto setup before proceeding...');
    if (validateCryptoSetup()) {
      console.log('🚀 [FORM_HOOK] Validation passed, moving to next step');
      nextStep();
    } else {
      console.log('❌ [FORM_HOOK] Validation failed, staying on current step');
    }
  }, [updateCryptoSetup, validateCryptoSetup, nextStep]);

  const handleBeneficiariesSubmit = useCallback((data: Partial<Beneficiaries>) => {
    console.log('📝 [FORM_HOOK] Beneficiaries submit triggered:', data);
    
    updateBeneficiaries(data);
    
    console.log('✅ [FORM_HOOK] Validating beneficiaries before proceeding...');
    if (validateBeneficiaries()) {
      console.log('🚀 [FORM_HOOK] Validation passed, moving to next step');
      nextStep();
    } else {
      console.log('❌ [FORM_HOOK] Validation failed, staying on current step');
    }
  }, [updateBeneficiaries, validateBeneficiaries, nextStep]);

  // Field update handlers
  const updateField = useCallback((step: string, field: string, value: any) => {
    console.log(`🔄 [FORM_HOOK] Field update - Step: ${step}, Field: ${field}, Value:`, value);
    
    clearErrors(step);
    
    switch (step) {
      case 'personalInfo':
        console.log('📝 [FORM_HOOK] Updating personal info field');
        updatePersonalInfo({ [field]: value });
        break;
      case 'digitalAssets':
        console.log('📝 [FORM_HOOK] Updating digital assets field');
        updateDigitalAssets({ [field]: value });
        break;
      case 'cryptoSetup':
        console.log('📝 [FORM_HOOK] Updating crypto setup field');
        updateCryptoSetup({ [field]: value });
        break;
      case 'beneficiaries':
        console.log('📝 [FORM_HOOK] Updating beneficiaries field');
        updateBeneficiaries({ [field]: value });
        break;
      default:
        console.log(`⚠️ [FORM_HOOK] Unknown step: ${step}`);
    }
  }, [updatePersonalInfo, updateDigitalAssets, updateCryptoSetup, updateBeneficiaries, clearErrors]);

  // Validation helpers
  const getFieldError = useCallback((step: string, field: string) => {
    const error = errors[step]?.[field];
    if (error) {
      console.log(`❌ [FORM_HOOK] Field error - Step: ${step}, Field: ${field}, Error: ${error}`);
    }
    return error;
  }, [errors]);

  const isStepValid = useCallback((step: number) => {
    console.log(`🔍 [FORM_HOOK] Checking if step ${step} is valid...`);
    
    let valid = false;
    
    switch (step) {
      case 1:
        valid = !!(willData.personalInfo?.fullName && willData.personalInfo?.state);
        console.log(`📋 [FORM_HOOK] Step 1 validity: ${valid} (name: ${!!willData.personalInfo?.fullName}, state: ${!!willData.personalInfo?.state})`);
        break;
      case 2:
        valid = !!(willData.digitalAssets?.selectedCategories?.length > 0);
        console.log(`📋 [FORM_HOOK] Step 2 validity: ${valid} (categories: ${willData.digitalAssets?.selectedCategories?.length || 0})`);
        break;
      case 3:
        valid = true; // Crypto setup is optional
        console.log(`📋 [FORM_HOOK] Step 3 validity: ${valid} (optional step)`);
        break;
      case 4:
        valid = !!(willData.beneficiaries?.primaryBeneficiary?.name && 
                  willData.beneficiaries?.primaryBeneficiary?.email);
        console.log(`📋 [FORM_HOOK] Step 4 validity: ${valid} (name: ${!!willData.beneficiaries?.primaryBeneficiary?.name}, email: ${!!willData.beneficiaries?.primaryBeneficiary?.email})`);
        break;
      default:
        console.log(`⚠️ [FORM_HOOK] Unknown step for validation: ${step}`);
        valid = false;
    }
    
    return valid;
  }, [willData]);

  const canProceedToStep = useCallback((targetStep: number) => {
    console.log(`🎯 [FORM_HOOK] Checking if can proceed to step ${targetStep}...`);
    
    for (let step = 1; step < targetStep; step++) {
      if (!isStepValid(step)) {
        console.log(`❌ [FORM_HOOK] Cannot proceed to step ${targetStep} - step ${step} is invalid`);
        return false;
      }
    }
    
    console.log(`✅ [FORM_HOOK] Can proceed to step ${targetStep}`);
    return true;
  }, [isStepValid]);

  // Log current state for debugging
  console.log('🔍 [FORM_HOOK] Current hook state:', {
    currentStep,
    isLoading,
    hasErrors: Object.keys(errors).length > 0,
    completionPercentage: getCompletionPercentage(),
    willDataKeys: Object.keys(willData),
  });

  return {
    // State
    willData,
    currentStep,
    isLoading,
    errors,
    
    // Form handlers
    handlePersonalInfoSubmit,
    handleDigitalAssetsSubmit,
    handleCryptoSetupSubmit,
    handleBeneficiariesSubmit,
    
    // Field handlers
    updateField,
    getFieldError,
    
    // Navigation
    nextStep,
    prevStep,
    goToStep,
    canProceedToStep,
    isStepValid,
    
    // Utility
    getCompletionPercentage,
    clearErrors,
  };
};