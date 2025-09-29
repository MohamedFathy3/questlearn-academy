import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Users, BookOpen, Crown, Medal, Award, Trophy } from 'lucide-react';
import { apiFetch } from '@/lib/api';

interface Teacher {
  id: number;
  name: string;
  image: string | null;
  courses_count: number;
  students_count: number;
  total_rate: number;
  subject: {
    name: string;
  };
  stage: {
    name: string;
  };
}

interface ApiResponse {
  result: string;
  data: Teacher[];
  message: string;
  status: number;
}

// بيانات وهمية لل cache
const cachedTeachers = [
  {
    id: 1,
    name: "أحمد محمد",
    image: null,
    courses_count: 15,
    students_count: 320,
    total_rate: 4.9,
    subject: { name: "الرياضيات" },
    stage: { name: "الثانوية" }
  },
  {
    id: 2,
    name: "فاطمة أحمد",
    image: null,
    courses_count: 12,
    students_count: 280,
    total_rate: 4.8,
    subject: { name: "الفيزياء" },
    stage: { name: "الثانوية" }
  },
  {
    id: 3,
    name: "محمد علي",
    image: null,
    courses_count: 10,
    students_count: 250,
    total_rate: 4.7,
    subject: { name: "الكيمياء" },
    stage: { name: "الإعدادية" }
  },
  {
    id: 4,
    name: "سارة خالد",
    image: null,
    courses_count: 8,
    students_count: 200,
    total_rate: 4.6,
    subject: { name: "اللغة العربية" },
    stage: { name: "الابتدائية" }
  }
];

interface TeachersHonorBoardProps {
  title?: string;
  subtitle?: string;
}

const TeachersHonorBoard: React.FC<TeachersHonorBoardProps> = ({ 
  title = "المعلمين المتميزين", 
  subtitle = "تعرف على معلمينا الأكثر تفوقاً وإبداعاً" 
}) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchTopTeachers();
    
    // أنيميشن الظهور عند التمرير
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('teachers-honor-board');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  const fetchTopTeachers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFetch<ApiResponse>('/teacher/index', {
        method: 'POST',
        body: {
          filters: {},
          orderBy: "total_rate",
          orderByDirection: "desc",
          perPage: 4,
          paginate: true,
          delete: false
        }
      });

      if (response.result === "Success" && response.data && response.data.length > 0) {
        setTeachers(response.data);
      } else {
        setTeachers(cachedTeachers);
      }
    } catch (err: any) {
      console.error('Error fetching top teachers:', err);
      setError(err.message || 'حدث خطأ أثناء تحميل بيانات المعلمين');
      setTeachers(cachedTeachers);
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

  if (loading) {
    return (
      <section id="teachers-honor-board" className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="overflow-hidden text-center animate-pulse">
                <CardHeader className="pt-8">
                  <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto mb-4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-12 rounded" />
                    <Skeleton className="h-12 rounded" />
                    <Skeleton className="h-12 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="teachers-honor-board" className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header مع أنيميشن */}
        <div className={`text-center mb-12 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Teachers Grid مع أنيميشن متدرج */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((teacher, index) => (
            <Card 
              key={teacher.id} 
              className={`group cursor-pointer hover:shadow-xl transition-all duration-500 border-0 shadow-lg relative overflow-hidden transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0 scale-100' 
                  : 'opacity-0 translate-y-10 scale-95'
              }`}
              style={{
                animationDelay: `${index * 200}ms`,
                animationFillMode: 'forwards'
              }}
            >
              {/* تأثير خلفي متحرك */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Rank Badge مع أنيميشن */}
              <div className={`absolute top-4 right-4 ${getRankBgColor(index + 1)} text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold z-10 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                {getRankIcon(index + 1)}
                #{index + 1}
              </div>
              
              <CardHeader className="text-center pt-8 pb-4 relative z-10">
                {/* Avatar مع أنيميشن */}
                <div className="relative mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                  <Avatar className="w-20 h-20 border-4 border-white shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative z-10">
                    <AvatarImage 
                      src={teacher.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"} 
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
                    {teacher.subject?.name}
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
                      الكورسات
                    </div>
                  </div>
                  
                  <div className="transform transition-all duration-300 group-hover:scale-110">
                    <div className="text-xl font-bold text-accent flex flex-col items-center gap-1">
                      <Users className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:text-green-500" />
                      {teacher.students_count}
                    </div>
                    <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
                      الطلاب
                    </div>
                  </div>
                  
                  <div className="transform transition-all duration-300 group-hover:scale-110">
                    <div className="text-xl font-bold text-success flex flex-col items-center gap-1">
                      <Star className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:text-yellow-500" />
                      {teacher.total_rate}
                    </div>
                    <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
                      التقييم
                    </div>
                  </div>
                </div>

                {/* Progress Bar أنيميشن */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: isVisible ? `${(teacher.total_rate / 5) * 100}%` : '0%'
                    }}
                  ></div>
                </div>
              </CardContent>

              {/* تأثير Hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 dark:group-hover:border-blue-600 rounded-lg transition-all duration-500 pointer-events-none"></div>
            </Card>
          ))}
        </div>

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${6 + i * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeachersHonorBoard;