import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiUser, FiPhone, FiCreditCard, FiBook, FiFlag, FiCheck, FiX, FiUpload, FiEye, FiEyeOff, FiArrowRight, FiUserCheck, FiUsers } from 'react-icons/fi';
import 'react-toastify/dist/ReactToastify.css';

interface Country {
  id: number;
  name: string;
  key: string;
  code: string;
  active: boolean;
  image: string;
  orderId: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deleted: boolean;
}

interface Stage {
  id: number;
  name: string;
  country: { id: number; name: string; image?: string } | null;
  active: boolean;
  image: string;
  postion: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deleted: boolean;
}

interface Subject {
  id: number;
  name: string;
  stage_id: number;
  stage: { id: number; name: string; postion: number };
  stage_name?: string;
  position?: number;
  active: boolean;
  image?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  national_id?: string;
  password?: string;
  password_confirmation?: string;
  country_id?: string;
  stage_id?: string;
  subject_id?: string;
  image?: string;
  certificate_image?: string;
  experience_image?: string;
}

type UserType = 'student' | 'teacher' | 'parent';

const UnifiedRegisterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<UserType>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    national_id: '',
    password: '',
    password_confirmation: '',
    country_id: '',
    stage_id: '',
    subject_id: '',
    image: null as File | null,
    certificate_image: null as File | null,
    experience_image: null as File | null,
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  const [experiencePreview, setExperiencePreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navigate = useNavigate();
  const API_URL = '/api'; // تعديل حسب عنوان الـ API الخاص بك
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // اكتشاف الوضع الداكن تلقائياً
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
  }, []);

  // تأثير الخلفية المتحركة
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    const dots: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    // إنشاء النقاط
    for (let i = 0; i < 80; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      dots.forEach(dot => {
        dot.x += dot.speedX;
        dot.y += dot.speedY;

        if (dot.x < 0 || dot.x > canvas.width) dot.speedX *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.speedY *= -1;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = isDarkMode 
          ? `rgba(99, 102, 241, ${dot.opacity})`
          : `rgba(59, 130, 246, ${dot.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isDarkMode]);

  // جلب البيانات الأساسية
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // جلب الدول
        const countriesRes = await fetch(`${API_URL}/country/index`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters: {}, perPage: 100, paginate: true }),
        });
        const countriesData = await countriesRes.json();
        if (countriesData.status === 200) setCountries(countriesData.data);

        // جلب المراحل
        const stagesRes = await fetch(`${API_URL}/stage/index`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters: {}, perPage: 100, paginate: true }),
        });
        const stagesData = await stagesRes.json();
        if (stagesData.status === 200) setStages(stagesData.data);

        // جلب المواد
        const subjectsRes = await fetch(`${API_URL}/subject/index`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters: {}, perPage: 100, paginate: true }),
        });
        const subjectsData = await subjectsRes.json();
        if (subjectsData.status === 200) setSubjects(subjectsData.data);

      } catch (error) {
        toast.error('حدث خطأ في تحميل البيانات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  // التحقق من صحة البيانات
  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'الاسم مطلوب';
      else if (formData.name.trim().length < 3) newErrors.name = 'الاسم يجب أن يكون 3 أحرف على الأقل';

      if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'البريد الإلكتروني غير صالح';

      if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
      else if (!/^[\+]?[0-9\s\-\(\)]{8,}$/.test(formData.phone)) newErrors.phone = 'رقم الهاتف غير صالح';

      if (activeTab === 'teacher') {
        if (!formData.national_id.trim()) newErrors.national_id = 'الرقم القومي مطلوب';
        else if (!/^[0-9]{14}$/.test(formData.national_id)) newErrors.national_id = 'الرقم القومي يجب أن يكون 14 رقمًا';
      }

      if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
      else if (formData.password.length < 6) newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';

      if (!formData.password_confirmation) newErrors.password_confirmation = 'تأكيد كلمة المرور مطلوب';
      else if (formData.password !== formData.password_confirmation) newErrors.password_confirmation = 'كلمة المرور غير متطابقة';
    }

    if (step === 2 && activeTab === 'teacher') {
      if (!formData.country_id) newErrors.country_id = 'البلد مطلوب';
      if (!formData.stage_id) newErrors.stage_id = 'المرحلة مطلوبة';
      if (!formData.subject_id) newErrors.subject_id = 'المادة مطلوبة';
      if (!formData.certificate_image) newErrors.certificate_image = 'صورة الشهادة مطلوبة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, [name]: 'يجب أن يكون الملف صورة' }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [name]: 'حجم الملف يجب أن يكون أقل من 5MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, [name]: file }));
      
      const reader = new FileReader();
      reader.onload = () => {
        if (name === 'image') setImagePreview(reader.result as string);
        else if (name === 'certificate_image') setCertificatePreview(reader.result as string);
        else if (name === 'experience_image') setExperiencePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      if (errors[name as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const removeImage = (type: 'image' | 'certificate_image' | 'experience_image') => {
    setFormData(prev => ({ ...prev, [type]: null }));
    if (type === 'image') setImagePreview(null);
    else if (type === 'certificate_image') setCertificatePreview(null);
    else if (type === 'experience_image') setExperiencePreview(null);
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
        const value = formData[key as keyof typeof formData];
        if (value !== null && value !== undefined && value !== '') {
          if (value instanceof File) {
            payload.append(key, value);
          } else {
            payload.append(key, value.toString());
          }
        }
      });

      // تحديد الـ API بناءً على نوع المستخدم
      let apiEndpoint = '';
      switch (activeTab) {
        case 'student':
          apiEndpoint = `${API_URL}/student/register`;
          break;
        case 'teacher':
          apiEndpoint = `${API_URL}/teachers/register`;
          break;
        case 'parent':
          apiEndpoint = `${API_URL}/parent/register`;
          break;
      }

      const res = await fetch(apiEndpoint, {
        method: 'POST',
        body: payload,
      });

      const data = await res.json();

      if (data.success || data.status === 200) {
        toast.success('تم التسجيل بنجاح!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(data.message || 'فشل في التسجيل');
      }
    } catch (err) {
      toast.error('حدث خطأ أثناء التسجيل');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      national_id: '',
      password: '',
      password_confirmation: '',
      country_id: '',
      stage_id: '',
      subject_id: '',
      image: null,
      certificate_image: null,
      experience_image: null,
    });
    setImagePreview(null);
    setCertificatePreview(null);
    setExperiencePreview(null);
    setErrors({});
    setCurrentStep(1);
  };

  const getTotalSteps = () => {
    return activeTab === 'teacher' ? 3 : 2;
  };

  const getStepTitle = () => {
    const titles = {
      student: ['المعلومات الشخصية', 'إكمال التسجيل'],
      teacher: ['المعلومات الشخصية', 'المعلومات الأكاديمية', 'مراجعة البيانات'],
      parent: ['المعلومات الشخصية', 'إكمال التسجيل'],
    };
    return titles[activeTab][currentStep - 1];
  };
return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8 bg-gradient-to-br from-white via-blue-50 to-indigo-100">
      
      {/* خلفية النقاط المتحركة */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* تأثيرات إضافية */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float bg-blue-200"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float animation-delay-2000 bg-indigo-200"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000 bg-purple-200"></div>
      </div>

      {/* تأثيرات النقاط */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-300 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.4 + 0.2
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl p-6 md:p-8 mx-4 rounded-3xl bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl shadow-blue-500/10 transition-all duration-500 transform hover:scale-[1.01] hover:shadow-blue-500/20">
        
        {/* العنوان الرئيسي */}
        <div className="text-center mb-8 animate-slide-down">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
            انضم إلى منصتنا التعليمية
          </h1>
          <p className="mt-3 text-lg text-gray-600 animate-slide-down animation-delay-200">
            اختر نوع حسابك وابدأ رحلتك التعليمية
          </p>
        </div>

        {/* التبويبات */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 animate-slide-up">
          {[
            { id: 'student' as UserType, label: 'طالب', icon: FiUser, color: 'green' },
            { id: 'teacher' as UserType, label: 'معلم', icon: FiUserCheck, color: 'blue' },
            { id: 'parent' as UserType, label: 'ولي أمر', icon: FiUsers, color: 'purple' },
          ].map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentStep(1);
                  resetForm();
                }}
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

        {/* عنوان الخطوة */}
        <div className="text-center mb-6 animate-slide-down">
          <h2 className="text-2xl font-bold text-gray-800">
            {getStepTitle()}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* الخطوة 1: المعلومات الشخصية لجميع المستخدمين */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
              {/* الحقول المشتركة */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-blue-600">
                  الاسم بالكامل
                </label>
                <div className="relative">
                  <div className="absolute right-3 top-3 text-blue-500">
                    <FiUser />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-3 pr-10 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.name 
                        ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                        : 'border-blue-400 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500'
                    }`}
                    placeholder="أدخل اسمك بالكامل"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-600">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <div className="absolute right-3 top-3 text-blue-500">
                    <FiMail />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-3 pr-10 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                        : 'border-blue-400 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500'
                    }`}
                    placeholder="example@domain.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-600">
                  رقم الهاتف
                </label>
                <div className="relative">
                  <div className="absolute right-3 top-3 text-blue-500">
                    <FiPhone />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-3 pr-10 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.phone 
                        ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                        : 'border-blue-400 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500'
                    }`}
                    placeholder="01XXXXXXXXX"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.phone}</p>}
              </div>

              {/* الرقم القومي للمعلم فقط */}
              {activeTab === 'teacher' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-blue-600">
                    الرقم القومي
                  </label>
                  <div className="relative">
                    <div className="absolute right-3 top-3 text-blue-500">
                      <FiCreditCard />
                    </div>
                    <input
                      type="text"
                      name="national_id"
                      value={formData.national_id}
                      onChange={handleInputChange}
                      required
                      className={`w-full p-3 pr-10 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                        errors.national_id 
                          ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                          : 'border-blue-400 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500'
                      }`}
                      placeholder="14 رقم قومي"
                      maxLength={14}
                    />
                  </div>
                  {errors.national_id && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.national_id}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-600">
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute right-3 top-3 text-blue-500">
                    <FiLock />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-3 pr-10 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.password 
                        ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                        : 'border-blue-400 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500'
                    }`}
                    placeholder="6 أحرف على الأقل"
                  />
                  <button 
                    type="button"
                    className="absolute left-3 top-3 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-blue-600">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute right-3 top-3 text-blue-500">
                    <FiLock />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    required
                    className={`w-full p-3 pr-10 rounded-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
                      errors.password_confirmation 
                        ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                        : 'border-blue-400 focus:ring-blue-400 bg-white text-gray-800 placeholder-gray-500'
                    }`}
                    placeholder="تأكيد كلمة المرور"
                  />
                  <button 
                    type="button"
                    className="absolute left-3 top-3 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password_confirmation && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.password_confirmation}</p>}
              </div>

              {/* الصورة الشخصية */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-blue-600">
                  الصورة الشخصية {activeTab !== 'teacher' && '(اختياري)'}
                </label>
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div className={`flex-1 border-2 border-dashed rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 ${
                    errors.image 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-blue-400 bg-blue-50 hover:bg-blue-100'
                  }`}>
                    <input
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center p-4">
                      <FiUpload className="text-2xl mb-2 text-blue-500" />
                      <span className="text-blue-600">
                        انقر لرفع الصورة
                      </span>
                      <span className="text-sm mt-1 text-gray-500">
                        PNG, JPG, JPEG (5MB كحد أقصى)
                      </span>
                    </label>
                  </div>
                  
                  {imagePreview && (
                    <div className="relative group animate-scale-in">
                      <img 
                        src={imagePreview} 
                        alt="معاينة الصورة الشخصية" 
                        className="w-32 h-32 object-cover rounded-lg border-2 border-blue-500 transition-all duration-300 group-hover:scale-110 shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage('image')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 shadow-lg"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  )}
                </div>
                {errors.image && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.image}</p>}
              </div>
            </div>
          )}

          {/* الخطوة 2: تختلف حسب نوع المستخدم */}
          {currentStep === 2 && (
            <div className="animate-fade-in-up">
              {activeTab === 'teacher' ? (
                // للمعلم: معلومات أكاديمية
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-blue-600">
                      البلد
                    </label>
                    <div className="relative">
                      <div className="absolute right-3 top-3 text-blue-500 z-10">
                        <FiFlag />
                      </div>
                      <select
                        name="country_id"
                        value={formData.country_id}
                        onChange={handleInputChange}
                        required
                        className={`w-full p-3 pr-10 rounded-lg border-2 focus:outline-none focus:ring-2 appearance-none transition-all duration-300 ${
                          errors.country_id 
                            ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                            : 'border-blue-400 focus:ring-blue-400 bg-white text-gray-800'
                        }`}
                      >
                        <option value="">اختر البلد</option>
                        {countries.map((country: Country) => (
                          <option key={country.id} value={country.id}>{country.name}</option>
                        ))}
                      </select>
                    </div>
                    {errors.country_id && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.country_id}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-blue-600">
                      المرحلة
                    </label>
                    <div className="relative">
                      <div className="absolute right-3 top-3 text-blue-500 z-10">
                        <FiBook />
                      </div>
                      <select
                        name="stage_id"
                        value={formData.stage_id}
                        onChange={handleInputChange}
                        required
                        className={`w-full p-3 pr-10 rounded-lg border-2 focus:outline-none focus:ring-2 appearance-none transition-all duration-300 ${
                          errors.stage_id 
                            ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                            : 'border-blue-400 focus:ring-blue-400 bg-white text-gray-800'
                        }`}
                      >
                        <option value="">اختر المرحلة</option>
                        {stages.map((stage: Stage) => (
                          <option key={stage.id} value={stage.id}>{stage.name}</option>
                        ))}
                      </select>
                    </div>
                    {errors.stage_id && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.stage_id}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-blue-600">
                      المادة
                    </label>
                    <div className="relative">
                      <div className="absolute right-3 top-3 text-blue-500 z-10">
                        <FiBook />
                      </div>
                      <select
                        name="subject_id"
                        value={formData.subject_id}
                        onChange={handleInputChange}
                        required
                        className={`w-full p-3 pr-10 rounded-lg border-2 focus:outline-none focus:ring-2 appearance-none transition-all duration-300 ${
                          errors.subject_id 
                            ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                            : 'border-blue-400 focus:ring-blue-400 bg-white text-gray-800'
                        }`}
                      >
                        <option value="">اختر المادة</option>
                        {subjects.map((subject: Subject) => (
                          <option key={subject.id} value={subject.id}>{subject.name}</option>
                        ))}
                      </select>
                    </div>
                    {errors.subject_id && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.subject_id}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-blue-600">
                      صورة الشهادة
                    </label>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className={`flex-1 border-2 border-dashed rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 ${
                        errors.certificate_image 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-blue-400 bg-blue-50 hover:bg-blue-100'
                      }`}>
                        <input
                          type="file"
                          name="certificate_image"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                          id="certificate-upload"
                        />
                        <label htmlFor="certificate-upload" className="cursor-pointer flex flex-col items-center justify-center p-4">
                          <FiUpload className="text-2xl mb-2 text-blue-500" />
                          <span className="text-blue-600">
                            انقر لرفع صورة الشهادة
                          </span>
                          <span className="text-sm mt-1 text-gray-500">
                            PNG, JPG, JPEG (5MB كحد أقصى)
                          </span>
                        </label>
                      </div>
                      
                      {certificatePreview && (
                        <div className="relative group animate-scale-in">
                          <img 
                            src={certificatePreview} 
                            alt="معاينة الشهادة" 
                            className="w-32 h-32 object-cover rounded-lg border-2 border-blue-500 transition-all duration-300 group-hover:scale-110 shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage('certificate_image')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 shadow-lg"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    {errors.certificate_image && <p className="text-red-500 text-sm mt-1 animate-pulse">{errors.certificate_image}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-blue-600">
                      صورة الخبرة (اختياري)
                    </label>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex-1 border-2 border-dashed rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 border-blue-400 bg-blue-50 hover:bg-blue-100">
                        <input
                          type="file"
                          name="experience_image"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                          id="experience-upload"
                        />
                        <label htmlFor="experience-upload" className="cursor-pointer flex flex-col items-center justify-center p-4">
                          <FiUpload className="text-2xl mb-2 text-blue-500" />
                          <span className="text-blue-600">
                            انقر لرفع صورة الخبرة
                          </span>
                          <span className="text-sm mt-1 text-gray-500">
                            PNG, JPG, JPEG (5MB كحد أقصى)
                          </span>
                        </label>
                      </div>
                      
                      {experiencePreview && (
                        <div className="relative group animate-scale-in">
                          <img 
                            src={experiencePreview} 
                            alt="معاينة الخبرة" 
                            className="w-32 h-32 object-cover rounded-lg border-2 border-blue-500 transition-all duration-300 group-hover:scale-110 shadow-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage('experience_image')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110 shadow-lg"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // للطالب وولي الأمر: تأكيد البيانات
                <div className="text-center py-8 animate-bounce-in">
                  <div className="p-8 rounded-2xl border-2 bg-green-50 border-green-400 shadow-lg shadow-green-500/10">
                    <FiCheck className="text-5xl mx-auto mb-4 text-green-500 animate-check-mark" />
                    <h3 className="text-2xl font-bold mb-3 text-green-600">
                      جاهز للتسجيل!
                    </h3>
                    <p className="text-green-500">
                      اضغط على زر التسجيل لإكمال عملية إنشاء حسابك
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* الخطوة 3: المراجعة النهائية (للمعلم فقط) */}
          {currentStep === 3 && activeTab === 'teacher' && (
            <div className="animate-fade-in-up">
              <div className="p-6 rounded-lg border-2 bg-blue-50 border-blue-400 shadow-lg shadow-blue-500/10">
                <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
                  مراجعة البيانات
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
                    <p className="text-blue-600 font-medium">الاسم:</p>
                    <p className="text-gray-800 mt-1">{formData.name || 'غير مذكور'}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
                    <p className="text-blue-600 font-medium">البريد الإلكتروني:</p>
                    <p className="text-gray-800 mt-1">{formData.email || 'غير مذكور'}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
                    <p className="text-blue-600 font-medium">رقم الهاتف:</p>
                    <p className="text-gray-800 mt-1">{formData.phone || 'غير مذكور'}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
                    <p className="text-blue-600 font-medium">الرقم القومي:</p>
                    <p className="text-gray-800 mt-1">{formData.national_id || 'غير مذكور'}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
                    <p className="text-blue-600 font-medium">البلد:</p>
                    <p className="text-gray-800 mt-1">
                      {countries.find((c: any) => c.id == formData.country_id)?.name || 'غير محدد'}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm">
                    <p className="text-blue-600 font-medium">المرحلة:</p>
                    <p className="text-gray-800 mt-1">
                      {stages.find((s: any) => s.id == formData.stage_id)?.name || 'غير محددة'}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm md:col-span-2">
                    <p className="text-blue-600 font-medium">المادة:</p>
                    <p className="text-gray-800 mt-1">
                      {subjects.find((s: any) => s.id == formData.subject_id)?.name || 'غير محددة'}
                    </p>
                  </div>
                  
                  {/* معاينات الصور */}
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {imagePreview && (
                      <div className="text-center">
                        <p className="text-blue-600 font-medium mb-2">الصورة الشخصية</p>
                        <img 
                          src={imagePreview} 
                          alt="معاينة الصورة الشخصية" 
                          className="w-24 h-24 object-cover rounded-lg mx-auto border border-blue-500 shadow-md"
                        />
                      </div>
                    )}
                    {certificatePreview && (
                      <div className="text-center">
                        <p className="text-blue-600 font-medium mb-2">صورة الشهادة</p>
                        <img 
                          src={certificatePreview} 
                          alt="معاينة الشهادة" 
                          className="w-24 h-24 object-cover rounded-lg mx-auto border border-blue-500 shadow-md"
                        />
                      </div>
                    )}
                    {experiencePreview && (
                      <div className="text-center">
                        <p className="text-blue-600 font-medium mb-2">صورة الخبرة</p>
                        <img 
                          src={experiencePreview} 
                          alt="معاينة الخبرة" 
                          className="w-24 h-24 object-cover rounded-lg mx-auto border border-blue-500 shadow-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {activeTab === 'teacher' && (
                <div className="mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-400 shadow-sm">
                  <p className="text-sm text-center text-yellow-700">
                    <strong>ملاحظة:</strong> سيتم مراجعة طلبك من قبل إدارة المنصة قبل تفعيل حسابك. قد تستغرق هذه العملية حتى 48 ساعة.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* أزرار التنقل */}
          <div className="flex flex-col md:flex-row justify-between pt-6 gap-4 animate-slide-up">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 rounded-lg transition-all duration-500 flex items-center gap-2 transform hover:scale-105 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-lg hover:shadow-xl"
                >
                  <FiArrowRight className="transform rotate-180 transition-transform duration-300" />
                  السابق
                </button>
              )}
              
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 rounded-lg transition-all duration-500 transform hover:scale-105 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 shadow-lg hover:shadow-xl"
              >
                إعادة تعيين
              </button>
            </div>
            
            {currentStep < getTotalSteps() ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 rounded-lg transition-all duration-500 flex items-center gap-2 transform hover:scale-105 bg-blue-500 text-white hover:bg-blue-400 shadow-lg shadow-blue-500/30 border border-blue-400 animate-pulse-slow"
              >
                التالي
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            ) : (
              <div className="flex gap-2">
                {getTotalSteps() > 2 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 rounded-lg transition-all duration-500 transform hover:scale-105 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-lg hover:shadow-xl"
                  >
                    السابق
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-lg transition-all duration-500 flex items-center gap-2 transform hover:scale-105 bg-green-500 text-white hover:bg-green-400 shadow-lg shadow-green-500/30 border border-green-400 disabled:opacity-50 ${
                    isSubmitting ? 'animate-pulse' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري التسجيل...
                    </>
                  ) : (
                    <>
                      <FiCheck className="transition-transform duration-300" />
                      تأكيد التسجيل
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </form>

        {/* رابط تسجيل الدخول */}
        <div className="text-center mt-8 pt-6 border-t border-gray-300 animate-fade-in">
          <p className="text-gray-600">
            لديك حساب بالفعل؟{' '}
            <Link
              to="/login"
              className="font-semibold text-blue-500 hover:text-blue-400 transition-all duration-300 hover:underline"
            >
              سجل الدخول
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