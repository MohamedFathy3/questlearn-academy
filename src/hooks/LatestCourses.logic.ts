import { useTranslation } from 'react-i18next';
import { Course, TransformedCourse } from '@/type/LatestCourses.types';

// Hook للبيانات
export const useLatestCoursesLogic = () => {
  const { t } = useTranslation();

  // دالة تحويل البيانات
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformCourseData = (course: Course): any => {
   
    // حساب إذا الكورس جديد (تم إنشاؤه في آخر 7 أيام)
    const isNewCourse = () => {
      const courseDate = new Date(course.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - courseDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    };

    // حساب إذا الكورس bestseller
    const isBestsellerCourse = course.subscribers_count > 5;

    // تحديد المستوى بناءً على البيانات المتاحة
    const getCourseLevel = (): "Beginner" | "Intermediate" | "Advanced" | "All Levels" => {
      const title = course.title.toLowerCase();
      if (title.includes('basic') || title.includes('intro') || title.includes('beginner')) {
        return "Beginner";
      } else if (title.includes('advanced') || title.includes('expert')) {
        return "Advanced";
      } else if (title.includes('intermediate')) {
        return "Intermediate";
      }
      return "All Levels";
    };

    const getCourseDuration = () => {
      const lessonCount = course.details?.length || 0;
      if (lessonCount === 0) return t('courses.flexible', 'Flexible');
      if (lessonCount <= 5) return t('courses.hours2-4', '2-4 hours');
      if (lessonCount <= 10) return t('courses.hours5-8', '5-8 hours');
      return t('courses.hours8+', '8+ hours');
    };

    // حساب rating من بيانات المعلم
    const getRating = () => {
      return course.teacher?.total_rate || 4.5;
    };

    // ✅ **البيانات اللي هتظهر الـ Progress:**
    // - count_student: الحد الأقصى للكورس (من الـ API)
    // - subscribers_count: عدد المشتركين الحاليين (من الـ API)
    
    const MAX_SEATS = course.count_student || 0; // الحد الأقصى للكورس
    const CURRENT_STUDENTS = course.subscribers_count || 0; // المشتركين الحاليين
    const IS_GROUP_COURSE = course.course_type === "group";
    
    
    // ✅ حساب نسبة التقدم للكورسات الجماعية فقط
    const enrollmentProgressPercentage = IS_GROUP_COURSE && MAX_SEATS > 0 
      ? (CURRENT_STUDENTS / MAX_SEATS) * 100 
      : 0;
    
    // ✅ عدد المقاعد المتبقية
    const remainingSeats = Math.max(0, MAX_SEATS - CURRENT_STUDENTS);
    
    // ✅ تحديد حالة الكورس
    const getCourseStatus = () => {
      if (!IS_GROUP_COURSE) return "no-progress";
      if (CURRENT_STUDENTS >= MAX_SEATS) return "full";
      if (remainingSeats > 0 && remainingSeats <= 3) return "almost-full";
      if (enrollmentProgressPercentage >= 75) return "filling-fast";
      return "available";
    };
    
    const courseStatus = getCourseStatus();

    // ✅ بيانات تقدم الطالب
    const getUserProgressData = () => {
      const enrolledCourses = JSON.parse(localStorage.getItem('enrolled_courses') || '[]');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userCourse = enrolledCourses.find((c: any) => c.id === course.id);
      
      if (userCourse) {
        return {
          isEnrolled: true,
          userProgress: userCourse.progress || 0,
          completedLessons: userCourse.completed_lessons || 0,
          totalLessons: course.details?.length || 0,
          userNextLesson: userCourse.next_lesson || course.details?.[0]?.title || '',
          userStreak: userCourse.streak || 0
        };
      }
      
      return {
        isEnrolled: false,
        userProgress: 0,
        completedLessons: 0,
        totalLessons: course.details?.length || 0,
        userNextLesson: '',
        userStreak: 0
      };
    };

    const userProgressData = getUserProgressData();

    return {
      // ✅ البيانات الأساسية
      id: course.id.toString(),
      title: course.title,
      teacher: {
        name: course.teacher?.name || 'Unknown Instructor',
        image: course.teacher?.image || ''
      },
      thumbnail: course?.image || '',
      price: parseFloat(course.price) || 0,
      originalPrice: parseFloat(course.original_price) || 0,
      rating: getRating(),
      
      // ✅ **البيانات المهمة للـ Progress:**
      studentsCount: CURRENT_STUDENTS, // عدد المشتركين الحاليين
      countStudent: MAX_SEATS, // الحد الأقصى للكورس
      courseStatus: courseStatus, // حالة الكورس (full, almost-full, etc)
      enrollmentProgressPercentage: enrollmentProgressPercentage, // نسبة التقدم
      remainingSeats: remainingSeats, // المقاعد المتبقية
      
      duration: getCourseDuration(),
      level: getCourseLevel(),
      category: course.subject?.name || 'Uncategorized',
      
      // ✅ البيانات الإضافية
      isNew: isNewCourse(),
      isBestseller: isBestsellerCourse,
      type: course.type || 'recorded',
      currency: course.currency || "EGP",
      courseType: course.course_type || 'private',
      startDate: course.start_date,
      endDate: course.end_date,
      averageRating: course.teacher?.total_rate || 4.5,
      
      // ✅ بيانات التقدم القديمة
      progress: userProgressData.userProgress,
      totalLessons: userProgressData.totalLessons,
      completedLessons: userProgressData.completedLessons,
      
      // ✅ بيانات التقدم الجديدة
      userProgress: userProgressData.userProgress,
      userNextLesson: userProgressData.userNextLesson,
      userStreak: userProgressData.userStreak,
      isEnrolled: userProgressData.isEnrolled
    };
  };

  return {
    transformCourseData
  };
};