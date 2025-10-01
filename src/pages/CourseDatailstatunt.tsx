import { useState, useEffect, useRef } from "react";
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
import { useAuth } from '@/context/AuthContext';
import YouTubePlayer from '@/components/youtube';

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
  LogIn,
  Eye,
  FileQuestion,
  Timer,
  EyeIcon,
  RefreshCw,
  ExternalLink
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
    watched_duration?: number;
    view_count?: number;
  }[];
  exams: {
    id: number;
    title: string;
    description: string;
    duration: number;
    questions_count: number;
    total_marks: number;
    passing_marks: number;
    available_from: string;
    available_to: string;
    status: string;
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
  const { user, refreshUserData } = useAuth();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [watchedDuration, setWatchedDuration] = useState<number>(0);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [videoViews, setVideoViews] = useState<number>(0);
  const [debugMode, setDebugMode] = useState(false);
  const [lessonProgress, setLessonProgress] = useState<{[key: number]: {duration: number, views: number}}>({});
  
  const videoRef = useRef<HTMLIFrameElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id) {
      fetchCourseDetail();
    }
  }, [id]);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const openZoomLink = (zoomLink: string | null, lesson: any) => {
    if (!zoomLink) {
      toast({
        title: "No Zoom Link Available",
        description: "This session doesn't have a Zoom link",
        variant: "destructive",
      });
      return;
    }

    window.open(zoomLink, '_blank', 'noopener,noreferrer');
    
    sendVideoProgress(lesson, 300);
  };

  // دالة لإيقاف تتبع الفيديو
  const stopVideoTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    if (currentLesson && watchedDuration > 0) {
      sendVideoProgress(currentLesson, watchedDuration);
    }
    
    setIsTracking(false);
    setCurrentLesson(null);
    setWatchedDuration(0);
  };

  // دالة محسنة لتشغيل الفيديو
  const playVideo = (videoUrl: string | null, lesson: any) => {
    if (!videoUrl) {
      toast({
        title: "No Video Available",
        description: "This lesson doesn't have a video content",
        variant: "destructive",
      });
      return;
    }

    console.log("🎬 Playing video:", videoUrl);
    console.log("📺 Lesson details:", lesson);

    stopVideoTracking();
    
    startVideoTracking(lesson);
    
    setSelectedVideo(videoUrl);
    setShowVideoModal(true);
  };

  // دالة محسنة لتتبع الفيديو
  const startVideoTracking = (lesson: any) => {
    setCurrentLesson(lesson);
    setWatchedDuration(0);
    setIsTracking(true);
    
    console.log("🔍 Starting video tracking for lesson:", lesson.id);
    
    progressIntervalRef.current = setInterval(() => {
      setWatchedDuration(prev => {
        const newDuration = prev + 1;
        
        const estimatedDuration = 300;
        
        if (newDuration % 30 === 0 || newDuration >= estimatedDuration) {
          sendVideoProgress(lesson, newDuration);
        }
        
        if (newDuration >= estimatedDuration) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
          }
          setIsTracking(false);
          console.log("✅ Video tracking completed");
        }
        
        return newDuration;
      });
    }, 1000);
  };

  // دالة محسنة لإرسال بيانات المشاهدة
  const sendVideoProgress = async (lesson: any, duration: number) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.log("⚠️ User not logged in, skipping video progress tracking");
        return;
      }

      console.log("📊 Sending video progress to API:", {
        course_id: course?.id,
        course_detail_id: lesson.id,
        watched_duration: duration,
        view: 1
      });

      const response = await apiFetch("/student/course-detail/watch", {
        method: "POST",
        body: {
          course_id: course?.id,
          course_detail_id: lesson.id,
          watched_duration: duration,
          view: 1
        }
      });

      console.log("✅ Video progress API response:", response);

  if (response.message === "Watching data saved successfully") {
        setLessonProgress(prev => ({
          ...prev,
          [lesson.id]: {
            duration: duration,
            views: (prev[lesson.id]?.views || 0) + 1
          }
        }));

        setVideoViews(prev => prev + 1);

        if (duration >= 300 || duration === 30) {
          toast({
            title: "Progress Saved",
            description: `Your progress (${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}) has been saved`,
            variant: "default",
          });
        }

      } else {
        console.error("❌ API returned error:", response.message);
      }

    } catch (error: any) {
      console.error("❌ Error sending video progress:", error);
    }
  };

  const downloadFile = (filePath: string | null, fileName: string) => {
    if (!filePath) {
      toast({
        title: "No File Available",
        description: "This resource doesn't have a file",
        variant: "destructive",
      });
      return;
    }

    window.open(filePath, '_blank');
  };

  const getLessonProgress = (lessonId: number) => {
    return lessonProgress[lessonId] || { duration: 0, views: 0 };
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const cleanCourseDetails = (courseData: CourseDetail): CourseDetail => {
    if (!courseData.details) {
      return { ...courseData, details: [] };
    }

    if (Array.isArray(courseData.details)) {
      const validDetails = courseData.details.filter(item => 
        item && typeof item === 'object'
      );
      
      return {
        ...courseData,
        details: validDetails
      };
    }

    if (typeof courseData.details === 'object') {
      const detailsArray = [];
      const detailsObj = courseData.details as any;
      
      for (const key in detailsObj) {
        if (/^\d+$/.test(key) && detailsObj[key] && typeof detailsObj[key] === 'object') {
          detailsArray.push(detailsObj[key]);
        }
      }
      
      const nonNumericProps: any = {};
      for (const key in detailsObj) {
        if (!/^\d+$/.test(key) && key !== 'length' && key !== 'constructor') {
          nonNumericProps[key] = detailsObj[key];
        }
      }
      
      if (Object.keys(nonNumericProps).length > 0) {
        const newItem = {
          id: nonNumericProps.id || Date.now(),
          title: nonNumericProps.title || "Untitled Lesson",
          description: nonNumericProps.description || "",
          content_type: nonNumericProps.content_type || "unknown",
          content_link: nonNumericProps.content_link || null,
          session_date: nonNumericProps.session_date || null,
          session_time: nonNumericProps.session_time || null,
          file_path: nonNumericProps.file_path || null,
          created_at: nonNumericProps.created_at || new Date().toISOString()
        };
        detailsArray.push(newItem);
      }
      
      return {
        ...courseData,
        details: detailsArray
      };
    }

    return { ...courseData, details: [] };
  };

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = Cookies.get("token");
      if (token && user) {
        try {
          const userCourses = user.courses || [];
          const foundCourse = userCourses.find((c: any) => c.id.toString() === id);
          if (foundCourse) {
            const cleanedData = cleanCourseDetails(foundCourse);
            setCourse(cleanedData);
            setLoading(false);
            return;
          }
        } catch (userError) {
          console.log("⚠️ Could not fetch user data, trying public API");
        }
      }

      const response = await fetch(`/api/student-course/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.result === "Success" && data.data) {
        const cleanedData = cleanCourseDetails(data.data);
        setCourse(cleanedData);
      } else {
        throw new Error(data.message || 'Failed to fetch course details');
      }
    } catch (err: any) {
      console.error('🚨 Error fetching course details:', err);
      setError(err.message || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const refreshFromContext = async () => {
    try {
      setLoading(true);
      console.log("🔄 Refreshing data from AuthContext...");
      
      await refreshUserData();
      
      const userCourses = user?.courses || [];
      const foundCourse = userCourses.find((c: any) => c.id.toString() === id);
      
      if (foundCourse) {
        console.log("✅ Updated course from context:", foundCourse);
        const cleanedData = cleanCourseDetails(foundCourse);
        setCourse(cleanedData);
        toast({
          title: "Data Refreshed",
          description: "Course data updated from your profile",
          variant: "default",
        });
      } else {
        console.log("❌ Course not found in updated context");
        toast({
          title: "No Update",
          description: "Course not found in your profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ Error refreshing from context:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not update course data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // دالة للانضمام للكورس
  const handleEnrollClick = async () => {
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

    try {
      setEnrolling(true);
      console.log("🛒 Enrolling in course ID:", course!.id);
      
      const response = await apiFetch<any>('/student/unenroll', {
        method: 'POST',
        body: {
          course_id: course!.id
        }
      });

      console.log("✅ Enrollment response:", response);

      if (response.result === "Success") {
        toast({
          title: "Unenrollment Successful",
          description: "You have been successfully unenrolled from the course!",
          variant: "default",
        });
        
        await refreshUserData();
        navigate('/profile');
      } else {
        throw new Error(response.message || "unenroll failed");
      }
    } catch (error: any) {
      console.error("❌ unenroll error:", error);

      let errorMessage = "Failed to unenroll in the course";
      if (error.message?.includes('already enrolled')) {
        errorMessage = "You are already enrolled in this course";
        navigate('/profile');
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setEnrolling(false);
    }
  };

  // دالة لبدء الامتحان
  const startExam = (examId: number) => {
    const token = Cookies.get("token");
    if (!token) {
      toast({
        title: "Login Required",
        description: "Please login to take the exam",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    navigate(`/exam/${examId}`);
  };

  // عرض شريط التقدم أثناء المشاهدة
  const renderVideoProgress = () => {
    if (!isTracking || !currentLesson) return null;

    const totalDuration = 300;
    const progress = (watchedDuration / totalDuration) * 100;
    const minutes = Math.floor(watchedDuration / 60);
    const seconds = watchedDuration % 60;

    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-60 bg-black/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-blue-400/50 shadow-lg shadow-blue-500/20">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="relative">
              <EyeIcon className="w-4 h-4 text-blue-400 animate-pulse" />
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
            </div>
            <span className="text-blue-300 font-semibold">{videoViews + 1}</span>
          </div>
          <div className="w-32 bg-gray-600 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-1000 shadow-lg shadow-blue-500/50"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-blue-300 font-medium">
            {minutes}:{seconds.toString().padStart(2, '0')} / 5:00
          </span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
        </div>
      </div>
    );
  };

  // تحويل الثواني إلى تنسيق الوقت
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            <div className="flex gap-2 justify-center mt-4">
              <Button onClick={fetchCourseDetail}>
                Try Again
              </Button>
              <Button 
                onClick={() => {
                  console.log("🔍 Debug - Current course:", course);
                  console.log("🔍 Debug - User courses:", user?.courses);
                  setDebugMode(!debugMode);
                }} 
                variant="outline"
              >
                Debug Info
              </Button>
            </div>
            {debugMode && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
                <pre>{JSON.stringify({ course, userCourses: user?.courses }, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // تحويل البيانات
  const discount = parseFloat(course.discount || "0");
  const originalPrice = parseFloat(course.original_price || "0");
  const currentPrice = parseFloat(course.price || "0");
  const hasDiscount = originalPrice > currentPrice && discount > 0;
  const discountPercentage = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  // تقسيم what_you_will_learn إلى مصفوفة
  const learningPoints = course.what_you_will_learn 
    ? course.what_you_will_learn.split(',').map(point => point.trim()).filter(point => point.length > 0)
    : ["No learning objectives specified"];

  // تجميع الدروس حسب النوع مع التحقق من الصحة
  const details = course.details || [];
  const videoLessons = details.filter(detail => 
    detail && typeof detail === 'object' && detail.content_type === 'video'
  );
  const pdfLessons = details.filter(detail => 
    detail && typeof detail === 'object' && detail.content_type === 'pdf'
  );
  const zoomLessons = details.filter(detail => 
    detail && typeof detail === 'object' && detail.content_type === 'zoom'
  );
  const totalLessons = details.filter(detail => 
    detail && typeof detail === 'object'
  ).length;

  const getEstimatedDuration = () => {
    const videoCount = videoLessons.length;
    if (videoCount === 0) return "Flexible";
    if (videoCount <= 3) return "1-2 hours";
    if (videoCount <= 6) return "3-4 hours";
    return "5+ hours";
  };

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

  const getTeacherName = () => {
    return course.teacher?.name || "Unknown Teacher";
  };

  const getSubjectName = () => {
    return course.subject?.name || "Unknown Subject";
  };

  const getStageName = () => {
    return course.stage?.name || "Unknown Stage";
  };

  const getStudentCount = () => {
    return (course.count_student || course.subscribers_count || 0).toLocaleString();
  };

  const getTeacherCoursesCount = () => {
    return course.teacher?.courses_count || 0;
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
              <Button
                variant="outline"
                size="sm"
                onClick={refreshFromContext}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
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
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                <span>{totalLessons} lessons</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14 border-2 border-white">
                <AvatarImage src={course.teacher?.image || "https://www.shutterstock.com/image-vector/online-courses-elearning-vector-background-260nw-1725725059.jpg"} alt={getTeacherName()} />
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
            {/* Tabs for Course Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum ({totalLessons})</TabsTrigger>
                <TabsTrigger value="exams">Exams ({course.exams?.length || 0})</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
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
                          <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt=2 flex-shrink-0"></div>
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
              </TabsContent>

              {/* Curriculum Tab */}
              <TabsContent value="curriculum" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Course Curriculum</CardTitle>
                    <p className="text-muted-foreground">
                      {totalLessons} lessons • {getEstimatedDuration()} total length
                    </p>
                    <div className="flex gap-2 text-sm">
                      <Badge variant="outline">{videoLessons.length} Videos</Badge>
                      <Badge variant="outline">{pdfLessons.length} PDFs</Badge>
                      <Badge variant="outline">{zoomLessons.length} Zoom</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Video Lessons */}
                      {videoLessons.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Video className="w-5 h-5 text-primary" />
                            Video Lessons ({videoLessons.length})
                          </h4>
                          <div className="space-y-2">
                            {videoLessons.map((lesson, index) => {
                              const progress = getLessonProgress(lesson.id);
                              const hasWatched = progress.duration > 0;
                              
                              return (
                                <div key={lesson.id || `video-${index}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors group">
                                  <div className="flex items-center gap-3">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => playVideo(lesson.content_link, lesson)}
                                      className="p-0 h-8 w-8 hover:bg-primary hover:text-primary-foreground"
                                    >
                                      <Play className="w-4 h-4" />
                                    </Button>
                                    <div>
                                      <span className="font-medium">{lesson.title || `Video Lesson ${index + 1}`}</span>
                                      {lesson.description && (
                                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                                      )}
                                      {debugMode && (
                                        <p className="text-xs text-gray-500">ID: {lesson.id} | Type: {lesson.content_type}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">Video</Badge>
                                    <div className={`flex items-center gap-1 ${hasWatched ? 'text-green-500' : 'text-blue-500'}`}>
                                      <div className="relative">
                                        <Eye className="w-4 h-4" />
                                        {hasWatched && (
                                          <>
                                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                                          </>
                                        )}
                                      </div>
                                      <span className="text-xs font-semibold">
{user?.courses?.details?.watching_data.watched_duration
  ? formatDuration(user.courses.details.watching_data.watched_duration)
  : '0:00'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Zoom Lessons */}
                      {zoomLessons.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Video className="w-5 h-5 text-primary" />
                            Live Sessions ({zoomLessons.length})
                          </h4>
                          <div className="space-y-2">
                            {zoomLessons.map((lesson, index) => {
                              const progress = getLessonProgress(lesson.id);
                              const hasAttended = progress.duration > 0;
                              
                              return (
                                <div key={lesson.id || `zoom-${index}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                                  <div className="flex items-center gap-3">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => openZoomLink(lesson.content_link, lesson)}
                                      className="p-0 h-8 w-8 hover:bg-primary hover:text-primary-foreground"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </Button>
                                    <div>
                                      <span className="font-medium">{lesson.title || `Live Session ${index + 1}`}</span>
                                      {lesson.description && (
                                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                                      )}
                                      {lesson.session_date && (
                                        <p className="text-sm text-muted-foreground">
                                          📅 {lesson.session_date} {lesson.session_time && `at ${lesson.session_time}`}
                                        </p>
                                      )}
                                      {debugMode && (
                                        <p className="text-xs text-gray-500">ID: {lesson.id} | Type: {lesson.content_type}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">Zoom</Badge>
                                    <div className={`flex items-center gap-1 ${hasAttended ? 'text-green-500' : 'text-blue-500'}`}>
                                      <div className="relative">
                                        <Eye className="w-4 h-4" />
                                        {hasAttended && (
                                          <>
                                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                                          </>
                                        )}
                                      </div>
                                      <span className="text-xs font-semibold">
                                        {hasAttended ? 'Attended' : 'Join Now'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* PDF Lessons */}
                      {pdfLessons.length > 0 && (
                        <div>
                          <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Resources & Materials ({pdfLessons.length})
                          </h4>
                          <div className="space-y-2">
                            {pdfLessons.map((lesson, index) => (
                              <div key={lesson.id || `pdf-${index}`} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                                <div className="flex items-center gap-3">
                                  <File className="w-5 h-5 text-primary" />
                                  <div>
                                    <span className="font-medium">{lesson.title || `Resource ${index + 1}`}</span>
                                    {lesson.description && (
                                      <p className="text-sm text-muted-foreground">{lesson.description}</p>
                                    )}
                                    {debugMode && (
                                      <p className="text-xs text-gray-500">ID: {lesson.id} | Type: {lesson.content_type}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">PDF</Badge>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => downloadFile(lesson.file_path, lesson.title)}
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

                      {/* Debug Information */}
                      {debugMode && (
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h4 className="text-lg font-semibold mb-2 text-yellow-800">Debug Information</h4>
                          <div className="text-sm text-yellow-700">
                            <p>Total Details: {details.length}</p>
                            <p>Video Lessons: {videoLessons.length}</p>
                            <p>PDF Lessons: {pdfLessons.length}</p>
                            <p>Zoom Lessons: {zoomLessons.length}</p>
                            <pre className="mt-2 text-xs">{JSON.stringify(details, null, 2)}</pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Exams Tab */}
              <TabsContent value="exams" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Course Exams</CardTitle>
                    <p className="text-muted-foreground">
                      Test your knowledge with these exams
                    </p>
                  </CardHeader>
                  <CardContent>
                 <div className="space-y-4">
  {user?.courses?.length > 0 &&
  user.courses.some((course) => course.exams?.length > 0) ? (
    user.courses.map((course) =>
      course.exams?.map((exam) => {
        const studentExam = exam.studentExams?.[0]; // نفترض محاولة واحدة فقط
        const attended = studentExam?.attend === 1;

        return (
          <div
            key={exam.id}
            className="flex items-center justify-between p-6 border rounded-lg hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileQuestion className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-2">{exam.title}</h4>
                <p className="text-muted-foreground mb-3">{exam.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    <span>{exam.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileQuestion className="w-4 h-4" />
                    <span>{exam.questions_count} questions</span>
                  </div>

                  {/* ✅ عرض السكور فقط لو حضر */}
                  {attended && (
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      <span>
                        Score: {studentExam?.score ?? 0}/{exam.questions_count}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ✅ عرض الزر فقط لو ما حضرش */}
            {!attended && (
              <Button
                onClick={() => startExam(exam.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                Start Exam
              </Button>
            )}
          </div>
        );
      })
    )
  ) : (
    <div className="text-center py-8">
      <FileQuestion className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      <h4 className="text-lg font-semibold mb-2">No Exams Available</h4>
      <p className="text-muted-foreground">Exams will be added soon.</p>
    </div>
  )}
</div>

                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Enrollment Card */}
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Pricing */}
                  <div className="text-center">
                    {hasDiscount ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-3xl font-bold text-gray-900">${currentPrice}</span>
                          <span className="text-lg text-gray-500 line-through">${originalPrice}</span>
                          <Badge variant="destructive" className="text-sm">
                            {discountPercentage}% OFF
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Limited time offer</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <span className="text-3xl font-bold text-gray-900">
                          {currentPrice === 0 ? "Free" : `$${currentPrice}`}
                        </span>
                        {currentPrice === 0 && (
                          <p className="text-sm text-success">Free forever</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Enroll Button */}
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg font-semibold"
                    onClick={handleEnrollClick}
                    disabled={enrolling}
                  >
                    {enrolling ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Unenroll...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 mr-2" />
                        Enroll Now
                      </>
                    )}
                  </Button>

                  {/* Course Features */}
                  <div className="space-y-3 pt-4">
                    <h4 className="font-semibold text-lg">This course includes:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-4 h-4 text-success" />
                        <span>{videoLessons.length} video lessons</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-success" />
                        <span>{pdfLessons.length} downloadable resources</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Video className="w-4 h-4 text-success" />
                        <span>{zoomLessons.length} live sessions</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Infinity className="w-4 h-4 text-success" />
                        <span>Full lifetime access</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-4 h-4 text-success" />
                        <span>Access on mobile and TV</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-4 h-4 text-success" />
                        <span>Certificate of completion</span>
                      </div>
                    </div>
                  </div>

                  {/* Debug Toggle */}
                  <div className="pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDebugMode(!debugMode)}
                      className="w-full"
                    >
                      {debugMode ? 'Hide Debug' : 'Show Debug'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          {renderVideoProgress()}
          <div className="relative w-full max-w-4xl bg-black rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-10 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white font-semibold text-lg">{currentLesson?.title}</h3>
                  <p className="text-gray-300 text-sm">{currentLesson?.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    stopVideoTracking();
                    setShowVideoModal(false);
                    setSelectedVideo(null);
                  }}
                  className="text-white hover:bg-white/20 rounded-full w-10 h-10 p-0"
                >
                  ✕
                </Button>
              </div>
            </div>

            {/* Video Player */}
          <div className="aspect-video bg-black">
  {selectedVideo ? (
    <YouTubePlayer videoUrl={selectedVideo} />
  ) : (
    <div className="text-white text-center p-4">No video selected</div>
  )}
</div>


            {/* Footer with Progress Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent z-10 p-4">
              <div className="flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Eye className="w-4 h-4 text-green-400" />
                      {isTracking && (
                        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                      )}
                    </div>
                    <span className="text-green-300 font-semibold text-sm">
                      Tracking... {formatDuration(watchedDuration)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-300 text-sm font-medium">
                    {isTracking ? 'Watching...' : 'Completed'}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3 w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(watchedDuration / 300) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;