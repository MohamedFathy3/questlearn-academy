import { apiFetch } from '@/lib/api';
import { Student, ApiResponse, FetchStudentsParams } from '@/type/students';

export class StudentsService {
  static async fetchStudents(params: FetchStudentsParams = {}) {
    const {
      page = 1,
      perPage = 8,
    //   orderBy = "",
      orderByDirection = "desc"
    } = params;

    try {
      const response = await apiFetch<ApiResponse>('/student/index', {
        method: 'POST',
        body: {
          filters: {},
        //   orderBy,
          orderByDirection,
          perPage,
          paginate: true,
          page
        }
      });

      if (response.result === "Success" && response.data) {
        // ترتيب الطلاب حسب عدد الكورسات أولاً، ثم التقييم
        const sortedStudents = response.data.sort((a, b) => {
          // عدد الكورسات أولاً
          if (b.courses.length !== a.courses.length) {
            return b.courses.length - a.courses.length;
          }
          // ثم التقييم
          return (b.average_rating || 0) - (a.average_rating || 0);
        });

        return {
          students: sortedStudents,
          pagination: {
            currentPage: response.meta?.current_page || 1,
            totalPages: response.meta?.last_page || 1,
            totalStudents: response.meta?.total || sortedStudents.length,
            from: response.meta?.from || 1,
            to: response.meta?.to || sortedStudents.length
          },
          error: null
        };
      }

      throw new Error(response.message || 'Failed to fetch students');

    } catch (error: any) {
      console.error('Error fetching students:', error);
      
      return {
        students: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalStudents: 0,
          from: 0,
          to: 0
        },
        error: error.message || 'حدث خطأ أثناء تحميل بيانات الطلاب'
      };
    }
  }
}