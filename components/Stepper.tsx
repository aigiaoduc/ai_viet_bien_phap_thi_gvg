
import React from 'react';
import { Step } from '../types';

interface StepperProps {
  currentStep: Step;
  onStepClick?: (step: Step) => void; // Optional prop for admin navigation
}

const steps = [
  { id: Step.Intro, name: 'Thông tin' },
  { id: Step.Reason, name: 'Lý do' },
  { id: Step.Content, name: 'Nội dung' },
  { id: Step.Implementation, name: 'Thực hiện' },
  { id: Step.Results, name: 'Kết quả' },
  { id: Step.Conclusion, name: 'Kết luận' },
  { id: Step.Review, name: 'Hoàn thành' },
];

const Stepper: React.FC<StepperProps> = ({ currentStep, onStepClick }) => {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  const handleStepClick = (stepId: Step) => {
    if (onStepClick) {
      onStepClick(stepId);
    }
  };

  return (
    <div className="w-full px-2 sm:px-4">
      {/* Mobile View: Simple Progress Bar & Text */}
      <div className="md:hidden mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-bold text-indigo-600">Bước {currentStep}/{steps.length}</span>
          <span className="text-lg font-bold text-gray-800">{steps[currentStep - 1].name}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        {/* Admin Dropdown for Mobile */}
        {onStepClick && (
          <select 
            value={currentStep} 
            onChange={(e) => handleStepClick(Number(e.target.value) as Step)}
            className="mt-3 block w-full pl-3 pr-10 py-2 text-base border-yellow-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-yellow-50 text-yellow-800 font-bold shadow-sm"
          >
            {steps.map((step) => (
              <option key={step.id} value={step.id}>Admin Mode: Đi tới {step.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Desktop View: Full Stepper */}
      <div className="hidden md:block relative">
        <div className="overflow-hidden rounded-full bg-gray-200 h-2 absolute top-5 w-full -z-0">
           <div 
            className="bg-indigo-600 h-full transition-all duration-500 ease-out" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between relative z-10 w-full">
          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isClickable = !!onStepClick;

            return (
              <div 
                key={step.id} 
                className={`flex flex-col items-center group ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => isClickable && handleStepClick(step.id)}
                title={isClickable ? "Click để chuyển bước (Admin Mode)" : ""}
              >
                <div 
                  className={`
                    w-10 h-10 flex items-center justify-center rounded-full border-4 text-sm font-bold transition-all duration-300
                    ${isCompleted ? 'bg-indigo-600 border-indigo-600 text-white scale-100' : ''}
                    ${isCurrent ? 'bg-white border-indigo-600 text-indigo-600 scale-125 shadow-lg' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-white border-gray-300 text-gray-400' : ''}
                    ${isClickable && !isCurrent && !isCompleted ? 'group-hover:border-indigo-300 group-hover:text-indigo-300' : ''}
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span 
                  className={`
                    mt-3 text-sm font-semibold tracking-wide transition-colors duration-300 absolute top-10 w-32 text-center
                    ${isCurrent ? 'text-indigo-700' : 'text-gray-500'}
                    ${!isCurrent && !isCompleted ? 'opacity-70' : 'opacity-100'}
                    ${isClickable ? 'group-hover:text-indigo-500' : ''}
                  `}
                  style={{ transform: 'translateX(0%)' }} 
                >
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
        {/* Spacer to accommodate absolute positioned labels */}
        <div className="h-8"></div>
        
        {onStepClick && (
            <div className="absolute -top-8 right-0 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-yellow-200 animate-pulse">
                Admin Mode: ON
            </div>
        )}
      </div>
    </div>
  );
};

export default Stepper;
