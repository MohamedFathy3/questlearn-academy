import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Trophy, Award, Star, Medal, Crown, Users, BookOpen, CheckCircle, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface Student {
  id: number;
  name: string;
  email: string;
  image: string | null;
  total_courses: number;
  completed_courses: number;
  enrolled_courses: number;
  total_hours: number;
  points: number;
  total_rate: number;
  grade: {
    name: string;
  };
  stage: {
    name: string;
  };
  country: {
    name: string;
  };
}

interface ApiResponse {
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

const StudentsHonorBoard = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStudentsHonorBoardData(currentPage);

    // أنيميشن الظهور عند التمرير
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // لمرة واحدة فقط
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
  }, [currentPage]);

  const fetchStudentsHonorBoardData = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<ApiResponse>('/student/index', {
        method: 'POST',
        body: {
          filters: {},
          orderBy: "total_rate",
          orderByDirection: "desc",
          perPage: 4,
          paginate: true,
          page: page
        }
      });

      if (response.result === "Success" && response.data && response.data.length > 0) {
        setStudents(response.data);
        setTotalPages(response.meta?.last_page || 1);
        setTotalStudents(response.meta?.total || response.data.length);
      } else {
        // لو البيانات مش جاهزة، ممكن تستخدم بيانات مخزنة أو فارغة
        setStudents([]);
        setTotalPages(1);
        setTotalStudents(0);
      }
    } catch (err: any) {
      console.error('Error fetching students honor board:', err);
      setError(err.message || 'حدث خطأ أثناء تحميل البيانات');
      setStudents([]);
      setTotalPages(1);
      setTotalStudents(0);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400 animate-bounce" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600 animate-pulse" />;
      default:
        return <Trophy className="w-4 h-4 text-blue-500" />;
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/25';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 shadow-lg shadow-gray-400/25';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 shadow-lg shadow-amber-500/25';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg shadow-blue-500/25';
    }
  };

  const getDefaultAvatar = (student: Student) => {
    const avatars = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    ];
    return student.image || avatars[student.id % avatars.length];
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    // نحاول نزل الصفحة إلى القسم
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div ref={sectionRef} className="min-h-[500px] bg-gradient-to-b from-background to-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden text-center animate-pulse">
                <CardHeader className="pt-8">
                  <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto mb-4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <Skeleton className="h-12 rounded" />
                    <Skeleton className="h-12 rounded" />
                    <Skeleton className="h-12 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="min-h-[500px] bg-gradient-to-b from-background to-muted/30 py-16">
      <div className="container mx-auto px-4">
        {/* Header مع أنيميشن */}
        <div
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('studentsHonorBoard.topStudents', 'لوحة شرف الطلاب')}
            </h2>
            <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t(
              'studentsHonorBoard.subtitle',
              'تعرف على الطلاب المتفوقين والمتميزين في مسيرتهم التعليمية'
            )}
          </p>
        </div>

        {/* الطلاب */}
        {students.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>{t('studentsHonorBoard.noStudents', 'لا توجد بيانات للطلاب حالياً')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {students.map((student, index) => {
              const globalRank = (currentPage - 1) * 4 + index + 1;

              return (
                <Card
                  key={student.id}
                  className={`group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 shadow-lg relative overflow-hidden ${
                    isVisible
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-10 scale-95'
                  }`}
                  style={{
                    transitionDelay: `${index * 150}ms`
                  }}
                >
                  {/* خلفية التأثير عند الهوفّر */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* رتبة الطالب */}
                  <div
                    className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'} ${
                      getRankBgColor(globalRank)
                    } text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold z-10 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    {getRankIcon(globalRank)}
                    #{globalRank}
                  </div>

                  <CardHeader className="text-center pt-8 pb-4 relative z-10">
                    {/* الصورة (Avatar) */}
                    <div className="relative mx-auto mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                      <Avatar className="w-20 h-20 border-4 border-white shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative z-10">
                        <AvatarImage
                          src={getDefaultAvatar(student)}
                          alt={student.name}
                          className="transition-all duration-500 group-hover:brightness-110"
                        />
                        <AvatarFallback className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold transition-all duration-500 group-hover:scale-110">
                          {student.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <CardTitle className="text-lg transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-105">
                      {student.name}
                    </CardTitle>

                    <div className="flex flex-col gap-1 mt-2">
                      <Badge
                        variant="secondary"
                        className="mx-auto text-xs transition-all duration-300 group-hover:bg-blue-100 group-hover:text-blue-700 dark:group-hover:bg-blue-900/30"
                      >
                        {student.grade?.name || ''}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="mx-auto text-xs transition-all duration-300 group-hover:border-blue-300"
                      >
                        {student.country?.name || ''}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 relative z-10">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="transform transition-all duration-300 group-hover:scale-110">
                        <div className="text-xl font-bold text-primary flex flex-col items-center gap-1">
                          <BookOpen className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:text-blue-500" />
                          {student.total_courses}
                        </div>
                        <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
                          الكورسات
                        </div>
                      </div>

                      <div className="transform transition-all duration-300 group-hover:scale-110">
                        <div className="text-xl font-bold text-green-600 flex flex-col items-center gap-1">
                          <CheckCircle className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:text-green-500" />
                          {student.completed_courses}
                        </div>
                        <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
                          المكتملة
                        </div>
                      </div>

                      <div className="transform transition-all duration-300 group-hover:scale-110">
                        <div className="text-xl font-bold text-amber-600 flex flex-col items-center gap-1">
                          <Star className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:text-yellow-500" />
                          {student.total_rate}
                        </div>
                        <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
                          التقييم
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 dark:group-hover:border-blue-600 rounded-lg transition-all duration-500 pointer-events-none"></div>
                </Card>
              );
            })}
          </div>
        )}

        {error && (
          <div
            className={`text-center text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <p>ملاحظة: يتم عرض بيانات مخزنة - {error}</p>
          </div>
        )}

        {/* تأثير الجسيمات العائمة */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 1.5}s`,
                animationDuration: `${8 + i * 1}s`,
              }}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 relative z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={isArabic ? 'rotate-180' : ''}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  onClick={() => handlePageChange(pageNum)}
                  className={
                    currentPage === pageNum ? 'bg-tan text-white' : ''
                  }
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={isArabic ? 'rotate-180' : ''}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsHonorBoard;
