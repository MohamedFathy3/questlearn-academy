import { Clock, Users, BookOpen, Award, Calendar, Star, Target, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useTranslation } from 'react-i18next';

interface CourseCardProps {
  id: string | number;
  title: string;
  teacher: {
    name: string;
    image?: string;
  };
  thumbnail: string;
  price: number;
  originalPrice?: number;
  rating: number;
  studentsCount: number;
  countStudent: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  category: string;
  isNew?: boolean;
  isBestseller?: boolean;
  type?: string;
  currency?: string;
  courseType?: "group" | "private";
  startDate?: string;
  endDate?: string;
  progress?: number; // ✅ تقدم الطالب (للتوافق القديم)
  totalLessons?: number;
  completedLessons?: number;
  averageRating?: number;
  userProgress?: number; // ✅ نسبة تقدم الطالب (0-100)
  userNextLesson?: string; // ✅ الدرس التالي
  userStreak?: number; // ✅ عدد الأيام المتتالية
  isEnrolled?: boolean; // ✅ الطالب مسجل أم لا
}

const DEFAULT_COURSE_IMAGE = "https://foundr.com/wp-content/uploads/2021/09/Best-online-course-platforms.png";
const DEFAULT_AVATAR = "https://via.placeholder.com/40/CCCCCC/808080?text=MS";

const CourseCard = ({
  id,
  title,
  teacher,
  thumbnail,
  price,
  originalPrice,
  rating,
  studentsCount,
  countStudent,
  duration,
  level,
  category,
  isNew = false,
  isBestseller = false,
  type = "recorded",
  currency = "USD",
  courseType = "private",
  startDate,
  endDate,
  progress = 0,
  totalLessons = 0,
  completedLessons = 0,
  averageRating = 0,
  userProgress = 0,
  userNextLesson = "",
  userStreak = 0,
  isEnrolled = false
}: CourseCardProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const courseImage = thumbnail || DEFAULT_COURSE_IMAGE;
  const isArabic = i18n.language === "ar";
  
  // ✅ تحديد إذا كان الطالب مسجل في الكورس
  const isUserEnrolled = isEnrolled || userProgress > 0;
  
  // ✅ حل مشكلة teacher إذا كانت undefined
  const teacherName = teacher?.name || t('courses.unknownTeacher', 'مدرس غير معروف');
  const teacherImage = teacher?.image || DEFAULT_AVATAR;

  const discount = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const isGroupCourse = courseType === "group";
  
  // ✅ تحويل القيم لـ numbers للتأكد
  const MAX_SEATS = Number(countStudent) || 0;
  const CURRENT_STUDENTS = Number(studentsCount) || 0;
  
  // ✅ Progress التسجيل للكورسات الجماعية
  const shouldShowProgress = isGroupCourse && MAX_SEATS > 0;
  const remainingStudents = shouldShowProgress 
    ? Math.max(0, MAX_SEATS - CURRENT_STUDENTS) 
    : 0;

  // ✅ نسبة تقدم التسجيل
  const enrollmentProgressPercentage = shouldShowProgress && MAX_SEATS > 0
    ? (CURRENT_STUDENTS / MAX_SEATS) * 100
    : 0;

  // ✅ نسبة تقدم الطالب (استخدام progress القديم أو userProgress الجديد)
  const studentProgressPercentage = Math.min(isUserEnrolled ? (userProgress || progress) : 0, 100);
  
  // ✅ تحديد حالة تقدم الطالب
  const getStudentProgressStatus = () => {
    if (studentProgressPercentage === 0) return "not-started";
    if (studentProgressPercentage < 25) return "beginner";
    if (studentProgressPercentage < 50) return "early";
    if (studentProgressPercentage < 75) return "midway";
    if (studentProgressPercentage < 100) return "almost-done";
    return "completed";
  };

  const progressStatus = getStudentProgressStatus();
  
  // ✅ لون شريط التقدم بناءً على النسبة
  const getProgressColor = () => {
    switch (progressStatus) {
      case "completed": return "bg-gradient-to-r from-green-500 to-emerald-500";
      case "almost-done": return "bg-gradient-to-r from-blue-500 to-indigo-500";
      case "midway": return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "early": return "bg-gradient-to-r from-yellow-500 to-orange-500";
      case "beginner": return "bg-gradient-to-r from-orange-500 to-red-500";
      default: return "bg-gradient-to-r from-gray-400 to-gray-300";
    }
  };

  const progressColor = getProgressColor();
  
  // ✅ نص حالة التقدم
  const getProgressText = () => {
    switch (progressStatus) {
      case "completed":
        return { 
          text: t('courses.completed', 'مكتمل'), 
          subText: t('courses.congratulations', 'مبروك! لقد أكملت الكورس'),
          icon: "🎓"
        };
      case "almost-done":
        return { 
          text: t('courses.almostDone', 'يكاد ينتهي'), 
          subText: t('courses.keepGoing', 'استمر! أنت على وشك الإنتهاء'),
          icon: "⚡"
        };
      case "midway":
        return { 
          text: t('courses.halfway', 'في المنتصف'), 
          subText: t('courses.greatProgress', 'تقدم رائع! استمر بنفس الوتيرة'),
          icon: "🔥"
        };
      case "early":
        return { 
          text: t('courses.earlyStage', 'المرحلة المبكرة'), 
          subText: t('courses.goodStart', 'بداية جيدة! واصل التعلم'),
          icon: "🌱"
        };
      case "beginner":
        return { 
          text: t('courses.justStarted', 'بدأ للتو'), 
          subText: t('courses.welcome', 'مرحباً بك! ابدأ رحلتك التعليمية'),
          icon: "👋"
        };
      default:
        return { 
          text: t('courses.notStarted', 'لم يبدأ بعد'), 
          subText: t('courses.startNow', 'ابدأ التعلم الآن'),
          icon: "📚"
        };
    }
  };

  const progressInfo = getProgressText();

  // ✅ عدد الدروس المتبقية
  const remainingLessons = Math.max(0, totalLessons - completedLessons);

  // ✅ تحديد حالة الكورس مع تحسين تأثير المؤشر الأحمر
  const getCourseStatus = () => {
    if (!shouldShowProgress) return "no-progress";
    
    if (CURRENT_STUDENTS >= MAX_SEATS) return "full";
    if (remainingStudents > 0 && remainingStudents <= 3) return "almost-full";
    if (enrollmentProgressPercentage >= 75) return "filling-fast";
    if (enrollmentProgressPercentage >= 50) return "half-full";
    return "available";
  };

  const courseStatus = getCourseStatus();
  const shouldHideEnrollButton = courseStatus === "full";

  // ✅ تحديد لون المؤشر الأحمر بناءً على النسبة
  const getEnrollmentProgressColor = () => {
    if (courseStatus === "full") return "from-red-700 to-red-900"; // أحمر داكن
    if (courseStatus === "almost-full") return "from-red-500 to-red-700 animate-pulse"; // أحمر مع نبض
    if (courseStatus === "filling-fast") return "from-orange-500 to-red-500"; // برتقالي لأحمر
    if (courseStatus === "half-full") return "from-yellow-500 to-orange-500"; // أصفر لبرتقالي
    return "from-green-500 to-emerald-500"; // أخضر
  };

  // ✅ تأثيرات إضافية للمؤشر الأحمر
  const getProgressEffects = () => {
    if (courseStatus === "full") {
      return {
        glow: "shadow-lg shadow-red-900/50",
        animation: "animate-none",
        indicator: "💯"
      };
    }
    if (courseStatus === "almost-full") {
      return {
        glow: "shadow-lg shadow-red-600/50 animate-pulse",
        animation: "animate-ping absolute opacity-75",
        indicator: "🔥"
      };
    }
    if (courseStatus === "filling-fast") {
      return {
        glow: "shadow-lg shadow-orange-500/50",
        animation: "animate-pulse",
        indicator: "⚡"
      };
    }
    return {
      glow: "",
      animation: "",
      indicator: "✅"
    };
  };

  const progressColorClass = getEnrollmentProgressColor();
  const progressEffects = getProgressEffects();

  const handleEnrollClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/course/${id}`);
  }, [id, navigate]);

  const handleContinueClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/course/${id}/learn`);
  }, [id, navigate]);

  const handleProgressClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUserEnrolled) {
      navigate(`/course/${id}/learn`);
    } else {
      navigate(`/course/${id}`);
    }
  }, [id, navigate, isUserEnrolled]);

  // ✅ الترجمة
  const getTranslatedLevel = (level: string) => {
    const levels: { [key: string]: string } = {
      'Beginner': t('courses.beginner', 'مبتدئ'),
      'Intermediate': t('courses.intermediate', 'متوسط'),
      'Advanced': t('courses.advanced', 'متقدم'),
      'All Levels': t('courses.allLevels', 'جميع المستويات')
    };
    return levels[level] || level;
  };

  // ✅ تنسيق التاريخ
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Link to={`/course/${id}`} className="block no-underline">
      <Card className="group course-card-hover bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col relative">
        {/* 🔥 شريط التقدم في الأعلى مباشرة (إذا كان مسجل) */}
        {isUserEnrolled && studentProgressPercentage > 0 && (
          <div 
            className="absolute top-0 left-0 right-0 z-20 h-2 bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-t-lg"
            onClick={handleProgressClick}
          >
            <div 
              className={`h-full ${progressColor} transition-all duration-1000 ease-out`}
              style={{ width: `${studentProgressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
            
            {/* نقاط التقدم */}
            <div className="absolute left-1/4 top-0 w-1 h-2 bg-white/50"></div>
            <div className="absolute left-1/2 top-0 w-1 h-2 bg-white/50"></div>
            <div className="absolute left-3/4 top-0 w-1 h-2 bg-white/50"></div>
          </div>
        )}
        
        {/* 🔥 الجزء العلوي - الصورة والبادجات */}
        <div className={`relative overflow-hidden flex-shrink-0 ${isUserEnrolled ? 'h-44 mt-2' : 'h-48'}`}>
          <img
            src={courseImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_COURSE_IMAGE;
            }}
          />
          
          {/* ✅ Badges العلوية */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {isNew && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 text-xs px-2 py-1">
                {t('courses.new', 'جديد')}
              </Badge>
            )}
            {isBestseller && (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 text-xs px-2 py-1">
                {t('courses.bestseller', 'الأكثر مبيعاً')}
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive" className="text-xs px-2 py-1">
                {discount}% {t('courses.off', 'خصم')}
              </Badge>
            )}
          </div>
          
          {/* ✅ Badges اليمين */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90 backdrop-blur text-xs px-2 py-1">
              {getTranslatedLevel(level)}
            </Badge>
      
          </div>

          {/* ✅ Badge حالة التسجيل */}
          {shouldShowProgress && courseStatus === "almost-full" && !isUserEnrolled && (
            <div className="absolute top-12 left-3">
              <Badge className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white border-0 text-xs animate-pulse px-2 py-1 shadow-lg shadow-red-600/50">
                🔥 {t('course.almostFull', 'يكاد يمتلئ')}
              </Badge>
            </div>
          )}
          
          {shouldShowProgress && courseStatus === "full" && !isUserEnrolled && (
            <div className="absolute top-12 left-3">
              <Badge className="bg-gradient-to-r from-red-800 to-red-900 hover:from-red-900 hover:to-black text-white border-0 text-xs px-2 py-1 shadow-lg shadow-red-900/50">
                ⛔ {t('course.full', 'امتلأ بالكامل')}
              </Badge>
            </div>
          )}
        </div>

        {/* 🔥 المحتوى - المعلومات */}
        <CardContent className="p-4 space-y-3 flex-grow">
          {/* ✅ العنوان والمدرس */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-blue-500 transition-colors duration-200 text-gray-900 dark:text-white">
              {title}
            </h3>
            <div className="flex items-center gap-2">
              <img 
                src={teacherImage} 
                alt={teacherName}
                className="w-6 h-6 rounded-full object-cover border border-gray-300"
              />
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{teacherName}</p>
            </div>
          </div>

          {/* ✅ معلومات أساسية */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Users className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                {CURRENT_STUDENTS.toLocaleString()} {t('courses.students', 'طالب')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{duration || t('courses.noDuration', 'غير محدد')}</span>
            </div>
            {averageRating > 0 && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Star className="w-4 h-4 flex-shrink-0 text-yellow-500 fill-yellow-500" />
                <span className="truncate">{averageRating.toFixed(1)}</span>
              </div>
            )}
            {startDate && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="truncate text-xs" title={formatDate(startDate)}>
                  {formatDate(startDate)}
                </span>
              </div>
            )}
          </div>

          {/* ✅ قسم تقدم الطالب (إذا كان مسجل) */}
          {isUserEnrolled && (
            <div 
              className="space-y-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-3 rounded-lg border border-blue-200 dark:border-blue-800 cursor-pointer hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 transition-all duration-300"
              onClick={handleProgressClick}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-blue-700 dark:text-blue-300">
                      {progressInfo.text}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 opacity-75">
                      {progressInfo.subText}
                    </div>
                  </div>
                </div>
                
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {studentProgressPercentage.toFixed(0)}%
                </div>
              </div>
              
              {/* شريط التقدم التفصيلي */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t('courses.yourProgress', 'تقدمك في الكورس')}
                  </span>
                  <span className="font-semibold text-blue-700 dark:text-blue-300">
                    {completedLessons}/{totalLessons} {t('courses.lessons', 'دروس')}
                  </span>
                </div>
                
                <div className="relative w-full bg-blue-100 dark:bg-blue-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full ${progressColor} transition-all duration-700`}
                    style={{ width: `${studentProgressPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs">
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <BookOpen className="w-3 h-3" />
                    {remainingLessons} {t('courses.lessonsLeft', 'دروس متبقية')}
                  </div>
                  {userStreak > 0 && (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <Target className="w-3 h-3" />
                      {userStreak} {t('courses.daysStreak', 'يوم متتالي')}
                    </div>
                  )}
                </div>
              </div>
              
              {userNextLesson && studentProgressPercentage < 100 && (
                <div className="mt-2 text-xs bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 p-2 rounded border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center gap-1 font-semibold">
                    <Zap className="w-3 h-3" />
                    {t('courses.nextLesson', 'الدرس التالي')}:
                  </div>
                  <div className="truncate mt-1">{userNextLesson}</div>
                </div>
              )}
            </div>
          )}

          {/* ✅ قسم تقدم التسجيل (للكورسات الجماعية فقط) */}
          {shouldShowProgress && !isUserEnrolled && (
            <div className="space-y-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              {/* ✅ مؤشر حالة التسجيل مع تأثيرات */}
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {t('courses.enrollmentProgress', 'تقدم التسجيل')}
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded-full ${
                  courseStatus === "full" 
                    ? "bg-gradient-to-r from-red-700 to-red-900 text-white" 
                    : courseStatus === "almost-full" 
                      ? "bg-gradient-to-r from-red-500 to-red-700 text-white animate-pulse"
                      : courseStatus === "filling-fast"
                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                        : courseStatus === "half-full"
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-800"
                          : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                }`}>
                  {progressEffects.indicator} {courseStatus === "full" 
                    ? t('courses.filled', 'امتلأ بالكامل')
                    : courseStatus === "almost-full" 
                      ? t('courses.almostFull', 'يكاد يمتلئ')
                      : courseStatus === "filling-fast" 
                        ? t('courses.fillingFast', 'يمتلئ بسرعة')
                        : courseStatus === "half-full"
                          ? t('courses.halfFull', 'نصف ممتلئ')
                          : t('courses.available', 'متاح')
                  }
                </div>
              </div>
              
              {/* ✅ الأرقام مع تأثيرات */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="text-center bg-white dark:bg-gray-800 p-2 rounded-lg border border-blue-100 dark:border-blue-800/30 relative overflow-hidden">
                  {/* تأثير خلفية */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {CURRENT_STUDENTS}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {t('courses.joined', 'منضم')}
                    </div>
                  </div>
                </div>
                <div className="text-center bg-white dark:bg-gray-800 p-2 rounded-lg border border-red-100 dark:border-red-800/30 relative overflow-hidden">
                  {/* تأثير خلفية أحمر للمقاعد المتبقية */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent"></div>
                  <div className="relative z-10">
                    <div className={`text-xl font-bold ${
                      remainingStudents <= 3 
                        ? "text-red-600 dark:text-red-400" 
                        : "text-green-600 dark:text-green-400"
                    }`}>
                      {remainingStudents}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {t('course.seatsLeft')}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* ✅ شريط التقدم مع تأثير أحمر متدرج */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {t('course.enrollmentStatus', 'حالة التسجيل')}:
                  </span>
                  <span className={`font-bold ${
                    courseStatus === "full" ? "text-red-600 dark:text-red-400" :
                    courseStatus === "almost-full" ? "text-red-500 dark:text-red-300" :
                    courseStatus === "filling-fast" ? "text-orange-600 dark:text-orange-400" :
                    courseStatus === "half-full" ? "text-yellow-600 dark:text-yellow-400" : 
                    "text-green-600 dark:text-green-400"
                  }`}>
                    {enrollmentProgressPercentage.toFixed(1)}%
                  </span>
                </div>
                
                {/* ✅ شريط التقدم الرئيسي مع تأثيرات */}
                <div className={`relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden ${progressEffects.glow}`}>
                  {/* تأثير التوهج */}
                  <div className={`absolute inset-0 ${progressEffects.animation} bg-gradient-to-r from-transparent via-white/50 to-transparent`}></div>
                  
                  {/* شريط التقدم */}
                  <div 
                    className={`h-3 rounded-full bg-gradient-to-r ${progressColorClass} transition-all duration-700 ease-out relative z-10`}
                    style={{ 
                      width: `${Math.min(enrollmentProgressPercentage, 100)}%` 
                    }}
                  >
                    {/* خطوط توهج داخلية */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                  
                  {/* نقاط مؤشر على الشريط */}
                  {enrollmentProgressPercentage > 0 && enrollmentProgressPercentage < 100 && (
                    <>
                      <div className="absolute left-1/4 top-0 w-1 h-3 bg-white/60 z-20"></div>
                      <div className="absolute left-1/2 top-0 w-1 h-3 bg-white/60 z-20"></div>
                      <div className="absolute left-3/4 top-0 w-1 h-3 bg-white/60 z-20"></div>
                    </>
                  )}
                </div>
                
                {/* ✅ مؤشر المقاعد المتبقية مع تحذير أحمر */}
                <div className="flex justify-between text-xs">
                  <div className="text-gray-500 dark:text-gray-400">
                    {CURRENT_STUDENTS}/{MAX_SEATS} {t('courses.students', 'طالب')}
                  </div>
                  <div className={`font-bold flex items-center gap-1 ${
                    remainingStudents <= 3 
                      ? "text-red-600 dark:text-red-400 animate-pulse" 
                      : "text-green-600 dark:text-green-400"
                  }`}>
                    {remainingStudents <= 3 && (
                      <span className="text-xs">⚠️</span>
                    )}
                    {remainingStudents} {t('course.seatsLeft', 'مقاعد متبقية')}
                  </div>
                </div>
              </div>
              
              {/* ✅ رسالة تحذير إذا كان الكورس يكاد يمتلئ */}
              {remainingStudents <= 3 && remainingStudents > 0 && (
                <div className="mt-2 p-2 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                    <div className="text-xs text-red-700 dark:text-red-300 font-medium">
                      {t('courses.hurryMessage', '!سارع بالتسجيل - لم يتبقى سوى')} <span className="font-bold">{remainingStudents}</span> {t('courses.seatsLeft', 'مقاعد')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ✅ الفئة والمستوى */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {category || t('courses.uncategorized', 'غير مصنف')}
            </Badge>
            <div className="flex items-center gap-2">
              {isUserEnrolled && studentProgressPercentage === 100 && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-xs animate-pulse">
                  🎓 {t('courses.completed', 'مكتمل')}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>

        {/* 🔥 الفوتر - السعر والزر */}
        <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto border-t border-gray-100 dark:border-gray-700 pt-4">
          <div className="flex flex-col gap-1">
            {price === 0 ? (
              <>
                <span className="text-xl font-bold text-green-600">
                  {t('courses.free', 'مجاني')}
                </span>
                {startDate && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {t('courses.starts', 'يبدأ')}: {formatDate(startDate)}
                  </span>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {typeof price === 'number' ? price.toLocaleString() : price} {currency}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                      {typeof originalPrice === 'number' ? originalPrice.toLocaleString() : originalPrice} {currency}
                    </span>
                  )}
                </div>
                {startDate && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {t('courses.starts', 'يبدأ')}: {formatDate(startDate)}
                  </span>
                )}
              </>
            )}
          </div>
          
          {/* ✅ الأزرار مع تأثيرات */}
          <div>
            {isUserEnrolled ? (
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                onClick={handleContinueClick}
              >
                {studentProgressPercentage === 100 ? (
                  <>
                    <Award className="w-4 h-4 mr-2" />
                    {t('coursess.reviewCourse', 'مراجعة')}
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {t('coursess.continueLearning', 'واصل التعلم')}
                  </>
                )}
              </Button>
            ) : !shouldHideEnrollButton ? (
              <Button 
                size="sm" 
                className={`px-4 py-2 transition-all duration-300 hover:scale-105 text-white shadow-md hover:shadow-lg ${
                  courseStatus === "almost-full" 
                    ? `bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 animate-pulse` 
                    : courseStatus === "filling-fast"
                      ? "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                      : courseStatus === "half-full"
                        ? "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-gray-800"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                }`}
                onClick={handleEnrollClick}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                {courseStatus === "almost-full" 
                  ? `🔥 ${t('course.hurryEnroll', 'سجل الآن!')}` 
                  : courseStatus === "filling-fast"
                    ? `⚡ ${t('courses.enrollNow', 'احجز الآن')}`
                    : t('courses.enrollNow', 'احجز الآن')
                }
              </Button>
            ) : (
              <Badge variant="outline" className="text-gray-500 border-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-2">
                ⛔ {t('course.courseFull', 'امتلأ')}
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;