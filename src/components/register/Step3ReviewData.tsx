import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiUser, FiMail, FiPhone, FiCreditCard, FiFlag, FiBook, FiCheck } from 'react-icons/fi';
import { FormData } from '@/type/useFormData';
import { UserType } from '@/utils/constants';

interface Step3ReviewDataProps {
  formData: FormData;
  activeTab: UserType;
  countries?: any[];
  stages?: any[];
  subjects?: any[];
}

const Step3ReviewData: React.FC<Step3ReviewDataProps> = ({ 
  formData, 
  activeTab, 
  countries = [], 
  stages = [], 
  subjects = [] 
}) => {
  const { t } = useTranslation();

  const getCountryName = (countryId: string) => {
    const country = countries.find(c => c.id.toString() === countryId);
    return country?.name || countryId;
  };

const getStageNames = (stageIds: string | string[]) => {
  // تحويل لـ array لو كان string
  const idsArray = Array.isArray(stageIds) ? stageIds : [stageIds];
  
  if (formData.custom_stage) return [formData.custom_stage];
  
  return idsArray
    .filter(id => id && id !== '') // إزالة القيم الفاضية
    .map(id => {
      const stage = stages.find(s => s.id.toString() === id);
      return stage?.name || id;
    });
};

const getSubjectNames = (subjectIds: string[]) => {
  if (formData.custom_subject) return [formData.custom_subject];
  return subjectIds
    .filter(id => id && id !== '') // إزالة القيم الفاضية
    .map(id => {
      const subject = subjects.find(s => s.id.toString() === id);
      return subject?.name || id;
    });
};

  const InfoRow: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ 
    icon: Icon, 
    label, 
    value 
  }) => (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <Icon className="text-blue-500 text-xl flex-shrink-0" />
      <div className="flex-1">
        <div className="text-sm font-semibold text-gray-600">{label}</div>
        <div className="text-lg font-medium text-gray-800 mt-1">{value || '-'}</div>
      </div>
    </div>
  );

  const FilePreview: React.FC<{ file: File | null; label: string }> = ({ file, label }) => (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="text-sm font-semibold text-gray-600 mb-2">{label}</div>
      {file ? (
        <div className="flex items-center gap-3">
          <img 
            src={URL.createObjectURL(file)} 
            alt={label}
            className="w-16 h-16 object-cover rounded-lg border border-gray-300"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-800">{file.name}</div>
            <div className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
          </div>
          <FiCheck className="text-green-500 text-xl" />
        </div>
      ) : (
        <div className="text-gray-400 italic">{t('register.form.noFileUploaded')}</div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-50 text-green-700 rounded-2xl border border-green-200">
          <FiCheck className="text-xl" />
          <span className="font-semibold">{t('register.messages.reviewData')}</span>
        </div>
      </div>

      {/* المعلومات الأساسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoRow icon={FiUser} label={t('register.form.fullName')} value={formData.name} />
        <InfoRow icon={FiMail} label={t('register.form.email')} value={formData.email} />
        <InfoRow icon={FiPhone} label={t('register.form.phone')} value={`${formData.phone_country_code} ${formData.phone}`} />
        <InfoRow icon={FiUser} label={t('register.form.dateOfBirth')} value={formData.date_of_birth} />
      </div>

      {/* معلومات إضافية حسب نوع المستخدم */}
      {(activeTab === 'student' || activeTab === 'teacher' || activeTab === 'parent') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow icon={FiFlag} label={t('register.form.country')} value={getCountryName(formData.country_id)} />
        </div>
      )}

      {/* معلومات المعلم */}
      {activeTab === 'teacher' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow 
              icon={FiUser} 
              label={t('register.form.teacherType')} 
              value={formData.teacher_type === 'male' ? t('register.form.maleTeacher') : t('register.form.femaleTeacher')} 
            />
            {formData.national_id && (
              <InfoRow icon={FiCreditCard} label={t('register.form.nationalId')} value={formData.national_id} />
            )}
            {formData.passport_number && (
              <InfoRow icon={FiCreditCard} label={t('register.form.passportNumber')} value={formData.passport_number} />
            )}
          </div>

          {/* المراحل والمواد */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <FiBook className="text-blue-500 text-xl" />
                <div className="text-sm font-semibold text-gray-600">{t('register.form.educationalStages')}</div>
              </div>
              <div className="space-y-2">
                {getStageNames(formData.stage_id).map((stage, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <FiCheck className="text-green-500 text-sm" />
                    <span>{stage}</span>
                  </div>
                ))}
                {getStageNames(formData.stage_id).length === 0 && (
                  <div className="text-gray-400 italic">{t('register.form.noStagesSelected')}</div>
                )}
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <FiBook className="text-blue-500 text-xl" />
                <div className="text-sm font-semibold text-gray-600">{t('register.form.subjects')}</div>
              </div>
              <div className="space-y-2">
                {getSubjectNames(formData.subject_id).map((subject, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <FiCheck className="text-green-500 text-sm" />
                    <span>{subject}</span>
                  </div>
                ))}
                {getSubjectNames(formData.subject_id).length === 0 && (
                  <div className="text-gray-400 italic">{t('register.form.noSubjectsSelected')}</div>
                )}
              </div>
            </div>
          </div>

          {/* الملفات */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FilePreview file={formData.id_card_front} label={t('register.form.idCardFront')} />
            <FilePreview file={formData.id_card_back} label={t('register.form.idCardBack')} />
            <FilePreview file={formData.certificate_image} label={t('register.form.certificateImage')} />
            <FilePreview file={formData.experience_image} label={t('register.form.experienceImage')} />
          </div>
        </>
      )}

      {/* معلومات الطالب */}
      {activeTab === 'student' && (
     <div className="grid grid-cols-1 gap-4">
  <InfoRow 
    icon={FiBook} 
    label={t('register.form.educationalStage')} 
    value={formData.custom_stage || getStageNames(formData.stage_id)[0] || t('register.form.noStagesSelected')} 
  />
</div>
      )}

      {/* معلومات ولي الأمر */}
      {activeTab === 'parent' && (
        <div className="grid grid-cols-1 gap-4">
          <InfoRow icon={FiFlag} label={t('register.form.qrCode')} value={formData.qr_code} />
        </div>
      )}

      {/* صورة الملف الشخصي */}
      <div className="grid grid-cols-1 gap-4">
        <FilePreview file={formData.image} label={t('register.form.profileImage')} />
      </div>

      {/* رسالة التأكيد */}
      <div className="text-center py-6">
        <div className="p-6 rounded-2xl border-2 bg-green-50 border-green-400 shadow-lg shadow-green-500/10">
          <FiCheck className="text-4xl mx-auto mb-4 text-green-500 animate-check-mark" />
          <h3 className="text-2xl font-bold mb-3 text-green-600">{t('register.messages.readyToRegister')}</h3>
          <p className="text-green-500">{t('register.messages.clickToComplete')}</p>
        </div>
      </div>
    </div>
  );
};

export default Step3ReviewData;