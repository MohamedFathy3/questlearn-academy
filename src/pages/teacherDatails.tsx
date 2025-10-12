import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { apiFetch } from "@/lib/api";
import { 
  Star, 
  Users, 
  BookOpen, 
  Award, 
  Mail, 
  Phone, 
  MapPin,
  Globe,
  Calendar,
  TrendingUp,
  DollarSign,
  Share2,
  MessageCircle,
  FileText,
  CheckCircle,
  PlayCircle,
  BarChart3,
  ThumbsUp,
  Eye,
  Send,
  User
} from "lucide-react";

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

interface Teacher {
  id: number;
  name: string;
  email: string;
  secound_email: string | null;
  active: boolean;
  type: string;
  teacher_type: string | null;
  total_rate: number;
  phone: string;
  national_id: string;
  image: string;
  certificate_image: string | null;
  experience_image: string | null;
  id_card_front: string | null;
  id_card_back: string | null;
  country: {
    id: number;
    name: string;
    key: string;
    code: string;
    active: boolean;
    image: string;
  };
  account_holder_name: string;
  account_number: string;
  iban: string;
  swift_code: string;
  branch_name: string;
  postal_transfer_full_name: string | null;
  postal_transfer_office_address: string | null;
  postal_transfer_recipient_name: string | null;
  postal_transfer_recipient_phone: string | null;
  wallets_name: string;
  wallets_number: string;
  commission: string;
  courses_count: number;
  students_count: number;
  total_income: number;
  courses: Array<{
    course_name: string;
    students_count: number;
    course_income: number;
    teacher_share: number;
  }>;
  rewards: string;
  average_rating: number;
  comments: Comment[];
}

interface ApiResponse {
  result: string;
  data: Teacher;
  message: string;
  status: number;
}

const TeacherProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("courses");
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTeacherProfile();
    }
  }, [id]);

  const fetchTeacherProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/teacher/${id}`, {
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
        setTeacher(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch teacher profile');
      }
    } catch (err: any) {
      console.error('Error fetching teacher profile:', err);
      setError(err.message || 'Failed to load teacher profile');
    } finally {
      setLoading(false);
    }
  };

  const handleContactTeacher = () => {
    toast({
      title: "Contact Teacher",
      description: "Contact feature will be implemented soon",
      variant: "default",
    });
  };

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `Teacher Profile - ${teacher?.name}`,
        text: `Check out ${teacher?.name}'s profile on our platform`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Profile link copied to clipboard",
        variant: "default",
      });
    }
  };

const handleAddComment = async () => {
  if (!newComment.trim() || rating === 0) {
    toast({
      title: "خطأ",
      description: "الرجاء إدخال تعليق وتقييم",
      variant: "destructive",
    });
    return;
  }

  try {
    setSubmitting(true);
    
    // ✅ التصحيح: استخدام apiFetch بشكل صحيح
    const response = await apiFetch(`/teachers/${id}/comments`, {
      method: 'POST',
      body: {
        comment: newComment,
        rating: rating
      }
    });

    // ✅ التصحيح: apiFetch يرجع البيانات مباشرة
    if (response.result === "Success") {
      toast({
        title: "تمت الإضافة!",
        description: "تم إضافة تعليقك بنجاح",
        variant: "default",
      });
      
      // إعادة تحميل البيانات
      fetchTeacherProfile();
      setNewComment("");
      setRating(0);
    } else {
      throw new Error(response.message || 'Failed to add comment');
    }
  } catch (error: any) {
    console.error('Error adding comment:', error);
    toast({
      title: "خطأ",
      description: error.message || "فشل في إضافة التعليق",
      variant: "destructive",
    });
  } finally {
    setSubmitting(false);
  }
};
  // Render Hero Section
  const renderHeroSection = () => {
    if (!teacher) return null;

    return (
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Teacher Avatar and Basic Info */}
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32 border-4 border-white/20 shadow-lg">
                  <AvatarImage src={teacher.image} alt={teacher.name} />
                  <AvatarFallback className="bg-white text-purple-600 text-2xl font-bold">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Teacher Details */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{teacher.name}</h1>
                    <p className="text-purple-100 text-lg mb-4">مدرس محترف مع سنوات من الخبرة</p>
                    
                    {/* Rating and Stats */}
                    <div className="flex items-center gap-6 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-xl">{teacher.total_rate}</span>
                        </div>
                        <span className="text-purple-100">تقييم المعلم</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        <span className="font-bold text-xl">{teacher.students_count.toLocaleString()}</span>
                        <span className="text-purple-100">طالب</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        <span className="font-bold text-xl">{teacher.courses_count}</span>
                        <span className="text-purple-100">دورة</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button 
                      className="bg-white text-purple-600 hover:bg-gray-100 font-semibold"
                      onClick={handleContactTeacher}
                    >
                      <MessageCircle className="w-4 h-4 ml-2" />
                      تواصل مع المعلم
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-white text-white bg-blue-600 hover:bg-white/10"
                      onClick={handleShareProfile}
                    >
                      <Share2 className="w-4 h-4 ml-2" />
                      مشاركة
                    </Button>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center gap-6 mt-6 flex-wrap text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{teacher.country.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{teacher.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>معلم موثوق</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Courses
  const renderCourses = () => {
    if (!teacher) return null;

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">الدورات التعليمية</h2>
        
        <div className="grid gap-6">
          {teacher.courses.map((course, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{course.course_name}</h3>
                    <div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{course.students_count} طالب</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>دخل الدورة: ${course.course_income}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        <span>حصة المعلم: ${course.teacher_share}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => navigate(`/course/${index + 1}`)}
                    >
                      <Eye className="w-4 h-4 ml-2" />
                      عرض الدورة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {teacher.courses.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">لا توجد دورات متاحة حالياً</p>
          </div>
        )}
      </div>
    );
  };

  // Render Comments and Ratings
  const renderComments = () => {
    if (!teacher) return null;

    const comments = teacher.comments || [];

    // حساب متوسط التقييمات
    const averageRating = comments.length > 0 
      ? comments.reduce((sum, comment) => sum + comment.rating, 0) / comments.length
      : 0;

    // توزيع التقييمات
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
          {/* Left Column - Rating Summary and Add Comment */}
          <div className="lg:col-span-1 space-y-6">
            {/* Rating Summary */}
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
                    بناءً على {comments.length} تقييم
                  </p>
                </div>

                {/* Rating Distribution */}
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

            {/* Add Comment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">أضف تقييمك</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Star Rating */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    تقييمك
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

                {/* Comment Textarea */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    تعليقك
                  </label>
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="شاركنا تجربتك مع هذا المعلم..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleAddComment}
                  disabled={submitting || !newComment.trim() || rating === 0}
                  className="w-full"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 ml-2" />
                      إرسال التقييم
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Comments List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">التقييمات والتعليقات</h2>
            
            {comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <Card key={comment.id} className="hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Student Avatar */}
                        <Avatar className="w-12 h-12 border-2 border-gray-200">
                          <AvatarImage src={comment.student.image} alt={comment.student.name} />
                          <AvatarFallback className="bg-blue-500 text-white">
                            {comment.student.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        {/* Comment Content */}
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

                          {/* Actions */}
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                              <ThumbsUp className="w-4 h-4" />
                              <span>مفيد</span>
                            </button>
                            <button className="hover:text-gray-700 transition-colors">
                              رد
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
                    لا توجد تقييمات بعد
                  </h3>
                  <p className="text-gray-600">
                    كن أول من يقيم هذا المعلم
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render Bank Information
  const renderBankInfo = () => {
    if (!teacher) return null;

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">معلومات التحويل البنكي</h2>
        
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">اسم صاحب الحساب</label>
                  <p className="font-semibold">{teacher.account_holder_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">رقم الحساب</label>
                  <p className="font-semibold">{teacher.account_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">الفرع</label>
                  <p className="font-semibold">{teacher.branch_name}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">IBAN</label>
                  <p className="font-semibold">{teacher.iban}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">SWIFT Code</label>
                  <p className="font-semibold">{teacher.swift_code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">المحفظة الإلكترونية</label>
                  <p className="font-semibold">{teacher.wallets_name}: {teacher.wallets_number}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Render Documents
  const renderDocuments = () => {
    if (!teacher) return null;

    const documents = [
      {
        title: "صورة الشهادة",
        image: teacher.certificate_image,
        type: "certificate"
      },
      {
        title: "صورة الخبرة",
        image: teacher.experience_image,
        type: "experience"
      },
      {
        title: "صورة البطاقة الأمامية",
        image: teacher.id_card_front,
        type: "id_front"
      },
      {
        title: "صورة البطاقة الخلفية",
        image: teacher.id_card_back,
        type: "id_back"
      }
    ].filter(doc => doc.image);

    if (documents.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">الوثائق والمستندات</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documents.map((doc, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{doc.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={doc.image!} 
                    alt={doc.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                    onClick={() => window.open(doc.image!, '_blank')}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
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
            <p className="mt-4 text-gray-600">جاري تحميل بيانات المعلم...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            <p>خطأ: {error || 'المعلم غير موجود'}</p>
            <Button onClick={fetchTeacherProfile} className="mt-4">
              حاول مرة أخرى
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {renderHeroSection()}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              {[
                { id: "courses", label: "الدورات", count: teacher.courses_count },
                { id: "comments", label: "التقييمات", count: teacher.comments?.length || 0 },
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

          {/* Tab Content */}
          <div>
            {activeTab === "courses" && renderCourses()}
            {activeTab === "comments" && renderComments()}
        
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;