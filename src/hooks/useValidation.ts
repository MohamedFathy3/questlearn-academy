import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormData } from '@/type/useFormData';
import { UserType } from '@/utils/constants';
import { validatePassword, validateEmail, validatePhone } from '@/utils/validators';

export const useValidation = () => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number, formData: FormData, activeTab: UserType, countries: any[]): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // التحقق من الحقول الأساسية
      if (!formData.name.trim()) newErrors.name = t('register.validation.nameRequired');
      if (!formData.email.trim()) newErrors.email = t('register.validation.emailRequired');
      else if (!validateEmail(formData.email)) newErrors.email = t('register.validation.invalidEmail');
      
      if (!formData.phone.trim()) newErrors.phone = t('register.validation.phoneRequired');
      else if (!validatePhone(formData.phone)) newErrors.phone = t('register.validation.phoneInvalid');

      if (!formData.date_of_birth) {
        newErrors.date_of_birth = t('register.validation.dateOfBirthRequired');
      }

      // التحقق من كلمة المرور
      const passwordValidation = validatePassword(formData.password);
      if (!formData.password) newErrors.password = t('register.validation.passwordRequired');
      else if (!passwordValidation.isValid) newErrors.password = t('register.validation.weakPassword');

      if (!formData.password_confirmation) newErrors.password_confirmation = t('register.validation.confirmPasswordRequired');
      else if (formData.password !== formData.password_confirmation) newErrors.password_confirmation = t('register.validation.passwordsMismatch');

      // التحقق من الحقول الخاصة بكل نوع مستخدم
      if ((activeTab === 'teacher' || activeTab === 'student' || activeTab === 'parent') && !formData.country_id) {
        newErrors.country_id = t('register.validation.countryRequired');
      }

      if (activeTab === 'student' && !formData.stage_id && !formData.custom_stage) {
        newErrors.stage_id = t('register.validation.stageRequired');
      }

      if (activeTab === 'teacher') {
        if (!formData.teacher_type) newErrors.teacher_type = t('register.validation.teacherTypeRequired');
        
        if (formData.country_id) {
          const selectedCountry = countries.find(country => country.id.toString() === formData.country_id);
          const isEgypt = selectedCountry?.name === 'مصر' || selectedCountry?.name === 'Egypt';
          
          if (isEgypt) {
            if (!formData.national_id.trim()) newErrors.national_id = t('register.validation.nationalIdRequired');
            else if (!/^[0-9]{14}$/.test(formData.national_id)) newErrors.national_id = t('register.validation.nationalIdInvalid');
          } else {
            if (!formData.passport_number.trim()) newErrors.passport_number = t('register.validation.passportRequired');
          }
        }
      }

      if (activeTab === 'parent' && !formData.qr_code.trim()) newErrors.qr_code = t('register.validation.qrCodeRequired');
    }

    if (step === 2 && activeTab === 'teacher') {
      if (!formData.stage_id.length && !formData.custom_stage) newErrors.stage_id = t('register.validation.stagesRequired');
      if (!formData.subject_id.length && !formData.custom_subject) newErrors.subject_id = t('register.validation.subjectsRequired');
      if (!formData.certificate_image) newErrors.certificate_image = t('register.validation.certificateRequired');
      if (!formData.id_card_front) newErrors.id_card_front = t('register.validation.idFrontRequired');
      if (!formData.id_card_back) newErrors.id_card_back = t('register.validation.idBackRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return { errors, validateStep, clearError, setErrors };
};