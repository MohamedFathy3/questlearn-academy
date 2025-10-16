    import React, { useState, useEffect, useRef } from 'react';
    import { useTranslation } from 'react-i18next';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Badge } from '@/components/ui/badge';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { 
      Trophy, Award, Star, Medal, Crown, BookOpen, CheckCircle, Sparkles 
    } from 'lucide-react';
    import { apiFetch } from '@/lib/api';
    import { Skeleton } from '@/components/ui/skeleton';

    // Import Swiper styles
    import 'swiper/css';
    import 'swiper/css/navigation';
    import 'swiper/css/pagination';
    import { Swiper, SwiperSlide } from 'swiper/react';
    import { Navigation, Autoplay } from 'swiper/modules';

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
      average_rating: number;
      grade: {
        name: string;
        name_ar?: string;
      };
      stage: {
        name: string;
        name_ar?: string;
      };
      country: {
        name: string;
        name_ar?: string;
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

    const StudentsHonorBoardCarousel = () => {
      const { t, i18n } = useTranslation();
      const isArabic = i18n.language === 'ar';
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const [students, setStudents] = useState<Student[]>([]);
      const [isVisible, setIsVisible] = useState(false);
      const sectionRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        fetchStudentsHonorBoardData();

        // Scroll animation
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.unobserve(entry.target);
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

      const fetchStudentsHonorBoardData = async () => {
        try {
          setLoading(true);
          setError(null);

          const response = await apiFetch<ApiResponse>('/student/index', {
            method: 'POST',
            body: {
              filters: {},
              orderBy: "total_rate",
              orderByDirection: "desc",
              perPage: 5, // Get only top 5 students
              paginate: false, // No pagination
            }
          });

          if (response.result === "Success" && response.data && response.data.length > 0) {
            setStudents(response.data);
          } else {
            setStudents([]);
          }
        } catch (err: any) {
          console.error('Error fetching students honor board:', err);
          setError(err.message || t('common.error'));
          setStudents([]);
        } finally {
          setLoading(false);
        }
      };

      const getRankIcon = (rank: number) => {
        switch (rank) {
          case 1:
            return <Crown className="w-6 h-6 text-yellow-500 animate-pulse" />;
          case 2:
            return <Medal className="w-6 h-6 text-gray-400 animate-bounce" />;
          case 3:
            return <Award className="w-6 h-6 text-amber-600 animate-pulse" />;
          default:
            return <Trophy className="w-5 h-5 text-blue-500" />;
        }
      };

      const getRankBadge = (rank: number) => {
        switch (rank) {
          case 1:
            return "🥇";
          case 2:
            return "🥈";
          case 3:
            return "🥉";
          default:
            return "🏅";
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

      // دالة للحصول على الاسم بناءً على اللغة
      const getLocalizedName = (item: { name: string; name_ar?: string } | null | undefined) => {
        if (!item) return t('common.notSpecified', 'Not Specified');
        return isArabic && item.name_ar ? item.name_ar : item.name;
      };

      if (loading) {
        return (
          <div ref={sectionRef} className="min-h-[500px] bg-gradient-to-b from-background to-muted/30 py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <Skeleton className="h-12 w-64 mx-auto mb-4" />
                <Skeleton className="h-6 w-96 mx-auto" />
              </div>
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
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
          </div>
        );
      }

      return (
        <div 
          ref={sectionRef} 
          className="min-h-[500px] bg-gradient-to-b from-background to-muted/30 py-16"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <div className="container mx-auto px-4">
            {/* Header with animation */}
            <div
              className={`text-center mb-12 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="inline-flex items-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  {t('students.topStudents', 'Top Students')}
                </h2>
                <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t('students.honorBoard', 'Meet our top performing students')}
              </p>
            </div>

            {students.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>{t('students.noData', 'No students data available at the moment')}</p>
              </div>
            ) : (
              <div className={`max-w-6xl mx-auto transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={30}
                  slidesPerView={1}
                  navigation
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 1,
                      spaceBetween: 20,
                    },
                    768: {
                      slidesPerView: 2,
                      spaceBetween: 30,
                    },
                    1024: {
                      slidesPerView: 3,
                      spaceBetween: 30,
                    },
                  }}
                  className="students-swiper"
                  dir={isArabic ? 'rtl' : 'ltr'}
                >
                  {students.map((student, index) => {
                    const rank = index + 1;
                    
                    return (
                      <SwiperSlide key={student.id}>
                        <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 shadow-lg relative overflow-hidden h-full">
                          {/* Rank Badge */}
                          <div className={`absolute -top-2 z-20 ${isArabic ? '-left-2' : '-right-2'}`}>
                            <div className={`${getRankBgColor(rank)} text-white px-4 py-2 rounded-full flex items-center gap-2 text-lg font-bold transform rotate-12 shadow-2xl`}>
                              <span className="text-xl">{getRankBadge(rank)}</span>
                              <span>#{rank}</span>
                            </div>
                          </div>

                          {/* Background effect on hover */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                          <CardHeader className="text-center pt-12 pb-4 relative z-10">
                            {/* Avatar */}
                            <div className="relative mx-auto mb-4">
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                              <Avatar className="w-24 h-24 border-4 border-white shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative z-10">
                                <AvatarImage
                                  src={getDefaultAvatar(student)}
                                  alt={student.name}
                                  className="transition-all duration-500 group-hover:brightness-110"
                                />
                                <AvatarFallback className="text-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                                  {student.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </AvatarFallback>
                              </Avatar>
                            </div>

                            <CardTitle className="text-xl transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-105">
                              {student.name}
                            </CardTitle>

                            {/* Grade and Country */}
                            <div className="flex flex-col gap-2 mt-3">
                              <Badge
                                variant="secondary"
                                className="mx-auto text-sm transition-all duration-300 group-hover:bg-blue-100 group-hover:text-blue-700 dark:group-hover:bg-blue-900/30"
                              >
                                📚 {getLocalizedName(student.grade)}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="mx-auto text-sm transition-all duration-300 group-hover:border-blue-300"
                              >
                                🌍 {getLocalizedName(student.country)}
                              </Badge>
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-4 relative z-10 pb-8">
                            {/* Statistics */}
                            <div className="grid grid-cols-3 gap-4 text-center">
                              {/* Total Courses */}
                              <div className="transform transition-all duration-300 group-hover:scale-110">
                                <div className="text-lg font-bold text-primary flex flex-col items-center gap-1">
                                  <BookOpen className="w-5 h-5 transition-all duration-300 group-hover:scale-125 group-hover:text-blue-500" />
                                  {student.total_courses}
                                </div>
                                <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
                                  {t('students.totalCourses', 'Courses')}
                                </div>
                              </div>

                              {/* Completed Courses */}
                              <div className="transform transition-all duration-300 group-hover:scale-110">
                                <div className="text-lg font-bold text-green-600 flex flex-col items-center gap-1">
                                  <CheckCircle className="w-5 h-5 transition-all duration-300 group-hover:scale-125 group-hover:text-green-500" />
                                  {student.completed_courses}
                                </div>
                                <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
                                  {t('students.completed', 'Completed')}
                                </div>
                              </div>

                              {/* Rating */}
                              <div className="transform transition-all duration-300 group-hover:scale-110">
                                <div className="text-lg font-bold text-amber-600 flex flex-col items-center gap-1">
                                  <Star className="w-5 h-5 transition-all duration-300 group-hover:scale-125 group-hover:text-yellow-500" />
                                  {student.average_rating}
                                </div>
                                <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
                                  {t('students.rating', 'Rating')}
                                </div>
                              </div>
                            </div>

                            {/* Success Rate */}
                            <div className="bg-muted/50 rounded-lg p-3 mt-4">
                              <div className="text-center">
                                <div className="text-sm font-semibold text-foreground mb-1">
                                  {t('students.successRate', 'Success Rate')}
                                </div>
                                <div className="text-2xl font-bold text-green-600">
                                  {student.average_rating > 0 ? Math.min(100, student.total_rate * 20) : 0}%
                                </div>
                              </div>
                            </div>
                          </CardContent>

                          <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 dark:group-hover:border-blue-600 rounded-lg transition-all duration-500 pointer-events-none"></div>
                        </Card>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            )}

            {error && (
              <div className="text-center text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-8">
                <p>{t('common.note', 'Note')}: {t('students.usingCachedData', 'Using cached data')} - {error}</p>
              </div>
            )}
          </div>

          {/* CSS for navigation arrows */}
          <style jsx>{`
            .students-swiper {
              padding: 20px 10px;
            }
            .students-swiper :global(.swiper-button-next),
            .students-swiper :global(.swiper-button-prev) {
              color: rgb(59 130 246);
              background: white;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            .students-swiper :global(.swiper-button-next:after),
            .students-swiper :global(.swiper-button-prev:after) {
              font-size: 18px;
              font-weight: bold;
            }
            
            /* RTL support for Swiper */
            .students-swiper[dir="rtl"] :global(.swiper-button-next) {
              left: 10px;
              right: auto;
            }
            .students-swiper[dir="rtl"] :global(.swiper-button-prev) {
              right: 10px;
              left: auto;
            }
          `}</style>
        </div>
      );
    };

    export default StudentsHonorBoardCarousel;