import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trophy, Award, Star, Medal, Crown, Users, BookOpen, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import Cookies from 'js-cookie';
import Hero from '@/components/home/hero';

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

// بيانات وهمية لل cache
const cachedStudents: Student[] = [
  {
    id: 1,
    name: "Ahmed Mohamed",
    email: "ahmed.mohamed@example.com",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    total_courses: 15,
    completed_courses: 12,
    enrolled_courses: 3,
    total_hours: 45,
    points: 1250,
    grade: { name: "Grade 10" },
    stage: { name: "Secondary Stage" },
    country: { name: "Egypt" }
  },
  {
    id: 2,
    name: "Fatima Al-Zahra",
    email: "fatima.alzahra@example.com",
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
    total_courses: 12,
    completed_courses: 10,
    enrolled_courses: 2,
    total_hours: 38,
    points: 980,
    grade: { name: "Grade 9" },
    stage: { name: "Secondary Stage" },
    country: { name: "Saudi Arabia" }
  },
  {
    id: 3,
    name: "Omar Hassan",
    email: "omar.hassan@example.com",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    total_courses: 8,
    completed_courses: 6,
    enrolled_courses: 2,
    total_hours: 28,
    points: 750,
    grade: { name: "Grade 8" },
    stage: { name: "Middle Stage" },
    country: { name: "UAE" }
  },
  {
    id: 4,
    name: "Layla Ibrahim",
    email: "layla.ibrahim@example.com",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    total_courses: 10,
    completed_courses: 8,
    enrolled_courses: 2,
    total_hours: 32,
    points: 890,
    grade: { name: "Grade 11" },
    stage: { name: "Secondary Stage" },
    country: { name: "Jordan" }
  },
  {
    id: 5,
    name: "Youssef Ali",
    email: "youssef.ali@example.com",
    image: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=150&h=150&fit=crop&crop=face",
    total_courses: 7,
    completed_courses: 5,
    enrolled_courses: 2,
    total_hours: 25,
    points: 620,
    grade: { name: "Grade 7" },
    stage: { name: "Middle Stage" },
    country: { name: "Qatar" }
  },
  {
    id: 6,
    name: "Aisha Mohammed",
    email: "aisha.mohammed@example.com",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    total_courses: 9,
    completed_courses: 7,
    enrolled_courses: 2,
    total_hours: 30,
    points: 780,
    grade: { name: "Grade 10" },
    stage: { name: "Secondary Stage" },
    country: { name: "Kuwait" }
  },
  {
    id: 7,
    name: "Khalid Ahmed",
    email: "khalid.ahmed@example.com",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    total_courses: 6,
    completed_courses: 4,
    enrolled_courses: 2,
    total_hours: 22,
    points: 550,
    grade: { name: "Grade 6" },
    stage: { name: "Primary Stage" },
    country: { name: "Oman" }
  },
  {
    id: 8,
    name: "Noura Hassan",
    email: "noura.hassan@example.com",
    image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop&crop=face",
    total_courses: 11,
    completed_courses: 9,
    enrolled_courses: 2,
    total_hours: 35,
    points: 920,
    grade: { name: "Grade 12" },
    stage: { name: "Secondary Stage" },
    country: { name: "Bahrain" }
  },
  {
    id: 9,
    name: "Mohammed Saleh",
    email: "mohammed.saleh@example.com",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
    total_courses: 5,
    completed_courses: 3,
    enrolled_courses: 2,
    total_hours: 18,
    points: 480,
    grade: { name: "Grade 5" },
    stage: { name: "Primary Stage" },
    country: { name: "Lebanon" }
  },
  {
    id: 10,
    name: "Sara Abdullah",
    email: "sara.abdullah@example.com",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    total_courses: 8,
    completed_courses: 6,
    enrolled_courses: 2,
    total_hours: 26,
    points: 680,
    grade: { name: "Grade 8" },
    stage: { name: "Middle Stage" },
    country: { name: "Egypt" }
  }
];

const StudentsHonorBoard = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    fetchStudentsHonorBoardData(currentPage);
  }, [currentPage]);

  const fetchStudentsHonorBoardData = async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const token = Cookies.get("token");
      
      // محاولة جلب البيانات من API
      try {
        const response = await apiFetch<ApiResponse>('/student/index', {
          method: 'POST',
          body: {
            filters: {},
            orderBy: "total_rate",
            orderByDirection: "desc",
            perPage: 10,
            paginate: true,
            page: page
          }
        });

        if (response.result === "Success" && response.data && response.data.length > 0) {
          setStudents(response.data);
          setTotalPages(response.meta?.last_page || 1);
          setTotalStudents(response.meta?.total || response.data.length);
          return;
        }
      } catch (apiError) {
        console.log('API not ready, using cached data');
      }

      // استخدام البيانات المخزنة في الكاش إذا فشل الـ API
      const startIndex = (page - 1) * 10;
      const paginatedStudents = cachedStudents.slice(startIndex, startIndex + 10);
      setStudents(paginatedStudents);
      setTotalPages(Math.ceil(cachedStudents.length / 10));
      setTotalStudents(cachedStudents.length);

    } catch (err: any) {
      console.error('Error fetching students honor board:', err);
      setError(err.message || 'An error occurred while loading data');
      
      // استخدام البيانات المخزنة في الكاش في حالة الخطأ
      const startIndex = (currentPage - 1) * 10;
      const paginatedStudents = cachedStudents.slice(startIndex, startIndex + 10);
      setStudents(paginatedStudents);
      setTotalPages(Math.ceil(cachedStudents.length / 10));
      setTotalStudents(cachedStudents.length);
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
  const getDefaultAvatar = (student: Student) => {
    const avatars = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=150&h=150&fit=crop&crop=face'
    ];
    return student.image || avatars[student.id % avatars.length];
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

 

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="">
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Results Info */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-muted-foreground">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalStudents)} of {totalStudents} students
          </p>
        </div>

        {/* Top Students Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-tan">
            {t('honers.top', 'Top Performing Students')}
          </h2>
          
          {students.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>{t('studentsHonorBoard.noStudents', 'No students data available')}</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {students.map((student, index) => {
                  const globalRank = ((currentPage - 1) * 10) + index + 1;
                  return (
                    <Card key={student.id} className="gradient-card shadow-medium course-card-hover relative overflow-hidden">
                      {/* Rank Badge */}
                      <div className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'} ${getRankBgColor(globalRank)} text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold`}>
                        {getRankIcon(globalRank)}
                        #{globalRank}
                      </div>
                      
                      <CardHeader className="text-center pt-8">
                        <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white shadow-lg">
                          <AvatarImage 
                            src={getDefaultAvatar(student)} 
                            alt={student.name} 
                          />
                          <AvatarFallback className="text-lg bg-green-500 text-white">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-lg">
                          {student.name}
                        </CardTitle>
                        <div className="flex flex-col gap-1">
                          <Badge variant="secondary" className="mx-auto text-xs">
                            {student.grade?.name || 'Grade'}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div>
                            <div className="text-xl font-bold text-primary flex flex-col items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {student.total_courses}
                            </div>
                            <div className="text-xs text-muted-foreground">Total</div>
                          </div>
                          <div>
                            <div className="text-xl font-bold text-accent flex flex-col items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {student.completed_courses}
                            </div>
                            <div className="text-xs text-muted-foreground">Completed</div>
                          </div>
                          <div>
                           
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progress</span>
                            <span>{Math.round((student.completed_courses / student.total_courses) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-tan h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(student.completed_courses / student.total_courses) * 100}%` }}
                            ></div>
                          </div>
                        </div>
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
                        className={currentPage === pageNum ? "bg-green-500 text-white" : ""}
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
            <p>Note: Showing cached data - {error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsHonorBoard;