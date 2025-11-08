import { useState, useEffect, useCallback } from "react";
import { Course, ApiResponse, TransformedCourse } from '@/type/courecses';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchCourses = useCallback(async (page = 1, loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch('/api/course/index', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          filters: { active: true },
          orderBy: "created_at",
          orderByDirection: "desc",
          perPage: 12,
          paginate: true,
          delete: false,
          page: page,
          include: ['teacher', 'subject', 'stage', 'country', 'details']
        })
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch courses');
      }

      if (data.result === "Success" && data.data) {
        const activeCourses = data.data.filter((course: Course) => course.active !== false);
        
        if (loadMore) {
          setCourses(prev => [...prev, ...activeCourses]);
        } else {
          setCourses(activeCourses);
        }
        
        setHasMore(data.meta.current_page < data.meta.last_page);
        setCurrentPage(data.meta.current_page);
      } else {
        setError(data.message || 'Failed to fetch courses');
      }
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'An error occurred while loading courses');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadMoreCourses = useCallback(() => {
    if (hasMore && !loadingMore) {
      fetchCourses(currentPage + 1, true);
    }
  }, [hasMore, loadingMore, currentPage, fetchCourses]);

  const refetchCourses = useCallback(() => {
    fetchCourses(1, false);
  }, [fetchCourses]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    loadingMore,
    currentPage,
    hasMore,
    fetchCourses: refetchCourses,
    loadMoreCourses
  };
};