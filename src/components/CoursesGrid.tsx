import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Search } from "lucide-react";
import { useTranslation } from 'react-i18next';
import CourseCard from "@/components/CourseCard";
import { TransformedCourse } from '@/type/courecses';

interface CoursesGridProps {
  courses: TransformedCourse[];
  viewMode: "grid" | "list";
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

const CoursesGrid: React.FC<CoursesGridProps> = ({
  courses,
  viewMode,
  loading,
  loadingMore,
  hasMore,
  onLoadMore
}) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-tan" />
        <span className="ml-2">{t('common.loading', 'Loading courses...')}</span>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">{t('courses.noCoursesFound', 'No courses found')}</h3>
          <p>{t('courses.adjustFilters', 'Try adjusting your filters or search terms')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          {t('courses.showingResults', 'Showing')} <span className="font-semibold text-foreground">{courses.length}</span> {t('courses.results', 'results')}
        </p>
      </div>

      <Separator className="mb-8" />

      {/* Courses Grid */}
      <div className={`grid gap-6 ${
        viewMode === "grid" 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "grid-cols-1"
      }`}>
        {courses.map((course) => (
          <CourseCard 
            key={course.id} 
            {...course}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('common.loading', 'Loading...')}
              </>
            ) : (
              t('courses.loadMore', 'Load More Courses')
            )}
          </Button>
        </div>
      )}
    </>
  );
};

export default CoursesGrid;