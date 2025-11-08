import { useTranslation } from 'react-i18next';
import { Course, TransformedCourse } from '@/type/LatestCourses.types';

// Hook للبيانات
export const useLatestCoursesLogic = () => {
  const { t } = useTranslation();

  // دالة تحويل البيانات
  const transformCourseData = (course: Course): TransformedCourse => {
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

    return {
      id: course.id.toString(),
      title: course.title,
      instructor: course.teacher.name,
      thumbnail: course?.image, 
      price: parseFloat(course.price) || 0,
      originalPrice: parseFloat(course.original_price) || 0,
      studentsCount: course.count_student || course.subscribers_count || 0,
      duration: getCourseDuration(),
      level: getCourseLevel(),
      category: course.subject.name,
      isNew: isNewCourse(),
      isBestseller: isBestsellerCourse,
      type: course.type,
      rating: getRating(),
      currency: course.currency || "EGP",
      maxStudents: undefined,
      enrollmentProgress: 0,
      courseType: course.course_type,
      subscribersCount: course.subscribers_count
    };
  };

  return {
    transformCourseData
  };
};

// Helper functions
export const shouldShowPopularBadge = (subscribersCount: number) => {
  return subscribersCount > 10;
};

export const shouldShowNewBadge = (createdAt: string) => {
  return new Date(createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;
};