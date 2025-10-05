import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
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
  Video,
  File,
  Loader2,
  ChevronDown,
  ChevronUp,
  Globe,
  ThumbsUp,
  Shield,
  Trophy,
  BarChart3,
  LogIn,
  User,
  BookOpen,
  Target,
  Mail,
  Captions,
  Eye,
  Calendar
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
    total_rate?: number;
    country?: {
      name: string;
    };
    stage?: {
      name: string;
    };
    subject?: {
      name: string;
    };
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
    students?: Array<{
      pivot: {
        watched_duration: number;
        view: boolean;
      };
    }>;
  }[];
  exams: {
    id: number;
    title: string;
    description: string;
    duration: number;
    questions_count: number;
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

// بيانات تقييمات وهمية لحين ما تجي من الـ API
const mockReviews = [
  {
    id: 1,
    user: {
      name: "أحمد محمد",
      avatar: "AM"
    },
    rating: 5,
    comment: "دورة رائعة جداً! الشرح واضح والمحتوى منظم بشكل ممتاز. أنصح بها بشدة للمبتدئين.",
    date: "2024-01-15",
    likes: 24
  },
  {
    id: 2,
    user: {
      name: "فاطمة علي",
      avatar: "FA"
    },
    rating: 4,
    comment: "المحتوى جيد ولكن أتمنى وجود أمثلة أكثر تطبيقية. بشكل عام دورة مفيدة.",
    date: "2024-01-10",
    likes: 12
  },
  {
    id: 3,
    user: {
      name: "خالد عبدالله",
      avatar: "KA"
    },
    rating: 5,
    comment: "أفضل دورة في هذا المجال. المدرس محترف والتمارين عملية جداً.",
    date: "2024-01-08",
    likes: 31
  },
  {
    id: 4,
    user: {
      name: "سارة أحمد",
      avatar: "SA"
    },
    rating: 3,
    comment: "جيدة ولكن تحتاج بعض التحسينات في جودة الفيديوهات.",
    date: "2024-01-05",
    likes: 8
  }
];

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
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [finalPrice, setFinalPrice] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState({
    curriculum: true,
    instructor: false,
    reviews: false
  });

  useEffect(() => {
    if (id) {
      fetchCourseDetail();
    }
  }, [id]);

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
        setCourse(data.data);
        setFinalPrice(parseFloat(data.data.price || "0"));
      } else {
        throw new Error(data.message || 'Failed to fetch course details');
      }
    } catch (err: any) {
      console.error('Error fetching course details:', err);
      setError(err.message || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

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
      
      const response = await apiFetch<any>('/student/enroll', {
        method: 'POST',
        body: {
          course_id: course!.id,
          discount_code: discountApplied ? discountCode : null
        }
      });

      if (response.result === "Success") {
        toast({
          title: "Enrollment Successful!",
          description: "You have been successfully enrolled in the course",
          variant: "default",
        });
        
        await refreshUserData();
        navigate('/learning');
      } else {
        throw new Error(response.message || "Enrollment failed");
      }
    } catch (error: any) {
      console.error("Enrollment error:", error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to enroll in the course",
        variant: "destructive",
      });
    } finally {
      setEnrolling(false);
    }
  };

  // ✅ دالة تطبيق كود الخصم
  const applyDiscount = async () => {
    if (!discountCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a discount code",
        variant: "destructive",
      });
      return;
    }

    try {
      setApplyingDiscount(true);
      
      const discountPercentage = 10;
      const currentPrice = parseFloat(course?.price || "0");
      const discountedPrice = currentPrice * (1 - discountPercentage / 100);
      
      setFinalPrice(discountedPrice);
      setDiscountApplied(true);
      
      toast({
        title: "Discount Applied!",
        description: `You saved ${discountPercentage}% on this course`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Invalid Discount Code",
        description: "The discount code you entered is invalid or expired",
        variant: "destructive",
      });
    } finally {
      setApplyingDiscount(false);
    }
  };

  // ✅ Render Hero Section مثل Udemy
  const renderUdemyHero = () => {
    if (!course) return null;

    // حساب إجمالي مدة المشاهدة من البيانات الفعلية
    const totalWatchedDuration = course.details?.reduce((total, detail) => {
      if (detail.students) {
        return total + detail.students.reduce((studentTotal, student) => {
          return studentTotal + (student.pivot?.watched_duration || 0);
        }, 0);
      }
      return total;
    }, 0) || 0;

    const totalLessons = course.details?.length || 0;
    const videoLessons = course.details?.filter(d => d.content_type === 'video') || [];
    const totalVideoDuration = videoLessons.length * 10; // تقدير 10 دقائق لكل فيديو

    return (
      <div 
        className="bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop"})`
        }}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-300 mb-4">
              <span>{course.country?.name || "Global"}</span>
              <span className="mx-2">›</span>
              <span>{course.stage?.name}</span>
              <span className="mx-2">›</span>
              <span className="text-white">{course.subject?.name}</span>
            </nav>

            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            
         

            {/* Ratings and Students - من البيانات الفعلية */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="text-orange-400 font-bold text-lg">{course.teacher?.total_rate || 5}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < Math.floor(course.teacher?.total_rate || 5) 
                          ? "fill-orange-400 text-orange-400" 
                          : "text-gray-400"
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-blue-300 underline ml-1 text-sm cursor-pointer">
                  ({mockReviews.length} تقييمات)
                </span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-200">{(course.count_student || 0).toLocaleString()} طالب</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-200">{totalLessons} درس</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-200">
                {Math.floor(totalVideoDuration / 60)}س {totalVideoDuration % 60}د
              </span>
            </div>

            {/* Created By */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-gray-300">تم الإنشاء بواسطة</span>
              <span className="text-white underline cursor-pointer">{course.teacher?.name}</span>
            </div>

            {/* Course Highlights */}
            <div className="flex items-center gap-6 text-sm mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>آخر تحديث {new Date(course.created_at).toLocaleDateString('ar-SA', { month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-400" />
                <span>العربية</span>
              </div>
              <div className="flex items-center gap-2">
                <Captions className="w-4 h-4 text-green-400" />
                <span>ترجمة [تلقائية]</span>
              </div>
            </div>

            {/* What You'll Learn - من البيانات الفعلية */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">ما الذي ستتعلمه</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {course.what_you_will_learn.split(',').map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-200">{point.trim()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ✅ Render Course Curriculum
  const renderCurriculum = () => {
    const details = course?.details || [];

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">محتويات الدورة</h2>
        
        <div className="border border-gray-200 rounded-lg mb-4">
          <button
            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 bg-gray-100"
            onClick={() => setExpandedSections(prev => ({
              ...prev,
              curriculum: !prev.curriculum
            }))}
          >
            <div>
              <h3 className="font-bold text-lg">محتويات الدورة</h3>
              <p className="text-sm text-gray-600 mt-1">
                {details.length} قسم • {details.filter(l => l.content_type === 'video').length} محاضرة • 
                {Math.floor(details.length * 10 / 60)}س {details.length * 10 % 60}د
              </p>
            </div>
            {expandedSections.curriculum ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          
          {expandedSections.curriculum && (
            <div className="border-t">
              {details.map((lesson, lessonIndex) => {
                const totalWatched = lesson.students?.reduce((total, student) => 
                  total + (student.pivot?.watched_duration || 0), 0) || 0;
                const totalStudents = lesson.students?.length || 0;
                const avgWatched = totalStudents > 0 ? Math.floor(totalWatched / totalStudents) : 0;

                return (
                  <div key={lesson.id} className="border-b last:border-b-0">
                    <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3 flex-1">
                        {lesson.content_type === 'video' && <PlayCircle className="w-5 h-5 text-gray-400" />}
                        {lesson.content_type === 'pdf' && <FileText className="w-5 h-5 text-gray-400" />}
                        {lesson.content_type === 'zoom' && <Video className="w-5 h-5 text-blue-500" />}
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{lesson.title || `الدرس ${lessonIndex + 1}`}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                            {lesson.content_type === 'video' && <span>فيديو • 10د</span>}
                            {lesson.content_type === 'pdf' && <span>ملف • PDF</span>}
                            {lesson.content_type === 'zoom' && (
                              <span>
                                بث مباشر • 
                                {lesson.session_date && ` ${lesson.session_date}`}
                                {lesson.session_time && ` الساعة ${lesson.session_time}`}
                              </span>
                            )}
                            {totalStudents > 0 && (
                              <span className="flex items-center gap-1 text-green-600">
                                <Eye className="w-3 h-3" />
                                {avgWatched}ث متوسط المشاهدة
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {lesson.content_type === 'video' && lesson.content_link && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedVideo(lesson.content_link);
                            setShowVideoModal(true);
                          }}
                        >
                          معاينة
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="text-center text-sm text-gray-600 mt-4">
          {details.length} درس • {Math.floor(details.length * 10 / 60)}س {details.length * 10 % 60}د
        </div>
      </div>
    );
  };

  // ✅ Render Instructor Info
  const renderInstructor = () => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">المدرس</h2>
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-6">
          <Avatar className="w-24 h-24 border-2 border-gray-300">
            <AvatarImage src={course?.teacher?.image || ""} alt={course?.teacher?.name} />
            <AvatarFallback className="bg-purple-600 text-white text-xl font-bold">
              {course?.teacher?.name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">{course?.teacher?.name}</h3>
            <p className="text-gray-600 mb-4">
              مدرس {course?.teacher?.subject?.name} متمرس مع سنوات من الخبرة في التدريس في {course?.teacher?.country?.name}.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                  <span className="font-bold text-lg">{course?.teacher?.total_rate || 5}</span>
                </div>
                <span className="text-sm text-gray-600">تقييم المدرس</span>
              </div>
              
              <div className="text-center">
                <div className="font-bold text-lg mb-1">{course?.teacher?.courses_count || 1}</div>
                <span className="text-sm text-gray-600">دورة</span>
              </div>
              
              <div className="text-center">
                <div className="font-bold text-lg mb-1">{(course?.teacher?.subscribers_count || 0).toLocaleString()}</div>
                <span className="text-sm text-gray-600">طالب</span>
              </div>
              
              <div className="text-center">
                <div className="font-bold text-lg mb-1">{course?.subscribers_count?.toLocaleString()}</div>
                <span className="text-sm text-gray-600">طلاب الدورة</span>
              </div>
            </div>

            {/* Instructor Details */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="font-semibold mb-3">عن المدرس</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{course?.teacher?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{course?.teacher?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>مدرس {course?.teacher?.subject?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>{course?.teacher?.stage?.name}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">الشهادات</h4>
                <div className="space-y-2">
                  {course?.teacher?.certificate_image && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4 text-green-500" />
                      <span>معتمد في تدريس {course?.teacher?.subject?.name}</span>
                    </div>
                  )}
                  {course?.teacher?.experience_image && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span>خبرة تدريس موثقة</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ✅ Render Exams
  const renderExams = () => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">اختبارات الدورة</h2>
      
      <div className="space-y-4">
        {course?.exams?.map((exam) => (
          <div key={exam.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Award className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">{exam.title}</h4>
                  <p className="text-gray-600 mb-3">{exam.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{exam.duration} دقيقة</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{exam.questions_count} سؤال</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>أنشئ: {new Date(exam.created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                ابدأ الاختبار
              </Button>
            </div>
          </div>
        ))}
        
        {(!course?.exams || course.exams.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>لا توجد اختبارات متاحة لهذه الدورة بعد.</p>
          </div>
        )}
      </div>
    </div>
  );

  // ✅ Render Reviews Section
  const renderReviews = () => {
    const totalReviews = mockReviews.length;
    const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    
    // حساب التوزيع
    const ratingDistribution = {
      5: mockReviews.filter(r => r.rating === 5).length,
      4: mockReviews.filter(r => r.rating === 4).length,
      3: mockReviews.filter(r => r.rating === 3).length,
      2: mockReviews.filter(r => r.rating === 2).length,
      1: mockReviews.filter(r => r.rating === 1).length
    };

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">تقييمات الطلاب</h2>
        
        {/* Rating Summary */}
        <div className="border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-400 mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex mb-1 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < Math.floor(averageRating) 
                        ? "fill-orange-400 text-orange-400" 
                        : "text-gray-300"
                    }`} 
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">متوسط التقييم</div>
              <div className="text-xs text-gray-500 mt-1">{totalReviews} تقييم</div>
            </div>
            
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2 mb-1">
                  <div className="flex w-8 justify-end">
                    <span className="text-sm text-gray-600">{stars}</span>
                    <Star className="w-4 h-4 fill-orange-400 text-orange-400 ml-1" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-400 h-2 rounded-full" 
                      style={{ width: `${(ratingDistribution[stars as keyof typeof ratingDistribution] / totalReviews) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {ratingDistribution[stars as keyof typeof ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {mockReviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-blue-500 text-white">
                    {review.user.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{review.user.name}</div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < review.rating 
                                ? "fill-orange-400 text-orange-400" 
                                : "text-gray-300"
                            }`} 
                          />
                        ))}
                        <span className="text-sm text-gray-600 mr-2">
                          {new Date(review.date).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-2 leading-relaxed">{review.comment}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <button className="flex items-center gap-1 hover:text-gray-800">
                      <ThumbsUp className="w-4 h-4" />
                      <span>مفيد ({review.likes})</span>
                    </button>
                    <button className="hover:text-gray-800">رد</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Reviews */}
        <div className="text-center mt-6">
          <Button variant="outline">
            تحميل المزيد من التقييمات
          </Button>
        </div>
      </div>
    );
  };

  // ✅ Render Pricing Card
  const renderPricingCard = () => {
    if (!course) return null;

    const token = Cookies.get("token");
    const isLoggedIn = !!token;
    
    const originalPrice = parseFloat(course.original_price || "0");
    const currentPrice = parseFloat(course.price || "0");
    const hasDiscount = originalPrice > currentPrice;
    const discountPercentage = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
    const displayPrice = discountApplied ? finalPrice : currentPrice;
    const currency = course.currency || "USD";

    const features = [
      { icon: PlayCircle, text: `${course.details?.filter(d => d.content_type === 'video').length || 0} درس فيديو` },
      { icon: FileText, text: `${course.details?.filter(d => d.content_type === 'pdf').length || 0} ملف قابل للتحميل` },
      { icon: Infinity, text: "وصول كامل مدى الحياة" },
      { icon: Smartphone, text: "الوصول على الهاتف والتلفزيون" },
      { icon: Award, text: "شهادة إتمام" },
      { icon: Users, text: `${course.count_student || 0} طالب مسجل` },
    ];

    return (
      <div className="sticky top-6 border border-gray-300 rounded-lg shadow-xl bg-white">
        {/* Course Image */}
        <div className="relative">
          <img 
            src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop"} 
            alt={course.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {course.intro_video_url && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Button
                className="bg-white/90 hover:bg-white text-black rounded-full w-16 h-16 shadow-lg"
                onClick={() => {
                  setSelectedVideo(course.intro_video_url);
                  setShowVideoModal(true);
                }}
              >
                <Play className="w-6 h-6 ml-1" />
              </Button>
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="p-6">
          <div className="space-y-4">
            {/* Price - مع العملة الفعلية */}
            <div className="space-y-2">
              {hasDiscount ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">{currency} {displayPrice.toFixed(2)}</span>
                    <span className="text-lg text-gray-500 line-through">{currency} {originalPrice}</span>
                    <Badge variant="destructive" className="text-sm">
                      خصم {discountPercentage}%
                    </Badge>
                  </div>
                  {discountApplied && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      تم تطبيق الخصم!
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-3xl font-bold">
                  {currentPrice === 0 ? "مجاني" : `${currency} ${displayPrice.toFixed(2)}`}
                </span>
              )}
            </div>

            {/* Discount Code Input */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="كود الخصم"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  disabled={discountApplied}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={applyDiscount}
                  disabled={applyingDiscount || discountApplied}
                >
                  {applyingDiscount ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : discountApplied ? (
                    "مطبق"
                  ) : (
                    "تطبيق"
                  )}
                </Button>
              </div>
              {discountApplied && (
                <p className="text-sm text-green-600">
                  تم تطبيق الخصم بنجاح! السعر الجديد: {currency} {displayPrice.toFixed(2)}
                </p>
              )}
            </div>

            {/* Enroll Button */}
            {isLoggedIn ? (
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold shadow-lg"
                onClick={handleEnrollClick}
                disabled={enrolling}
              >
                {enrolling ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    جاري التسجيل...
                  </>
                ) : (
                  "سجل الآن"
                )}
              </Button>
            ) : (
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold shadow-lg"
                onClick={() => navigate('/login')}
              >
                <LogIn className="w-5 h-5 mr-2" />
                سجل الدخول للتسجيل
              </Button>
            )}

            {/* Money Back Guarantee */}
            <p className="text-center text-sm text-gray-600">
              ضمان استرجاع المبلغ خلال 30 يوم
            </p>

            {/* Course Includes */}
            <div className="space-y-3">
              <h4 className="font-bold text-lg">تشمل هذه الدورة:</h4>
              <div className="space-y-2 text-sm">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <feature.icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Summary in Sidebar */}
            <div className="border-t pt-4 mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-2xl font-bold text-orange-400">{course.teacher?.total_rate || 5}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < Math.floor(course.teacher?.total_rate || 5) 
                            ? "fill-orange-400 text-orange-400" 
                            : "text-gray-300"
                        }`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{mockReviews.length} تقييم</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                مشاركة
              </Button>
             
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل تفاصيل الدورة...</p>
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
            <p>خطأ: {error || 'الدورة غير موجودة'}</p>
            <Button onClick={fetchCourseDetail} className="mt-4">
              حاول مرة أخرى
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {renderUdemyHero()}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                {[
                  { id: "overview", label: "نظرة عامة" },
                  { id: "curriculum", label: "المحتوى" },
                  { id: "instructor", label: "المدرس" },
                  { id: "reviews", label: "التقييمات" },
                  { id: "exams", label: "الاختبارات" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-purple-600 text-purple-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mb-8">
              {activeTab === "overview" && (
                <>
                  {/* What You'll Learn - كاملة */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">ما الذي ستتعلمه</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {course.what_you_will_learn.split(',').map((point, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{point.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">المتطلبات</h2>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>لا توجد خبرة مسبقة مطلوبة</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>مهارات أساسية في استخدام الكمبيوتر</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span>الرغبة في التعلم والممارسة</span>
                      </li>
                    </ul>
                  </div>

                  {/* Description */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">الوصف</h2>
                    <div className="prose max-w-none text-gray-700">
                      <p>{course.description}</p>
                    </div>
                  </div>

                  {/* Course Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{(course.subscribers_count || 0).toLocaleString()}</div>
                      <div className="text-sm text-gray-600">طالب</div>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <PlayCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{course.details?.length || 0}</div>
                      <div className="text-sm text-gray-600">درس</div>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">
                        {Math.floor((course.details?.length || 0) * 10 / 60)}س
                      </div>
                      <div className="text-sm text-gray-600">المدة</div>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{course.teacher?.total_rate || 0}</div>
                      <div className="text-sm text-gray-600">التقييم</div>
                    </div>
                  </div>

                  {/* Intro Video */}
                  {course?.intro_video_url && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">مقدمة الدورة</h2>
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <YouTubePlayer videoUrl={course.intro_video_url} />
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === "curriculum" && renderCurriculum()}
              {activeTab === "instructor" && renderInstructor()}
              {activeTab === "reviews" && renderReviews()}
              {activeTab === "exams" && renderExams()}
            </div>
          </div>

          {/* Right Column - Pricing Card */}
          <div className="lg:col-span-1">
            {renderPricingCard()}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-10 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white font-semibold text-lg">معاينة الدورة</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
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
              <YouTubePlayer videoUrl={selectedVideo} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;