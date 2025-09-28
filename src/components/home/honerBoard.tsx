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

interface TeachersHonorBoardProps {
  title?: string;
  subtitle?: string;
}

const TeachersHonorBoard: React.FC<TeachersHonorBoardProps> = ({ 
  title = "Top Teachers", 
  subtitle = "Meet our most successful instructors" 
}) => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopTeachers();
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
        // استخدام البيانات المخزنة في الكاش إذا لم توجد بيانات حقيقية
        setTeachers(cachedTeachers);
      }
    } catch (err: any) {
      console.error('Error fetching top teachers:', err);
      setError(err.message || 'An error occurred while loading teachers');
      // استخدام البيانات المخزنة في الكاش في حالة الخطأ
      setTeachers(cachedTeachers);
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
        return <Trophy className="w-5 h-5 text-blue-500" />;
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

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="overflow-hidden text-center">
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
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teachers.map((teacher, index) => (
            <Card 
              key={teacher.id} 
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md relative overflow-hidden"
            >
              {/* Rank Badge */}
              <div className={`absolute top-4 right-4 ${getRankBgColor(index + 1)} text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold z-10`}>
                {getRankIcon(index + 1)}
                #{index + 1}
              </div>
              
              <CardHeader className="text-center pt-8 pb-4">
                <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <AvatarImage 
                    src={teacher.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"} 
                    alt={teacher.name} 
                  />
                  <AvatarFallback className="text-sm bg-tan text-white font-bold">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg group-hover:text-tan transition-colors">
                  {teacher.name}
                </CardTitle>
                <div className="flex flex-col gap-1 mt-2">
                  <Badge variant="secondary" className="mx-auto text-xs">
                    {teacher.subject?.name}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Teacher Stats */}
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
                      {teacher.total_rate}
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

     
      </div>
    </section>
  );
};

export default TeachersHonorBoard;