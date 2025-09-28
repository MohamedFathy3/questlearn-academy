import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, User, Mail, Lock, ArrowLeft } from "lucide-react";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  image: File | null;
}

interface ApiResponse {
  result: string;
  data: null | {
    token?: string;
    student?: any;
  };
  message: {
    message: string;
    student?: any;
    token?: string;
  };
  status: number;
}

const Register = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    image: null
  });

  const isRTL = i18n.language === 'ar';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError(t('register.invalidImageType', 'Please select a valid image file'));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError(t('register.imageTooLarge', 'Image size should be less than 5MB'));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // التحقق من صحة البيانات
    if (!formData.name || !formData.email || !formData.password || !formData.password_confirmation) {
      setError(t('register.fillAllFields', 'Please fill in all fields'));
      setLoading(false);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError(t('register.passwordsDontMatch', 'Passwords do not match'));
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(t('register.passwordLength', 'Password must be at least 6 characters'));
      setLoading(false);
      return;
    }

    try {
      // إنشاء FormData لإرسال الملفات
      const submitData = new FormData();
      
      // إضافة الحقول بشكل صحيح
      submitData.append('name', formData.name.trim());
      submitData.append('email', formData.email.trim());
      submitData.append('password', formData.password);
      submitData.append('password_confirmation', formData.password_confirmation);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      console.log("📝 Registering user...", {
        name: formData.name,
        email: formData.email,
        hasImage: !!formData.image
      });

      const response = await fetch('/api/student/register', {
        method: 'POST',
        body: submitData,
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include'
      });

      console.log("📡 Response status:", response.status);

      const data: ApiResponse = await response.json();
      console.log("✅ Registration response:", data);

      if (!response.ok) {
        console.error("❌ Registration error response:", data);
        
        let errorMessage = t('register.registrationFailed', 'Registration failed');
        
        if (typeof data.message === 'string') {
          errorMessage = data.message;
        } else if (data.message && typeof data.message === 'object') {
          // إذا كان message كائن، نستخدم الرسالة الرئيسية
          errorMessage = data.message.message || t('register.registrationFailed', 'Registration failed');
        } else if (data.result && data.result !== "Success") {
          errorMessage = String(data.result);
        }
        
        setError(errorMessage);
        return;
      }

      if (data.result === "Success") {
        // حفظ التوكن إذا كان موجوداً في الرد
        let tokenToSave = null;
        
        // البحث عن التوكن في الأماكن المختلفة
        if (data.data?.token) {
          tokenToSave = data.data.token;
        } else if (data.message?.token) {
          tokenToSave = data.message.token;
        }
        
        if (tokenToSave) {
          Cookies.set("token", tokenToSave, { expires: 7 });
          console.log("🔑 Token saved");
        } else {
          console.log("❌ No token found in response");
        }
        
        // عرض رسالة النجاح
        const successMessage = typeof data.message === 'string' 
          ? data.message 
          : data.message?.message || t('register.registrationSuccess', 'Registration successful!');
        
        toast.success(successMessage);
        
        // توجيه المستخدم لصفحة تسجيل الدخول بعد تأخير بسيط
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const errorMessage = typeof data.message === 'string' 
          ? data.message 
          : data.message?.message || t('register.registrationFailed', 'Registration failed');
        setError(errorMessage);
      }

    } catch (err: any) {
      console.error("🚨 Registration error:", err);
      // التأكد من أن الخطأ هو نص وليس كائن
      const errorMessage = err?.message || t('register.registrationError', 'An error occurred during registration');
      setError(String(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-tan/5 to-blue-500/5 flex items-center justify-center p-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4 hover:bg-tan/10 hover:text-tan"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('common.back', 'Back')}
        </Button>

        <Card className="border-tan/20 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-tan">
              {t('register.title', 'Create Account')}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              {t('register.subtitle', 'Join thousands of learners worldwide')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {typeof error === 'string' ? error : JSON.stringify(error)}
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('register.name', 'Full Name')} *
                </Label>
                <div className="relative">
                  <User className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={t('register.namePlaceholder', 'Enter your full name')}
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`border-tan/20 focus:border-tan focus:ring-tan/20 ${isRTL ? 'pr-10' : 'pl-10'}`}
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('register.email', 'Email Address')} *
                </Label>
                <div className="relative">
                  <Mail className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t('register.emailPlaceholder', 'Enter your email')}
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`border-tan/20 focus:border-tan focus:ring-tan/20 ${isRTL ? 'pr-10' : 'pl-10'}`}
                    required
                  />
                </div>
              </div>

              {/* Profile Image */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('register.profileImage', 'Profile Image')} ({t('register.optional', 'Optional')})
                </Label>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="border-tan/20 focus:border-tan focus:ring-tan/20"
                    />
                  </div>
                  {formData.image && (
                    <div className="w-10 h-10 rounded-full border-2 border-tan overflow-hidden">
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('register.password', 'Password')} *
                </Label>
                <div className="relative">
                  <Lock className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t('register.passwordPlaceholder', 'Enter your password')}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`border-tan/20 focus:border-tan focus:ring-tan/20 ${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`absolute top-0 h-full px-3 py-2 hover:bg-transparent ${isRTL ? 'left-0' : 'right-0'}`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('register.passwordHint', 'Password must be at least 6 characters')}
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('register.confirmPassword', 'Confirm Password')} *
                </Label>
                <div className="relative">
                  <Lock className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                  <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t('register.confirmPasswordPlaceholder', 'Confirm your password')}
                    value={formData.password_confirmation}
                    onChange={handleInputChange}
                    className={`border-tan/20 focus:border-tan focus:ring-tan/20 ${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
                    required
                    minLength={6}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`absolute top-0 h-full px-3 py-2 hover:bg-transparent ${isRTL ? 'left-0' : 'right-0'}`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-tan hover:bg-tan/90 text-white py-2.5 text-base font-medium shadow-md"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('register.creatingAccount', 'Creating Account...')}
                  </div>
                ) : (
                  t('register.createAccount', 'Create Account')
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {t('register.alreadyHaveAccount', 'Already have an account?')}{' '}
                  <Link
                    to="/login"
                    className="text-tan hover:text-tan/80 font-medium transition-colors"
                  >
                    {t('register.signIn', 'Sign in')}
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;