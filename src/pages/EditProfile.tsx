import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Save,
  Camera,
  Trash2,
  Shield,
  AlertTriangle,
  Mail,
  Phone,
  Calendar,
  User
} from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FormData {
  name: string;
  email: string;
  phone: string;
  birth_day: string;
  image: File | null;
}

const EditProfile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    birth_day: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        birth_day: user.birth_day || "",
        image: null
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

 const handleSaveProfile = async () => {
  try {
    setLoading(true);
    
    if (!formData.name.trim()) {
      alert(t('editProfile.nameRequired'));
      return;
    }

    if (!formData.email.trim()) {
      alert(t('editProfile.emailRequired'));
      return;
    }

    // إنشاء FormData مع الأسماء الصحيحة
    const submitData = new FormData();
    
    // استخدام الأسماء التي يتوقعها الـ backend
    submitData.append('name', formData.name.trim());
    submitData.append('email', formData.email.trim());
    
    if (formData.phone && formData.phone.trim()) {
      submitData.append('phone', formData.phone.trim());
    }
    
    if (formData.birth_day && formData.birth_day.trim()) {
      submitData.append('birth_day', formData.birth_day);
    }
    
    if (formData.image) {
      submitData.append('image', formData.image);
    }

    // التحقق النهائي من البيانات
    console.log("🔍 Final FormData check:");
    let hasName = false;
    for (let [key, value] of submitData.entries()) {
      console.log(`${key}:`, value);
      if (key === 'name') hasName = true;
    }

    if (!hasName) {
      console.error("❌ name field is missing from FormData!");
      alert("خطأ في إعداد البيانات. حقل الاسم مفقود.");
      return;
    }

    console.log("✅ FormData is ready, sending...");

    // Call update profile API
    await updateProfile(submitData);
    
    navigate("/profile");
    
  } catch (error) {
    console.error("Error updating profile:", error);
    alert(t('editProfile.updateError'));
  } finally {
    setLoading(false);
  }
};

//   const handleDeleteAccount = async () => {
//     try {
//       setDeleteLoading(true);
//       await deleteAccount();
//       // بعد حذف الحساب، سيتم توجيه المستخدم تلقائياً من خلال الـ AuthContext
//     } catch (error) {
//       console.error("Error deleting account:", error);
//       alert(t('editProfile.deleteError'));
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/profile")}
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {t('editProfile.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('editProfile.description')}
            </p>
          </div>
        </div>

        {/* Edit Profile Card */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden">
          <div className="h-3 bg-gradient-to-r from-tan to-amber-600"></div>
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
              <User className="w-7 h-7 text-tan" />
              {t('editProfile.profileInfo')}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
              {t('editProfile.updateYourInfo')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Avatar Section */}
            <div className="text-center">
              <div className="relative inline-block">
                <Avatar className="w-24 h-24 lg:w-32 lg:h-32 mx-auto border-4 border-white dark:border-gray-800 shadow-2xl">
                  <AvatarImage 
                    src={imagePreview || user?.image || undefined} 
                    alt={formData.name} 
                  />
                  <AvatarFallback className="text-xl bg-gradient-to-br from-tan to-amber-600 text-white font-semibold">
                    {formData.name ? getInitials(formData.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                
                {/* Edit Image Button */}
                <div className="absolute -bottom-2 -right-2">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="bg-tan rounded-full p-3 border-4 border-white dark:border-gray-800 shadow-lg hover:bg-amber-600 transition-colors duration-300">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                {t('editProfile.clickToChange')}
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {t('editProfile.name')} *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder={t('editProfile.enterName')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t('editProfile.email')} *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder={t('editProfile.enterEmail')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {t('editProfile.phone')}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className="w-full"
                  placeholder={t('editProfile.enterPhone')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birth_day" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t('editProfile.birthDate')}
                </Label>
                <Input
                  id="birth_day"
                  name="birth_day"
                  type="date"
                  value={formData.birth_day || ''}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
            </div>

            {/* User Type Badge */}
            {user?.type && (
              <div className="flex justify-center">
                <Badge variant="secondary" className="bg-tan/10 text-tan border-tan/20 px-4 py-2 text-sm">
                  <Shield className="w-4 h-4 mr-2" />
                  {user.type === 'student' ? t('editProfile.student') : t('editProfile.parent')}
                </Badge>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button 
                variant="outline"
                onClick={() => navigate("/profile")}
                className="flex-1 border-gray-300 dark:border-gray-600"
                disabled={loading}
              >
                {t('editProfile.cancel')}
              </Button>
              <Button 
                onClick={handleSaveProfile}
                className="flex-1 bg-gradient-to-r from-tan to-amber-600 hover:from-amber-600 hover:to-tan text-white shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('editProfile.saving')}
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t('editProfile.save')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delete Account Card - في الأسفل */}
        <Card className="border-0 shadow-xl bg-red-50/50 dark:bg-red-900/20 backdrop-blur-sm rounded-2xl overflow-hidden mt-8 border border-red-200 dark:border-red-800">
          <div className="h-3 bg-gradient-to-r from-red-500 to-red-600"></div>
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-red-900 dark:text-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              {t('editProfile.dangerZone')}
            </CardTitle>
            <CardDescription className="text-red-700 dark:text-red-300">
              {t('editProfile.deleteWarning')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 dark:text-red-100">
                  {t('editProfile.deleteAccount')}
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {t('editProfile.deleteDescription')}
                </p>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('editProfile.deleteAccount')}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                      <AlertTriangle className="w-5 h-5" />
                      {t('editProfile.confirmDelete')}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                      {t('editProfile.deleteConfirmText')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-gray-300">
                      {t('editProfile.cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction 
                    //   onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          {t('editProfile.deleting')}
                        </div>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          {t('editProfile.confirmDelete')}
                        </>
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;