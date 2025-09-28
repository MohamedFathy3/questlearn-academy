import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trophy, Award, Star, Medal, Crown, Users, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import Cookies from 'js-cookie';

interface Teacher {
  id: number;
  name: string;
  email: string;
  image: string | null;
  courses_count: number;
  students_count: number;
  total_income: number;
  commission: string;
  total_rate: number;
  total_rating: number;
  stage: {
    name: string;
  };
  subject: {
    name: string;
  };
  country: {
    name: string;
  };
}

interface ApiResponse {
  result: string;
  data: Teacher[];
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

const HonorBoard = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTeachers, setTotalTeachers] = useState(0);

  useEffect(() => {
    fetchHonorBoardData(currentPage);
  }, [currentPage]);

  const fetchHonorBoardData = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const token = Cookies.get("token");
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      // جلب البيانات الحقيقية من API مع الترتيب حسب إجمالي الكورسات والتقييمات
      const response = await apiFetch<ApiResponse>('/teacher/index', {
        method: 'POST',
        body: {
          filters: {},
          orderBy: "total_rate", // الترتيب حسب عدد الكورسات
          orderByDirection: "desc", // من الأعلى إلى الأقل
          perPage: 10,
          paginate: true,
          page: page
        }
      });

      if (response.result === "Success" && response.data) {
        // ترتيب البيانات حسب إجمالي الكورسات أولاً، ثم التقييمات
        const sortedTeachers = response.data.sort((a, b) => {
          // أولاً: الترتيب حسب عدد الكورسات (من الأعلى للأقل)
          if (b.courses_count !== a.courses_count) {
            return b.courses_count - a.courses_count;
          }
          // ثانياً: إذا تساوى عدد الكورسات، الترتيب حسب التقييمات
          return (b.total_rate || 0) - (a.total_rate || 0);
        });

        setTeachers(sortedTeachers);
        setTotalPages(response.meta?.last_page || 1);
        setTotalTeachers(response.meta?.total || sortedTeachers.length);
      } else {
        setError('No data available from API');
      }

    } catch (err: any) {
      console.error('Error fetching honor board:', err);
      setError(err.message || 'An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <Trophy className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  // الحصول على صورة افتراضية
  const getDefaultAvatar = (teacher: Teacher) => {
    const avatars = [
      'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    ];
    return teacher.image || avatars[teacher.id % avatars.length];
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="gradient-hero text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
        </div>
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden text-center">
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
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="gradient-hero text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t('honorBoard.title', 'Teachers Honor Board')}
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            {t('honorBoard.subtitle', 'Celebrating Teaching Excellence')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Results Info */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-muted-foreground">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalTeachers)} of {totalTeachers} teachers
          </p>
          <div className="text-sm text-muted-foreground">
            Sorted by: <strong>Total Courses</strong> & <strong>Ratings</strong>
          </div>
        </div>

        {/* Top Teachers Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient">
            {t('honorBoard.topTeachers', 'Top Performing Teachers')}
          </h2>
          
          {teachers.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>{t('honorBoard.noTeachers', 'No teachers data available')}</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {teachers.map((teacher, index) => {
                  const globalRank = ((currentPage - 1) * 10) + index + 1;
                  return (
                    <Card key={teacher.id} className="gradient-card shadow-medium course-card-hover relative overflow-hidden">
                      {/* Rank Badge */}
                      <div className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'} ${getRankBgColor(globalRank)} text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold`}>
                        {getRankIcon(globalRank)}
                        #{globalRank}
                      </div>
                      
                      <CardHeader className="text-center pt-8">
                        <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white shadow-lg">
                          <AvatarImage 
                            src={getDefaultAvatar(teacher)} 
                            alt={teacher.name} 
                          />
                          <AvatarFallback className="text-lg bg-tan text-white">
                            {teacher.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-lg">
                          {teacher.name}
                        </CardTitle>
                        <div className="flex flex-col gap-1">
                          <Badge variant="secondary" className="mx-auto text-xs">
                            {teacher.subject?.name || 'General'}
                          </Badge>
                          <Badge variant="outline" className="mx-auto text-xs">
                            {teacher.courses_count} Courses
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div>
                            <div className="text-xl font-bold text-primary flex flex-col items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {teacher.courses_count}
                            </div>
                            <div className="text-xs text-muted-foreground">Courses</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-accent flex flex-col items-center gap-1">
                              <Users className="w-4 h-4" />
                              {teacher.students_count}
                            </div>
                            <div className="text-xs text-muted-foreground">Students</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-success flex flex-col items-center gap-1">
                              <Star className="w-4 h-4" />
                              {teacher.total_rate ? teacher.total_rate.toFixed(1) : '0.0'}
                            </div>
                            <div className="text-xs text-muted-foreground">Rating</div>
                          </div>
                        </div>
                        
                        {/* Total Rating */}
                        {teacher.total_rating && (
                          <div className="text-center pt-2 border-t">
                            <div className="text-sm font-semibold text-muted-foreground">
                              Total Ratings: {teacher.total_rating}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={isArabic ? 'rotate-180' : ''}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        onClick={() => handlePageChange(pageNum)}
                        className={currentPage === pageNum ? "bg-tan text-white" : ""}
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
            </>
          )}
        </section>

        {/* Error Message */}
        {error && (
          <div className="text-center text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
            <p>Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HonorBoard;