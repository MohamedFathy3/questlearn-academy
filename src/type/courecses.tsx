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

export interface TransformedCourse {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorImage: string | null;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  isFree: boolean;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  duration: string;
  level: string;
  category: string;
  subject: string;
  stage: string;
  lessonsCount: number;
  videoLessonsCount: number;
  resourcesCount: number;
  liveSessionsCount: number;
  maxStudents?: number;
  enrollmentProgress: number;
  isBestseller: boolean;
  isNew: boolean;
  isTrending: boolean;
  teacherRating: number;
  teacherExperience: number;
  teacherCoursesCount: number;
  courseType: string;
  country: string;
  hasVideoContent: boolean;
  hasResources: boolean;
  hasLiveSessions: boolean;
  hasIntroVideo: boolean;
  learningPoints: string[];
  createdAt: string;
  viewsCount: number;
  active: boolean;
}