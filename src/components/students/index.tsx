import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Trophy } from 'lucide-react';
import { StudentsService } from '@/lib/students/actions';
import { StudentsGrid } from './students-grid';
import { Pagination } from '@/components/teachers/pagination';
import { Student, PaginationInfo } from '@/type/students';

const StudentsHonorBoard = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalStudents: 0,
    from: 0,
    to: 0
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStudentsData(pagination.currentPage);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const fetchStudentsData = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const result = await StudentsService.fetchStudents({
        page,
        perPage: 8,
        orderBy: "average_rating",
        orderByDirection: "desc"
      });

      setStudents(result.students);
      setPagination(result.pagination);
      setError(result.error);

    } catch (err: any) {
      console.error('Error in fetchStudentsData:', err);
      setError(err.message || 'حدث خطأ أثناء تحميل بيانات الطلاب');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
    fetchStudentsData(newPage);
    window.scrollTo({ top: sectionRef.current?.offsetTop || 0, behavior: 'smooth' });
  };

  return (
    <div ref={sectionRef} className="min-h-[500px] bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 mt-12">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-green-500 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('students.title', 'الطلاب المتميزين')}
            </h1>
            <Sparkles className="w-8 h-8 text-green-500 animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('students.subtitle', 'تعرف على طلابنا الأكثر تفوقاً وتميزاً')}
          </p>
        </div>

        {/* Results Info */}
        <div className={`flex justify-between items-center mb-8 transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <p className="text-muted-foreground text-sm">
            {t('common.showing', 'عرض')} {pagination.from} {t('common.to', 'إلى')} {pagination.to} {t('common.of', 'من')} {pagination.totalStudents} {t('students.title', 'طالب')}
          </p>
          <div className="text-sm text-muted-foreground">
            {t('common.sortedBy', 'مرتب حسب')}: <strong>{t('students.courses', 'الكورسات')}</strong> & <strong>{t('students.rating', 'التقييم')}</strong>
          </div>
        </div>

        {/* Students Grid */}
        <StudentsGrid
          students={students}
          pagination={pagination}
          loading={loading}
          isVisible={isVisible}
          currentPage={pagination.currentPage}
        />

        {/* Pagination */}
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          isVisible={isVisible}
        />

        {/* Error Message */}
        {error && (
          <div className={`text-center text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <p>{t('common.error', 'خطأ')}: {error}</p>
          </div>
        )}

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: `${8 + i * 1}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentsHonorBoard;