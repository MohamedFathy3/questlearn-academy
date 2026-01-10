export interface Course {
  id: number;
  title: string;
  description: string;
  type: string;
  original_price: string;
  discount: string;
  price: string;
  what_you_will_learn: string;
  image: string | null;
  intro_video_url: string;
  views_count: number;
  course_type: string;
  count_student: number | null;
  currency: string | null;
  subscribers_count: number;
  active: boolean;
  max_students?: number;
  teacher: {
    id: number;
    name: string;
    email: string;
    image: string | null;
    certificate_image: string | null;
    experience_image: string | null;
    students_count: number;
    courses_count: number;
    total_income: number;
    total_rate: number;
  };
  stage: {
    name: string;
  };
  subject: {
    name: string;
  };
  country: {
    name: string;
  };
  details: {
    id: number;
    title: string;
    description: string;
    content_type: string;
    content_link: string | null;
    session_date: string | null;
    session_time: string | null;
    file_path: string | null;
    created_at: string;
  }[];
  created_at: string;
  average_rating?: number;
}



export interface TransformedCourse {
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
  studentsCount: number; // ✅ مهم: عدد المشتركين الحاليين
  countStudent: number; // ✅ مهم: الحد الأقصى للكورس
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
  progress?: number;
  totalLessons?: number;
  completedLessons?: number;
  averageRating?: number;
  userProgress?: number;
  userNextLesson?: string;
  userStreak?: number;
  isEnrolled?: boolean;
  
  // ✅ الحقول الجديدة المضافة
  enrollmentProgressPercentage: number;
  remainingSeats: number;
  courseStatus: "no-progress" | "full" | "almost-full" | "filling-fast" | "available" | "half-full";
}

export interface ApiResponse {
  data: Course[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  result: string;
  message: string;
  status: number;
}

export interface Filters {
  category: string;
  level: string;
  price: string;
  teacher: string;
  sort: string;
}

