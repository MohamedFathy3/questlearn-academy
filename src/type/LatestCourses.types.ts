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
  teacher: {
    id: number;
    name: string;
    email: string;
    image: string | null;
    total_rate?: number;
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
  details?: Array<{
    id: number;
    title: string;
    content_type: string;
  }>;
  created_at: string;
}

export interface TransformedCourse {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string | null;
  price: number;
  originalPrice: number;
  studentsCount: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  category: string;
  isNew: boolean;
  isBestseller: boolean;
  type: string;
  rating: number;
  currency: string;
  maxStudents?: number;
  enrollmentProgress: number;
  courseType: string;
  subscribersCount: number;
}

export interface ApiResponse {
  data: Course[];
  meta: {
    current_page: number;
    total: number;
  };
  result: string;
  message: string;
  status: number;
}