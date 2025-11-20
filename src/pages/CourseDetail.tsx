import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Cookies from "js-cookie";
import { useAuth } from "@/context/AuthContext";
import YouTubePlayer from '@/components/youtube';
import { Link } from "react-router-dom";
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
  Calendar,
  Send,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { apiFetch } from '@/lib/api';
import { useTranslation } from 'react-i18next';

interface Comment {
  id: number;
  comment: string;
  rating: number;
  created_at: string;
  student: {
    id: number;
    name: string;
    phone: string;
    email: string;
    type: string;
    image: string;
    qr_code: string;
    delete_reason: string | null;
    birth_day: string;
    average_rating: number;
  };
}

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
  comments: Comment[];
  average_rating: number;
  created_at: string;
}

interface ApiResponse {
  result: string;
  data: CourseDetail;
  message: string;
  status: number;
}

const CourseDetail = () => {
  const { t } = useTranslation();
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
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [submittingComment, setSubmittingComment] = useState(false);

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
        title: t('login.required'),
        description: t('login.requiredDescription'),
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
          title: t('enrollment.success'),
          description: t('enrollment.successDescription'),
          variant: "default",
        });
        
        await refreshUserData();
        navigate('/profile');
      } else {
        throw new Error(response.message || t('enrollment.failed'));
      }
    } catch (error: any) {
      console.error("Enrollment error:", error);
      
      toast({
        title: t('common.error'),
        description: error.message || t('enrollment.failed'),
        variant: "destructive",
      });
    } finally {
      setEnrolling(false);
    }
  };

 const applyDiscount = async () => {
  if (!discountCode.trim()) {
    toast({
      title: t('common.error'),
      description: t('discount.enterCode'),
      variant: "destructive",
    });
    return;
  }

  try {
    setApplyingDiscount(true);
    
    const response = await apiFetch<any>('/apply-coupon', {
      method: 'POST',
      body: {
        code: discountCode,
        amount: parseFloat(course?.original_price || course?.price || "0")
      }
    });

    if (response.message === "Coupon applied successfully") {
      // استخدم البيانات من الresponse مباشرة
      const discountedPrice = response.total_after_discount;
      const discountAmount = response.discount;
      
      setFinalPrice(discountedPrice);
      setDiscountApplied(true);
      
      toast({
        title: t('discount.applied'),
        description: t('discount.savedAmount', { 
          amount: discountAmount,
          currency: course?.currency || "USD" 
        }),
        variant: "default",
      });
    } else {
      throw new Error(response.message || t('discount.invalid'));
    }
  } catch (error: any) {
    toast({
      title: t('discount.invalid'),
      description: error.message || t('discount.invalidDescription'),
      variant: "destructive",
    });
  } finally {
    setApplyingDiscount(false);
  }
};

  const handleAddComment = async () => {
    if (!newComment.trim() || rating === 0) {
      toast({
        title: t('common.error'),
        description: t('reviews.enterCommentAndRating'),
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmittingComment(true);
      
      const response = await apiFetch(`/courses/${id}/comments`, {
        method: 'POST',
        body: {
          comment: newComment,
          rating: rating
        }
      });

      if (response.result === "Success") {
        toast({
          title: t('common.success'),
          description: t('reviews.commentAdded'),
          variant: "default",
        });
        
        fetchCourseDetail();
        setNewComment("");
        setRating(0);
      } else {
        throw new Error(response.message || t('reviews.addFailed'));
      }
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: t('common.error'),
        description: error.message || t('reviews.addFailed'),
        variant: "destructive",
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const renderCurriculum = () => {
    const details = course?.details || [];

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">{t('course.curriculum')}</h2>
        
        <div className="border border-gray-200 rounded-lg mb-4">
          <button
            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 bg-gray-100"
            onClick={() => setExpandedSections(prev => ({
              ...prev,
              curriculum: !prev.curriculum
            }))}
          >
            <div>
              <h3 className="font-bold text-lg">{t('course.curriculum')}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {details.length} {t('course.sections')} • {details.filter(l => l.content_type === 'video').length} {t('course.lectures')} • 
                {Math.floor(details.length * 10 / 60)}{t('common.hours')} {details.length * 10 % 60}{t('common.minutes')}
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
                          <h4 className="font-medium text-sm">{lesson.title || `${t('course.lesson')} ${lessonIndex + 1}`}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                            {lesson.content_type === 'video' && <span>{t('course.video')} • 10{t('common.minutes')}</span>}
                            {lesson.content_type === 'pdf' && <span>{t('course.file')} • PDF</span>}
                            {lesson.content_type === 'zoom' && (
                              <span>
                                {t('course.liveStream')} • 
                                {lesson.session_date && ` ${lesson.session_date}`}
                                {lesson.session_time && ` ${t('course.atTime')} ${lesson.session_time}`}
                              </span>
                            )}
                            {totalStudents > 0 && (
                              <span className="flex items-center gap-1 text-green-600">
                                <Eye className="w-3 h-3" />
                                {avgWatched}{t('common.seconds')} {t('course.averageWatch')}
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
                          {t('course.preview')}
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
          {details.length} {t('course.lessons')} • {Math.floor(details.length * 10 / 60)}{t('common.hours')} {details.length * 10 % 60}{t('common.minutes')}
        </div>
      </div>
    );
  };

  const renderInstructor = () => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">{t('course.instructor')}</h2>
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-start gap-6">
          <Avatar className="w-24 h-24 border-2 border-gray-300">
            <AvatarImage src={course?.teacher?.image || ""} alt={course?.teacher?.name} />
            <AvatarFallback className="bg-purple-600 text-white text-xl font-bold">
              {course?.teacher?.name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Link to={`/profileTeacher/${course?.teacher?.id}`}>
              <h3 className="text-xl font-bold mb-2">{course?.teacher?.name}</h3>
            </Link>
            <p className="text-gray-600 mb-4">
              {t('course.teacherDescription', {
                subject: course?.teacher?.subject?.name,
                country: course?.teacher?.country?.name
              })}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                  <span className="font-bold text-lg">{course?.teacher?.total_rate}</span>
                </div>
                <span className="text-sm text-gray-600">{t('teachers.rating')}</span>
              </div>
              
              <div className="text-center">
                <div className="font-bold text-lg mb-1">{course?.teacher?.courses_count || 1}</div>
                <span className="text-sm text-gray-600">{t('teachers.courses')}</span>
              </div>
              
              <div className="text-center">
                <div className="font-bold text-lg mb-1">{(course?.teacher?.students_count || 0).toLocaleString()}</div>
                <span className="text-sm text-gray-600">{t('teachers.students')}</span>
              </div>
              
              <div className="text-center">
                <div className="font-bold text-lg mb-1">{course?.subscribers_count?.toLocaleString()}</div>
                <span className="text-sm text-gray-600">{t('course.courseStudents')}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="font-semibold mb-3">{t('course.aboutInstructor')}</h4>
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
                    <span>{t('course.teacherOf', { subject: course?.teacher?.subject?.name })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>{course?.teacher?.stage?.name}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">{t('course.certificates')}</h4>
                <div className="space-y-2">
                  {course?.teacher?.certificate_image && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4 text-green-500" />
                      <span>{t('course.certifiedIn', { subject: course?.teacher?.subject?.name })}</span>
                    </div>
                  )}
                  {course?.teacher?.experience_image && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span>{t('course.experienceVerified')}</span>
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

  const renderExams = () => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6">{t('course.exams')}</h2>
      
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
                      <span>{exam.duration} {t('common.minutes')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{exam.questions_count} {t('course.questions')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{t('course.createdAt')} {new Date(exam.created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                {t('course.startExam')}
              </Button>
            </div>
          </div>
        ))}
        
        {(!course?.exams || course.exams.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>{t('course.noExamsAvailable')}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderCourseReviews = () => {
    if (!course) return null;

    const comments = course.comments || [];
    const averageRating = course.average_rating || 0;

    const ratingDistribution = {
      5: comments.filter(c => c.rating === 5).length,
      4: comments.filter(c => c.rating === 4).length,
      3: comments.filter(c => c.rating === 3).length,
      2: comments.filter(c => c.rating === 2).length,
      1: comments.filter(c => c.rating === 1).length
    };

    return (
      <div className="mb-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-orange-500 mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.floor(averageRating)
                            ? "fill-orange-500 text-orange-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">
                    {t('reviews.basedOn', { count: comments.length })}
                  </p>
                </div>

                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => (
                    <div key={stars} className="flex items-center gap-2">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm text-gray-600">{stars}</span>
                        <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{
                            width: `${comments.length > 0 ? (ratingDistribution[stars as keyof typeof ratingDistribution] / comments.length) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-left">
                        {ratingDistribution[stars as keyof typeof ratingDistribution]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">{t('reviews.addYourReview')}</h3>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {t('reviews.yourRating')}
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    {t('reviews.yourComment')}
                  </label>
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={t('reviews.commentPlaceholder')}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <Button
                  onClick={handleAddComment}
                  disabled={submittingComment || !newComment.trim() || rating === 0}
                  className="w-full"
                >
                  {submittingComment ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t('common.sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 ml-2" />
                      {t('reviews.submitReview')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">{t('reviews.studentReviews')}</h2>
            
            {comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <Card key={comment.id} className="hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12 border-2 border-gray-200">
                          <AvatarImage src={comment.student.image} alt={comment.student.name} />
                          <AvatarFallback className="bg-blue-500 text-white">
                            {comment.student.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {comment.student.name}
                              </h4>
                              <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= comment.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="text-sm text-gray-500 mr-2">
                                  {new Date(comment.created_at).toLocaleDateString('ar-SA')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-700 leading-relaxed">
                            {comment.comment}
                          </p>

                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{t('reviews.helpful')}</span>
                            </button>
                            <button className="hover:text-gray-700 transition-colors">
                              {t('reviews.reply')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('reviews.noReviews')}
                  </h3>
                  <p className="text-gray-600">
                    {t('reviews.beFirstToReview')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderUdemyHero = () => {
    if (!course) return null;

    const totalLessons = course.details?.length || 0;
    const videoLessons = course.details?.filter(d => d.content_type === 'video') || [];
    const totalVideoDuration = videoLessons.length * 10;

    return (
      <div 
        className="bg-cover bg-center bg-no-repeat text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop"})`
        }}
      >
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <nav className="text-sm text-gray-300 mb-4">
              <span>{course.country?.name || "Global"}</span>
              <span className="mx-2">›</span>
              <span>{course.stage?.name}</span>
              <span className="mx-2">›</span>
              <span className="text-white">{course.subject?.name}</span>
            </nav>

            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="text-orange-400 font-bold text-lg">{course.average_rating || 5}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < Math.floor(course.average_rating || 5) 
                          ? "fill-orange-400 text-orange-400" 
                          : "text-gray-400"
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-blue-300 underline ml-1 text-sm cursor-pointer">
                  ({course.comments?.length || 0} {t('reviews.reviews')})
                </span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-200">{(course.count_student || 0).toLocaleString()} {t('teachers.students')}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-200">{totalLessons} {t('course.lessons')}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-200">
                {Math.floor(totalVideoDuration / 60)}{t('common.hours')} {totalVideoDuration % 60}{t('common.minutes')}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-gray-300">{t('course.createdBy')}</span>
              <Link to={`/profileTeacher/${course?.teacher?.id}`} className="text-white underline cursor-pointer">
                {course.teacher?.name}
              </Link>
            </div>

            <div className="flex items-center gap-6 text-sm mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>{t('course.lastUpdate')} {new Date(course.created_at).toLocaleDateString('ar-SA', { month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-green-400" />
                <span>{t('course.arabic')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Captions className="w-4 h-4 text-green-400" />
                <span>{t('course.subtitles')}</span>
              </div>
            </div>

          
          </div>
        </div>
      </div>
    );
  };

  const renderPricingCard = () => {
    if (!course) return null;

    const token = Cookies.get("token");
    const isLoggedIn = !!token;
    
    const originalPrice = parseFloat(course.original_price || course.price || "0");
    const currentPrice = parseFloat(course.price || "0");
    
    const displayPrice = discountApplied ? finalPrice : currentPrice;
    const currency = course.currency || "USD";

    const discountPercentage = discountApplied 
      ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
      : 0;

    const features = [
      { icon: PlayCircle, text: `${course.details?.filter(d => d.content_type === 'video').length || 0} ${t('course.videoLessons')}` },
      { icon: FileText, text: `${course.details?.filter(d => d.content_type === 'pdf').length || 0} ${t('course.downloadableFiles')}` },
      { icon: Infinity, text: t('course.lifetimeAccess') },
      { icon: Smartphone, text: t('course.mobileAccess') },
      { icon: Award, text: t('course.certificate') },
      { icon: Users, text: `${course.count_student || 0} ${t('teachers.students')}` },
    ];

    return (
      <div className="sticky top-6 border border-gray-300 rounded-lg shadow-xl bg-white">
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

        <div className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              {discountApplied ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-green-600">
                      {currency} {displayPrice.toFixed(2)}
                    </span>
                    <Badge className="bg-green-100 text-green-800 border-green-200 text-sm">
                      {t('discount.saved')} {discountPercentage}%
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    {t('course.was')}: {currency} {originalPrice.toFixed(2)}
                  </div>
                </>
              ) : (
                <span className="text-3xl font-bold">
                  {currentPrice === 0 ? t('common.free') : `${currency} ${displayPrice.toFixed(2)}`}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder={t('discount.codePlaceholder')}
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
                    t('discount.applied')
                  ) : (
                    t('discount.apply')
                  )}
                </Button>
              </div>
              {discountApplied && (
                <p className="text-sm text-green-600">
                  {t('discount.appliedSuccess')} {currency} {displayPrice.toFixed(2)}
                </p>
              )}
            </div>

            {isLoggedIn ? (
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold shadow-lg"
                onClick={handleEnrollClick}
                disabled={enrolling}
              >
                {enrolling ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('enrollment.enrolling')}
                  </>
                ) : (
                  t('enrollment.enrollNow')
                )}
              </Button>
            ) : (
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold shadow-lg"
                onClick={() => navigate('/login')}
              >
                <LogIn className="w-5 h-5 mr-2" />
                {t('login.signInToEnroll')}
              </Button>
            )}

            <p className="text-center text-sm text-gray-600">
              {t('course.moneyBackGuarantee')}
            </p>

            <div className="space-y-3">
              <h4 className="font-bold text-lg">{t('course.includes')}</h4>
              <div className="space-y-2 text-sm">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <feature.icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <span className="text-2xl font-bold text-orange-400">{course.average_rating || 5}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < Math.floor(course.average_rating || 5) 
                            ? "fill-orange-400 text-orange-400" 
                            : "text-gray-300"
                        }`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{course.comments?.length || 0} {t('reviews.reviews')}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                {t('common.share')}
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
            <p className="mt-4 text-gray-600">{t('course.loadingDetails')}</p>
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
            <p>{t('common.error')}: {error || t('course.notFound')}</p>
            <Button onClick={fetchCourseDetail} className="mt-4">
              {t('common.tryAgain')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {renderUdemyHero()}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                {[
                  { id: "overview", label: t('course.overview') },
                  { id: "curriculum", label: t('course.curriculum') },
                  { id: "instructor", label: t('course.instructor') },
                  { id: "reviews", label: t('reviews.reviews'), count: course?.comments?.length || 0 },
                  { id: "exams", label: t('course.exams') },
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
                    {tab.count && (
                      <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mb-8">
              {activeTab === "overview" && (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">{t('course.whatYouWillLearn')}</h2>
                   <div className="grid md:grid-cols-2 gap-4">
 {course.what_you_will_learn?.split('\n')
  .map((point: string) => point.trim())
  .filter((point: string) => point.length > 0)
  .map((point: string, index: number) => (
    <div key={index} className="flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
      <span className="text-gray-700">{point}</span>
    </div>
  ))
}

</div>
                  </div>

                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">{t('course.description')}</h2>
                    <div className="prose max-w-none text-gray-700">
                      <p>{course.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{(course.subscribers_count || 0).toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{t('teachers.students')}</div>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <PlayCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{course.details?.length || 0}</div>
                      <div className="text-sm text-gray-600">{t('course.lessons')}</div>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">
                        {Math.floor((course.details?.length || 0) * 10 / 60)}
                      </div>
                      <div className="text-sm text-gray-600">{t('course.duration')}</div>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-lg">
                      <BarChart3 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{course.average_rating || 0}</div>
                      <div className="text-sm text-gray-600">{t('teachers.rating')}</div>
                    </div>
                  </div>

                  {course?.intro_video_url && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">{t('course.courseIntro')}</h2>
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <YouTubePlayer videoUrl={course.intro_video_url} />
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === "curriculum" && renderCurriculum()}
              {activeTab === "instructor" && renderInstructor()}
              {activeTab === "reviews" && renderCourseReviews()}
              {activeTab === "exams" && renderExams()}
            </div>
          </div>

          <div className="lg:col-span-1">
            {renderPricingCard()}
          </div>
        </div>
      </div>

      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-10 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white font-semibold text-lg">{t('course.coursePreview')}</h3>
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