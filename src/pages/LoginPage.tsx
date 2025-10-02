import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Users, ExternalLink, BookOpen, Shield, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from '@/assets/logo.png';
import { Link } from "react-router-dom";

type LoginType = 'student' | 'parent' | 'teacher';

export default function LoginPage() {
  const { login, error, loading } = useAuth();
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<LoginType>('student');
  const [isHovered, setIsHovered] = useState(false);

  const isRTL = i18n.language === 'ar';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(email, password);
  }

  const handleTeacherRedirect = () => {
    window.open('https://dashboards.professionalacademyedu.com/teacher/login', '_blank');
  };

  const tabConfig = {
    student: {
      title: t('login.student', 'طالب'),
      icon: User,
      description: t('login.studentDesc', 'سجل الدخول لحسابك الطلابي والوصول إلى الدورات'),
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      lightGradient: 'from-blue-50 to-cyan-50',
      darkGradient: 'from-blue-900/20 to-cyan-900/20'
    },
    parent: {
      title: t('login.parent', 'ولي أمر'),
      icon: Users,
      description: t('login.parentDesc', 'تابع أداء أبنائك وتقدمهم التعليمي'),
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      lightGradient: 'from-green-50 to-emerald-50',
      darkGradient: 'from-green-900/20 to-emerald-900/20'
    },
    teacher: {
      title: t('login.teacher', 'معلم'),
      icon: GraduationCap,
      description: t('login.teacherDesc', 'الوصول إلى منصة المعلمين لإدارة الدورات'),
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-500',
      lightGradient: 'from-purple-50 to-indigo-50',
      darkGradient: 'from-purple-900/20 to-indigo-900/20'
    }
  };

  const CurrentTab = tabConfig[activeTab];

  // تأثيرات النقاط المتحركة في الخلفية
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: `rgba(${CurrentTab.color === 'blue' ? '100, 150, 255' : CurrentTab.color === 'green' ? '100, 200, 150' : '180, 100, 255'}, ${Math.random() * 0.3 + 0.1})`
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.body.removeChild(canvas);
    };
  }, [CurrentTab.color]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8 transition-all duration-500"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        background: `linear-gradient(135deg, 
          ${activeTab === 'student' ? '#f0f9ff, #e0f2fe, #f0fdf4' : 
            activeTab === 'parent' ? '#f0fdf4, #ecfdf5, #f0f9ff' : 
            '#faf5ff, #f3e8ff, #f0f9ff'})`
      }}
    >
      {/* تأثيرات الخلفية المتحركة */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float ${
          activeTab === 'student' ? 'bg-blue-300' : 
          activeTab === 'parent' ? 'bg-green-300' : 
          'bg-purple-300'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float animation-delay-2000 ${
          activeTab === 'student' ? 'bg-cyan-300' : 
          activeTab === 'parent' ? 'bg-emerald-300' : 
          'bg-indigo-300'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-4000 ${
          activeTab === 'student' ? 'bg-sky-300' : 
          activeTab === 'parent' ? 'bg-teal-300' : 
          'bg-violet-300'
        }`}></div>
      </div>

      {/* النقاط المتحركة */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full animate-pulse ${
              activeTab === 'student' ? 'bg-blue-400' : 
              activeTab === 'parent' ? 'bg-green-400' : 
              'bg-purple-400'
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.6 + 0.2
            }}
          />
        ))}
      </div>

      <div 
        className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-500 transform hover:scale-[1.01] hover:shadow-3xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header Section with Animated Gradient */}
        <div className={`relative bg-gradient-to-r ${CurrentTab.gradient} p-8 text-center overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className={`relative ${isHovered ? 'animate-bounce' : ''}`}>
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="h-20 w-20 object-contain drop-shadow-lg"
                />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3 animate-slide-down">
              {t('login.welcomeBack', 'مرحباً بعودتك')}
            </h1>
            <p className="text-white/90 text-lg">
              {t('login.chooseAccountType', 'اختر نوع الحساب للمتابعة')}
            </p>
          </div>
          
          {/* Animated Waves */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className={`w-full h-2 bg-gradient-to-r ${
              activeTab === 'student' ? 'from-blue-400/50 to-cyan-400/50' : 
              activeTab === 'parent' ? 'from-green-400/50 to-emerald-400/50' : 
              'from-purple-400/50 to-indigo-400/50'
            } animate-wave`}></div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="flex">
            {(['student', 'parent', 'teacher'] as LoginType[]).map((tab, index) => {
              const TabIcon = tabConfig[tab].icon;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 flex items-center justify-center gap-3 py-5 px-4 text-base font-semibold transition-all duration-300 relative overflow-hidden group ${
                    isActive
                      ? `text-${tabConfig[tab].color}-600 bg-white shadow-sm`
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {isActive && (
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tabConfig[tab].gradient} animate-slide-in`}></div>
                  )}
                  <TabIcon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? `text-${tabConfig[tab].color}-600` : 'text-gray-400'
                  }`} />
                  <span className="relative">
                    {tabConfig[tab].title}
                    {isActive && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-current opacity-20"></div>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {/* Tab Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${CurrentTab.gradient} shadow-lg mb-4 transform transition-transform duration-300 hover:scale-110`}>
              <CurrentTab.icon className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3 bg-gradient-to-r bg-clip-text text-transparent animate-gradient">
              {CurrentTab.title}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {CurrentTab.description}
            </p>
          </div>

          {activeTab === 'teacher' ? (
            // Teacher Tab - Redirect Button
            <div className="text-center space-y-8 animate-fade-in-up">
              <div className={`bg-gradient-to-r ${CurrentTab.lightGradient} border-2 border-${CurrentTab.color}-200 rounded-2xl p-8 transform transition-all duration-300 hover:scale-105`}>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-lg mb-4">
                  <GraduationCap className={`w-10 h-10 text-${CurrentTab.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {t('login.teacherPlatform', 'منصة المعلمين المتخصصة')}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {t('login.teacherRedirect', 'منصة متكاملة لإدارة الفصول والدورات التعليمية، متابعة الطلاب، وإنشاء المحتوى التعليمي')}
                </p>
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { icon: BookOpen, text: 'إدارة الدورات' },
                    { icon: Users, text: 'متابعة الطلاب' },
                    { icon: Star, text: 'تقييم الأداء' }
                  ].map((item, index) => (
                    <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 200}ms` }}>
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-${CurrentTab.color}-100 mb-2`}>
                        <item.icon className={`w-6 h-6 text-${CurrentTab.color}-600`} />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={handleTeacherRedirect}
                className={`w-full bg-gradient-to-r ${CurrentTab.gradient} text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 shadow-lg`}
              >
                <ExternalLink className="w-6 h-6" />
                {t('login.goToTeacherPlatform', 'الذهاب إلى منصة المعلمين')}
                <Shield className="w-5 h-5" />
              </button>

              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  {t('login.teacherSupport', 'للدعم الفني: support@academy.com - 0123456789')}
                </p>
              </div>
            </div>
          ) : (
            // Student & Parent Tabs - Login Form
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
              {/* Email Input */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-gray-700 font-semibold text-base flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {t('login.email', 'البريد الإلكتروني')}
                </Label>
                <div className="relative group">
                  <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 transition-colors duration-300 group-focus-within:text-${CurrentTab.color}-500`}>
                    <Mail className="w-6 h-6 text-gray-400 group-focus-within:scale-110 transition-transform duration-300" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full border-2 border-gray-200 rounded-xl py-4 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-${CurrentTab.color}-500/20 focus:border-${CurrentTab.color}-500 transition-all duration-300 ${
                      isRTL ? 'pl-16 pr-6' : 'pr-16 pl-6'
                    } text-lg hover:border-${CurrentTab.color}-300`}
                    placeholder={t('login.emailPlaceholder', 'example@example.com')}
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-gray-700 font-semibold text-base flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  {t('login.password', 'كلمة المرور')}
                </Label>
                <div className="relative group">
                  <div className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 transition-colors duration-300 group-focus-within:text-${CurrentTab.color}-500`}>
                    <Lock className="w-6 h-6 text-gray-400 group-focus-within:scale-110 transition-transform duration-300" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full border-2 border-gray-200 rounded-xl py-4 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-${CurrentTab.color}-500/20 focus:border-${CurrentTab.color}-500 transition-all duration-300 ${
                      isRTL ? 'pl-16 pr-12' : 'pr-16 pl-12'
                    } text-lg hover:border-${CurrentTab.color}-300`}
                    placeholder="••••••••"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-${CurrentTab.color}-500 transition-colors duration-300`}
                  >
                    {showPassword ? 
                      <EyeOff className="w-6 h-6 hover:scale-110 transition-transform" /> : 
                      <Eye className="w-6 h-6 hover:scale-110 transition-transform" />
                    }
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-3`}>
                  <div className={isRTL ? 'scale-x-[-1]' : ''}>
                    <Switch
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                      className={`data-[state=checked]:bg-${CurrentTab.color}-600 transition-colors duration-300`}
                    />
                  </div>
                  <Label htmlFor="remember-me" className="text-gray-600 font-medium cursor-pointer text-base">
                    {t('login.rememberMe', 'تذكرني')}
                  </Label>
                </div>
                <a href="#" className={`text-${CurrentTab.color}-600 hover:text-${CurrentTab.color}-700 font-semibold transition-colors duration-300 text-base`}>
                  {t('login.forgotPassword', 'نسيت كلمة المرور؟')}
                </a>
              </div>

              {/* Error Message */}
              {error && (
                <div className={`bg-red-50 border-2 border-red-200 rounded-xl p-4 animate-shake`}>
                  <p className="text-red-600 text-center font-medium text-base">
                    {error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r ${CurrentTab.gradient} text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t('login.signingIn', 'جارٍ تسجيل الدخول...')}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <User className="w-6 h-6" />
                    {t('login.signIn', 'تسجيل الدخول')}
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </button>

              {/* Sign Up Link */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-gray-600 text-base">
                  {t('login.noAccount', 'ليس لديك حساب؟')}{" "}
                  <Link 
                    to="/register" 
                    className={`font-bold text-${CurrentTab.color}-600 hover:text-${CurrentTab.color}-700 transition-colors duration-300 underline-offset-4 hover:underline`}
                  >
                    {t('login.signUpNow', 'سجل الآن مجاناً')}
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Additional Info for Parents */}
        {activeTab === 'parent' && (
          <div className={`bg-gradient-to-r ${CurrentTab.lightGradient} border-t border-${CurrentTab.color}-200 p-6`}>
            <div className="text-center">
              <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-green-600" />
                {t('login.parentFeatures', 'مميزات ولي الأمر')}
              </h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {[
                  { text: 'متابعة التقدم', emoji: '📊' },
                  { text: 'تقارير الأداء', emoji: '📈' },
                  { text: 'التواصل مع المعلمين', emoji: '👨‍🏫' }
                ].map((item, index) => (
                  <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <p className="text-gray-700 font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes wave {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slide-in {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.7s ease-out forwards; }
        .animate-slide-down { animation: slideDown 0.6s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.5s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-wave { animation: wave 2s linear infinite; }
        .animate-gradient { 
          background-size: 200% 200%;
          animation: gradient 3s ease infinite; 
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }

        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}