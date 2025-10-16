import { Star, Clock, Users, BookOpen, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useTranslation } from 'react-i18next';

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  rating: number;
  studentsCount: number;
  maxStudents?: number; // ✅ الحد الأقصى للطلاب
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  category: string;
  isNew?: boolean;
  isBestseller?: boolean;
  type?: string;
  currency?: string;
  enrollmentProgress?: number;
  courseType?: "group" | "private";
  subscribersCount?: number;
  count_student?: number; // ✅ عدد الطلاب الحاليين من البيانات
}

const CourseCard = ({
  id,
  title,
  instructor,
  thumbnail,
  price,
  originalPrice,
  studentsCount,
  maxStudents, // ✅ الحد الأقصى
  duration,
  level,
  category,
  isNew,
  isBestseller,
  type = "recorded",
  currency = "USD",
  enrollmentProgress,
  courseType = "private",
  subscribersCount = 0,
  count_student = 0 // ✅ عدد الطلاب الحاليين
}: CourseCardProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const discount = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  // ✅ تحديد إذا كان الكورس جماعي وعرض شريط التقدم
  const isGroupCourse = courseType === "group";
  
  // ✅ حساب التقدم بناءً على subscribers_count والحد الأقصى
  const shouldShowProgress = isGroupCourse && maxStudents !== undefined && maxStudents > 0;
  
  // ✅ عدد الطلاب الحاليين (الأولوية لـ subscribers_count ثم count_student ثم studentsCount)
  const currentStudents = subscribersCount > 0 ? subscribersCount : 
                         count_student > 0 ? count_student : 
                         studentsCount;
  
  // ✅ عدد الطلاب المتبقيين
  const remainingStudents = shouldShowProgress ? Math.max(0, maxStudents! - currentStudents) : 0;
  
  // ✅ نسبة الامتلاء
  const progress = enrollmentProgress !== undefined 
    ? Number(enrollmentProgress) 
    : shouldShowProgress 
      ? Math.min(100, (currentStudents / maxStudents!) * 100)
      : 0;

  // ✅ حالة الكورس بناءً على نسبة الامتلاء
  const getProgressStatus = () => {
    if (progress >= 90) return "almost-full";
    if (progress >= 70) return "filling-fast";
    return "available";
  };

  const progressStatus = getProgressStatus();

  const handleEnrollClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/course/${id}`);
  }, [id, navigate]);

  // ✅ ترجمة المستويات
  const getTranslatedLevel = (level: string) => {
    const levels: { [key: string]: string } = {
      'Beginner': t('courses.beginner', 'مبتدئ'),
      'Intermediate': t('courses.intermediate', 'متوسط'),
      'Advanced': t('courses.advanced', 'متقدم'),
      'All Levels': t('courses.allLevels', 'جميع المستويات')
    };
    return levels[level] || level;
  };

  // ✅ ترجمة نوع الكورس
  const getTranslatedType = (type: string) => {
    const types: { [key: string]: string } = {
      'recorded': t('courses.recorded', 'مسجل'),
      'online': t('courses.online', 'أونلاين')
    };
    return types[type] || type;
  };

  // ✅ ترجمة نوع الكورس (جماعي/خاص)
  const getTranslatedCourseType = (courseType: string) => {
    const types: { [key: string]: string } = {
      'group': t('courses.group', 'جماعي'),
      'private': t('courses.private', 'خاص')
    };
    return types[courseType] || courseType;
  };

  return (
    <Link to={`/course/${id}`} className="block">
      <Card className="group course-card-hover bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative overflow-hidden flex-shrink-0">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Course+Image';
            }}
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {isNew && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 text-xs">
                {t('courses.new', 'جديد')}
              </Badge>
            )}
            {isBestseller && (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 text-xs">
                {t('courses.bestseller', 'الأكثر مبيعاً')}
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {discount}% {t('courses.off', 'خصم')}
              </Badge>
            )}
          </div>
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            <Badge variant="secondary" className="bg-white/90 text-blue-500 dark:bg-gray-800/90 backdrop-blur text-xs">
              {getTranslatedType(type)}
            </Badge>
            <Badge variant="secondary" className="bg-white/90 text-purple-500 dark:bg-gray-800/90 backdrop-blur text-xs">
              {getTranslatedCourseType(courseType)}
            </Badge>
          </div>

          {/* ✅ حالة الامتلاء */}
          {shouldShowProgress && progressStatus === "almost-full" && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 text-xs animate-pulse">
                ⚠️ {t('courses.almostFull', 'يكاد يمتلئ')}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3 flex-grow">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-blue-500 transition-colors duration-200">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">{instructor}</p>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{currentStudents.toLocaleString()} {t('courses.enrolled', 'مشترك')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
          </div>

          {/* ✅ شريط تقدم الاشتراك - يعرض فقط للكورسات الجماعية */}
          {shouldShowProgress && (
            <div className="space-y-3 bg-muted/30 p-3 rounded-lg border">
              {/* ✅ معلومات الأرقام */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1 text-green-600 font-medium">
                  <UserCheck className="w-4 h-4" />
                  <span>{currentStudents} {t('courses.joined', 'منضم')}</span>
                </div>
                <div className="text-orange-600 font-medium">
                  <span>{remainingStudents} {t('courses.remaining', 'متبقي')}</span>
                </div>
              </div>

              {/* ✅ شريط التقدم */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t('courses.enrollmentProgress', 'تقدم التسجيل')}</span>
                  <span>{currentStudents}/{maxStudents} {t('courses.students', 'طالب')}</span>
                </div>
                <Progress 
                  value={progress} 
                  className={`h-3 ${
                    progressStatus === "almost-full" ? "bg-red-100" :
                    progressStatus === "filling-fast" ? "bg-orange-100" : "bg-green-100"
                  }`}
                />
                <div className="flex justify-between text-xs">
                  <span className={`font-medium ${
                    progressStatus === "almost-full" ? "text-red-600" :
                    progressStatus === "filling-fast" ? "text-orange-600" : "text-green-600"
                  }`}>
                    {progressStatus === "almost-full" && `🚀 ${t('courses.almostFull', 'يكاد يمتلئ')}`}
                    {progressStatus === "filling-fast" && `⚡ ${t('courses.fillingFast', 'يمتلئ بسرعة')}`}
                    {progressStatus === "available" && `✅ ${t('courses.available', 'متاح')}`}
                  </span>
                  <span className="text-muted-foreground">
                    {progress.toFixed(0)}% {t('courses.completed', 'مكتمل')}
                  </span>
                </div>
              </div>

              {/* ✅ رسالة تشجيعية */}
              {remainingStudents > 0 && remainingStudents <= 5 && (
                <div className="text-xs text-center bg-yellow-50 text-yellow-700 p-2 rounded border border-yellow-200">
                  {t('courses.hurryUp', 'أسرع! فقط')} {remainingStudents} {t('courses.seatsLeft', 'مقاعد متبقية')} 🎯
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                level === "Beginner" 
                  ? "border-green-500 text-green-600" 
                  : level === "Intermediate" 
                  ? "border-yellow-500 text-yellow-600" 
                  : level === "Advanced"
                  ? "border-red-500 text-red-600"
                  : "border-blue-500 text-blue-600"
              }`}
            >
              {getTranslatedLevel(level)}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            {price === 0 ? (
              <span className="text-xl font-bold text-green-600">{t('courses.free', 'مجاني')}</span>
            ) : (
              <>
                <span className="text-xl font-bold text-tan">
                  {price.toLocaleString()} {currency}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {originalPrice.toLocaleString()} {currency}
                  </span>
                )}
              </>
            )}
          </div>
          <Button 
            size="sm" 
            className={`bg-tan hover:bg-tan/90 transition-colors ${
              shouldShowProgress && progressStatus === "almost-full" ? "animate-pulse bg-red-600 hover:bg-red-700" : ""
            }`}
            onClick={handleEnrollClick}
          >
            <BookOpen className="w-4 h-4 mr-1" />
            {shouldShowProgress && remainingStudents <= 3 ? 
              t('courses.hurryEnroll', 'سجل الآن!') : 
              t('courses.enrollNow', 'احجز الآن')
            }
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;