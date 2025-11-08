import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
 import {useEffect} from 'react'
import { useFormData } from '@/type/useFormData';
import { useApiData } from '@/hooks/useApiData';
import { useValidation } from '@/hooks/useValidation';
import { UserType, STEP_TITLES, API_ENDPOINTS } from '@/utils/constants';

import RegisterTabs from './RegisterTabs';
import StepIndicator from './StepIndicator';
import Step1PersonalInfo from './Step1PersonalInfo';
import Step2AcademicInfo from './Step2AcademicInfo';
import Step3ReviewData from './Step3ReviewData';

const UnifiedRegisterPage: React.FC = () => {
   const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<UserType>('student');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { formData, updateFormData, resetFormData } = useFormData(activeTab);
  const { countries, stages, subjects, loading } = useApiData();
  const { errors, validateStep, clearError } = useValidation();

  useEffect(() => {
    console.log('🔄 [FORM] Form data updated:', {
      phone_country_code: formData.phone_country_code,
      country_id: formData.country_id,
      stage_id: formData.stage_id
    });
  }, [formData.phone_country_code, formData.country_id, formData.stage_id]);

  
  const getTotalSteps = () => {
    if (activeTab === 'teacher') return 3;
    if (activeTab === 'student') return 2;
    return 2;
  };
console.log('🎯 [DEBUG] Initial loading - Active Tab:', activeTab);
console.log('🎯 [DEBUG] Countries count:', countries.length);
console.log('🎯 [DEBUG] Stages count:', stages.length); 
console.log('🎯 [DEBUG] Subjects count:', subjects.length);

  const getStepTitle = () => STEP_TITLES[activeTab][currentStep - 1];

  const handleTabChange = (tab: UserType) => {
    setActiveTab(tab);
    setCurrentStep(1);
    resetFormData();
  };

  const nextStep = () => {
    if (validateStep(currentStep, formData, activeTab, countries)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep, formData, activeTab, countries)) return;
    
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        const value = (formData as any)[key];
        if (value !== null && value !== undefined && value !== '') {
          if (value instanceof File) {
            payload.append(key, value);
          } else if (Array.isArray(value)) {
            value.forEach(item => payload.append(`${key}[]`, item));
          } else {
            payload.append(key, value.toString());
          }
        }
      });

      payload.append('user_type', activeTab);

      const apiEndpoint = API_ENDPOINTS[activeTab];
      const res = await fetch(apiEndpoint, { method: 'POST', body: payload });
      const data = await res.json();

      if (data.success || data.status === 200) {
        toast.success(t('register.messages.registrationSuccess'));
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(data.message || t('register.messages.registrationError'));
      }
    } catch (err) {
      toast.error(t('register.messages.generalError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    resetFormData();
    setCurrentStep(1);
  };

  const renderStepContent = () => {
    const commonProps = {
      formData,
      updateFormData,
      errors,
      clearError,
      countries,
      stages,
      subjects,
      activeTab
    };

    switch (currentStep) {
      case 1:
        return <Step1PersonalInfo {...commonProps} />;
      case 2:
        return <Step2AcademicInfo {...commonProps} />;
      case 3:
        return <Step3ReviewData formData={formData} activeTab={activeTab} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 bg-gradient-to-br from-white via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* تأثيرات الخلفية المتحركة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float bg-blue-200"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float animation-delay-2000 bg-indigo-200"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000 bg-purple-200"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl p-8 mx-4 rounded-3xl bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl shadow-blue-500/10 transition-all duration-500 transform hover:scale-[1.01]">
        
        <div className="text-center mb-8 animate-slide-down">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
            {t('register.title')}
          </h1>
          <p className="mt-3 text-lg text-gray-600 animate-slide-down animation-delay-200">
            {t('register.subtitle')}
          </p>
        </div>

        <RegisterTabs activeTab={activeTab} onTabChange={handleTabChange} />
        
        <StepIndicator 
          currentStep={currentStep} 
          totalSteps={getTotalSteps()} 
        />

        <div className="text-center mb-6 animate-slide-down">
          <h2 className="text-2xl font-bold text-gray-800">{t(getStepTitle())}</h2>
        </div>
<button 
  type="button"
  onClick={() => {
    console.log('🧪 [TEST] Current form data:', formData);
    console.log('🧪 [TEST] Active tab:', activeTab);
    console.log('🧪 [TEST] Validation errors:', errors);
    console.log('🧪 [TEST] Can proceed to next step?', validateStep(currentStep, formData, activeTab, countries));
  }}
  className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm"
>
  Test Data (Dev Only)
</button>
        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          {/* أزرار التنقل */}
          <div className="flex flex-col md:flex-row justify-between pt-6 gap-4 animate-slide-up">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="px-6 py-3 rounded-lg transition-all duration-500 flex items-center gap-2 transform hover:scale-105 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-lg hover:shadow-xl">
                  ← {t('register.buttons.previous')}
                </button>
              )}
              <button type="button" onClick={resetForm} className="px-6 py-3 rounded-lg transition-all duration-500 transform hover:scale-105 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 shadow-lg hover:shadow-xl">
                {t('register.buttons.reset')}
              </button>
            </div>
            
            {currentStep < getTotalSteps() ? (
              <button type="button" onClick={nextStep} className="px-8 py-3 rounded-lg transition-all duration-500 flex items-center gap-2 transform hover:scale-105 bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/30 border border-blue-400 animate-pulse-slow">
                {t('register.buttons.next')} →
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting} className={`px-8 py-3 rounded-lg transition-all duration-500 flex items-center gap-2 transform hover:scale-105 bg-green-500 text-white hover:bg-green-400 shadow-lg shadow-green-500/30 border border-green-400 disabled:opacity-50 ${
                isSubmitting ? 'animate-pulse' : ''
              }`}>
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('register.buttons.registering')}
                  </>
                ) : (
                  <>
                    ✓ {t('register.buttons.register')}
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-gray-300 animate-fade-in">
          <p className="text-gray-600">
            {t('register.messages.alreadyHaveAccount')}{' '}
            <a href="/login" className="font-semibold text-blue-500 hover:text-blue-400 transition-all duration-300 hover:underline">
              {t('register.buttons.login')}
            </a>
          </p>
        </div>
      </div>

      
    </div>
  );
};

export default UnifiedRegisterPage;