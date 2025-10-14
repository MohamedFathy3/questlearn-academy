import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trophy, Award, Star, Medal, Crown, Users, BookOpen, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
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
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHonorBoardData(currentPage);
    
    // Scroll animation
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
  }, [currentPage]);

  const fetchHonorBoardData = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch data from API without token
      try {
        const response = await apiFetch<ApiResponse>('/teacher/index', {
          method: 'POST',
          body: {
            filters: {},
            orderBy: "total_rate",
            orderByDirection: "desc",
            perPage: 8,
            paginate: true,
            page: page
          }
        });

        if (response.result === "Success" && response.data && response.data.length > 0) {
          // Sort data by total courses first, then ratings
          const sortedTeachers = response.data.sort((a, b) => {
            if (b.courses_count !== a.courses_count) {
              return b.courses_count - a.courses_count;
            }
            return (b.total_rate || 0) - (a.total_rate || 0);
          });

          setTeachers(sortedTeachers);
          setTotalPages(response.meta?.last_page || 1);
          setTotalTeachers(response.meta?.total || sortedTeachers.length);
          return;
        }
      } catch (apiError) {
        console.log('API not available, using cached data');
      }

      // Use cached data if API is not available
      const startIndex = (page - 1) * 8;
      const paginatedTeachers = cachedTeachers.slice(startIndex, startIndex + 8);
      setTeachers(paginatedTeachers);
      setTotalPages(Math.ceil(cachedTeachers.length / 8));
      setTotalTeachers(cachedTeachers.length);

    } catch (err: any) {
      console.error('Error fetching honor board:', err);
      setError(err.message || t('common.error'));
      
      // Use cached data in case of error
      const startIndex = (currentPage - 1) * 8;
      const paginatedTeachers = cachedTeachers.slice(startIndex, startIndex + 8);
      setTeachers(paginatedTeachers);
      setTotalPages(Math.ceil(cachedTeachers.length / 8));
      setTotalTeachers(cachedTeachers.length);
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

  // Get default avatar
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
    window.scrollTo({ top: sectionRef.current?.offsetTop || 0, behavior: 'smooth' });
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
            {[...Array(8)].map((_, i) => (
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
        {/* Header with animation */}
        <div className={`text-center mb-12 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('teachers.title')}
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('teachers.subtitle')}
          </p>
        </div>

        {/* Results Info */}
        <div className={`flex justify-between items-center mb-8 transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <p className="text-muted-foreground text-sm">
            {t('common.showing')} {((currentPage - 1) * 8) + 1} {t('common.to')} {Math.min(currentPage * 8, totalTeachers)} {t('common.of')} {totalTeachers} {t('teachers.teacher')}
          </p>
          <div className="text-sm text-muted-foreground">
            {t('common.sortedBy')}: <strong>{t('teachers.courses')}</strong> & <strong>{t('teachers.rating')}</strong>
          </div>
        </div>

        {/* Teachers Grid with animation */}
        {teachers.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>{t('teachers.noData', 'No teachers data available at the moment')}</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {teachers.map((teacher, index) => {
                const globalRank = ((currentPage - 1) * 8) + index + 1;
                
                return (
                  <Card 
                    key={teacher.id} 
                    className={`group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 shadow-lg relative overflow-hidden transform ${
                      isVisible 
                        ? 'opacity-100 translate-y-0 scale-100' 
                        : 'opacity-0 translate-y-10 scale-95'
                    }`}
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Rank Badge with animation */}
                    <div className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'} ${
                      getRankBgColor(globalRank)
                    } text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold z-10 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                      {getRankIcon(globalRank)}
                      #{globalRank}
                    </div>
                    
                    <CardHeader className="text-center pt-8 pb-4 relative z-10">
                      {/* Avatar with animation */}
                      <div className="relative mx-auto mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                        <Avatar className="w-20 h-20 border-4 border-white shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative z-10">
                          <AvatarImage 
                            src={getDefaultAvatar(teacher)} 
                            alt={teacher.name}
                            className="transition-all duration-500 group-hover:brightness-110"
                          />
                          <AvatarFallback className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold transition-all duration-500 group-hover:scale-110">
                            {teacher.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <CardTitle className="text-lg transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-105">
                        {teacher.name}
                      </CardTitle>
                      
                      <div className="flex flex-col gap-1 mt-2">
                        <Badge 
                          variant="secondary" 
                          className="mx-auto text-xs transition-all duration-300 group-hover:bg-blue-100 group-hover:text-blue-700 dark:group-hover:bg-blue-900/30"
                        >
                          {teacher.subject?.name || t('common.general', 'General')}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="mx-auto text-xs transition-all duration-300 group-hover:border-blue-300"
                        >
                          {teacher.courses_count} {t('teachers.courses')}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 relative z-10">
                      {/* Teacher Stats with animation */}
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="transform transition-all duration-300 group-hover:scale-110">
                          <div className="text-xl font-bold text-primary flex flex-col items-center gap-1">
                            <BookOpen className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:text-blue-500" />
                            {teacher.courses_count}
                          </div>
                          <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
                            {t('teachers.courses')}
                          </div>
                        </div>
                        
                        <div className="transform transition-all duration-300 group-hover:scale-110">
                          <div className="text-xl font-bold text-green-600 flex flex-col items-center gap-1">
                            <Users className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:text-green-500" />
                            {teacher.students_count || 0}
                          </div>
                          <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
                            {t('teachers.students')}
                          </div>
                        </div>
                        
                        <div className="transform transition-all duration-300 group-hover:scale-110">
                          <div className="text-xl font-bold text-amber-600 flex flex-col items-center gap-1">
                            <Star className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:text-yellow-500" />
                            {teacher.total_rate ? teacher.total_rate.toFixed(1) : '0.0'}
                          </div>
                          <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
                            {t('teachers.rating')}
                          </div>
                        </div>
                      </div>
                      
                      {/* Total Rating */}
                      {teacher.total_rating && (
                        <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-sm font-semibold text-muted-foreground transition-all duration-300 group-hover:text-foreground">
                            {t('teachers.totalRatings', 'Total Ratings')}: {teacher.total_rating}
                          </div>
                        </div>
                      )}
                    </CardContent>

                    {/* Hover effect */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 dark:group-hover:border-blue-600 rounded-lg transition-all duration-500 pointer-events-none"></div>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={`flex justify-center items-center gap-2 mt-8 transition-all duration-700 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  {t('common.previous')}
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  {t('common.next')}
                  {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Error Message */}
        {error && (
          <div className={`text-center text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <p>{t('common.error')}: {error}</p>
          </div>
        )}

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float"
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

// Cached teachers data for fallback
const cachedTeachers: Teacher[] = [
  // This would be your fallback data
];

export default HonorBoard;