import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiUser, FiMail, FiPhone, FiCreditCard, FiFlag, FiLock, FiCalendar, FiEye, FiEyeOff, FiPlus, FiMinus } from 'react-icons/fi';
import { FormData } from '@/type/useFormData';
import { UserType } from '@/utils/constants';
import CountryDropdown from './CountryDropdown';
import PasswordStrength from './PasswordStrength';
import FileUpload from './FileUpload';

interface Step1PersonalInfoProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
  clearError: (field: string) => void;
  countries: any[];
  stages: any[];
  subjects: any[];
  activeTab: UserType;
}

const Step1PersonalInfo: React.FC<Step1PersonalInfoProps> = ({
  formData,
  updateFormData,
  errors,
  clearError,
  countries,
  stages,
  subjects,
  activeTab
}) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCustomStage, setShowCustomStage] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    if (errors[name]) clearError(name);
  };

  const handleCountrySelect = (countryId: string) => {
    updateFormData({ 
      country_id: countryId,
      national_id: '',
      passport_number: ''
    });
  };

  const handlePhoneCountrySelect = (phoneCode: string) => {
    updateFormData({ phone_country_code: phoneCode });
  };

  const handleFileUpload = (file: File, fieldName: keyof FormData) => {
    updateFormData({ [fieldName]: file });
    if (errors[fieldName]) clearError(fieldName);
  };

  const handleFileRemove = (fieldName: keyof FormData) => {
    updateFormData({ [fieldName]: null });
  };

  const getSelectedCountry = () => 
    countries.find(country => country.id.toString() === formData.country_id);

  const isEgyptSelected = () => {
    const selectedCountry = getSelectedCountry();
    return selectedCountry?.name === 'مصر' || selectedCountry?.name === 'Egypt';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
      {/* الاسم */}
      <div className="md:col-span-2">
        <label className="block text-sm font-semibold mb-2 text-blue-600">
          {t('register.form.fullName')}
        </label>
        <div className="relative">
          <FiUser className="absolute right-3 top-3 text-blue-500" />
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange}
            required
            className={`w-full p-4 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.name ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-blue-400 focus:ring-blue-400'
            }`} 
            placeholder={t('register.form.fullNamePlaceholder')} 
          />
        </div>
        {errors.name && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.name}</p>}
      </div>

      {/* البريد الإلكتروني */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-blue-600">
          {t('register.form.email')}
        </label>
        <div className="relative">
          <FiMail className="absolute right-3 top-3 text-blue-500" />
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleInputChange}
            required
            className={`w-full p-4 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.email ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-blue-400 focus:ring-blue-400'
            }`} 
            placeholder={t('register.form.emailPlaceholder')} 
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.email}</p>}
      </div>

      {/* تاريخ الميلاد */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-blue-600">
          {t('register.form.dateOfBirth')}
        </label>
        <div className="relative">
          <FiCalendar className="absolute right-3 top-3 text-blue-500" />
          <input 
            type="date" 
            name="date_of_birth" 
            value={formData.date_of_birth} 
            onChange={handleInputChange}
            required
            className={`w-full p-4 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.date_of_birth ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-blue-400 focus:ring-blue-400'
            }`} 
          />
        </div>
        {errors.date_of_birth && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.date_of_birth}</p>}
      </div>

      {/* الهاتف */}
      <div className="md:col-span-2">
        <label className="block text-sm font-semibold mb-2 text-blue-600">
          {t('register.form.phone')}
        </label>
        <div className="flex gap-3">
          {/* SELECT عادي - أسرع حل */}
          <div className="flex-1">
            <select 
              value={formData.phone_country_code}
              onChange={(e) => {
                const selectedCode = e.target.value;
                console.log('📞 Phone code selected:', selectedCode);
                updateFormData({ phone_country_code: selectedCode });
              }}
              className="w-full text-black p-4 rounded-xl border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              {countries.map(country => (
                <option key={country.id} value={country.phone_code}>
                  +{country.phone_code} - {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* رقم الهاتف */}
          <div className="flex-[2]">
            <input 
              type="tel" 
              name="phone" 
              maxLength={13}
              value={formData.phone} 
              onChange={handleInputChange}
              required
              className={`w-full p-4 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.phone ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-blue-400 focus:ring-blue-400'
              }`} 
              placeholder="1234567890" 
            />
          </div>
        </div>
        
        {/* إذا في خطأ */}
        {errors.phone && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.phone}</p>}
        
        {/* إذا مفيش كود مختار */}
        {!formData.phone_country_code && (
          <p className="text-orange-500 text-sm mt-1">⚠️ يرجى اختيار رمز الدولة</p>
        )}
      </div>

      {/* البلد (للطلاب والمعلمين وأولياء الأمور) */}
      {(activeTab === 'student' || activeTab === 'teacher' || activeTab === 'parent') && (
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2 text-blue-600">
            {t('register.form.country')}
          </label>
          <CountryDropdown
            countries={countries}
            selectedValue={formData.country_id}
            onSelect={handleCountrySelect}
            type="country"
            error={errors.country_id}
          />
          {errors.country_id && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.country_id}</p>}
        </div>
      )}

      {/* المرحلة التعليمية للطالب */}
      {activeTab === 'student' && (
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2 text-blue-600">
            {t('register.form.educationalStage')} *
          </label>
          
       
          
          <div className="space-y-3">
            {/* Select للمراحل */}
            <select 
              name="stage_id" 
              value={formData.stage_id} 
              onChange={handleInputChange}
              className={`w-full p-4 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.stage_id ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-blue-400 focus:ring-blue-400'
              }`}
            >
              <option value="">{t('register.form.selectStage')}</option>
              {stages.map((stage) => (
                <option key={stage.id} value={stage.id.toString()}>
                  {stage.name}
                </option>
              ))}
            </select>
            
            {errors.stage_id && (
              <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.stage_id}</p>
            )}
            
            {/* إضافة مرحلة مخصصة */}
       
            
            {showCustomStage && (
              <div className="animate-fade-in-up">
                <input 
                  type="text" 
                  name="custom_stage" 
                  value={formData.custom_stage} 
                  onChange={handleInputChange}
                  placeholder={t('register.form.newStagePlaceholder')} 
                  className="w-full p-3 rounded-xl border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
                <p className="text-sm text-gray-500 mt-1">سيتم استخدام هذه المرحلة إذا لم تكن موجودة في القائمة</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* نوع المعلم (للمعلمين فقط) */}
      {activeTab === 'teacher' && (
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2 text-blue-600">
            {t('register.form.teacherType')}
          </label>
          <div className="grid grid-cols-2 gap-4">
            {['male', 'female'].map((type) => (
              <button 
                type="button" 
                key={type} 
                onClick={() => updateFormData({ teacher_type: type })}
                className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
                  formData.teacher_type === type
                    ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-lg shadow-blue-500/20'
                    : 'border-gray-300 bg-white text-gray-600 hover:border-blue-400'
                }`}
              >
                <FiUser className="text-xl" />
                <span className="font-medium">
                  {type === 'male' ? t('register.form.maleTeacher') : t('register.form.femaleTeacher')}
                </span>
              </button>
            ))}
          </div>
          {errors.teacher_type && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.teacher_type}</p>}
        </div>
      )}

      {/* الرقم القومي أو جواز السفر (للمعلمين فقط) */}
      {activeTab === 'teacher' && formData.country_id && (
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2 text-blue-600">
            {isEgyptSelected() ? t('register.form.nationalId') : t('register.form.passportNumber')}
          </label>
          <div className="relative">
            <FiCreditCard className="absolute right-3 top-3 text-blue-500" />
            <input 
              type="text" 
              name={isEgyptSelected() ? "national_id" : "passport_number"} 
              value={isEgyptSelected() ? formData.national_id : formData.passport_number} 
              onChange={handleInputChange} 
              required 
              maxLength={isEgyptSelected() ? 14 : undefined}
              className={`w-full p-4 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                (errors.national_id || errors.passport_number) ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-blue-400 focus:ring-blue-400'
              }`} 
              placeholder={isEgyptSelected() ? t('register.form.nationalIdPlaceholder') : t('register.form.passportPlaceholder')} 
            />
          </div>
          {isEgyptSelected() ? 
            (errors.national_id && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.national_id}</p>) :
            (errors.passport_number && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.passport_number}</p>)
          }
        </div>
      )}

      {/* QR Code (لأولياء الأمور فقط) */}
      {activeTab === 'parent' && (
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2 text-blue-600">
            {t('register.form.phone')}
          </label>
          <div className="relative">
            <FiFlag className="absolute right-3 top-3 text-blue-500" />
            <input 
              type="text" 
              name="phone" 
              value={formData.qr_code} 
              onChange={handleInputChange}
              required
              className={`w-full p-4 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                errors.qr_code ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-blue-400 focus:ring-blue-400'
              }`} 
              placeholder= {t('register.form.phone')} 
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">{t('register.form.qrCodeHelp')}</p>
          {errors.qr_code && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.qr_code}</p>}
        </div>
      )}

      {/* كلمة المرور */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-blue-600">
          {t('register.form.password')}
        </label>
        <div className="relative">
          <FiLock className="absolute right-3 top-3 text-blue-500" />
          <input 
            type={showPassword ? "text" : "password"} 
            name="password" 
            value={formData.password} 
            onChange={handleInputChange}
            required
            className={`w-full p-4 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.password ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-blue-400 focus:ring-blue-400'
            }`} 
            placeholder={t('register.form.passwordPlaceholder')} 
          />
          <button 
            type="button" 
            className="absolute left-3 top-3 text-gray-500 hover:text-gray-700 transition-colors duration-300" 
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        <PasswordStrength password={formData.password} />
        {errors.password && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.password}</p>}
      </div>

      {/* تأكيد كلمة المرور */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-blue-600">
          {t('register.form.confirmPassword')}
        </label>
        <div className="relative">
          <FiLock className="absolute right-3 top-3 text-blue-500" />
          <input 
            type={showConfirmPassword ? "text" : "password"} 
            name="password_confirmation" 
            value={formData.password_confirmation} 
            onChange={handleInputChange}
            required
            className={`w-full p-4 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
              errors.password_confirmation ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-blue-400 focus:ring-blue-400'
            }`} 
            placeholder={t('register.form.confirmPasswordPlaceholder')} 
          />
          <button 
            type="button" 
            className="absolute left-3 top-3 text-gray-500 hover:text-gray-700 transition-colors duration-300" 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {formData.password_confirmation && formData.password !== formData.password_confirmation && (
          <p className="text-red-500 text-sm mt-1 animate-pulse">{t('register.validation.passwordsMismatch')}</p>
        )}
        {errors.password_confirmation && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.password_confirmation}</p>}
      </div>
        
      {/* صورة الملف الشخصي */}
      <div className="md:col-span-2">
        <label className="block text-sm font-semibold mb-2 text-blue-600">
          {t('register.form.profileImage')}
        </label>
        <FileUpload
          onFileSelect={(file) => handleFileUpload(file, 'image')}
          onFileRemove={() => handleFileRemove('image')}
          preview={formData.image ? URL.createObjectURL(formData.image) : null}
          accept="image/*"
          error={errors.image}
          uploadText={t('register.form.uploadImage')}
          requirementsText={t('register.form.imageRequirements')}
        />
        {errors.image && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.image}</p>}
      </div>
    </div>
  );
};

export default Step1PersonalInfo;