import { apiFetch } from '@/lib/api';
import { Teacher, ApiResponse, FetchTeachersParams } from '@/type/teachers';

export class TeachersService {
  static async fetchTeachers(params: FetchTeachersParams = {}) {
    const {
      page = 1,
      perPage = 8,
      orderBy = "total_rate",
      orderByDirection = "desc"
    } = params;

    try {
      const response = await apiFetch<ApiResponse>('/teacher/index', {
        method: 'POST',
        body: {
          filters: {},
          orderBy,
          orderByDirection,
          perPage,
          paginate: true,
          page
        }
      });

      if (response.result === "Success" && response.data) {
        // ترتيب البيانات حسب إجمالي الكورسات أولاً، ثم التقييمات
        const sortedTeachers = response.data.sort((a, b) => {
          if (b.courses_count !== a.courses_count) {
            return b.courses_count - a.courses_count;
          }
          return (b.total_rate || 0) - (a.total_rate || 0);
        });

        return {
          teachers: sortedTeachers,
          pagination: {
            currentPage: response.meta?.current_page || 1,
            totalPages: response.meta?.last_page || 1,
            totalTeachers: response.meta?.total || sortedTeachers.length,
            from: response.meta?.from || 1,
            to: response.meta?.to || sortedTeachers.length
          },
          error: null
        };
      }

      throw new Error(response.message || 'Failed to fetch teachers');

    } catch (error: any) {
      console.error('Error fetching teachers:', error);
      
      return {
        teachers: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalTeachers: 0,
          from: 0,
          to: 0
        },
        error: error.message || 'حدث خطأ أثناء تحميل البيانات'
      };
    }
  }
}