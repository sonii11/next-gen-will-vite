import React from 'react';
import { Screen } from '../App';

interface NavigationProps {
  currentScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

export function Navigation({ currentScreen, onScreenChange }: NavigationProps) {
  const navItems: { id: Screen; label: string }[] = [
    { id: 'landing', label: 'Home' },
    { id: 'onboarding', label: 'Start' },
    { id: 'assets', label: 'Assets' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'beneficiaries', label: 'Beneficiaries' },
    { id: 'preview', label: 'Review' },
    { id: 'payment', label: 'Payment' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => onScreenChange('landing')}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            NextGenWill
          </button>
          
          <div className="hidden md:flex gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onScreenChange(item.id)}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  currentScreen === item.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}