import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  BookOpen, 
  Award, 
  Clock, 
  Mail,
  QrCode,
  Calendar,
  CheckCircle2,
  PlayCircle,
  GraduationCap,
  Star,
  Users,
  BarChart3,
  TrendingUp,
  FileText,
  Video,
  Bookmark,
  Eye,
  ChevronRight,
  School,
  Target,
  User,
  Book,
  FileQuestion
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Course {
  id: number;
  title: string;
  description: string;
  type: string;
  original_price: string;
  discount: string;
  price: string;
  what_you_will_learn: string;
  image: string;
  intro_video_url: string;
  views_count: number;
  course_type: string;
  count_student: number;
  currency: string;
  subscribers_count: number;
  active: boolean;
  teacher: {
    id: number;
    name: string;
    email: string;
    image: string;
    total_rate: number;
  };
  stage: {
    id: number;
    name: string;
    image: string;
  };
  subject: {
    id: number;
    name: string;
    image: string;
  };
  country: {
    id: number;
    name: string;
    image: string;
  };
  details: Array<{
    id: number;
    title: string;
    description: string;
    content_type: string;
    content_link: string;
    session_date: string | null;
    session_time: string | null;
    file_path: string | null;
    created_at: string;
    watching_data: any;
    students: Array<{
      id: number;
      name: string;
      email: string;
      pivot: {
        course_id: number;
        started_at: string;
        watched_duration: number;
        view: boolean;
      };
    }>;
  }>;
  exams: Array<{
    id: number;
    title: string;
    description: string;
    duration: number;
    course_id: number;
    questions_count: number;
    questions: Array<{
      id: number;
      question_text: string;
      choices: Array<{
        id: number;
        choice_text: string;
        is_correct: boolean;
      }>;
    }>;
    studentExams: any[];
    created_at: string;
  }>;
  created_at: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: string;
  image: string | null;
  qr_code: string;
  total_rate: number;
  courses: Course[];
}

const ChildDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("courses");

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    fetchChildData();
  }, [id]);

  const fetchChildData = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching child data for ID:", id);
      
      // استخدام نفس API اللي بعتتلي إياه
      const response = await apiFetch<any>("/parent/check-auth");
      console.log("📊 Child API Response:", response);

      if (response.message && response.message.student) {
        setStudent(response.message.student);
      } else {
        console.error("❌ No student data found in response");
      }
    } catch (error) {
      console.error("🚨 Error fetching child data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getCourseProgress = (course: Course): number => {
    if (!course.details || course.details.length === 0) return 0;
    
    const totalLessons = course.details.length;
    const completedLessons = course.details.filter(detail => 
      detail.students?.some(student => student.pivot?.view)
    ).length;
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  const getTotalCompletedLessons = (): number => {
    if (!student?.courses) return 0;
    
    return student.courses.reduce((total, course) => {
      if (!course.details) return total;
      return total + course.details.filter(detail => 
        detail.students?.some(student => student.pivot?.view)
      ).length;
    }, 0);
  };

  const getTotalLessons = (): number => {
    if (!student?.courses) return 0;
    
    return student.courses.reduce((total, course) => {
      return total + (course.details?.length || 0);
    }, 0);
  };

  const getTotalExams = (): number => {
    if (!student?.courses) return 0;
    
    return student.courses.reduce((total, course) => {
      return total + (course.exams?.length || 0);
    }, 0);
  };

  const getTotalStudyTime = (): string => {
    if (!student?.courses) return "0h 0m";
    
    const totalMinutes = student.courses.reduce((total, course) => {
      const totalLessons = course.details?.length || 0;
      return total + (totalLessons * 45); // 45 دقيقة لكل درس
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) 
            ? "fill-yellow-500 text-yellow-500" 
            : "fill-gray-300 text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-1 h-80 bg-white/50 dark:bg-gray-800/50 rounded-2xl"></div>
              <div className="lg:col-span-2 h-80 bg-white/50 dark:bg-gray-800/50 rounded-2xl"></div>
            </div>
            <div className="space-y-6">
              {[1, 2].map((item) => (
                <div key={item} className="h-60 bg-white/50 dark:bg-gray-800/50 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="py-16">
            <User className="w-24 h-24 mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('childDetails.studentNotFound')}
            </h2>
            <Button onClick={() => navigate("/parent")}>
              {t('childDetails.backToDashboard')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate("/parent")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('childDetails.backToDashboard')}
          </Button>
        </div>

        {/* Student Header Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8 animate-fade-in">
          
          {/* Student Profile Card */}
          <Card className="lg:col-span-1 border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-600"></div>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="relative inline-block">
                  <Avatar className="w-32 h-32 mx-auto border-4 border-white dark:border-gray-800 shadow-2xl transition-all duration-500 hover:scale-110">
                    <AvatarImage src={student.image || undefined} alt={student.name} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white font-bold shadow-lg">
                      {getInitials(student.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {student.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2 mt-3 text-lg">
                      <Mail className="w-5 h-5" />
                      {student.email}
                    </p>
                    {student.phone && (
                      <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2 mt-2">
                        <span className="text-lg">📱</span>
                        {student.phone}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Badge variant="secondary" className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 px-4 py-2 text-sm font-semibold">
                      {t('childDetails.student')}
                    </Badge>
                    <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30 px-4 py-2 text-sm font-semibold">
                      <QrCode className="w-4 h-4 mr-2" />
                      {student.qr_code}
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex items-center gap-1">
                      {getRatingStars(student.total_rate)}
                    </div>
                    <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                      {student.total_rate}/5
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Stats Overview */}
          <Card className="lg:col-span-2 border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
            <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
                <BarChart3 className="w-8 h-8 text-purple-500" />
                {t('childDetails.learningProgress')}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
                {t('childDetails.studentPerformanceOverview')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { 
                    icon: BookOpen, 
                    value: student.courses?.length || 0, 
                    label: t('childDetails.totalCourses'), 
                    gradient: 'from-blue-500 to-blue-600'
                  },
                  { 
                    icon: FileText, 
                    value: getTotalCompletedLessons(), 
                    label: t('childDetails.completedLessons'), 
                    gradient: 'from-green-500 to-green-600'
                  },
                  { 
                    icon: FileQuestion, 
                    value: getTotalExams(), 
                    label: t('childDetails.totalExams'), 
                    gradient: 'from-orange-500 to-orange-600'
                  },
                  { 
                    icon: Clock, 
                    value: getTotalStudyTime(), 
                    label: t('childDetails.totalStudyTime'), 
                    gradient: 'from-purple-500 to-purple-600'
                  }
                ].map((stat, index) => (
                  <div 
                    key={stat.label}
                    className="text-center p-5 rounded-2xl bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-700/80 border border-gray-200/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105"
                  >
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Overall Progress */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 dark:text-white text-lg">{t('childDetails.overallProgress')}</span>
                  <span className="text-green-600 font-bold text-xl">
                    {Math.round(student.total_rate * 20)}%
                  </span>
                </div>
                <Progress 
                  value={student.total_rate * 20} 
                  className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses & Exams Tabs */}
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl overflow-hidden animate-fade-in-up">
          <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-600"></div>
          <CardHeader className="pb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="courses" className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {t('childDetails.courses')} ({student.courses?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="exams" className="flex items-center gap-2">
                  <FileQuestion className="w-5 h-5" />
                  {t('childDetails.exams')} ({getTotalExams()})
                </TabsTrigger>
              </TabsList>

              {/* Courses Tab */}
              <TabsContent value="courses" className="space-y-6 mt-6">
                {student.courses && student.courses.length > 0 ? (
                  student.courses.map((course, index) => (
                    <div 
                      key={course.id} 
                      className="group flex flex-col lg:flex-row items-start gap-6 p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-700/80 border border-gray-200/30 dark:border-gray-700/30 hover:border-blue-400/40 transition-all duration-500 hover:shadow-xl"
                    >
                      {/* Course Image */}
                      <div className="relative w-full lg:w-64 h-48 rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={course.image} 
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      {/* Course Details */}
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-col h-full">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-start gap-3 mb-3">
                              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 font-medium">
                                {course.subject.name}
                              </Badge>
                              <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 font-medium">
                                ${course.price}
                              </Badge>
                              <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800 font-medium">
                                {course.stage.name}
                              </Badge>
                            </div>
                            
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors duration-300">
                              {course.title}
                            </h3>
                            
                            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg leading-relaxed">
                              {course.description}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={course.teacher.image} />
                                  <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-600">
                                    {getInitials(course.teacher.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{course.teacher.name}</span>
                              </div>
                              <span className="flex items-center gap-1">
                                <Video className="w-4 h-4" />
                                {course.details?.length || 0} {t('childDetails.lessons')}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileQuestion className="w-4 h-4" />
                                {course.exams?.length || 0} {t('childDetails.exams')}
                              </span>
                            </div>

                            {/* What You Will Learn */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                {t('childDetails.whatYouWillLearn')}:
                              </h4>
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {course.what_you_will_learn}
                              </p>
                            </div>
                          </div>
                          
                          {/* Progress Section */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex-1">
                                  <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    <span>{t('childDetails.progress')}</span>
                                    <span className={getCourseProgress(course) === 100 ? 'text-green-600' : 'text-blue-600'}>
                                      {getCourseProgress(course)}%
                                    </span>
                                  </div>
                                  <Progress 
                                    value={getCourseProgress(course)} 
                                    className={`h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner ${
                                      getCourseProgress(course) === 100 ? 'bg-green-500' : 'bg-blue-500'
                                    }`}
                                  />
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {course.details?.filter(detail => 
                                  detail.students?.some(student => student.pivot?.view)
                                ).length || 0}/{course.details?.length || 0} {t('childDetails.lessonsCompleted')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <BookOpen className="w-24 h-24 mx-auto text-gray-400 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {t('childDetails.noCourses')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {t('childDetails.noCoursesEnrolled')}
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* Exams Tab */}
              <TabsContent value="exams" className="space-y-6 mt-6">
                {student.courses && student.courses.some(course => course.exams && course.exams.length > 0) ? (
                  student.courses.map(course => 
                    course.exams?.map(exam => (
                      <div 
                        key={exam.id} 
                        className="group flex flex-col lg:flex-row items-start gap-6 p-6 rounded-2xl bg-gradient-to-br from-white to-gray-50/80 dark:from-gray-800 dark:to-gray-700/80 border border-gray-200/30 dark:border-gray-700/30 hover:border-orange-400/40 transition-all duration-500 hover:shadow-xl"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
                          <FileQuestion className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start gap-3 mb-3">
                            <Badge variant="outline" className="bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800 font-medium">
                              {course.title}
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 font-medium">
                              {exam.questions_count} {t('childDetails.questions')}
                            </Badge>
                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800 font-medium">
                              {exam.duration} {t('childDetails.minutes')}
                            </Badge>
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors duration-300">
                            {exam.title}
                          </h3>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                            {exam.description}
                          </p>
                          
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {t('childDetails.createdAt')}: {formatDate(exam.created_at)}
                          </div>
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  <div className="text-center py-16">
                    <FileQuestion className="w-24 h-24 mx-auto text-gray-400 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {t('childDetails.noExams')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {t('childDetails.noExamsAvailable')}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardHeader>
        </Card>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.7s ease-out forwards; }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default ChildDetails;