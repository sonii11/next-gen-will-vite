import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  className?: string;
}

export function InfoTooltip({ content, className = '' }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        className="inline-flex items-center justify-center w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => {
          e.preventDefault();
          setIsVisible(!isVisible);
        }}
      >
        <Info className="w-4 h-4" />
      </button>
      
      {isVisible && (
        <div className="absolute z-10 w-64 p-3 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-2 left-6 transform -translate-y-full">
          <div className="relative">
            {content}
            {/* Arrow pointing to the info icon */}
            <div className="absolute top-full left-0 transform -translate-x-3">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}