import React from 'react';
import { FiCheck } from 'react-icons/fi';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center mb-8 animate-fade-in">
      <div className="flex space-x-4">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
          <div key={step} className="flex items-center animate-scale-in" style={{ animationDelay: `${index * 150}ms` }}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
              currentStep >= step 
                ? 'bg-blue-500 text-white scale-110 shadow-lg shadow-blue-500/30 border-blue-400'
                : 'bg-white text-gray-500 border-gray-300 shadow-md'
            }`}>
              {currentStep > step ? (
                <FiCheck className="text-white animate-check-mark" />
              ) : (
                <span className="font-semibold">{step}</span>
              )}
            </div>
            {step < totalSteps && (
              <div className={`w-8 h-1 mx-2 transition-all duration-500 ${
                currentStep > step 
                  ? 'bg-blue-400'
                  : 'bg-gray-300'
              }`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;