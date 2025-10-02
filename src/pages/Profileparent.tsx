import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  BookOpen, 
  Award, 
  Clock, 
  Mail,
  QrCode,
  Calendar,
  CheckCircle2,
  PlayCircle,
  GraduationCap,
  Star,
  Shield,
  Users,
  BarChart3,
  TrendingUp,
  Bookmark,
  Eye,
  ChevronRight,
  School,
  Target
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
  teacher: {
    name: string;
  };
  subject: {
    name: string;
  };
  details: Array<{
    id: number;
    title: string;
    content_type: string;
    students?: Array<{
      pivot?: {
        view: boolean;
        watched_duration: number;
      };
    }>;
  }>;
  exams: Array<{
    id: number;
    title: string;
    questions_count: number;
  }>;
}

interface Student {
  id: number;
  name: string;
  email: string;
  phone?: string;
  qr_code: string;
  image?: string;
  total_rate: number;
  courses?: Course[];
  created_at: string;
  updated_at: string;
}

interface ParentProfileStats {
  total_children: number;
  total_courses: number;
  average_progress: number;
  total_study_time: string;
  overall_performance: number;
}

const ParentProfile = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [children, setChildren] = useState<Student[]>([]);
  const [stats, setStats] = useState<ParentProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    fetchRealParentData();
  }, [user]);

  // دالة لجلب البيانات الحقيقية من APIs
  const fetchRealParentData = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching real parent data...");
      
      // جلب بيانات ولي الأمر من API
      const parentResponse = await apiFetch<any>("/parent/check-auth");
      console.log("📊 Parent API Response:", parentResponse);

      let childrenData: Student[] = [];

      // معالجة البيانات بناءً على الهيكل الفعلي للـ response
      if (parentResponse.message) {
        const message = parentResponse.message;
        
        // الحالة 1: إذا كان فيه parent و student في الـ response
        if (message.parent && message.student) {
          console.log("✅ Found parent and student data");
          childrenData = [{
            id: message.student.id,
            name: message.student.name,
            email: message.student.email,
            phone: message.student.phone,
            qr_code: message.student.qr_code,
            image: message.student.image,
            total_rate: message.student.total_rate,
            courses: message.student.courses,
            created_at: message.student.created_at,
            updated_at: message.student.updated_at
          }];
        }
        // الحالة 2: إذا كان فيه parent فقط
        else if (message.parent) {
          console.log("ℹ️ Found parent data only");
          // نحاول نجلب بيانات الأبناء من API منفصل إذا موجود
          try {
            const childrenResponse = await apiFetch<any>("/parent/children");
            console.log("👨‍👧‍👦 Children API Response:", childrenResponse);
            
            if (childrenResponse.message && Array.isArray(childrenResponse.message)) {
              childrenData = childrenResponse.message;
            } else if (childrenResponse.children && Array.isArray(childrenResponse.children)) {
              childrenData = childrenResponse.children;
            }
          } catch (error) {
            console.log("⚠️ No children API available, using single student data");
            // إذا مفيش API للأبناء، نستخدم بيانات الطالب من الـ response الأساسي إذا موجودة
            if (parentResponse.student) {
              childrenData = [parentResponse.student];
            }
          }
        }
        // الحالة 3: إذا كان فيه student مباشرة
        else if (message.student) {
          console.log("🎓 Found student data directly");
          childrenData = [message.student];
        }
      }

      console.log("👶 Processed children data:", childrenData);
      setChildren(childrenData);

      // حساب الإحصائيات من البيانات الحقيقية
      const calculatedStats = calculateStatsFromChildren(childrenData);
      setStats(calculatedStats);

    } catch (error) {
      console.error("🚨 Error fetching real parent data:", error);
      // في حالة الخطأ، نعرض حالة فارغة
      setChildren([]);
      setStats({
        total_children: 0,
        total_courses: 0,
        average_progress: 0,
        total_study_time: "0h 0m",
        overall_performance: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStatsFromChildren = (children: Student[]): ParentProfileStats => {
    const totalChildren = children.length;
    const totalCourses = children.reduce((total, child) => 
      total + (child.courses?.length || 0), 0
    );
    
    const averageProgress = totalChildren > 0 ? 
      Math.round(children.reduce((sum, child) => sum + (child.total_rate * 20), 0) / totalChildren) : 0;
    
    const totalStudyTime = calculateTotalStudyTime(children);
    const overallPerformance = calculateOverallPerformance(children);

    return {
      total_children: totalChildren,
      total_courses: totalCourses,
      average_progress: averageProgress,
      total_study_time: totalStudyTime,
      overall_performance: overallPerformance
    };
  };

  const calculateTotalStudyTime = (children: Student[]): string => {
    const totalMinutes = children.reduce((total, child) => {
      const totalLessons = child.courses?.reduce((sum, course) => 
        sum + (course.details?.length || 0), 0) || 0;
      return total + (totalLessons * 45); // 45 دقيقة لكل درس
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  const calculateOverallPerformance = (children: Student[]): number => {
    if (children.length === 0) return 0;
    const totalRate = children.reduce((sum, child) => sum + child.total_rate, 0);
    return Math.round((totalRate / children.length) * 20);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    return "bg-orange-500";
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) 
            ? "fill-yellow-500 text-yellow-500" 
            : "fill-gray-300 text-gray-300"
        }`}
      />
    ));
  };

  const handleViewChildDetails = (childId: number) => {
    navigate(`/parent/child/${childId}`);
  };

  const getCourseProgress = (course: Course): number => {
    if (!course.details || course.details.length === 0) return 0;
    
    const totalLessons = course.details.length;
    const completedLessons = course.details.filter((detail: any) => 
      detail.students?.some((student: any) => student.pivot?.view)
    ).length;
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  const getTotalCompletedLessons = (child: Student): number => {
    if (!child.courses) return 0;
    
    return child.courses.reduce((total, course) => {
      if (!course.details) return total;
      return total + course.details.filter((detail: any) => 
        detail.students?.some((student: any) => student.pivot?.view)
      ).length;
    }, 0);
  };

  const getTotalLessons = (child: Student): number => {
    if (!child.courses) return 0;
    
    return child.courses.reduce((total, course) => {
      return total + (course.details?.length || 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30 dark:from-gray-900 dark:to-green-950/20 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-1 h-80 bg-white/50 dark:bg-gray-800/50 rounded-2xl"></div>
              <div className="lg:col-span-2 h-80 bg-white/50 dark:bg-gray-800/50 rounded-2xl"></div>
            </div>
            <div className="space-y-6">
              {[1, 2].map((item) => (
                <div key={item} className="h-60 bg-white/50 dark:bg-gray-800/50 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50/30 dark:from-gray-900 dark:to-green-950/20 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8 animate-fade-in">
          
          {/* Parent Profile Card */}
          <Card className="lg:col-span-1 border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
            <div className="h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"></div>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="relative inline-block">
                  <div className="relative">
                    <Avatar className="w-32 h-32 mx-auto border-4 border-white dark:border-gray-800 shadow-2xl transition-all duration-500 hover:scale-110">
                      <AvatarImage src={user?.image || undefined} alt={user?.name} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold shadow-lg">
                        {user?.name ? getInitials(user.name) : 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2 border-4 border-white dark:border-gray-800 shadow-lg">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {user?.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2 mt-3 text-lg">
                      <Mail className="w-5 h-5" />
                      {user?.email}
                    </p>
                    {user?.phone && (
                      <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2 mt-2">
                        <span className="text-lg">📱</span>
                        {user.phone}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 px-4 py-2 text-sm font-semibold">
                      {t('profile.parent')}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30 px-4 py-2 text-sm font-semibold">
                      <Users className="w-4 h-4 mr-2" />
                      {children.length} {t('profile.children')}
                    </Badge>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                  <Button 
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-green-600 hover:to-emerald-500 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] font-semibold text-lg py-3 rounded-xl"
                    onClick={logout}
                  >
                    {t('profile.logout')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parent Stats Overview */}
          <Card className="lg:col-span-2 border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
            <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
                <BarChart3 className="w-8 h-8 text-blue-500" />
                {t('profile.parentDashboard')}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
                {t('profile.yourChildrenProgress')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {[
                  { 
                    icon: Users, 
                    value: stats?.total_children || 0, 
                    label: t('profile.totalChildren'), 
                    gradient: 'from-blue-500 to-blue-600'
                  },
                  { 
                    icon: BookOpen, 
                    value: stats?.total_courses || 0, 
                    label: t('profile.totalCourses'), 
                    gradient: 'from-green-500 to-green-600'
                  },
                  { 
                    icon: TrendingUp, 
                    value: stats?.average_progress || 0, 
                    label: t('profile.averageProgress'), 
                    gradient: 'from-orange-500 to-orange-600',
                    suffix: '%'
                  },
                  { 
                    icon: Clock, 
                    value: stats?.total_study_time || '0h 0m', 
                    label: t('profile.totalStudyTime'), 
                    gradient: 'from-purple-500 to-purple-600'
                  },
                  { 
                    icon: Target, 
                    value: stats?.overall_performance || 0, 
                    label: t('profile.overallPerformance'), 
                    gradient: 'from-red-500 to-red-600',
                    suffix: '%'
                  }
                ].map((stat, index) => (
                  <div 
                    key={stat.label}
                    className="text-center p-5 rounded-2xl bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-700/80 border border-gray-200/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105"
                  >
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}{stat.suffix || ''}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Overall Progress Bar */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 dark:text-white text-lg">{t('profile.overallProgress')}</span>
                  <span className="text-green-600 font-bold text-xl">
                    {stats?.average_progress || 0}%
                  </span>
                </div>
                <Progress 
                  value={stats?.average_progress || 0} 
                  className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Children Section */}
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
          <CardHeader className="pb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
                  <GraduationCap className="w-8 h-8 text-blue-500" />
                  {t('profile.myChildren')}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
                  {children.length} {t('profile.childrenUnderYourCare')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {children.length > 0 ? (
                children.map((child, index) => (
                  <div 
                    key={child.id} 
                    className="group flex flex-col lg:flex-row items-start gap-6 p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-700/80 border border-gray-200/30 dark:border-gray-700/30 hover:border-blue-400/40 transition-all duration-500 hover:shadow-xl"
                  >
                    {/* Student Image */}
                    <div className="relative w-full lg:w-48 h-40 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={child.image || "/api/placeholder/192/160"} 
                        alt={child.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Student Details */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col h-full">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-start gap-3 mb-3">
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 font-medium">
                              {t('profile.student')}
                            </Badge>
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 font-medium">
                              <QrCode className="w-3 h-3 mr-1" />
                              {child.qr_code}
                            </Badge>
                            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800 font-medium">
                              <BookOpen className="w-3 h-3 mr-1" />
                              {child.courses?.length || 0} {t('profile.courses')}
                            </Badge>
                          </div>
                          
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors duration-300">
                            {child.name}
                          </h3>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
                            {child.email}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {t('profile.joined')}: {formatDate(child.created_at)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {getTotalCompletedLessons(child)}/{getTotalLessons(child)} {t('profile.lessonsCompleted')}
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center gap-1">
                              {getRatingStars(child.total_rate)}
                            </div>
                            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                              {child.total_rate}/5
                            </span>
                          </div>
                        </div>
                        
                        {/* Progress Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex-1">
                                <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  <span>{t('profile.performance')}</span>
                                  <span className="text-green-600 font-bold">
                                    {Math.round(child.total_rate * 20)}%
                                  </span>
                                </div>
                                <Progress 
                                  value={child.total_rate * 20} 
                                  className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner"
                                />
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {t('profile.basedOnOverallRating')}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              className="font-medium transition-all duration-300 hover:scale-105 bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl px-6 py-2 rounded-xl"
                              onClick={() => handleViewChildDetails(child.id)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              {t('profile.viewDetails')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                    <Users className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {t('profile.noChildren')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                    {t('profile.noChildrenRegistered')}
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-cyan-600 hover:to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-3 rounded-xl"
                  >
                    {t('profile.addChild')}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.7s ease-out forwards; }
        .animate-scale-in { animation: scaleIn 0.6s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-gradient-x { 
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite; 
        }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default ParentProfile;