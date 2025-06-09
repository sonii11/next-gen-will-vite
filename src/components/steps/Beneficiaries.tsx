import React, { useState } from 'react';
import { Heart, UserCog, ShieldAlert, ArrowRight, Lightbulb, Plus, Minus } from 'lucide-react';
import { InfoTooltip } from '../ui/InfoTooltip';
import { useWillStore } from '../../store/willStore';
import { AIAssistant } from '../ui/AIAssistant';

interface BeneficiariesProps {
  onNext: () => void;
}

export function Beneficiaries({ onNext }: BeneficiariesProps) {
  const { willData, updateBeneficiaries } = useWillStore();
  
  const [primaryBeneficiary, setPrimaryBeneficiary] = useState({
    name: willData.beneficiaries?.primaryBeneficiary?.name || '',
    relationship: willData.beneficiaries?.primaryBeneficiary?.relationship || '',
    email: willData.beneficiaries?.primaryBeneficiary?.email || '',
    phone: willData.beneficiaries?.primaryBeneficiary?.phone || '',
    percentage: willData.beneficiaries?.primaryBeneficiary?.percentage || 100
  });

  const [hasSecondaryBeneficiary, setHasSecondaryBeneficiary] = useState(
    !!(willData.beneficiaries?.secondaryBeneficiary?.name)
  );

  const [secondaryBeneficiary, setSecondaryBeneficiary] = useState({
    name: willData.beneficiaries?.secondaryBeneficiary?.name || '',
    relationship: willData.beneficiaries?.secondaryBeneficiary?.relationship || '',
    email: willData.beneficiaries?.secondaryBeneficiary?.email || '',
    phone: willData.beneficiaries?.secondaryBeneficiary?.phone || '',
    percentage: willData.beneficiaries?.secondaryBeneficiary?.percentage || 0
  });

  const [executorType, setExecutorType] = useState<'same' | 'different'>(
    willData.beneficiaries?.digitalExecutor?.type || 'same'
  );
  
  const [digitalExecutor, setDigitalExecutor] = useState({
    name: willData.beneficiaries?.digitalExecutor?.name || '',
    techExperience: willData.beneficiaries?.digitalExecutor?.techExperience || '',
    email: willData.beneficiaries?.digitalExecutor?.email || '',
    phone: willData.beneficiaries?.digitalExecutor?.phone || ''
  });

  const [emergencySettings, setEmergencySettings] = useState({
    waitingPeriod: willData.beneficiaries?.emergencySettings?.waitingPeriod || '30',
    verificationMethods: willData.beneficiaries?.emergencySettings?.verificationMethods || []
  });

  // Calculate remaining percentage for secondary beneficiary
  const remainingPercentage = 100 - primaryBeneficiary.percentage;

  const updateStore = () => {
    const beneficiariesData = {
      primaryBeneficiary,
      ...(hasSecondaryBeneficiary && { secondaryBeneficiary }),
      digitalExecutor: { type: executorType, ...digitalExecutor },
      emergencySettings
    };

    console.log('🔄 [BENEFICIARIES] Updating store with:', beneficiariesData);
    updateBeneficiaries(beneficiariesData);
  };

  const handlePrimaryBeneficiaryChange = (field: string, value: any) => {
    console.log(`🔄 [BENEFICIARIES] Primary beneficiary ${field} changed to:`, value);
    
    const newData = { ...primaryBeneficiary, [field]: value };
    
    // If percentage changes and we have a secondary beneficiary, auto-adjust
    if (field === 'percentage' && hasSecondaryBeneficiary) {
      const newSecondaryPercentage = 100 - value;
      setSecondaryBeneficiary(prev => ({ ...prev, percentage: newSecondaryPercentage }));
    }
    
    setPrimaryBeneficiary(newData);
    setTimeout(updateStore, 0);
  };

  const handleSecondaryBeneficiaryChange = (field: string, value: any) => {
    console.log(`🔄 [BENEFICIARIES] Secondary beneficiary ${field} changed to:`, value);
    
    const newData = { ...secondaryBeneficiary, [field]: value };
    
    // If percentage changes, auto-adjust primary
    if (field === 'percentage') {
      const newPrimaryPercentage = 100 - value;
      setPrimaryBeneficiary(prev => ({ ...prev, percentage: newPrimaryPercentage }));
    }
    
    setSecondaryBeneficiary(newData);
    setTimeout(updateStore, 0);
  };

  const handleAddSecondaryBeneficiary = () => {
    console.log('➕ [BENEFICIARIES] Adding secondary beneficiary');
    setHasSecondaryBeneficiary(true);
    
    // Split percentages 50/50 by default
    setPrimaryBeneficiary(prev => ({ ...prev, percentage: 50 }));
    setSecondaryBeneficiary(prev => ({ ...prev, percentage: 50 }));
    
    setTimeout(updateStore, 0);
  };

  const handleRemoveSecondaryBeneficiary = () => {
    console.log('➖ [BENEFICIARIES] Removing secondary beneficiary');
    setHasSecondaryBeneficiary(false);
    
    // Give all percentage back to primary
    setPrimaryBeneficiary(prev => ({ ...prev, percentage: 100 }));
    setSecondaryBeneficiary({
      name: '',
      relationship: '',
      email: '',
      phone: '',
      percentage: 0
    });
    
    setTimeout(updateStore, 0);
  };

  const handleExecutorTypeChange = (type: 'same' | 'different') => {
    console.log(`🔄 [BENEFICIARIES] Executor type changed to:`, type);
    setExecutorType(type);
    setTimeout(updateStore, 0);
  };

  const handleDigitalExecutorChange = (field: string, value: string) => {
    console.log(`🔄 [BENEFICIARIES] Digital executor ${field} changed to:`, value);
    const newData = { ...digitalExecutor, [field]: value };
    setDigitalExecutor(newData);
    setTimeout(updateStore, 0);
  };

  const handleEmergencySettingsChange = (field: string, value: any) => {
    console.log(`🔄 [BENEFICIARIES] Emergency settings ${field} changed to:`, value);
    const newData = { ...emergencySettings, [field]: value };
    setEmergencySettings(newData);
    setTimeout(updateStore, 0);
  };

  const handleVerificationChange = (method: string, checked: boolean) => {
    console.log(`🔄 [BENEFICIARIES] Verification method ${method} changed to:`, checked);
    
    const newMethods = checked
      ? [...emergencySettings.verificationMethods, method]
      : emergencySettings.verificationMethods.filter(m => m !== method);
    
    handleEmergencySettingsChange('verificationMethods', newMethods);
  };

  const handleAISuggestion = (suggestion: string) => {
    console.log('💡 [BENEFICIARIES] AI suggestion clicked:', suggestion);
    // Handle AI suggestions for beneficiaries setup
  };

  const handleContinue = () => {
    console.log('🚀 [BENEFICIARIES] Continue button clicked');
    
    const primaryValid = primaryBeneficiary.name && primaryBeneficiary.email;
    const secondaryValid = !hasSecondaryBeneficiary || (secondaryBeneficiary.name && secondaryBeneficiary.email);
    const percentageValid = primaryBeneficiary.percentage + (hasSecondaryBeneficiary ? secondaryBeneficiary.percentage : 0) === 100;
    
    if (primaryValid && secondaryValid && percentageValid) {
      console.log('✅ [BENEFICIARIES] All validations passed, proceeding to next step');
      onNext();
    } else {
      console.log('❌ [BENEFICIARIES] Validation failed:', { primaryValid, secondaryValid, percentageValid });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Primary Beneficiary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              Primary Beneficiary
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter full name"
                  value={primaryBeneficiary.name}
                  onChange={(e) => handlePrimaryBeneficiaryChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                <select 
                  value={primaryBeneficiary.relationship}
                  onChange={(e) => handlePrimaryBeneficiaryChange('relationship', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select relationship</option>
                  <option value="spouse">Spouse</option>
                  <option value="partner">Partner</option>
                  <option value="child">Child</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="friend">Friend</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  placeholder="their.email@example.com"
                  value={primaryBeneficiary.email}
                  onChange={(e) => handlePrimaryBeneficiaryChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input 
                  type="tel" 
                  placeholder="(555) 123-4567"
                  value={primaryBeneficiary.phone}
                  onChange={(e) => handlePrimaryBeneficiaryChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                Percentage of Digital Assets
                <InfoTooltip 
                  content="This determines what percentage of your digital assets this beneficiary will receive. If you have multiple beneficiaries, their percentages must add up to 100%. You can adjust the distribution by moving the sliders."
                />
              </label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max={hasSecondaryBeneficiary ? "100" : "100"} 
                  value={primaryBeneficiary.percentage}
                  onChange={(e) => handlePrimaryBeneficiaryChange('percentage', parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-lg font-semibold text-blue-600 min-w-[60px]">
                  {primaryBeneficiary.percentage}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Drag the slider to adjust the percentage of digital assets this beneficiary will receive
              </p>
            </div>
          </div>

          {/* Secondary Beneficiary Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Heart className="w-6 h-6 text-purple-500" />
                Secondary Beneficiary
                <span className="text-sm font-normal text-gray-500">(Optional)</span>
              </h3>
              
              {!hasSecondaryBeneficiary ? (
                <button
                  onClick={handleAddSecondaryBeneficiary}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Secondary Beneficiary
                </button>
              ) : (
                <button
                  onClick={handleRemoveSecondaryBeneficiary}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>

            {!hasSecondaryBeneficiary ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-2">You can add a secondary beneficiary to split your digital assets</p>
                <p className="text-sm">This is common in estate planning for backup inheritance</p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter full name"
                      value={secondaryBeneficiary.name}
                      onChange={(e) => handleSecondaryBeneficiaryChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                    <select 
                      value={secondaryBeneficiary.relationship}
                      onChange={(e) => handleSecondaryBeneficiaryChange('relationship', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Select relationship</option>
                      <option value="spouse">Spouse</option>
                      <option value="partner">Partner</option>
                      <option value="child">Child</option>
                      <option value="parent">Parent</option>
                      <option value="sibling">Sibling</option>
                      <option value="friend">Friend</option>
                      <option value="charity">Charity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      placeholder="their.email@example.com"
                      value={secondaryBeneficiary.email}
                      onChange={(e) => handleSecondaryBeneficiaryChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      type="tel" 
                      placeholder="(555) 123-4567"
                      value={secondaryBeneficiary.phone}
                      onChange={(e) => handleSecondaryBeneficiaryChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Percentage of Digital Assets</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={secondaryBeneficiary.percentage}
                      onChange={(e) => handleSecondaryBeneficiaryChange('percentage', parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-lg font-semibold text-purple-600 min-w-[60px]">
                      {secondaryBeneficiary.percentage}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Remaining percentage automatically adjusts primary beneficiary to {100 - secondaryBeneficiary.percentage}%
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Percentage Summary */}
          {hasSecondaryBeneficiary && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Asset Distribution Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">{primaryBeneficiary.name || 'Primary Beneficiary'}:</span>
                  <span className="font-semibold text-blue-800">{primaryBeneficiary.percentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">{secondaryBeneficiary.name || 'Secondary Beneficiary'}:</span>
                  <span className="font-semibold text-blue-800">{secondaryBeneficiary.percentage}%</span>
                </div>
                <div className="border-t border-blue-300 pt-2 flex justify-between font-semibold">
                  <span className="text-blue-800">Total:</span>
                  <span className={`${primaryBeneficiary.percentage + secondaryBeneficiary.percentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    {primaryBeneficiary.percentage + secondaryBeneficiary.percentage}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Digital Executor */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UserCog className="w-6 h-6 text-blue-500" />
              Digital Executor
              <span className="text-sm font-normal text-gray-500">(Person who handles your digital assets)</span>
            </h3>
            
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Your digital executor should be tech-savvy and trustworthy. They'll handle accessing your crypto wallets, 
                social media accounts, and cloud storage according to your wishes.
              </p>
            </div>
            
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="executor" 
                  value="same"
                  checked={executorType === 'same'}
                  onChange={(e) => handleExecutorTypeChange(e.target.value as 'same' | 'different')}
                  className="w-4 h-4 text-blue-600"
                />
                <span>Same as primary beneficiary</span>
              </label>
              
              <label className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="executor" 
                  value="different"
                  checked={executorType === 'different'}
                  onChange={(e) => handleExecutorTypeChange(e.target.value as 'same' | 'different')}
                  className="w-4 h-4 text-blue-600"
                />
                <span>Different person (recommended for tech expertise)</span>
              </label>
            </div>

            {executorType === 'different' && (
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Digital Executor Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter full name"
                    value={digitalExecutor.name}
                    onChange={(e) => handleDigitalExecutorChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Their Tech Experience</label>
                  <select 
                    value={digitalExecutor.techExperience}
                    onChange={(e) => handleDigitalExecutorChange('techExperience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select experience level</option>
                    <option value="very-tech-savvy">Very tech-savvy (developer, IT pro)</option>
                    <option value="moderately-tech-savvy">Moderately tech-savvy</option>
                    <option value="basic-tech-skills">Basic tech skills</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="their.email@example.com"
                    value={digitalExecutor.email}
                    onChange={(e) => handleDigitalExecutorChange('email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    placeholder="(555) 123-4567"
                    value={digitalExecutor.phone}
                    onChange={(e) => handleDigitalExecutorChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Emergency Access Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-yellow-500" />
              Emergency Access Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Waiting Period Before Access</label>
                <select 
                  value={emergencySettings.waitingPeriod}
                  onChange={(e) => handleEmergencySettingsChange('waitingPeriod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7">7 days (fast access)</option>
                  <option value="30">30 days (recommended)</option>
                  <option value="60">60 days (more secure)</option>
                  <option value="90">90 days (maximum security)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Your beneficiaries will be notified, and you can cancel if you're still alive
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification Methods</label>
                <div className="space-y-2">
                  {[
                    { id: 'death-certificate', label: 'Require death certificate' },
                    { id: 'two-people', label: 'Require 2 people to confirm' },
                    { id: 'multiple-contacts', label: 'Send notification to multiple contacts' }
                  ].map((method) => (
                    <label key={method.id} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-blue-600 rounded"
                        checked={emergencySettings.verificationMethods.includes(method.id)}
                        onChange={(e) => handleVerificationChange(method.id, e.target.checked)}
                      />
                      <span className="text-sm">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={handleContinue}
              disabled={
                !primaryBeneficiary.name || 
                !primaryBeneficiary.email || 
                (hasSecondaryBeneficiary && (!secondaryBeneficiary.name || !secondaryBeneficiary.email)) ||
                (primaryBeneficiary.percentage + (hasSecondaryBeneficiary ? secondaryBeneficiary.percentage : 0)) !== 100
              }
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all inline-flex items-center gap-2"
            >
              Review Your Will <ArrowRight className="w-4 h-4" />
            </button>
            
            {(primaryBeneficiary.percentage + (hasSecondaryBeneficiary ? secondaryBeneficiary.percentage : 0)) !== 100 && (
              <p className="text-sm text-red-600 mt-2">
                Beneficiary percentages must add up to 100%
              </p>
            )}
          </div>
        </div>

        {/* AI Assistant Sidebar */}
        <div className="lg:col-span-1">
          <AIAssistant 
            currentStep={4}
            onSuggestionClick={handleAISuggestion}
            className="sticky top-4"
          />
        </div>
      </div>
    </div>
  );
}