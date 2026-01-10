export interface Course {
  id: number;
  title: string;
  price: string;
  original_price: string;
  teacher: {
    name: string;
    image?: string;
    total_rate: number;
  };
  image?: string;
  type: string;
  course_type: string;
  subject: {
    name: string;
  };
  created_at: string;
  subscribers_count: number;
  count_student: number;
  max_students?: number;
  currency: string;
  start_date?: string;
  end_date?: string;
  details?: Array<{
    id: number;
    title: string;
  }>;
}

// LatestCourses.types.ts
export interface TransformedCourse {
  created_at: number;
  // ✅ البيانات الأساسية (المطابقة لـ CourseCard)
  id: string;
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
  
  // ✅ البيانات الإضافية
  isNew: boolean;
  isBestseller: boolean;
  type: string;
  currency: string;
  courseType: "group" | "private";
  startDate?: string;
  endDate?: string;
  
  // ✅ بيانات التقدم
  progress?: number;
  totalLessons?: number;
  completedLessons?: number;
  averageRating?: number;
  userProgress?: number;
  userNextLesson?: string;
  userStreak?: number;
  isEnrolled?: boolean;
  
  // ✅ البيانات الخاصة بالـ Progress في UI
  courseStatus?: string;
  enrollmentProgressPercentage?: number;
  remainingSeats?: number;
}

// ✅ Type للبيانات الكاملة اللي محتاجينها للكارد
export interface FullCourseData {
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
  isNew: boolean;
  isBestseller: boolean;
  type: string;
  currency: string;
  courseType: "group" | "private";
  startDate?: string;
  endDate?: string;
  progress?: number;
  totalLessons?: number;
  completedLessons?: number;
  averageRating?: number;
  userProgress?: number;
  userNextLesson?: string;
  userStreak?: number;
  isEnrolled?: boolean;
}