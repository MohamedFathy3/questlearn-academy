import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Users, ExternalLink } from "lucide-react";
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

  const isRTL = i18n.language === 'ar';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(email, password);
  }

  const handleTeacherRedirect = () => {
    // تحويل المعلم إلى موقع آخر
    window.open('https://teacher-platform.example.com', '_blank');
  };

  const tabConfig = {
    student: {
      title: t('login.student', 'طالب'),
      icon: User,
      description: t('login.studentDesc', 'سجل الدخول لحسابك الطلابي والوصول إلى الدورات'),
      color: 'text-blue-600'
    },
    parent: {
      title: t('login.parent', 'ولي أمر'),
      icon: Users,
      description: t('login.parentDesc', 'تابع أداء أبنائك وتقدمهم التعليمي'),
      color: 'text-green-600'
    },
    teacher: {
      title: t('login.teacher', 'معلم'),
      icon: GraduationCap,
      description: t('login.teacherDesc', 'الوصول إلى منصة المعلمين لإدارة الدورات'),
      color: 'text-purple-600'
    }
  };

  const CurrentTab = tabConfig[activeTab];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 p-6 text-center border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-center mb-4">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-16 w-16 object-contain dark:brightness-90"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t('login.welcomeBack', 'مرحباً بعودتك')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
            {t('login.chooseAccountType', 'اختر نوع الحساب للمتابعة')}
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-100 dark:border-gray-700">
          <div className="flex">
            {(['student', 'parent', 'teacher'] as LoginType[]).map((tab) => {
              const TabIcon = tabConfig[tab].icon;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-2 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab
                      ? `${tabConfig[tab].color} border-b-2 ${tabConfig[tab].color.replace('text', 'border')} bg-gray-50 dark:bg-gray-700/50`
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tabConfig[tab].title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Tab Header */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${
              activeTab === 'student' ? 'from-blue-500 to-blue-600' :
              activeTab === 'parent' ? 'from-green-500 to-green-600' :
              'from-purple-500 to-purple-600'
            } mb-3`}>
              <CurrentTab.icon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              {CurrentTab.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {CurrentTab.description}
            </p>
          </div>

          {activeTab === 'teacher' ? (
            // Teacher Tab - Redirect Button
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
                <GraduationCap className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {t('login.teacherPlatform', 'منصة المعلمين')}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {t('login.teacherRedirect', 'سيتم تحويلك إلى منصة المعلمين المتخصصة لإدارة الدورات والطلاب')}
                </p>
              </div>
              
              <button
                onClick={handleTeacherRedirect}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                {t('login.goToTeacherPlatform', 'الذهاب إلى منصة المعلمين')}
              </button>

              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('login.teacherSupport', 'للمساعدة التقنية: support@academy.com')}
                </p>
              </div>
            </div>
          ) : (
            // Student & Parent Tabs - Login Form
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                  {t('login.email', 'البريد الإلكتروني')}
                </Label>
                <div className="relative">
                  <div className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2`}>
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 ${
                      activeTab === 'student' ? 'focus:ring-blue-500' : 'focus:ring-green-500'
                    } focus:border-transparent transition-all duration-200 ${
                      isRTL ? 'pl-12 pr-4' : 'pr-12 pl-4'
                    }`}
                    placeholder={t('login.emailPlaceholder', 'example@example.com')}
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                  {t('login.password', 'كلمة المرور')}
                </Label>
                <div className="relative">
                  <div className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2`}>
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 ${
                      activeTab === 'student' ? 'focus:ring-blue-500' : 'focus:ring-green-500'
                    } focus:border-transparent transition-all duration-200 ${
                      isRTL ? 'pl-12 pr-10' : 'pr-12 pl-10'
                    }`}
                    placeholder="********"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
                  <div className={isRTL ? 'scale-x-[-1]' : ''}>
                    <Switch
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                      className={`data-[state=checked]:${
                        activeTab === 'student' ? 'bg-blue-600' : 'bg-green-600'
                      }`}
                    />
                  </div>
                  <Label htmlFor="remember-me" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                    {t('login.rememberMe', 'تذكرني')}
                  </Label>
                </div>
                <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                  {t('login.forgotPassword', 'نسيت كلمة المرور؟')}
                </a>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-600 dark:text-red-400 text-sm text-center">
                    {error}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r ${
                  activeTab === 'student' 
                    ? 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' 
                    : 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                } text-white py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {t('login.signingIn', 'جارٍ تسجيل الدخول...')}
                  </div>
                ) : (
                  t('login.signIn', 'تسجيل الدخول')
                )}
              </button>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('login.noAccount', 'ليس لديك حساب؟')}{" "}
                  <Link 
                    to="/register" 
                    className={`font-semibold transition-colors ${
                      activeTab === 'student' 
                        ? 'text-blue-600 hover:text-blue-700' 
                        : 'text-green-600 hover:text-green-700'
                    }`}
                  >
                    {t('login.signUpNow', 'سجل الآن')}
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Additional Info for Parents */}
        {activeTab === 'parent' && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-t border-green-200 dark:border-green-800 p-4">
            <div className="text-center">
              <h4 className="text-sm font-semibold text-green-800 dark:text-green-400 mb-1">
                {t('login.parentFeatures', 'مميزات ولي الأمر')}
              </h4>
              <p className="text-xs text-green-600 dark:text-green-500">
                {t('login.parentFeaturesDesc', 'متابعة التقدم - تقارير الأداء - التواصل مع المعلمين')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}