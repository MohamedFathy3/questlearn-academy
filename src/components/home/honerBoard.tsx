import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trophy, Award, Star, Medal, Crown, Users, BookOpen, ChevronLeft, ChevronRight, Sparkles, MapPin, GraduationCap } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

interface Teacher {
  id: number;
  name: string;
  email: string;
  image: string | null;
  courses_count: number;
  students_count: number;
  total_income: number;
  commission: string;
  teacher_type: 'male' | 'female';
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
    image: string;
  };
  courses: Array<{
    course_name: string;
    students_count: number;
    course_income: number;
    teacher_share: number;
  }>;
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
  const navigate = useNavigate();
  const isArabic = i18n.language === 'ar';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  
  // استخدام key علشان نعمل force re-render عند تغيير اللغة
  const [swiperKey, setSwiperKey] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHonorBoardData();

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
  }, []);

  // إعادة تحميل السوايبر عند تغيير اللغة
  useEffect(() => {
    setSwiperKey(prev => prev + 1);
  }, [i18n.language]);

  const fetchHonorBoardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<ApiResponse>('/teacher/index', {
        method: 'POST',
        body: {
          filters: {},
          orderBy: "total_rate",
          orderByDirection: "desc",
          perPage: 10,
          paginate: false,
        }
      });

      if (response.result === "Success" && response.data && response.data.length > 0) {
        const sortedTeachers = response.data.sort((a, b) => {
          if (b.courses_count !== a.courses_count) {
            return b.courses_count - a.courses_count;
          }
          return (b.total_rate || 0) - (a.total_rate || 0);
        });

        setTeachers(sortedTeachers);
      } else {
        setTeachers([]);
      }
    } catch (err: any) {
      console.error('Error fetching honor board:', err);
      setError(err.message || t('common.error'));
      setTeachers([]);
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

  const getLocalizedTeacherType = (teacherType: string) => {
    switch (teacherType) {
      case 'male':
        return t('teachers.male', 'المعلم');
      case 'female':
        return t('teachers.female', 'المعلمة');
      default:
        return t('teachers.teacher', 'المعلم');
    }
  };

  // دالة لاستخراج المواد الفريدة من الكورسات
  const getUniqueSubjects = (teacher: Teacher) => {
    if (!teacher.courses || teacher.courses.length === 0) {
      return [t('teachers.noSubjects', 'لا توجد مواد')];
    }
    
    // استخراج المواد من أسماء الكورسات (يمكن تعديل هذا المنطق حسب هيكل البيانات الفعلي)
    const subjects = teacher.courses.map(course => {
      // يمكنك تعديل هذا المنطق بناءً على كيفية تخزين اسم المادة
      return course.course_name.split(' ')[0] || course.course_name;
    });
    
    // إرجاع المواد الفريدة فقط
    return [...new Set(subjects)].slice(0, 3); // الحد الأقصى 3 مواد
  };

  const handleTeacherClick = (teacherId: number) => {
    navigate(`/profileTeacher/${teacherId}`);
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
    >
      <div className="container mx-auto px-4">
        {/* Header with animation */}
        <div className={`text-center mb-12 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('teachers.title', 'المعلمين المتميزين')}
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('teachers.subtitle', 'تعرف على معلمينا الأكثر تفوقاً وإبداعاً')}
          </p>
        </div>

        {teachers.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>{t('teachers.noData', 'لا توجد بيانات للمعلمين حالياً')}</p>
          </div>
        ) : (
          <div className={`max-w-6xl mx-auto transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {/* استخدام key علشان نعمل force re-render */}
            <Swiper
              key={swiperKey}
              modules={[Autoplay]}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              slidesPerView={1}
              spaceBetween={30}
              loop={teachers.length > 3}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 25,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
                1280: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
              className="pb-8"
            >
              {teachers.map((teacher, index) => {
                const rank = index + 1;
                const subjects = getUniqueSubjects(teacher);
                
                return (
                  <SwiperSlide key={teacher.id}>
                    <Card 
                      className="group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 shadow-lg relative overflow-hidden h-full mx-2"
                      onClick={() => handleTeacherClick(teacher.id)}
                    >
                      {/* Rank Badge */}
                      <div className={`absolute -top-2 -right-2 z-20`}>
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
                              src={getDefaultAvatar(teacher)}
                              alt={teacher.name}
                              className="transition-all duration-500 group-hover:brightness-110"
                            />
                            <AvatarFallback className="text-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold">
                              {teacher.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <CardTitle className="text-xl transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-105">
                          {getLocalizedTeacherType(teacher.teacher_type)} {teacher.name}
                        </CardTitle>

                        {/* Country */}
                        {teacher.country && (
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {teacher.country.name}
                            </span>
                          </div>
                        )}

                        {/* Subjects */}
                        <div className="flex flex-wrap justify-center gap-2 mt-3">
                          {subjects.map((subject, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs transition-all duration-300 group-hover:bg-green-100 group-hover:text-green-700 dark:group-hover:bg-green-900/30"
                            >
                              <GraduationCap className="w-3 h-3 mr-1" />
                              {subject}
                            </Badge>
                          ))}
                        </div>

                        {/* Courses Count */}
                        <Badge
                          variant="outline"
                          className="mx-auto mt-2 text-sm transition-all duration-300 group-hover:border-blue-300"
                        >
                          🎓 {teacher.courses_count} {t('teachers.courses', 'Courses')}
                        </Badge>
                      </CardHeader>

                      <CardContent className="space-y-4 relative z-10 pb-8">
                        {/* Statistics */}
                        <div className="grid grid-cols-3 gap-4 text-center">
                          {/* Courses Count */}
                          <div className="transform transition-all duration-300 group-hover:scale-110">
                            <div className="text-lg font-bold text-primary flex flex-col items-center gap-1">
                              <BookOpen className="w-5 h-5 transition-all duration-300 group-hover:scale-125 group-hover:text-blue-500" />
                              {teacher.courses_count}
                            </div>
                            <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
                              {t('teachers.courses', 'Courses')}
                            </div>
                          </div>

                          {/* Students Count */}
                          <div className="transform transition-all duration-300 group-hover:scale-110">
                            <div className="text-lg font-bold text-green-600 flex flex-col items-center gap-1">
                              <Users className="w-5 h-5 transition-all duration-300 group-hover:scale-125 group-hover:text-green-500" />
                              {teacher.students_count || 0}
                            </div>
                            <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
                              {t('teachers.students', 'Students')}
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="transform transition-all duration-300 group-hover:scale-110">
                            <div className="text-lg font-bold text-amber-600 flex flex-col items-center gap-1">
                              <Star className="w-5 h-5 transition-all duration-300 group-hover:scale-125 group-hover:text-yellow-500" />
                              {teacher.total_rate ? teacher.total_rate.toFixed(1) : '0.0'}
                            </div>
                            <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
                              {t('teachers.rating', 'Rating')}
                            </div>
                          </div>
                        </div>

                        {/* Country Flag and Experience */}
                        <div className="bg-muted/50 rounded-lg p-3 mt-4">
                          <div className="flex items-center justify-between">
                            {teacher.country && (
                              <div className="flex items-center gap-2">
                                <img 
                                  src={teacher.country.image} 
                                  alt={teacher.country.name}
                                  className="w-6 h-4 rounded-sm object-cover"
                                />
                                <span className="text-sm font-medium">
                                  {teacher.country.name}
                                </span>
                              </div>
                            )}
                            <div className="text-right">
                              <div className="text-sm font-semibold text-foreground">
                                {t('teachers.experience', 'Experience')}
                              </div>
                              <div className="text-lg font-bold text-green-600">
                                {teacher.courses_count}+
                              </div>
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
            <p>{t('common.note', 'Note')}: {t('teachers.usingCachedData', 'Using cached data')} - {error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HonorBoard;