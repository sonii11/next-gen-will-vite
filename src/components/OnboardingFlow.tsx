import React from 'react';
import { Screen } from '../App';
import { PersonalInfo } from './steps/PersonalInfo';
import { DigitalAssets } from './steps/DigitalAssets';
import { CryptoSetup } from './steps/CryptoSetup';
import { Beneficiaries } from './steps/Beneficiaries';
import { WillPreview } from './steps/WillPreview';
import { PaymentFlow } from './steps/PaymentFlow';

interface OnboardingFlowProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

export function OnboardingFlow({ currentScreen, onScreenChange }: OnboardingFlowProps) {
  const getStepInfo = (screen: Screen) => {
    const steps = {
      onboarding: { number: 1, total: 6, title: 'Personal Information', time: '2 minutes' },
      assets: { number: 2, total: 6, title: 'Digital Assets Discovery', time: '4 minutes' },
      crypto: { number: 3, total: 6, title: 'Crypto Inheritance Setup', time: '3 minutes' },
      beneficiaries: { number: 4, total: 6, title: 'Beneficiaries & Executors', time: '3 minutes' },
      preview: { number: 5, total: 6, title: 'Review Your Will', time: '2 minutes' },
      payment: { number: 6, total: 6, title: 'Secure Your Digital Will', time: '1 minute' }
    };
    return steps[screen] || steps.onboarding;
  };

  const stepInfo = getStepInfo(currentScreen);
  const progress = (stepInfo.number / stepInfo.total) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Progress Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{stepInfo.title}</h2>
          <p className="text-gray-600 mb-4">
            Step {stepInfo.number} of {stepInfo.total} • About {stepInfo.time} remaining
          </p>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2 max-w-2xl mx-auto">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">{Math.round(progress)}% Complete</p>
        </div>

        {/* Step Content */}
        {currentScreen === 'onboarding' && <PersonalInfo onNext={() => onScreenChange('assets')} />}
        {currentScreen === 'assets' && <DigitalAssets onNext={() => onScreenChange('crypto')} />}
        {currentScreen === 'crypto' && <CryptoSetup onNext={() => onScreenChange('beneficiaries')} />}
        {currentScreen === 'beneficiaries' && <Beneficiaries onNext={() => onScreenChange('preview')} />}
        {currentScreen === 'preview' && <WillPreview onNext={() => onScreenChange('payment')} />}
        {currentScreen === 'payment' && <PaymentFlow />}
      </div>
    </div>
  );
}