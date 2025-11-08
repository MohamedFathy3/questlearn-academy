export interface Student {
  id: number;
  name: string;
  email: string;
  image: string | null;
  phone: string | null;
  type: string;
  qr_code: string;
  birth_day: string | null;
  stage: {
    id: number;
    name: string;
    postion: number;
    active: boolean;
    image: string;
    country: {
      id: number;
      name: string;
      key: string;
      code: string;
      active: boolean;
      image: string;
    };
  } | null;
  country: {
    id: number;
    name: string;
    key: string;
    code: string;
    active: boolean;
    image: string;
  } | null;
  courses: Array<{
    id: number;
    title: string;
    description: string;
    type: string;
    price: string;
    image: string;
    teacher: {
      id: number;
      name: string;
      email: string;
      image: string;
    };
    stage: {
      id: number;
      name: string;
    };
    subject: {
      id: number;
      name: string;
    };
    average_rating: number;
  }>;
  average_rating: number;
}

export interface ApiResponse {
  result: string;
  data: Student[];
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
  totalStudents: number;
  from: number;
  to: number;
}

export interface FetchStudentsParams {
  page?: number;
  perPage?: number;
  orderBy?: string;
  orderByDirection?: 'asc' | 'desc';
}