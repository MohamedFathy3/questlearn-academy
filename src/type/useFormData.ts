import { useState } from 'react';
import { UserType } from '@/utils/constants';

export interface FormData {
  name: string;
  email: string;
  phone: string;
  national_id: string;
  passport_number: string;
  password: string;
  password_confirmation: string;
  country_id: string;
  stage_id: string | string[];
    subject_id: string[];
  qr_code: string;
  teacher_type: string;
  phone_country_code: string;
  custom_stage: string;
  custom_subject: string;
  date_of_birth: string;
  image: File | null;
  certificate_image: File | null;
  experience_image: File | null;
  id_card_front: File | null;
  id_card_back: File | null;
  
}



 

  export const useFormData = (initialUserType: UserType) => {
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', national_id: '', passport_number: '',
    password: '', password_confirmation: '', country_id: '', stage_id: '',
    subject_id: [], qr_code: '', teacher_type: '', phone_country_code: '', // ⬅️ فاضية
    custom_stage: '', custom_subject: '', date_of_birth: '',
    image: null, certificate_image: null, experience_image: null,
    id_card_front: null, id_card_back: null
  });
 const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };
  const resetFormData = () => {
    setFormData({
      name: '', email: '', phone: '', national_id: '', passport_number: '',
      password: '', password_confirmation: '', country_id: '', stage_id: '',
      subject_id: [], qr_code: '', teacher_type: '', phone_country_code: '', // ⬅️ فاضية
      custom_stage: '', custom_subject: '', date_of_birth: '',
      image: null, certificate_image: null, experience_image: null,
      id_card_front: null, id_card_back: null
    });
  };

  return { formData, updateFormData, resetFormData };
};