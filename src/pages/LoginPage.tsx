import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from '@/assets/logo.png';
import { Link } from "react-router-dom";

export default function LoginPage() {
  const { login, error, loading } = useAuth();
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isRTL = i18n.language === 'ar';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 p-8 text-center border-b border-gray-100 dark:border-gray-700">
          <div className="flex justify-center mb-4">
            <img 
              src={logo} 
              alt="Logo" 
              className="h-20 w-20 object-contain dark:brightness-90"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {t('login.welcomeBack', 'مرحباً بعودتك')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            {t('login.accessAccount', 'سجل الدخول للوصول إلى حسابك')}
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">
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
                  className={`w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tan focus:border-transparent transition-all duration-200 ${
                    isRTL ? 'pl-12 pr-4' : 'pr-12 pl-4'
                  }`}
                  placeholder={t('login.emailPlaceholder', 'example@example.com')}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 font-medium">
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
                  className={`w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-tan focus:border-transparent transition-all duration-200 ${
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
                    className="data-[state=checked]:bg-tan"
                  />
                </div>
                <Label htmlFor="remember-me" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                  {t('login.rememberMe', 'تذكرني')}
                </Label>
              </div>
              <a href="#" className="text-sm text-tan hover:text-tan/80 transition-colors font-medium">
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
              className="w-full bg-tan text-white py-3 rounded-lg font-semibold hover:bg-tan/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
        <div className="text-center">
  <p className="text-gray-600 dark:text-gray-400">
    {t('login.noAccount', 'ليس لديك حساب؟')}{" "}
    <Link 
      to="/register" 
      className="text-tan hover:text-tan/80 font-semibold transition-colors"
    >
      {t('login.signUpNow', 'سجل الآن')}
    </Link>
  </p>
</div>
          </form>
        </div>
      </div>
    </div>
  );
}