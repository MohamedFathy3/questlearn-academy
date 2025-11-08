import { Course, TransformedCourse } from '@/type/courecses';
import { useTranslation } from 'react-i18next';

export const transformCourseData = (course: Course): TransformedCourse => {
  const originalPrice = parseFloat(course.original_price || "0");
  const currentPrice = parseFloat(course.price || "0");
  const discountValue = parseFloat(course.discount || "0");
  const hasDiscount = originalPrice > currentPrice && discountValue > 0;
  
  // بيانات المحتوى الحقيقي
  const videoLessons = course.details?.filter(detail => 
    detail.content_type === 'video' && detail.content_link
  ) || [];
  
  const pdfLessons = course.details?.filter(detail => 
    detail.content_type === 'pdf' && detail.file_path
  ) || [];
  
  const liveSessions = course.details?.filter(detail => 
    detail.content_type === 'live' && detail.session_date
  ) || [];

  // حساب المدة بناءً على المحتوى الحقيقي
  const getEstimatedDuration = () => {
    const totalLessons = videoLessons.length + pdfLessons.length + liveSessions.length;
    if (totalLessons === 0) return 'Flexible';
    
    const videoMinutes = videoLessons.length * 45;
    const pdfMinutes = pdfLessons.length * 30;
    const liveMinutes = liveSessions.length * 60;
    
    const totalMinutes = videoMinutes + pdfMinutes + liveMinutes;
    const totalHours = Math.ceil(totalMinutes / 60);
    
    if (totalHours <= 2) return "1-2 hours";
    if (totalHours <= 5) return "3-5 hours";
    if (totalHours <= 10) return "6-10 hours";
    return totalHours + "+ hours";
  };

  // تحديد المستوى بناءً على البيانات الحقيقية
  const getCourseLevel = () => {
    const title = course.title ? course.title.toLowerCase() : "";
    const description = course.description ? course.description.toLowerCase() : "";
    
    if (title.includes('basic') || title.includes('intro') || title.includes('beginner') || 
        description.includes('basic') || description.includes('intro') || description.includes('beginner')) {
      return 'Beginner';
    } else if (title.includes('advanced') || title.includes('expert') || 
              description.includes('advanced') || description.includes('expert')) {
      return 'Advanced';
    } else if (title.includes('intermediate') || description.includes('intermediate')) {
      return 'Intermediate';
    }
    return 'All Levels';
  };

  // تحديد الحد الأقصى للطلاب
  const getMaxStudents = () => {
    if (course.max_students) return course.max_students;
    
    if (course.course_type === 'group') {
      if (course.count_student && course.count_student > 50) return 100;
      if (course.count_student && course.count_student > 25) return 50;
      return 30;
    }
    
    return undefined;
  };

  // حساب التقدم
  const getEnrollmentProgress = () => {
    const maxStudents = getMaxStudents();
    if (!maxStudents) return 0;
    
    const currentStudents = course.subscribers_count || course.count_student || 0;
    const percentage = Math.min((currentStudents / maxStudents) * 100, 100);
    return Math.round(percentage);
  };

  const maxStudents = getMaxStudents();
  const enrollmentProgress = getEnrollmentProgress();

  return {
    id: course.id.toString(),
    title: course.title || 'Untitled Course',
    description: course.description || '',
    instructor: course.teacher?.name || 'Unknown Instructor',
    instructorImage: course.teacher?.image || null,
    thumbnail: course.image || '/images/placeholder-course.jpg',
    
    // البيانات المالية
    price: currentPrice,
    originalPrice: hasDiscount ? originalPrice : undefined,
    discount: hasDiscount ? discountValue : undefined,
    currency: course.currency || "EGP",
    isFree: currentPrice === 0,
    
    // بيانات التقييم
    rating: course.teacher?.total_rate || 0,
    reviewsCount: course.views_count || 0,
    studentsCount: course.subscribers_count || course.count_student || 0,
    
    // بيانات المحتوى
    duration: getEstimatedDuration(),
    level: getCourseLevel(),
    category: course.subject?.name || course.stage?.name || 'General',
    subject: course.subject?.name || '',
    stage: course.stage?.name || '',
    lessonsCount: course.details?.length || 0,
    videoLessonsCount: videoLessons.length,
    resourcesCount: pdfLessons.length,
    liveSessionsCount: liveSessions.length,
    
    // بيانات الـ Progress Bar
    maxStudents: maxStudents,
    enrollmentProgress: enrollmentProgress,
    
    // بيانات الحالة
    isBestseller: course.views_count > 500 || (course.count_student || 0) > 50,
    isNew: Date.now() - new Date(course.created_at).getTime() < 7 * 24 * 60 * 60 * 1000,
    isTrending: course.views_count > 1000,
    
    // بيانات المعلم
    teacherRating: course.teacher?.total_rate || 0,
    teacherExperience: course.teacher?.students_count || 0,
    teacherCoursesCount: course.teacher?.courses_count || 0,
    courseType: course.course_type || 'group',
    country: course.country?.name || 'International',
    
    // مؤشرات المحتوى
    hasVideoContent: videoLessons.length > 0,
    hasResources: pdfLessons.length > 0,
    hasLiveSessions: liveSessions.length > 0,
    hasIntroVideo: !!course.intro_video_url,
    learningPoints: course.what_you_will_learn ? 
      course.what_you_will_learn.split(',').filter(point => point.trim()) : 
      [],
    
    // بيانات إضافية
    createdAt: course.created_at,
    viewsCount: course.views_count || 0,
    active: course.active !== false
  };
};