import { useState, useMemo, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { Course } from '@/type/courecses';
import { TransformedCourse } from '@/type/LatestCourses.types';

// ✅ تصحيح الـ interface للـ Filters
export interface Filters {
  category: string;
  level: string;
  price: string;
  teacher: string;
  sort: string;
}

export const useCourseFilters = (courses: TransformedCourse[]) => {
  const { t } = useTranslation();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({
    category: "",
    level: "",
    price: "",
    teacher: "",
    sort: "popular"
  });

  // ✅ تأكد أن الـ courses هي TransformedCourse[]
  const transformedCourses = courses;

  // ✅ تطبيق الفلاتر والبحث
  const filteredCourses = useMemo(() => {
    let filtered = [...transformedCourses];

    // البحث
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(course =>
        course.title?.toLowerCase().includes(searchLower) ||
        course.teacher?.name?.toLowerCase().includes(searchLower) ||
        course.category?.toLowerCase().includes(searchLower)
      );
    }

    // فلترة الفئة
    if (filters.category) {
      filtered = filtered.filter(course =>
        course.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // فلترة المستوى
    if (filters.level) {
      filtered = filtered.filter(course =>
        course.level?.toLowerCase() === filters.level.toLowerCase()
      );
    }

    // فلترة السعر
    if (filters.price) {
      filtered = filtered.filter(course => {
        if (filters.price === 'free') return course.price === 0;
        if (filters.price === '$0-$50') return course.price > 0 && course.price <= 50;
        if (filters.price === '$50-$100') return course.price > 50 && course.price <= 100;
        if (filters.price === '$100+') return course.price > 100;
        return true;
      });
    }

    // فلترة المعلم
    if (filters.teacher) {
      filtered = filtered.filter(course =>
        course.teacher?.name?.toLowerCase().includes(filters.teacher.toLowerCase())
      );
    }

    // الترتيب
    if (filters.sort) {
      filtered.sort((a, b) => {
        switch (filters.sort) {
          case 'newest':
            return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
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

    console.log('🔍 Filtered courses count:', filtered.length);
    
    return filtered;
  }, [transformedCourses, searchTerm, filters]);

  // ✅ خيارات الفلاتر
  const filterOptions = useMemo(() => {
    const categories = courses
      .map(course => course.category)
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

  // ✅ معالجات الأحداث
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