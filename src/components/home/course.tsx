import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen } from "lucide-react";
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
      thumbnail: course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
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
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            <p>Error: {error}</p>
            <Button onClick={fetchLatestCourses} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12">
          <div className="mb-6 lg:mb-0">
         
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Newly Added <span className="text-tan">Courses</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover our latest courses added to the platform. Fresh content, updated curriculum, and modern teaching approaches.
            </p>
          </div>
          <Link to="/courses">
            <Button variant="ghost" className="hidden sm:flex">
              View All Courses
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-border">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No courses available</h3>
            <p className="text-muted-foreground">Check back later for new courses</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  {...transformCourseData(course)} 
                />
              ))}
            </div>

            <div className="text-center mt-8 sm:hidden">
              <Link to="/courses">
                <Button variant="outline" className="w-full sm:w-auto">
                  View All Courses
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}