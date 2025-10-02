import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Sparkles, Clock, TrendingUp, Star, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import CourseCard from "@/components/CourseCard";
import { apiFetch } from '@/lib/api';

interface Course {
  id: number;
  title: string;
  description: string;
  type: string;
  original_price: string;
  discount: string;
  price: string;
  what_you_will_learn: string;
  image: string | null;
  intro_video_url: string;
  views_count: number;
  course_type: string;
  count_student: number | null;
  currency: string | null;
  subscribers_count: number;
  active: boolean;
  teacher: {
    id: number;
    name: string;
    email: string;
    image: string | null;
  };
  stage: {
    name: string;
  };
  subject: {
    name: string;
  };
  country: {
    name: string;
  };
  details?: Array<{
    id: number;
    title: string;
    content_type: string;
  }>;
  created_at: string;
}

interface ApiResponse {
  data: Course[];
  meta: {
    current_page: number;
    total: number;
  };
  result: string;
  message: string;
  status: number;
}

export default function LatestCourses() {
  const { t } = useTranslation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    fetchLatestCourses();
  }, []);

  const fetchLatestCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiFetch<ApiResponse>('/course/index', {
        method: 'POST',
        body: {
          filters: {},
          orderBy: "id",
          orderByDirection: "desc",
          perPage: 6,
          paginate: true,
          delete: false
        }
      });

      if (response.result === "Success" && response.data) {
        setCourses(response.data);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

 

  // دالة لتحويل البيانات لـ CourseCard format
  const transformCourseData = (course: Course) => {
    // حساب إذا الكورس جديد (تم إنشاؤه في آخر 7 أيام)
    const isNewCourse = () => {
      const courseDate = new Date(course.created_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - courseDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    };

    // حساب إذا الكورس bestseller
    const isBestsellerCourse = course.subscribers_count > 5;

    // تحديد المستوى بناءً على البيانات المتاحة
    const getCourseLevel = (): "Beginner" | "Intermediate" | "Advanced" | "All Levels" => {
      const title = course.title.toLowerCase();
      if (title.includes('basic') || title.includes('intro') || title.includes('beginner')) {
        return "Beginner";
      } else if (title.includes('advanced') || title.includes('expert')) {
        return "Advanced";
      } else if (title.includes('intermediate')) {
        return "Intermediate";
      }
      return "All Levels";
    };

    // حساب المدة التقريبية بناءً على عدد الدروس
    const getCourseDuration = () => {
      const lessonCount = course.details?.length || 0;
      if (lessonCount === 0) return "Flexible";
      if (lessonCount <= 5) return "2-4 hours";
      if (lessonCount <= 10) return "5-8 hours";
      return "8+ hours";
    };

    return {
      id: course.id.toString(),
      title: course.title,
      instructor: course.teacher.name,
      thumbnail: course?.image , 
           price: parseFloat(course.price) || 0,
      originalPrice: parseFloat(course.original_price) || 0,
      studentsCount: course.count_student || course.subscribers_count || 0,
      duration: getCourseDuration(),
      level: getCourseLevel(),
      category: course.subject.name,
      isNew: isNewCourse(),
      isBestseller: isBestsellerCourse,
      type: course.type
    };
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/30 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
            </div>
            <p className="text-lg text-muted-foreground animate-pulse">Loading amazing courses...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500 animate-fade-in-up">
            <p>Error: {error}</p>
            <Button onClick={fetchLatestCourses} className="mt-4 animate-bounce-in">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-4 h-4 bg-primary/30 rounded-full animate-ping"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-blue-400/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-10 w-6 h-6 bg-cyan-400/20 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Header with Animation */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12">
          <div className="mb-6 lg:mb-0 animate-fade-in-left">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0 animate-pulse-glow">
                <TrendingUp className="w-3 h-3 mr-1" />
                Fresh Content
              </Badge>
              <Sparkles className="w-5 h-5 text-primary animate-spin" style={{ animationDelay: '0.5s' }} />
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Newly Added <span className="text-tan bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-text-shine">Courses</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Discover our latest courses added to the platform. Fresh content, updated curriculum, and modern teaching approaches.
            </p>
          </div>
          
          <Link to="/courses" className="animate-fade-in-right">
            <Button 
              variant="ghost" 
              className="hidden sm:flex group relative overflow-hidden border border-border hover:border-primary/30 transition-all duration-500 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                View All Courses
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Button>
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-border shadow-soft animate-fade-in-up">
            <div className="relative inline-block mb-4">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto animate-float" />
              <div className="absolute -top-1 -right-1">
                <div className="w-6 h-6 bg-primary/20 rounded-full animate-ping"></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              No courses available
            </h3>
            <p className="text-muted-foreground mb-4">Check back later for new courses</p>
            <Button 
              onClick={fetchLatestCourses} 
              className="animate-bounce-in hover:scale-105 transition-transform duration-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <div 
                  key={course.id}
                  className="animate-fade-in-up relative group"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onMouseEnter={() => setHoveredCard(course.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Hover Effect Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 ${
                    hoveredCard === course.id ? 'scale-105' : 'scale-100'
                  }`}></div>
                  
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 ${
                    hoveredCard === course.id ? 'animate-pulse-glow' : ''
                  }`}></div>

                  {/* Course Card */}
                  <div className={`relative transform transition-all duration-500 ${
                    hoveredCard === course.id ? 'scale-102 -translate-y-2' : 'scale-100'
                  }`}>
                    <CourseCard 
                      {...transformCourseData(course)} 
                    />
                  </div>

                  {/* Floating Elements */}
                  {course.subscribers_count > 10 && (
                    <div className={`absolute -top-2 -right-2 z-10 transition-all duration-500 ${
                      hoveredCard === course.id ? 'scale-110 rotate-12' : 'scale-100'
                    }`}>
                      <Badge className="bg-green-500 text-white border-0 shadow-glow animate-pulse-glow">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}

                  {/* New Course Badge */}
                  {(new Date(course.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                    <div className={`absolute -top-2 -left-2 z-10 transition-all duration-500 ${
                      hoveredCard === course.id ? 'scale-110 -rotate-12' : 'scale-100'
                    }`}>
                      <Badge className="bg-blue-500 text-white border-0 shadow-glow animate-bounce">
                        <Clock className="w-3 h-3 mr-1" />
                        New
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile View All Button */}
            <div className="text-center mt-8 sm:hidden animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <Link to="/courses">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto group relative overflow-hidden hover:scale-105 transition-transform duration-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    View All Courses
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Button>
              </Link>
            </div>

            {/* Animated CTA Section */}
            <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
                <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Ready to start learning?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Join thousands of students already learning with us
                </p>
                <Link to="/courses">
                  <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-glow hover:shadow-glow-lg transition-all duration-500 hover:scale-105 group">
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 group-hover:animate-spin" />
                      Explore All Courses
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}