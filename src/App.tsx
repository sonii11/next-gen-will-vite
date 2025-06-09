import React, { useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { OnboardingFlow } from './components/OnboardingFlow';
import { Navigation } from './components/Navigation';
import { useWillStore } from './store/willStore';

export type Screen = 'landing' | 'onboarding' | 'assets' | 'crypto' | 'beneficiaries' | 'preview' | 'payment';

function App() {
  const [currentScreen, setCurrentScreen] = React.useState<Screen>('landing');
  const { initializeSession, currentStep } = useWillStore();

  useEffect(() => {
    console.log('🚀 [APP] App component mounted, initializing session...');
    // Initialize session when app loads
    initializeSession();
  }, [initializeSession]);

  // Map will store steps to screens
  const stepToScreen: Record<number, Screen> = {
    1: 'onboarding',
    2: 'assets', 
    3: 'crypto',
    4: 'beneficiaries',
    5: 'preview',
    6: 'payment'
  };

  // Sync current screen with will store step when in onboarding flow
  useEffect(() => {
    console.log(`🔄 [APP] Step/Screen sync - Current step: ${currentStep}, Current screen: ${currentScreen}`);
    
    if (currentScreen !== 'landing' && stepToScreen[currentStep]) {
      const targetScreen = stepToScreen[currentStep];
      console.log(`🎯 [APP] Syncing to screen: ${targetScreen}`);
      setCurrentScreen(targetScreen);
    }
  }, [currentStep, currentScreen]);

  const handleScreenChange = (screen: Screen) => {
    console.log(`🔄 [APP] Screen change requested: ${currentScreen} → ${screen}`);
    
    setCurrentScreen(screen);
    
    // If navigating to a specific step, update the store
    const screenToStep: Record<Screen, number> = {
      'landing': 1,
      'onboarding': 1,
      'assets': 2,
      'crypto': 3,
      'beneficiaries': 4,
      'preview': 5,
      'payment': 6
    };
    
    if (screen !== 'landing' && screenToStep[screen]) {
      const targetStep = screenToStep[screen];
      console.log(`🎯 [APP] Updating store to step: ${targetStep}`);
      useWillStore.getState().goToStep(targetStep);
    }
  };

  // Log current app state
  console.log('📊 [APP] Current app state:', {
    currentScreen,
    currentStep,
    stepToScreen: stepToScreen[currentStep],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentScreen={currentScreen} onScreenChange={handleScreenChange} />
      
      <div className="pt-16">
        {currentScreen === 'landing' && (
          <LandingPage onGetStarted={() => {
            console.log('🚀 [APP] Get Started clicked, navigating to onboarding');
            handleScreenChange('onboarding');
          }} />
        )}
        
        {currentScreen !== 'landing' && (
          <OnboardingFlow 
            currentScreen={currentScreen} 
            onScreenChange={handleScreenChange} 
          />
        )}
      </div>
    </div>
  );
}

export default App;