import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiMinus, FiBook, FiAward } from 'react-icons/fi';
import { FormData } from '@/type/useFormData';
import { UserType } from '@/utils/constants';
import FileUpload from './FileUpload';

interface Step2AcademicInfoProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
  clearError: (field: string) => void;
  stages: any[];
  subjects: any[];
  activeTab: UserType;
}

const Step2AcademicInfo: React.FC<Step2AcademicInfoProps> = ({
  formData,
  updateFormData,
  errors,
  clearError,
  stages,
  subjects,
  activeTab
}) => {
  const { t } = useTranslation();
  const [showCustomStage, setShowCustomStage] = useState(false);
  const [showCustomSubject, setShowCustomSubject] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    if (errors[name]) clearError(name);
  };

  const handleMultiSelectChange = (name: 'stage_id' | 'subject_id', value: string) => {
    const currentArray = formData[name] as string[];
    const newArray = currentArray.includes(value) 
      ? currentArray.filter(item => item !== value) 
      : [...currentArray, value];
    
    updateFormData({ [name]: newArray });
    if (errors[name]) clearError(name);
  };

  const handleFileUpload = (file: File, fieldName: keyof FormData) => {
    updateFormData({ [fieldName]: file });
    if (errors[fieldName]) clearError(fieldName);
  };

  const handleFileRemove = (fieldName: keyof FormData) => {
    updateFormData({ [fieldName]: null });
  };

  // للطلاب: مرحلة دراسية واحدة
  if (activeTab === 'student') {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="text-center mb-6">
          <FiBook className="text-4xl mx-auto mb-3 text-blue-500" />
          <h3 className="text-xl font-bold text-blue-600">{t('register.titles.academicInfo')}</h3>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-600">
            {t('register.form.educationalStage')} *
          </label>
          <div className="space-y-3">
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
                <option key={stage.id} value={stage.id}>{stage.name}</option>
              ))}
            </select>
            
            <button 
              type="button" 
              onClick={() => setShowCustomStage(!showCustomStage)} 
              className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors duration-300"
            >
              {showCustomStage ? <FiMinus /> : <FiPlus />}
              {t('register.form.addNewStage')}
            </button>
            
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
              </div>
            )}
          </div>
          {errors.stage_id && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.stage_id}</p>}
        </div>
      </div>
    );
  }

  // للمعلمين: مراحل ومواد متعددة + وثائق
  if (activeTab === 'teacher') {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="text-center mb-6">
          <FiAward className="text-4xl mx-auto mb-3 text-blue-500" />
          <h3 className="text-xl font-bold text-blue-600">{t('register.titles.professionalInfo')}</h3>
        </div>

        {/* المراحل التعليمية */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-600">
            {t('register.form.educationalStages')} *
          </label>
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {stages.map((stage) => (
                <label 
                  key={stage.id} 
                  className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-gray-300 hover:border-blue-400 transition-all duration-300 bg-white hover:bg-blue-50"
                >
                  <input 
                    type="checkbox" 
                    checked={formData.stage_id.includes(stage.id.toString())} 
                    onChange={() => handleMultiSelectChange('stage_id', stage.id.toString())}
                    className="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500" 
                  />
                  <span className="font-medium text-gray-700">{stage.name}</span>
                </label>
              ))}
            </div>
            
            <button 
              type="button" 
              onClick={() => setShowCustomStage(!showCustomStage)} 
              className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors duration-300"
            >
              {showCustomStage ? <FiMinus /> : <FiPlus />}
              {t('register.form.addNewStage')}
            </button>
            
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
              </div>
            )}
          </div>
          {errors.stage_id && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.stage_id}</p>}
        </div>

        {/* المواد الدراسية */}
        <div>
          <label className="block text-sm font-semibold mb-2 text-blue-600">
            {t('register.form.subjects')} *
          </label>
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {subjects.map((subject) => (
                <label 
                  key={subject.id} 
                  className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-gray-300 hover:border-blue-400 transition-all duration-300 bg-white hover:bg-blue-50"
                >
                  <input 
                    type="checkbox" 
                    checked={formData.subject_id.includes(subject.id.toString())} 
                    onChange={() => handleMultiSelectChange('subject_id', subject.id.toString())}
                    className="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500" 
                  />
                  <span className="font-medium text-gray-700">{subject.name}</span>
                </label>
              ))}
            </div>
            
            <button 
              type="button" 
              onClick={() => setShowCustomSubject(!showCustomSubject)} 
              className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors duration-300"
            >
              {showCustomSubject ? <FiMinus /> : <FiPlus />}
              {t('register.form.addNewSubject')}
            </button>
            
            {showCustomSubject && (
              <div className="animate-fade-in-up">
                <input 
                  type="text" 
                  name="custom_subject" 
                  value={formData.custom_subject} 
                  onChange={handleInputChange}
                  placeholder={t('register.form.newSubjectPlaceholder')} 
                  className="w-full p-3 rounded-xl border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                />
              </div>
            )}
          </div>
          {errors.subject_id && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.subject_id}</p>}
        </div>

        {/* الوثائق الرسمية */}
        <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200">
          <h4 className="text-lg font-semibold text-blue-700 mb-4">{t('register.titles.officialDocuments')}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2 text-blue-600">
                {t('register.form.idCardFront')} *
              </label>
              <FileUpload
                onFileSelect={(file) => handleFileUpload(file, 'id_card_front')}
                onFileRemove={() => handleFileRemove('id_card_front')}
                preview={formData.id_card_front ? URL.createObjectURL(formData.id_card_front) : null}
                accept="image/*"
                error={errors.id_card_front}
                uploadText={t('register.form.uploadFront')}
              />
              {errors.id_card_front && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.id_card_front}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-blue-600">
                {t('register.form.idCardBack')} *
              </label>
              <FileUpload
                onFileSelect={(file) => handleFileUpload(file, 'id_card_back')}
                onFileRemove={() => handleFileRemove('id_card_back')}
                preview={formData.id_card_back ? URL.createObjectURL(formData.id_card_back) : null}
                accept="image/*"
                error={errors.id_card_back}
                uploadText={t('register.form.uploadBack')}
              />
              {errors.id_card_back && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.id_card_back}</p>}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold mb-2 text-blue-600">
              {t('register.form.certificateImage')} *
            </label>
            <FileUpload
              onFileSelect={(file) => handleFileUpload(file, 'certificate_image')}
              onFileRemove={() => handleFileRemove('certificate_image')}
              preview={formData.certificate_image ? URL.createObjectURL(formData.certificate_image) : null}
              accept="image/*"
              error={errors.certificate_image}
              uploadText={t('register.form.uploadCertificate')}
            />
            {errors.certificate_image && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.certificate_image}</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-8 animate-fade-in-up">
      <div className="p-8 rounded-2xl border-2 bg-blue-50 border-blue-400 shadow-lg shadow-blue-500/10">
        <FiBook className="text-4xl mx-auto mb-4 text-blue-500" />
        <h3 className="text-2xl font-bold mb-3 text-blue-600">
          {t('register.messages.readyToContinue')}
        </h3>
        <p className="text-blue-500">{t('register.messages.clickToNext')}</p>
      </div>
    </div>
  );
};

export default Step2AcademicInfo;