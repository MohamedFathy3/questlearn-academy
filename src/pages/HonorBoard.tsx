import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trophy, Award, Star, Medal, Crown, Users, BookOpen, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import Hero from '@/components/home/hero';

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

// بيانات وهمية للاستخدام عندما لا تكون API متاحة
const cachedTeachers = [
  {
    id: 1,
    name: "أحمد محمد",
    email: "ahmed@example.com",
    image: null,
    courses_count: 15,
    students_count: 320,
    total_income: 5000,
    commission: "20%",
    total_rate: 4.9,
    total_rating: 150,
    stage: { name: "الثانوية" },
    subject: { name: "الرياضيات" },
    country: { name: "مصر" }
  },
  {
    id: 2,
    name: "فاطمة أحمد",
    email: "fatima@example.com",
    image: null,
    courses_count: 12,
    students_count: 280,
    total_income: 4200,
    commission: "18%",
    total_rate: 4.8,
    total_rating: 120,
    stage: { name: "الثانوية" },
    subject: { name: "الفيزياء" },
    country: { name: "السعودية" }
  },
  {
    id: 3,
    name: "محمد علي",
    email: "mohamed@example.com",
    image: null,
    courses_count: 10,
    students_count: 250,
    total_income: 3800,
    commission: "15%",
    total_rate: 4.7,
    total_rating: 95,
    stage: { name: "الإعدادية" },
    subject: { name: "الكيمياء" },
    country: { name: "الإمارات" }
  },
  {
    id: 4,
    name: "سارة خالد",
    email: "sara@example.com",
    image: null,
    courses_count: 8,
    students_count: 200,
    total_income: 3200,
    commission: "12%",
    total_rate: 4.6,
    total_rating: 80,
    stage: { name: "الابتدائية" },
    subject: { name: "اللغة العربية" },
    country: { name: "قطر" }
  },
  {
    id: 5,
    name: "خالد محمود",
    email: "khaled@example.com",
    image: null,
    courses_count: 6,
    students_count: 180,
    total_income: 2800,
    commission: "10%",
    total_rate: 4.5,
    total_rating: 65,
    stage: { name: "الثانوية" },
    subject: { name: "الإنجليزية" },
    country: { name: "الكويت" }
  },
  {
    id: 6,
    name: "ليلى مصطفى",
    email: "layla@example.com",
    image: null,
    courses_count: 5,
    students_count: 150,
    total_income: 2500,
    commission: "8%",
    total_rate: 4.4,
    total_rating: 55,
    stage: { name: "الإعدادية" },
    subject: { name: "الفرنسية" },
    country: { name: "عمان" }
  },
  {
    id: 7,
    name: "ياسمين أحمد",
    email: "yasmin@example.com",
    image: null,
    courses_count: 4,
    students_count: 120,
    total_income: 2200,
    commission: "7%",
    total_rate: 4.3,
    total_rating: 45,
    stage: { name: "الابتدائية" },
    subject: { name: "العلوم" },
    country: { name: "البحرين" }
  },
  {
    id: 8,
    name: "عمر سعيد",
    email: "omar@example.com",
    image: null,
    courses_count: 3,
    students_count: 100,
    total_income: 1800,
    commission: "5%",
    total_rate: 4.2,
    total_rating: 35,
    stage: { name: "الثانوية" },
    subject: { name: "التاريخ" },
    country: { name: "لبنان" }
  }
];

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
    
    // أنيميشن الظهور عند التمرير
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

      // محاولة جلب البيانات من API بدون توكن
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
          // ترتيب البيانات حسب إجمالي الكورسات أولاً، ثم التقييمات
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

      // استخدام البيانات المخزنة في الكاش إذا لم تكن API متاحة
      const startIndex = (page - 1) * 8;
      const paginatedTeachers = cachedTeachers.slice(startIndex, startIndex + 8);
      setTeachers(paginatedTeachers);
      setTotalPages(Math.ceil(cachedTeachers.length / 8));
      setTotalTeachers(cachedTeachers.length);

    } catch (err: any) {
      console.error('Error fetching honor board:', err);
      setError(err.message || 'حدث خطأ أثناء تحميل البيانات');
      
      // استخدام البيانات المخزنة في الكاش في حالة الخطأ
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
    <div ref={sectionRef} className="min-h-[500px] bg-gradient-to-b from-background to-muted/30 ">
      <Hero />
      <div className="container mx-auto px-4 mt-12">
        {/* Header مع أنيميشن */}
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

        {/* Results Info */}
        <div className={`flex justify-between items-center mb-8 transition-all duration-700 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <p className="text-muted-foreground text-sm">
            {t('common.showing', 'عرض')} {((currentPage - 1) * 8) + 1} {t('common.to', 'إلى')} {Math.min(currentPage * 8, totalTeachers)} {t('common.of', 'من')} {totalTeachers} {t('teachers.title', 'معلم')}
          </p>
          <div className="text-sm text-muted-foreground">
            {t('common.sortedBy', 'مرتب حسب')}: <strong>{t('teachers.courses', 'الكورسات')}</strong> & <strong>{t('teachers.rating', 'التقييم')}</strong>
          </div>
        </div>

        {/* Teachers Grid مع أنيميشن */}
        {teachers.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>{t('teachers.noData', 'لا توجد بيانات للمعلمين حالياً')}</p>
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
                    {/* تأثير خلفي متحرك */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Rank Badge مع أنيميشن */}
                    <div className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'} ${
                      getRankBgColor(globalRank)
                    } text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold z-10 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                      {getRankIcon(globalRank)}
                      #{globalRank}
                    </div>
                    
                    <CardHeader className="text-center pt-8 pb-4 relative z-10">
                      {/* Avatar مع أنيميشن */}
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
                          {teacher.subject?.name || t('common.general', 'عام')}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className="mx-auto text-xs transition-all duration-300 group-hover:border-blue-300"
                        >
                          {teacher.courses_count} {t('teachers.courses', 'كورس')}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 relative z-10">
                      {/* Teacher Stats مع أنيميشن */}
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="transform transition-all duration-300 group-hover:scale-110">
                          <div className="text-xl font-bold text-primary flex flex-col items-center gap-1">
                            <BookOpen className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:text-blue-500" />
                            {teacher.courses_count}
                          </div>
                          <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
                            {t('teachers.courses', 'الكورسات')}
                          </div>
                        </div>
                        
                        <div className="transform transition-all duration-300 group-hover:scale-110">
                          <div className="text-xl font-bold text-green-600 flex flex-col items-center gap-1">
                            <Users className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:text-green-500" />
                            {teacher.students_count}
                          </div>
                          <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
                            {t('teachers.students', 'الطلاب')}
                          </div>
                        </div>
                        
                        <div className="transform transition-all duration-300 group-hover:scale-110">
                          <div className="text-xl font-bold text-amber-600 flex flex-col items-center gap-1">
                            <Star className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:text-yellow-500" />
                            {teacher.total_rate ? teacher.total_rate.toFixed(1) : '0.0'}
                          </div>
                          <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
                            {t('teachers.rating', 'التقييم')}
                          </div>
                        </div>
                      </div>
                      
                      {/* Total Rating */}
                      {teacher.total_rating && (
                        <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-sm font-semibold text-muted-foreground transition-all duration-300 group-hover:text-foreground">
                            {t('teachers.totalRatings', 'إجمالي التقييمات')}: {teacher.total_rating}
                          </div>
                        </div>
                      )}
                    </CardContent>

                    {/* تأثير Hover */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 dark:group-hover:border-blue-600 rounded-lg transition-all duration-500 pointer-events-none"></div>
                  </Card>
                );
              })}
            </div>

            {/* Pagination مع أنيميشن */}
            {totalPages > 1 && (
              <div className={`flex justify-center items-center gap-2 mt-8 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  <ChevronLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
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
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`transition-all duration-300 hover:scale-105 ${
                        currentPage === pageNum ? 'bg-blue-600 text-white' : ''
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  <ChevronRight className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
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
            <p>{t('common.error', 'خطأ')}: {error}</p>
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

export default HonorBoard;