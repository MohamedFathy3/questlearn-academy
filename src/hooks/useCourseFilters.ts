import { useState, useMemo, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { Course, Filters, TransformedCourse } from '@/type/courecses';
import { transformCourseData } from '@/utils/courseTransformers';

export const useCourseFilters = (courses: Course[]) => {
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    category: "",
    level: "",
    price: "",
    teacher: "",
    sort: "popular"
  });

  // Transform courses data
  const transformedCourses = useMemo(() => {
    return courses.map(transformCourseData);
  }, [courses]);

  // Apply filters and search
  const filteredCourses = useMemo(() => {
    let filtered = [...transformedCourses];

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(course =>
        course.title?.toLowerCase().includes(searchLower) ||
        course.description?.toLowerCase().includes(searchLower) ||
        course.instructor?.toLowerCase().includes(searchLower) ||
        course.category?.toLowerCase().includes(searchLower) ||
        course.subject?.toLowerCase().includes(searchLower) ||
        course.stage?.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(course =>
        course.category?.toLowerCase() === filters.category.toLowerCase() ||
        course.subject?.toLowerCase() === filters.category.toLowerCase() ||
        course.stage?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Level filter
    if (filters.level) {
      filtered = filtered.filter(course =>
        course.level?.toLowerCase() === filters.level.toLowerCase()
      );
    }

    // Price filter
    if (filters.price) {
      filtered = filtered.filter(course => {
        if (filters.price === 'free') return course.isFree;
        if (filters.price === '$0-$50') return !course.isFree && course.price > 0 && course.price <= 50;
        if (filters.price === '$50-$100') return !course.isFree && course.price > 50 && course.price <= 100;
        if (filters.price === '$100+') return !course.isFree && course.price > 100;
        return true;
      });
    }

    // Teacher filter
    if (filters.teacher) {
      filtered = filtered.filter(course =>
        course.instructor?.toLowerCase().includes(filters.teacher.toLowerCase())
      );
    }

    // Sort filter
    if (filters.sort) {
      filtered.sort((a, b) => {
        switch (filters.sort) {
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'rating':
            return b.rating - a.rating;
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'popular':
          default:
            return b.studentsCount - a.studentsCount;
        }
      });
    }

    return filtered;
  }, [transformedCourses, searchTerm, filters]);

  // Filter options
  const filterOptions = useMemo(() => {
    const categories = courses
      .map(course => course.subject?.name || course.stage?.name)
      .filter(Boolean)
      .filter((name): name is string => typeof name === 'string');
    
    const teachers = courses
      .map(course => course.teacher?.name)
      .filter(Boolean)
      .filter((name): name is string => typeof name === 'string');

    return {
      categories: [t('courses.allCategories', 'All Categories'), ...Array.from(new Set(categories))],
      teachers: [t('courses.allTeachers', 'All Teachers'), ...Array.from(new Set(teachers))],
      levels: [
        t('courses.allLevels', 'All Levels'), 
        t('courses.beginner', 'Beginner'), 
        t('courses.intermediate', 'Intermediate'), 
        t('courses.advanced', 'Advanced')
      ],
      priceRanges: [
        t('courses.allPrices', 'All Prices'), 
        t('courses.free', 'Free'), 
        "$0-$50", 
        "$50-$100", 
        "$100+"
      ]
    };
  }, [courses, t]);

  // Event handlers
  const handleFilterChange = useCallback((key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleClearFilter = useCallback((key: keyof Filters) => {
    setFilters(prev => ({ ...prev, [key]: '' }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      category: "",
      level: "",
      price: "",
      teacher: "",
      sort: "popular"
    });
    setSearchTerm("");
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    filteredCourses,
    filterOptions,
    handleFilterChange,
    handleClearFilter,
    handleClearFilters
  };
};