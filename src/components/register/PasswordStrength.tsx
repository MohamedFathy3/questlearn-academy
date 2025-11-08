import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { validatePassword } from '@/utils/validators';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const { t } = useTranslation();
  
  if (!password) return null;

  const validation = validatePassword(password);

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg animate-fade-in">
      <div className="space-y-2">
        <div className={`flex items-center gap-2 ${validation.requirements.minLength ? 'text-green-600' : 'text-red-600'}`}>
          <FiCheck className={validation.requirements.minLength ? 'text-green-500' : 'text-red-500'} />
          <span className="text-sm">{t('register.passwordRequirements.minLength')}</span>
        </div>
        <div className={`flex items-center gap-2 ${validation.requirements.hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
          <FiCheck className={validation.requirements.hasUpperCase ? 'text-green-500' : 'text-red-500'} />
          <span className="text-sm">{t('register.passwordRequirements.uppercase')}</span>
        </div>
        <div className={`flex items-center gap-2 ${validation.requirements.hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
          <FiCheck className={validation.requirements.hasLowerCase ? 'text-green-500' : 'text-red-500'} />
          <span className="text-sm">{t('register.passwordRequirements.lowercase')}</span>
        </div>
        <div className={`flex items-center gap-2 ${validation.requirements.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
          <FiCheck className={validation.requirements.hasNumber ? 'text-green-500' : 'text-red-500'} />
          <span className="text-sm">{t('register.passwordRequirements.number')}</span>
        </div>
        <div className={`flex items-center gap-2 ${validation.requirements.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
          <FiCheck className={validation.requirements.hasSpecialChar ? 'text-green-500' : 'text-red-500'} />
          <span className="text-sm">{t('register.passwordRequirements.specialChar')}</span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrength;