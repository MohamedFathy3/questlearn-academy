import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import CoursesFilters from '@/components/CoursesFilters';
import CoursesGrid from '@/components/CoursesGrid';
import { useCourses } from '@/hooks/useCourses';
import { useCourseFilters } from '@/hooks/useCourseFilters';

const CoursesView: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // UI State فقط
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // استخدام Custom Hooks
  const {
    courses,
    loading,
    error,
    loadingMore,
    hasMore,
    fetchCourses,
    loadMoreCourses
  } = useCourses();

  const {
    searchTerm,
    setSearchTerm,
    filters,
    filteredCourses,
    filterOptions,
    handleFilterChange,
    handleClearFilter,
    handleClearFilters
  } = useCourseFilters(courses);

  if (error && courses.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            <p>{t('common.error', 'Error')}: {error}</p>
            <Button onClick={fetchCourses} className="mt-4">
              {t('common.tryAgain', 'Try Again')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            {t('courses.title', 'All')} <span className="text-tan">{t('courses.courses', 'Courses')}</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('courses.discover', 'Discover thousands of courses across various categories')}
          </p>
        </div>

        {/* Filters Component */}
        <CoursesFilters
          filters={filters}
          searchTerm={searchTerm}
          viewMode={viewMode}
          showFilters={showFilters}
          categories={filterOptions.categories}
          teachers={filterOptions.teachers}
          levels={filterOptions.levels}
          priceRanges={filterOptions.priceRanges}
          onFilterChange={handleFilterChange}
          onSearchChange={setSearchTerm}
          onViewModeChange={setViewMode}
          onToggleFilters={() => setShowFilters(!showFilters)}
          onClearFilters={handleClearFilters}
          onClearFilter={handleClearFilter}
        />

        {/* Courses Grid Component */}
        <CoursesGrid
          courses={filteredCourses}
          viewMode={viewMode}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMoreCourses}
        />
      </div>
    </div>
  );
};

export default CoursesView;