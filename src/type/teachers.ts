export interface Teacher {
  id: number;
  name: string;
  email: string;
  image: string | null;
  courses_count: number;
  students_count: number;
  total_income: number;
  commission: string;
  total_rate: number;
  total_rating: number;
  stage: {
    name: string;
  };
  subject: {
    name: string;
  };
  country: {
    name: string;
  };
  teacher_type?: 'male' | 'female';
}

export interface ApiResponse {
  result: string;
  data: Teacher[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  message: string;
  status: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalTeachers: number;
  from: number;
  to: number;
}

export interface FetchTeachersParams {
  page?: number;
  perPage?: number;
  orderBy?: string;
  orderByDirection?: 'asc' | 'desc';
}