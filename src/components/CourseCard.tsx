import { Clock, Users, BookOpen, UserCheck } from "lucide-react";
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
  studentsCount: number; // ✅ ده اللي جاي من students_count في الـ API
  maxStudents?: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  category: string;
  isNew?: boolean;
  isBestseller?: boolean;
  type?: string;
  currency?: string;
  enrollmentProgress?: number;
  courseType?: "group" | "private";
  subscribers_count?: number; // ✅ ممكن يبقى 0
  count_student?: number; // ✅ الحد الأقصى
}

const DEFAULT_COURSE_IMAGE = "https://foundr.com/wp-content/uploads/2021/09/Best-online-course-platforms.png";

const CourseCard = ({
  id,
  title,
  instructor,
  thumbnail,
  price,
  originalPrice,
  studentsCount, // ✅ students_count من الـ API
  maxStudents,
  duration,
  level,
  category,
  isNew,
  isBestseller,
  type = "recorded",
  currency = "USD",
  enrollmentProgress,
  courseType = "private",
  subscribers_count = 0,
  count_student = 0
}: CourseCardProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const courseImage = thumbnail || DEFAULT_COURSE_IMAGE;

  const discount = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  const isGroupCourse = courseType === "group";
  
  // ✅ الحد الأقصى
  const MAX_SEATS = count_student > 0 ? count_student : (maxStudents || 0);

  // ✅ استخدم subscribers_count أولاً، لو 0 استخدم studentsCount
  const CURRENT_STUDENTS = subscribers_count > 0
    ? subscribers_count
    : (studentsCount > 0 ? studentsCount : 0);

  const shouldShowProgress = isGroupCourse && MAX_SEATS > 0;

  // عدد المقاعد المتبقية (لا يُظهر قيمة سالبية)
  const remainingStudents = shouldShowProgress ? Math.max(0, MAX_SEATS - CURRENT_STUDENTS) : 0;

  // نسبة التقدم الخام (قد تتجاوز 100 إذا كان هناك تجاوز)، لكن للشريط نحدها لـ 100
  const rawProgressPercentage = shouldShowProgress && MAX_SEATS > 0
    ? (CURRENT_STUDENTS / MAX_SEATS) * 100
    : 0;
  const progressPercentage = Math.min(rawProgressPercentage, 100);

  const getProgressStatus = () => {
    if (!shouldShowProgress) return "no-progress";
    // الكورس يعتبر ممتلئ لو العدد الحالي >= الحد الأقصى
    if (CURRENT_STUDENTS >= MAX_SEATS) return "full";
    // يكاد يمتلئ لو المقاعد المتبقية قليلة (مثلاً <= 5)
    if (remainingStudents > 0 && remainingStudents <= 5) return "almost-full";
    // سريع الامتلاء لو نسبة التقدم عالية
    if (rawProgressPercentage >= 70) return "filling-fast";
    return "available";
  };

  const progressStatus = getProgressStatus();

  // ✅ للعرض العام: إذا فيه سقف للطلاب نعرض الحد الأدنى بين الحالي والحد الأقصى
  const displayStudentsCount = shouldShowProgress ? Math.min(CURRENT_STUDENTS, MAX_SEATS) : CURRENT_STUDENTS;

  const handleEnrollClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/course/${id}`);
  }, [id, navigate]);

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

  const getTranslatedType = (type: string) => {
    const types: { [key: string]: string } = {
      'recorded': t('courses.recorded', 'مسجل'),
      'online': t('courses.online', 'أونلاين')
    };
    return types[type] || type;
  };

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
            src={courseImage}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_COURSE_IMAGE;
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

          {shouldShowProgress && progressStatus === "almost-full" && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-red-500 hover:bg-red-600 text-white border-0 text-xs animate-pulse">
                ⚠️ {t('courses.almostFull', 'يكاد يمتلئ')}
              </Badge>
            </div>
          )}
          
          {shouldShowProgress && progressStatus === "full" && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-gray-700 hover:bg-gray-800 text-white border-0 text-xs">
                ⛔ {t('courses.full', 'امتلأ')}
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

          {/* ✅ معلومات أساسية */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{displayStudentsCount.toLocaleString()} {t('courses.enrolled', 'مشترك')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
          </div>

          {/* ✅ شريط تقدم الاشتراك */}
          {shouldShowProgress && (
            <div className="space-y-3 bg-muted/30 p-3 rounded-lg border">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1 text-green-600 font-medium">
                  <UserCheck className="w-4 h-4" />
                  <span>{displayStudentsCount} {t('courses.joined', 'منضم')}</span>
                </div>
                <div className="text-orange-600 font-medium">
                  <span>{remainingStudents} {t('courses.remaining', 'متبقي')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t('courses.enrollmentProgress', 'تقدم التسجيل')}</span>
                  <span>{displayStudentsCount}/{MAX_SEATS} {t('courses.students', 'طالب')}</span>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className={`h-3 ${
                    progressStatus === "full" ? "bg-gray-200" :
                    progressStatus === "almost-full" ? "bg-red-100" :
                    progressStatus === "filling-fast" ? "bg-orange-100" : "bg-green-100"
                  }`}
                />
                <div className="flex justify-between text-xs">
                  <span className={`font-medium ${
                    progressStatus === "full" ? "text-gray-600" :
                    progressStatus === "almost-full" ? "text-red-600" :
                    progressStatus === "filling-fast" ? "text-orange-600" : "text-green-600"
                  }`}>
                    {progressStatus === "full" && `⛔ ${t('courses.full', 'امتلأ')}`}
                    {progressStatus === "almost-full" && `🚀 ${t('courses.almostFull', 'يكاد يمتلئ')}`}
                    {progressStatus === "filling-fast" && `⚡ ${t('courses.fillingFast', 'يمتلئ بسرعة')}`}
                    {progressStatus === "available" && `✅ ${t('courses.available', 'متاح')}`}
                  </span>
                  <span className="text-muted-foreground">
                    {progressPercentage.toFixed(0)}% {t('courses.completed', 'مكتمل')}
                  </span>
                </div>
              </div>

              {remainingStudents > 0 && remainingStudents <= 5 && progressStatus !== "full" && (
                <div className="text-xs text-center bg-yellow-50 text-yellow-700 p-2 rounded border border-yellow-200">
                  {t('courses.hurryUp', 'أسرع! فقط')} {remainingStudents} {t('courses.seatsLeft', 'مقاعد متبقية')} 🎯
                </div>
              )}

              {progressStatus === "full" && (
                <div className="text-xs text-center bg-gray-100 text-gray-700 p-2 rounded border border-gray-300 font-medium">
                  📚 {t('courses.courseFull', 'تم اكتمال العدد')}
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
            className={`transition-colors ${
              shouldShowProgress && progressStatus === "full" 
                ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed" 
                : shouldShowProgress && progressStatus === "almost-full" 
                  ? "animate-pulse bg-red-600 hover:bg-red-700" 
                  : "bg-tan hover:bg-tan/90"
            }`}
            onClick={handleEnrollClick}
            disabled={shouldShowProgress && progressStatus === "full"}
          >
            <BookOpen className="w-4 h-4 mr-1" />
            {shouldShowProgress && progressStatus === "full" 
              ? t('courses.full', 'امتلأ') 
              : shouldShowProgress && progressStatus === "almost-full" 
                ? t('courses.hurryEnroll', 'سجل الآن!') 
                : t('courses.enrollNow', 'احجز الآن')
            }
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;