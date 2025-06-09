import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  completionPercentage?: number;
  className?: string;
}

export function ProgressBar({ 
  currentStep, 
  totalSteps, 
  completionPercentage,
  className = '' 
}: ProgressBarProps) {
  const progressPercentage = completionPercentage || (currentStep / totalSteps) * 100;
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(progressPercentage)}% Complete</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}