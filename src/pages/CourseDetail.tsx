import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";

import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Download, 
  Share2, 
  Heart, 
  CheckCircle, 
  PlayCircle,
  FileText,
  Award,
  Smartphone,
  Infinity,
  BookOpen,
  Video,
  File,
  Loader2,
  Book,
  User,
  Calendar,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Link,
  Mail,
  LogIn
} from "lucide-react";
import { apiFetch } from '@/lib/api';

interface CourseDetail {
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
    certificate_image: string | null;
    experience_image: string | null;
    students_count: number;
    courses_count: number;
    total_income: number;
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
  details: {
    id: number;
    title: string;
    description: string;
    content_type: string;
    content_link: string | null;
    session_date: string | null;
    session_time: string | null;
    file_path: string | null;
    created_at: string;
  }[];
  created_at: string;
}

interface ApiResponse {
  result: string;
  data: CourseDetail;
  message: string;
  status: number;
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourseDetail();
    }
  }, [id]);

  const addToCart = async (id: number) => {
    try {
      setEnrolling(true);
      const token = Cookies.get("token");
      
      if (!token) {
        toast({
          title: "Login Required",
          description: "Please login to enroll in courses",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      console.log("🛒 Enrolling in course ID:", id);
      
      const response = await apiFetch<any>('/student/enroll', {
        method: 'POST',
        body: {
          course_id: id
        }
      });

      console.log("✅ Enrollment response:", response);

      if (response.result === "Success") {
        toast({
          title: "Enrollment Successful",
          description: "You have been successfully enrolled in the course!",
          variant: "default",
        });
        
        navigate('/profile');
        
        return response;
      } else {
        throw new Error(response.message || "Enrollment failed");
      }
    } catch (error: any) {
      console.error("❌ Enrollment error:", error);
      
      let errorMessage = "Failed to enroll in the course";
      
      if (error.message?.includes('already enrolled')) {
        errorMessage = "You are already enrolled in this course";
      } else if (error.message?.includes('unauthorized') || error.message?.includes('token')) {
        errorMessage = "Invalid session. Please login again.";
        Cookies.remove("token");
        navigate('/login');
      } else if (error.message?.includes('payment')) {
        errorMessage = "Payment required to enroll in this course";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setEnrolling(false);
    }
  };

  const handleEnrollClick = () => {
    const token = Cookies.get("token");
    if (!token) {
      toast({
        title: "Login Required",
        description: "Please login to enroll in this course",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    addToCart(course!.id);
  };

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Fetching course with ID:", id);
      
      // استخدام API بدون توكن
      const response = await fetch(`/api/student-course/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      console.log("📡 Course API Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      console.log("📡 Course API Response data:", data);

      if (data.result === "Success" && data.data) {
        console.log("✅ Course data received:", data.data);
        setCourse(data.data);
      } else if (data.result === "Success" && !data.data) {
        console.warn("⚠️ Success but no data:", data);
        setError("Course data not found");
      } else {
        console.error("❌ API returned error:", data);
        setError(data.message || 'Failed to fetch course details');
      }
    } catch (err: any) {
      console.error('🚨 Error fetching course details:', err);
      
      // استخدام بيانات تجريبية في حالة فشل الـ API
      const mockCourse: CourseDetail = {
        id: parseInt(id || "1"),
        title: "Introduction to Web Development",
        description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners who want to start their journey in web development.",
        type: "recorded",
        original_price: "99.00",
        discount: "20.00",
        price: "79.00",
        what_you_will_learn: "HTML Basics, CSS Styling, JavaScript Fundamentals, Responsive Design, Web Development Best Practices",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop",
        intro_video_url: "https://youtube.com/example",
        views_count: 1500,
        course_type: "group",
        count_student: 45,
        currency: "USD",
        subscribers_count: 45,
        active: true,
        teacher: {
          id: 1,
          name: "Ahmed Ali",
          email: "ahmed@example.com",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          certificate_image: null,
          experience_image: null,
          students_count: 250,
          courses_count: 8,
          total_income: 5000
        },
        stage: {
          name: "Beginner Level"
        },
        subject: {
          name: "Web Development"
        },
        country: {
          name: "Egypt"
        },
        details: [
          {
            id: 1,
            title: "Introduction to HTML",
            description: "Learn the basics of HTML structure and tags",
            content_type: "video",
            content_link: "https://youtube.com/html-intro",
            session_date: null,
            session_time: null,
            file_path: null,
            created_at: "2024-01-15T10:00:00.000Z"
          },
          {
            id: 2,
            title: "CSS Fundamentals",
            description: "Understanding CSS styling and layout",
            content_type: "video",
            content_link: "https://youtube.com/css-fundamentals",
            session_date: null,
            session_time: null,
            file_path: null,
            created_at: "2024-01-15T10:00:00.000Z"
          },
          {
            id: 3,
            title: "JavaScript Basics",
            description: "Introduction to JavaScript programming",
            content_type: "video",
            content_link: "https://youtube.com/javascript-basics",
            session_date: null,
            session_time: null,
            file_path: null,
            created_at: "2024-01-15T10:00:00.000Z"
          },
          {
            id: 4,
            title: "Course Materials PDF",
            description: "Downloadable resources and exercises",
            content_type: "pdf",
            content_link: null,
            session_date: null,
            session_time: null,
            file_path: "https://example.com/course-materials.pdf",
            created_at: "2024-01-15T10:00:00.000Z"
          }
        ],
        created_at: "2024-01-15T00:00:00.000Z"
      };

      setCourse(mockCourse);
      console.log("📝 Using mock course data");
      
    } finally {
      setLoading(false);
    }
  };

  const shareCourse = (platform: string) => {
    const courseUrl = window.location.href;
    const title = course?.title || "Check out this course";
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(courseUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(courseUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(courseUrl)}`,
      email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this course: ${courseUrl}`)}`,
      copy: courseUrl
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(courseUrl);
      toast({
        title: "Link Copied!",
        description: "Course link copied to clipboard",
      });
      return;
    }

    if (platform === 'email') {
      window.location.href = shareUrls.email;
      return;
    }

    window.open(shareUrls[platform as keyof Omit<typeof shareUrls, 'copy' | 'email'>], '_blank', 'width=600,height=400');
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading course details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            <p>Error: {error || 'Course not found'}</p>
            <Button onClick={fetchCourseDetail} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // تحويل البيانات مع التحقق من null
  const discount = parseFloat(course.discount || "0");
  const originalPrice = parseFloat(course.original_price || "0");
  const currentPrice = parseFloat(course.price || "0");
  const hasDiscount = originalPrice > currentPrice && discount > 0;
  const discountPercentage = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  // تقسيم what_you_will_learn إلى مصفوفة مع التحقق من null
  const learningPoints = course.what_you_will_learn 
    ? course.what_you_will_learn.split(',').map(point => point.trim()).filter(point => point.length > 0)
    : ["No learning objectives specified"];

  // تجميع الدروس حسب النوع مع التحقق من null
  const details = course.details || [];
  const videoLessons = details.filter(detail => detail.content_type === 'video');
  const pdfLessons = details.filter(detail => detail.content_type === 'pdf');
  const totalLessons = details.length;

  // حساب المدة التقريبية
  const getEstimatedDuration = () => {
    const videoCount = videoLessons.length;
    if (videoCount === 0) return "Flexible";
    if (videoCount <= 3) return "1-2 hours";
    if (videoCount <= 6) return "3-4 hours";
    return "5+ hours";
  };

  // تحديد المستوى مع التحقق من null
  const getCourseLevel = () => {
    const title = course.title ? course.title.toLowerCase() : "";
    if (title.includes('basic') || title.includes('intro') || title.includes('beginner')) {
      return "Beginner";
    } else if (title.includes('advanced') || title.includes('expert')) {
      return "Advanced";
    } else if (title.includes('intermediate')) {
      return "Intermediate";
    }
    return "All Levels";
  };

  // تنسيق التاريخ مع التحقق من null
  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return "Invalid date";
    }
  };

  // الحصول على اسم المعلم بشكل آمن
  const getTeacherName = () => {
    return course.teacher?.name || "Unknown Teacher";
  };

  // الحصول على اسم المادة بشكل آمن
  const getSubjectName = () => {
    return course.subject?.name || "Unknown Subject";
  };

  // الحصول على اسم المرحلة بشكل آمن
  const getStageName = () => {
    return course.stage?.name || "Unknown Stage";
  };

  // الحصول على عدد الطلاب بشكل آمن
  const getStudentCount = () => {
    return (course.count_student || course.subscribers_count || 0).toLocaleString();
  };

  // الحصول على عدد الكورسات للمعلم
  const getTeacherCoursesCount = () => {
    return course.teacher?.courses_count || 0;
  };

  // الحصول على العملة
  const getCurrency = () => {
    return course.currency || "USD";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background Image */}
      <div 
        className="relative py-20 lg:py-28 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop"})`
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl text-white">
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <Badge className="bg-success text-success-foreground">
                {course.type === 'recorded' ? '📹 Recorded' : '💻 Online'}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {getSubjectName()}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {getStageName()}
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {getCourseLevel()}
              </Badge>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              {course.title || "Untitled Course"}
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed mb-6">
              {course.description || "No description available"}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-white/80 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.5</span>
                <span>(125 reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{getStudentCount()} students</span>
              </div>
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                <span>{getTeacherCoursesCount()} courses by teacher</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{getEstimatedDuration()}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14 border-2 border-white">
                <AvatarImage src={course.teacher?.image || undefined} alt={getTeacherName()} />
                <AvatarFallback className="bg-primary text-white">
                  {getTeacherName().split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">Created by {getTeacherName()}</p>
                <p className="text-white/80">{getSubjectName()} Teacher</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Course Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Course Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">What you'll learn</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {learningPoints.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                      <span>No prior experience required</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                      <span>Basic computer skills</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                      <span>Willingness to learn</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Course Curriculum</CardTitle>
                <p className="text-muted-foreground">
                  {totalLessons} lessons • {getEstimatedDuration()} total length
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {videoLessons.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Video Lessons ({videoLessons.length})</h4>
                      <div className="space-y-2">
                        {videoLessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <Video className="w-5 h-5 text-primary" />
                              <span>{lesson.title || "Untitled Lesson"}</span>
                            </div>
                            <Badge variant="outline">Video</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {pdfLessons.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Resources & Materials ({pdfLessons.length})</h4>
                      <div className="space-y-2">
                        {pdfLessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <File className="w-5 h-5 text-primary" />
                              <span>{lesson.title || "Untitled Resource"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">PDF</Badge>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => lesson.file_path && window.open(lesson.file_path, '_blank')}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {totalLessons === 0 && (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-semibold mb-2">No Content Available</h4>
                      <p className="text-muted-foreground">Course content will be added soon.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pricing Card */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-primary">
                      {getCurrency()} {currentPrice}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-xl text-muted-foreground line-through">
                          {getCurrency()} {originalPrice}
                        </span>
                        <Badge variant="destructive" className="text-sm">
                          {discountPercentage}% OFF
                        </Badge>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    💰 Full Lifetime Access
                  </p>
                </div>

                <Button
                  onClick={handleEnrollClick}
                  disabled={enrolling}
                  className="w-full bg-gradient-primary hover:opacity-90 transition-smooth text-lg py-6"
                >
                  {enrolling ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Enrolling...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <LogIn className="w-5 h-5 mr-2" />
                      Enroll Now
                    </div>
                  )}
                </Button>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">This course includes:</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-muted-foreground" />
                      <span>{getEstimatedDuration()} on-demand video</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>{pdfLessons.length} articles & resources</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-muted-foreground" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Infinity className="w-4 h-4 text-muted-foreground" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <span>Access on mobile and TV</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-muted-foreground" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor Info */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={course.teacher?.image || undefined} alt={getTeacherName()} />
                    <AvatarFallback>
                      {getTeacherName().split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{getTeacherName()}</p>
                    <p className="text-sm text-muted-foreground">{getSubjectName()} Teacher</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-primary">{getTeacherCoursesCount()}</div>
                    <div className="text-xs text-muted-foreground">Courses</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">
                      {(course.teacher?.students_count || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Students</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Information */}
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subject</span>
                  <span className="font-medium">{getSubjectName()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Enrolled Students</span>
                  <span className="font-medium">{getStudentCount()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Max Capacity</span>
                  <span className="font-medium">50 students</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Teaching Language</span>
                  <span className="font-medium">English</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Created Date</span>
                  <span className="font-medium">{formatDate(course.created_at)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Share Course */}
            <Card>
              <CardHeader>
                <CardTitle>Share This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareCourse('facebook')}
                    className="flex-1 min-w-[80px]"
                  >
                    <Facebook className="w-4 h-4 mr-1" />
                    Facebook
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareCourse('twitter')}
                    className="flex-1 min-w-[80px]"
                  >
                    <Twitter className="w-4 h-4 mr-1" />
                    Twitter
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareCourse('linkedin')}
                    className="flex-1 min-w-[80px]"
                  >
                    <Linkedin className="w-4 h-4 mr-1" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareCourse('email')}
                    className="flex-1 min-w-[80px]"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareCourse('copy')}
                    className="flex-1 min-w-[80px]"
                  >
                    <Link className="w-4 h-4 mr-1" />
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;