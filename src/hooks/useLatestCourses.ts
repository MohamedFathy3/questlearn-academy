import { useState, useEffect, useCallback } from "react";
import { Course, ApiResponse } from '@/type/courecses';

// Hook مخصص للـ LatestCourses علشان يجيب 8 كورسات فقط
export const useLatestCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/course/index', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          filters: { active: true },
          orderBy: "created_at", // أحدث الكورسات أولاً
          orderByDirection: "desc",
          perPage: 8, // ✅ 8 كورسات فقط
          paginate: false, // ✅ بدون pagination
          delete: false,
          include: ['teacher', 'subject', 'stage', 'country', 'details']
        })
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch courses');
      }

      if (data.result === "Success" && data.data) {
        const activeCourses = data.data.filter((course: Course) => course.active !== false);
        setCourses(activeCourses);
      } else {
        setError(data.message || 'Failed to fetch courses');
      }
    } catch (err: any) {
      console.error('Error fetching latest courses:', err);
      setError(err.message || 'An error occurred while loading courses');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchCourses = useCallback(() => {
    fetchLatestCourses();
  }, [fetchLatestCourses]);

  useEffect(() => {
    fetchLatestCourses();
  }, [fetchLatestCourses]);

  return {
    courses,
    loading,
    error,
    fetchCourses: refetchCourses
    // ✅ مش محتاج loadingMore, hasMore, currentPage علشان مش بنعمل load more
  };
};