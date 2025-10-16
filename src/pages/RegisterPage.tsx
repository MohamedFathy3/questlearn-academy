import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiUser, FiPhone, FiCreditCard, FiBook, FiFlag, FiCheck, FiX, FiUpload, FiEye, FiEyeOff, FiArrowRight, FiUserCheck, FiUsers, FiSearch, FiChevronDown, FiPlus, FiMinus } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';

interface Country {
  id: number;
  name: string;
  code: string;
  image: string;
}

interface Stage {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

type UserType = 'student' | 'teacher' | 'parent';

const UnifiedRegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<UserType>('student');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', national_id: '', passport_number: '',
    password: '', password_confirmation: '', country_id: '', qr_code: '',
    stage_id: [] as string[], subject_id: [] as string[], teacher_type: '',
    phone_country_code: '+20', custom_stage: '', custom_subject: '',
    image: null as File | null, certificate_image: null as File | null,
    experience_image: null as File | null, id_card_front: null as File | null,
    id_card_back: null as File | null
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [errors, setErrors] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  const [experiencePreview, setExperiencePreview] = useState<string | null>(null);
  const [idCardFrontPreview, setIdCardFrontPreview] = useState<string | null>(null);
  const [idCardBackPreview, setIdCardBackPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCustomStage, setShowCustomStage] = useState(false);
  const [showCustomSubject, setShowCustomSubject] = useState(false);

  const navigate = useNavigate();
  const API_URL = '/api';
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // جلب البيانات
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countriesRes, stagesRes, subjectsRes] = await Promise.all([
          fetch(`${API_URL}/country/index`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filters: {}, perPage: 100, paginate: true }) }),
          fetch(`${API_URL}/stage/index`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filters: {}, perPage: 100, paginate: true }) }),
          fetch(`${API_URL}/subject/index`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filters: {}, perPage: 100, paginate: true }) })
        ]);

        const [countriesData, stagesData, subjectsData] = await Promise.all([countriesRes.json(), stagesRes.json(), subjectsRes.json()]);
        
        if (countriesData.status === 200) setCountries(countriesData.data);
        if (stagesData.status === 200) setStages(stagesData.data);
        if (subjectsData.status === 200) setSubjects(subjectsData.data);
        toast.success(t('register.messages.successOnLoad'));
      } catch (error) {
        toast.error(t('register.messages.errorLoading'));
      }
    };
    fetchData();
  }, [t]);

  // إغلاق dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // التحقق من كلمة المرور
  const validatePassword = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    return {
      isValid: Object.values(requirements).every(Boolean),
      requirements
    };
  };

  const validateStep = (step: number): boolean => {
    const newErrors: any = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = t('register.validation.nameRequired');
      if (!formData.email.trim()) newErrors.email = t('register.validation.emailRequired');
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t('register.validation.invalidEmail');
      if (!formData.phone.trim()) newErrors.phone = t('register.validation.phoneRequired');

      const passwordValidation = validatePassword(formData.password);
      if (!formData.password) newErrors.password = t('register.validation.passwordRequired');
      else if (!passwordValidation.isValid) newErrors.password = t('register.validation.weakPassword');

      if (!formData.password_confirmation) newErrors.password_confirmation = t('register.validation.confirmPasswordRequired');
      else if (formData.password !== formData.password_confirmation) newErrors.password_confirmation = t('register.validation.passwordsMismatch');

      // ✅ التحقق من البلد للطالب والمعلم
      if ((activeTab === 'teacher' || activeTab === 'student') && !formData.country_id) {
        newErrors.country_id = t('register.validation.countryRequired');
      }

      // ✅ التحقق من المرحلة للطالب
      if (activeTab === 'student' && !formData.stage_id.length && !formData.custom_stage) {
        newErrors.stage_id = t('register.validation.stageRequired');
      }

      if (activeTab === 'teacher') {
        if (!formData.teacher_type) newErrors.teacher_type = t('register.validation.teacherTypeRequired');
        
        if (formData.country_id) {
          const selectedCountry = getSelectedCountry();
          if (selectedCountry?.name === 'مصر' || selectedCountry?.name === 'Egypt') {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev: any) => ({ ...prev, [name]: undefined }));
  };

  const handleMultiSelectChange = (name: 'stage_id' | 'subject_id', value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name].includes(value) ? prev[name].filter(item => item !== value) : [...prev[name], value]
    }));
  };

  const handleCountrySelect = (country: Country) => {
    setFormData(prev => ({ 
      ...prev, 
      country_id: country.id.toString(),
      national_id: '',
      passport_number: ''
    }));
    setIsCountryDropdownOpen(false);
    setCountrySearch('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        setErrors((prev: any) => ({ ...prev, [name]: t('register.messages.fileTypeError') }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev: any) => ({ ...prev, [name]: t('register.messages.fileSizeError') }));
        return;
      }
      
      setFormData(prev => ({ ...prev, [name]: file }));
      
      const reader = new FileReader();
      reader.onload = () => {
        const previews: any = {
          image: setImagePreview,
          certificate_image: setCertificatePreview,
          experience_image: setExperiencePreview,
          id_card_front: setIdCardFrontPreview,
          id_card_back: setIdCardBackPreview,
        };
        previews[name]?.(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (type: string) => {
    setFormData(prev => ({ ...prev, [type]: null }));
    const previews: any = {
      image: setImagePreview,
      certificate_image: setCertificatePreview,
      experience_image: setExperiencePreview,
      id_card_front: setIdCardFrontPreview,
      id_card_back: setIdCardBackPreview,
    };
    previews[type](null);
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
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
    if (!validateStep(currentStep)) return;
    
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

      const apiEndpoint = {
        student: `${API_URL}/student/register`,
        teacher: `${API_URL}/teachers/register`,
        parent: `${API_URL}/parent/register`,
      }[activeTab];

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
    setFormData({
      name: '', email: '', phone: '', national_id: '', passport_number: '',
      password: '', password_confirmation: '', country_id: '', stage_id: [],
      subject_id: [], qr_code: '', image: null, certificate_image: null,
      experience_image: null, id_card_front: null, id_card_back: null,
      teacher_type: '', phone_country_code: '+20', custom_stage: '', custom_subject: ''
    });
    setImagePreview(null); setCertificatePreview(null); setExperiencePreview(null);
    setIdCardFrontPreview(null); setIdCardBackPreview(null); setErrors({});
    setCurrentStep(1); setCountrySearch(''); setShowCustomStage(false); setShowCustomSubject(false);
  };

  const getTotalSteps = () => {
    if (activeTab === 'teacher') return 3;
    if (activeTab === 'student') return 2; // ✅ الطالب له خطوتان الآن
    return 2;
  };

  const getStepTitle = () => ({
    student: [t('register.steps.personalInfo'), t('register.steps.academicInfo')], // ✅ إضافة خطوة أكاديمية للطالب
    teacher: [t('register.steps.personalInfo'), t('register.steps.academicInfo'), t('register.steps.reviewData')],
    parent: [t('register.steps.personalInfo'), t('register.steps.completeRegistration')],
  }[activeTab][currentStep - 1]);

  const getSelectedCountry = () => countries.find(country => country.id.toString() === formData.country_id);
  
  const isEgyptSelected = () => {
    const selectedCountry = getSelectedCountry();
    return selectedCountry?.name === 'مصر' || selectedCountry?.name === 'Egypt';
  };

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const passwordValidation = validatePassword(formData.password);

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

        {/* التبويبات */}
        <div className="flex justify-center gap-4 mb-8 animate-slide-up">
          {[
            { id: 'student' as UserType, label: t('register.accountTypes.student'), icon: FiUser, color: 'green' },
            { id: 'teacher' as UserType, label: t('register.accountTypes.teacher'), icon: FiUserCheck, color: 'blue' },
            { id: 'parent' as UserType, label: t('register.accountTypes.parent'), icon: FiUsers, color: 'purple' },
          ].map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setCurrentStep(1); resetForm(); }}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 border-2 ${
                  isActive
                    ? `bg-${tab.color}-500 text-white shadow-lg shadow-${tab.color}-500/30 border-${tab.color}-400`
                    : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300 shadow-md hover:shadow-lg'
                } animate-bounce-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className="text-xl" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* مؤشر الخطوات */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="flex space-x-4">
            {Array.from({ length: getTotalSteps() }, (_, i) => i + 1).map((step, index) => (
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
                {step < getTotalSteps() && (
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

        <div className="text-center mb-6 animate-slide-down">
          <h2 className="text-2xl font-bold text-gray-800">{getStepTitle()}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* الخطوة 1 */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-blue-600">{t('register.form.fullName')}</label>
                <div className="relative">
                  <FiUser className="absolute right-3 top-3 text-blue-500" />
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required
                    className={`w-full p-4 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.name ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-blue-400 focus:ring-blue-400'
                    }`} placeholder={t('register.form.fullNamePlaceholder')} />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-600">{t('register.form.email')}</label>
                <div className="relative">
                  <FiMail className="absolute right-3 top-3 text-blue-500" />
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required
                    className={`w-full p-4 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.email ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-blue-400 focus:ring-blue-400'
                    }`} placeholder={t('register.form.emailPlaceholder')} />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-600">{t('register.form.phone')}</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required
                  className={`w-full p-4 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.phone ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-blue-400 focus:ring-blue-400'
                  }`} placeholder={t('register.form.phonePlaceholder')} />
                {errors.phone && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.phone}</p>}
              </div>

              {/* ✅ البلد للطالب والمعلم */}
              {(activeTab === 'student' || activeTab === 'teacher') && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-blue-600">{t('register.form.country')}</label>
                  <div className="relative" ref={countryDropdownRef}>
                    <button type="button" onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className={`w-full p-4 pr-12 rounded-xl border-2 text-right flex items-center justify-between transition-all duration-300 ${
                        errors.country_id ? 'border-red-500 bg-red-50' : 'border-blue-400 focus:ring-2 focus:ring-blue-400'
                      }`}>
                      {getSelectedCountry() ? (
                        <div className="flex items-center gap-3">
                          <img src={getSelectedCountry()?.image} alt="flag" className="w-6 h-4 object-cover rounded" />
                          <span className="font-medium">{getSelectedCountry()?.name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">{t('register.form.selectCountry')}</span>
                      )}
                      <FiChevronDown className={`transition-transform duration-300 ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isCountryDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-blue-400 rounded-xl shadow-2xl shadow-blue-500/20 z-50 max-h-80 overflow-hidden animate-fade-in-up">
                        <div className="p-3 border-b border-gray-200">
                          <div className="relative">
                            <FiSearch className="absolute right-3 top-3 text-gray-400" />
                            <input type="text" value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)}
                              placeholder={t('register.form.searchCountry')} className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-right" />
                          </div>
                        </div>
                        <div className="overflow-y-auto max-h-60">
                          {filteredCountries.map((country) => (
                            <button key={country.id} type="button" onClick={() => handleCountrySelect(country)}
                              className="w-full p-3 text-right border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <img src={country.image} alt={country.name} className="w-6 h-4 object-cover rounded" />
                                <div className="text-left">
                                  <div className="font-medium text-gray-800">{country.name}</div>
                                </div>
                              </div>
                              {formData.country_id === country.id.toString() && <FiCheck className="text-green-500" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.country_id && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.country_id}</p>}
                </div>
              )}

              {/* ✅ نوع المعلم للمعلمين فقط */}
              {activeTab === 'teacher' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-blue-600">{t('register.form.teacherType')}</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['male', 'female'].map((type) => (
                      <button type="button" key={type} onClick={() => setFormData(prev => ({ ...prev, teacher_type: type }))}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-3 ${
                          formData.teacher_type === type
                            ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-lg shadow-blue-500/20'
                            : 'border-gray-300 bg-white text-gray-600 hover:border-blue-400'
                        }`}>
                        <FiUserCheck className="text-xl" />
                        <span className="font-medium">
                          {type === 'male' ? t('register.form.maleTeacher') : t('register.form.femaleTeacher')}
                        </span>
                      </button>
                    ))}
                  </div>
                  {errors.teacher_type && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.teacher_type}</p>}
                </div>
              )}

              {/* ✅ الرقم القومي أو جواز السفر للمعلمين فقط */}
              {activeTab === 'teacher' && formData.country_id && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-blue-600">
                    {isEgyptSelected() ? t('register.form.nationalId') : t('register.form.passportNumber')}
                  </label>
                  <div className="relative">
                    <FiCreditCard className="absolute right-3 top-3 text-blue-500" />
                    <input type="text" name={isEgyptSelected() ? "national_id" : "passport_number"} 
                      value={isEgyptSelected() ? formData.national_id : formData.passport_number} 
                      onChange={handleInputChange} required maxLength={isEgyptSelected() ? 14 : undefined}
                      className={`w-full p-4 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        (errors.national_id || errors.passport_number) ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-blue-400 focus:ring-blue-400'
                      }`} placeholder={isEgyptSelected() ? t('register.form.nationalIdPlaceholder') : t('register.form.passportPlaceholder')} />
                  </div>
                  {isEgyptSelected() ? 
                    (errors.national_id && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.national_id}</p>) :
                    (errors.passport_number && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.passport_number}</p>)
                  }
                </div>
              )}

              {/* ✅ QR Code للوالدين فقط */}
              {activeTab === 'parent' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-blue-600">{t('register.form.qrCode')}</label>
                  <div className="relative">
                    <FiFlag className="absolute right-3 top-3 text-blue-500" />
                    <input type="text" name="qr_code" value={formData.qr_code} onChange={handleInputChange} required
                      className={`w-full p-4 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.qr_code ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-blue-400 focus:ring-blue-400'
                      }`} placeholder={t('register.form.qrCodePlaceholder')} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{t('register.form.qrCodeHelp')}</p>
                  {errors.qr_code && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.qr_code}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-600">{t('register.form.password')}</label>
                <div className="relative">
                  <FiLock className="absolute right-3 top-3 text-blue-500" />
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} required
                    className={`w-full p-4 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.password ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-blue-400 focus:ring-blue-400'
                    }`} placeholder={t('register.form.passwordPlaceholder')} />
                  <button type="button" className="absolute left-3 top-3 text-gray-500 hover:text-gray-700 transition-colors duration-300" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg animate-fade-in">
                    <div className="space-y-2">
                      <div className={`flex items-center gap-2 ${passwordValidation.requirements.minLength ? 'text-green-600' : 'text-red-600'}`}>
                        <FiCheck className={passwordValidation.requirements.minLength ? 'text-green-500' : 'text-red-500'} />
                        <span className="text-sm">{t('register.passwordRequirements.minLength')}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordValidation.requirements.hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                        <FiCheck className={passwordValidation.requirements.hasUpperCase ? 'text-green-500' : 'text-red-500'} />
                        <span className="text-sm">{t('register.passwordRequirements.uppercase')}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordValidation.requirements.hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
                        <FiCheck className={passwordValidation.requirements.hasLowerCase ? 'text-green-500' : 'text-red-500'} />
                        <span className="text-sm">{t('register.passwordRequirements.lowercase')}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordValidation.requirements.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                        <FiCheck className={passwordValidation.requirements.hasNumber ? 'text-green-500' : 'text-red-500'} />
                        <span className="text-sm">{t('register.passwordRequirements.number')}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordValidation.requirements.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                        <FiCheck className={passwordValidation.requirements.hasSpecialChar ? 'text-green-500' : 'text-red-500'} />
                        <span className="text-sm">{t('register.passwordRequirements.specialChar')}</span>
                      </div>
                    </div>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-600">{t('register.form.confirmPassword')}</label>
                <div className="relative">
                  <FiLock className="absolute right-3 top-3 text-blue-500" />
                  <input type={showConfirmPassword ? "text" : "password"} name="password_confirmation" value={formData.password_confirmation} onChange={handleInputChange} required
                    className={`w-full p-4 pr-12 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.password_confirmation ? 'border-red-500 focus:ring-red-500 bg-red-50' : 'border-blue-400 focus:ring-blue-400'
                    }`} placeholder={t('register.form.confirmPasswordPlaceholder')} />
                  <button type="button" className="absolute left-3 top-3 text-gray-500 hover:text-gray-700 transition-colors duration-300" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password_confirmation && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.password_confirmation}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-blue-600">{t('register.form.profileImage')}</label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 ${
                  errors.image ? 'border-red-500 bg-red-50' : 'border-blue-400 bg-blue-50 hover:bg-blue-100'
                }`}>
                  <input type="file" name="image" onChange={handleFileChange} accept="image/*" className="hidden" id="image-upload" />
                  <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                    <FiUpload className="text-3xl mb-3 text-blue-500" />
                    <span className="text-blue-600 font-medium">{t('register.form.uploadImage')}</span>
                    <span className="text-sm text-gray-500 mt-1">{t('register.form.imageRequirements')}</span>
                  </label>
                </div>
                {imagePreview && (
                  <div className="relative inline-block mt-4 group animate-scale-in">
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border-2 border-blue-500 transition-all duration-300 group-hover:scale-110 shadow-lg" />
                    <button type="button" onClick={() => removeImage('image')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                      <FiX size={16} />
                    </button>
                  </div>
                )}
                {errors.image && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.image}</p>}
              </div>
            </div>
          )}
{(activeTab === 'student' ) &&
 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {stages.map((stage) => (
                      <label key={stage.id} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-gray-300 hover:border-blue-400 transition-all duration-300 bg-white hover:bg-blue-50">
                        <input type="checkbox" checked={formData.stage_id.includes(stage.id.toString())} 
                          onChange={() => handleMultiSelectChange('stage_id', stage.id.toString())}
                          className="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500" />
                        <span className="font-medium text-gray-700">{stage.name}</span>
                      </label>
                    ))}
                  </div>
}
          {/* الخطوة 2 للمعلمين */}
          {currentStep === 2 && activeTab === 'teacher' && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-600">{t('register.form.educationalStages')}</label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {stages.map((stage) => (
                      <label key={stage.id} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-gray-300 hover:border-blue-400 transition-all duration-300 bg-white hover:bg-blue-50">
                        <input type="checkbox" checked={formData.stage_id.includes(stage.id.toString())} 
                          onChange={() => handleMultiSelectChange('stage_id', stage.id.toString())}
                          className="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500" />
                        <span className="font-medium text-gray-700">{stage.name}</span>
                      </label>
                    ))}
                  </div>
                  
                  <button type="button" onClick={() => setShowCustomStage(!showCustomStage)} 
                    className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors duration-300">
                    {showCustomStage ? <FiMinus /> : <FiPlus />}
                    {t('register.form.addNewStage')}
                  </button>
                  
                  {showCustomStage && (
                    <div className="animate-fade-in-up">
                      <input type="text" name="custom_stage" value={formData.custom_stage} onChange={handleInputChange}
                        placeholder={t('register.form.newStagePlaceholder')} className="w-full p-3 rounded-xl border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                  )}
                </div>
                {errors.stage_id && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.stage_id}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-600">{t('register.form.subjects')}</label>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {subjects.map((subject) => (
                      <label key={subject.id} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border-2 border-gray-300 hover:border-blue-400 transition-all duration-300 bg-white hover:bg-blue-50">
                        <input type="checkbox" checked={formData.subject_id.includes(subject.id.toString())} 
                          onChange={() => handleMultiSelectChange('subject_id', subject.id.toString())}
                          className="w-5 h-5 text-blue-600 rounded-lg focus:ring-blue-500" />
                        <span className="font-medium text-gray-700">{subject.name}</span>
                      </label>
                    ))}
                  </div>
                  
                  <button type="button" onClick={() => setShowCustomSubject(!showCustomSubject)} 
                    className="flex items-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors duration-300">
                    {showCustomSubject ? <FiMinus /> : <FiPlus />}
                    {t('register.form.addNewSubject')}
                  </button>
                  
                  {showCustomSubject && (
                    <div className="animate-fade-in-up">
                      <input type="text" name="custom_subject" value={formData.custom_subject} onChange={handleInputChange}
                        placeholder={t('register.form.newSubjectPlaceholder')} className="w-full p-3 rounded-xl border-2 border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                  )}
                </div>
                {errors.subject_id && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.subject_id}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-blue-600">{t('register.form.idCardFront')}</label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 ${
                    errors.id_card_front ? 'border-red-500 bg-red-50' : 'border-blue-400 bg-blue-50 hover:bg-blue-100'
                  }`}>
                    <input type="file" name="id_card_front" onChange={handleFileChange} accept="image/*" className="hidden" id="id-card-front" />
                    <label htmlFor="id-card-front" className="cursor-pointer flex flex-col items-center">
                      <FiUpload className="text-3xl mb-3 text-blue-500" />
                      <span className="text-blue-600 font-medium">{t('register.form.uploadFront')}</span>
                    </label>
                  </div>
                  {idCardFrontPreview && (
                    <div className="relative inline-block mt-4 group animate-scale-in">
                      <img src={idCardFrontPreview} alt="Front" className="w-32 h-32 object-cover rounded-xl border-2 border-blue-500 transition-all duration-300 group-hover:scale-110 shadow-lg" />
                      <button type="button" onClick={() => removeImage('id_card_front')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                        <FiX size={16} />
                      </button>
                    </div>
                  )}
                  {errors.id_card_front && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.id_card_front}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-blue-600">{t('register.form.idCardBack')}</label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 ${
                    errors.id_card_back ? 'border-red-500 bg-red-50' : 'border-blue-400 bg-blue-50 hover:bg-blue-100'
                  }`}>
                    <input type="file" name="id_card_back" onChange={handleFileChange} accept="image/*" className="hidden" id="id-card-back" />
                    <label htmlFor="id-card-back" className="cursor-pointer flex flex-col items-center">
                      <FiUpload className="text-3xl mb-3 text-blue-500" />
                      <span className="text-blue-600 font-medium">{t('register.form.uploadBack')}</span>
                    </label>
                  </div>
                  {idCardBackPreview && (
                    <div className="relative inline-block mt-4 group animate-scale-in">
                      <img src={idCardBackPreview} alt="Back" className="w-32 h-32 object-cover rounded-xl border-2 border-blue-500 transition-all duration-300 group-hover:scale-110 shadow-lg" />
                      <button type="button" onClick={() => removeImage('id_card_back')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                        <FiX size={16} />
                      </button>
                    </div>
                  )}
                  {errors.id_card_back && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.id_card_back}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-600">{t('register.form.certificateImage')}</label>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 ${
                  errors.certificate_image ? 'border-red-500 bg-red-50' : 'border-blue-400 bg-blue-50 hover:bg-blue-100'
                }`}>
                  <input type="file" name="certificate_image" onChange={handleFileChange} accept="image/*" className="hidden" id="certificate" />
                  <label htmlFor="certificate" className="cursor-pointer flex flex-col items-center">
                    <FiUpload className="text-3xl mb-3 text-blue-500" />
                    <span className="text-blue-600 font-medium">{t('register.form.uploadCertificate')}</span>
                  </label>
                </div>
                {certificatePreview && (
                  <div className="relative inline-block mt-4 group animate-scale-in">
                    <img src={certificatePreview} alt="Certificate" className="w-32 h-32 object-cover rounded-xl border-2 border-blue-500 transition-all duration-300 group-hover:scale-110 shadow-lg" />
                    <button type="button" onClick={() => removeImage('certificate_image')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                      <FiX size={16} />
                    </button>
                  </div>
                )}
                {errors.certificate_image && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.certificate_image}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-600">{t('register.form.experienceImage')}</label>
                <div className="border-2 border-dashed border-blue-400 rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 bg-blue-50 hover:bg-blue-100">
                  <input type="file" name="experience_image" onChange={handleFileChange} accept="image/*" className="hidden" id="experience" />
                  <label htmlFor="experience" className="cursor-pointer flex flex-col items-center">
                    <FiUpload className="text-3xl mb-3 text-blue-500" />
                    <span className="text-blue-600 font-medium">{t('register.form.uploadExperience')}</span>
                  </label>
                </div>
                {experiencePreview && (
                  <div className="relative inline-block mt-4 group animate-scale-in">
                    <img src={experiencePreview} alt="Experience" className="w-32 h-32 object-cover rounded-xl border-2 border-blue-500 transition-all duration-300 group-hover:scale-110 shadow-lg" />
                    <button type="button" onClick={() => removeImage('experience_image')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 shadow-lg">
                      <FiX size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* الخطوة النهائية */}
          {currentStep === (activeTab === 'teacher' ? 3 : 2) && activeTab !== 'teacher' && (
            <div className="text-center py-8 animate-bounce-in">
              <div className="p-8 rounded-2xl border-2 bg-green-50 border-green-400 shadow-lg shadow-green-500/10">
                <FiCheck className="text-5xl mx-auto mb-4 text-green-500 animate-check-mark" />
                <h3 className="text-2xl font-bold mb-3 text-green-600">{t('register.messages.readyToRegister')}</h3>
                <p className="text-green-500">{t('register.messages.clickToComplete')}</p>
              </div>
            </div>
          )}

          {/* أزرار التنقل */}
          <div className="flex flex-col md:flex-row justify-between pt-6 gap-4 animate-slide-up">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="px-6 py-3 rounded-lg transition-all duration-500 flex items-center gap-2 transform hover:scale-105 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-lg hover:shadow-xl">
                  <FiArrowRight className="transform rotate-180 transition-transform duration-300" /> {t('register.buttons.previous')}
                </button>
              )}
              <button type="button" onClick={resetForm} className="px-6 py-3 rounded-lg transition-all duration-500 transform hover:scale-105 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 shadow-lg hover:shadow-xl">
                {t('register.buttons.reset')}
              </button>
            </div>
            
            {currentStep < getTotalSteps() ? (
              <button type="button" onClick={nextStep} className="px-8 py-3 rounded-lg transition-all duration-500 flex items-center gap-2 transform hover:scale-105 bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/30 border border-blue-400 animate-pulse-slow">
                {t('register.buttons.next')} <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
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
                    <FiCheck className="transition-transform duration-300" /> {t('register.buttons.register')}
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-gray-300 animate-fade-in">
          <p className="text-gray-600">
            {t('register.messages.alreadyHaveAccount')}{' '}
            <Link to="/login" className="font-semibold text-blue-500 hover:text-blue-400 transition-all duration-300 hover:underline">
              {t('register.buttons.login')}
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes checkMark {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slide-down { animation: slideDown 0.6s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.7s ease-out forwards; }
        .animate-bounce-in { animation: bounceIn 0.8s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.5s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 3s ease infinite; 
        }
        .animate-check-mark { animation: checkMark 0.5s ease-out forwards; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }

        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default UnifiedRegisterPage;