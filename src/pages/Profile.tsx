import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  BookOpen, 
  Award, 
  Clock, 
  Mail,
  QrCode,
  Calendar,
  CheckCircle2,
  PlayCircle
} from "lucide-react";
import { apiFetch } from '@/lib/api';

interface EnrolledCourse {
  id: number;
  title: string;
  description: string;
  image: string | null;
  progress: number;
  instructor: string;
  duration: string;
  enrolled_date: string;
  completion_date: string | null;
  price: string;
  subject: {
    name: string;
  };
}

interface ProfileStats {
  total_courses: number;
  completed_courses: number;
  in_progress_courses: number;
  total_study_time: string;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("courses");
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // جلب الكورسات المسجل فيها
      const coursesResponse = await apiFetch<any>("/student/enrolled-courses");
      console.log("📚 Enrolled courses response:", coursesResponse);
      
      if (coursesResponse.result === "Success" && coursesResponse.data) {
        setEnrolledCourses(coursesResponse.data);
      } else {
        // بيانات تجريبية للعرض
        setEnrolledCourses([
          {
            id: 1,
            title: "Mathematics Basics",
            description: "Learn basic mathematics concepts",
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop",
            progress: 75,
            instructor: "Dr. Ahmed Ali",
            duration: "10 hours",
            enrolled_date: "2024-01-15",
            completion_date: null,
            price: "200.00",
            subject: { name: "Mathematics" }
          },
          {
            id: 2,
            title: "Web Development Fundamentals",
            description: "Introduction to web development",
            image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop",
            progress: 100,
            instructor: "Sarah Johnson",
            duration: "15 hours",
            enrolled_date: "2024-01-10",
            completion_date: "2024-02-01",
            price: "150.00",
            subject: { name: "Programming" }
          },
          {
            id: 3,
            title: "English Language Course",
            description: "Improve your English skills",
            image: "https://images.unsplash.com/photo-1581094794329-c6fe63c7e4a5?w=300&h=200&fit=crop",
            progress: 30,
            instructor: "Mr. John Smith",
            duration: "20 hours",
            enrolled_date: "2024-01-20",
            completion_date: null,
            price: "180.00",
            subject: { name: "Languages" }
          }
        ]);
      }

      // جلب الإحصائيات
      const statsResponse = await apiFetch<any>("/student/stats");
      console.log("📊 Stats response:", statsResponse);
      
      if (statsResponse.result === "Success" && statsResponse.data) {
        setStats(statsResponse.data);
      } else {
        // إحصائيات تجريبية
        setStats({
          total_courses: 5,
          completed_courses: 2,
          in_progress_courses: 3,
          total_study_time: "45h 30m"
        });
      }

    } catch (error) {
      console.error("❌ Error fetching profile data:", error);
      // بيانات تجريبية كاملة عند فشل الـ API
      setEnrolledCourses([
        {
          id: 1,
          title: "Mathematics Basics",
          description: "Learn basic mathematics concepts",
          image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop",
          progress: 75,
          instructor: "Dr. Ahmed Ali",
          duration: "10 hours",
          enrolled_date: "2024-01-15",
          completion_date: null,
          price: "200.00",
          subject: { name: "Mathematics" }
        },
        {
          id: 2,
          title: "Web Development Fundamentals",
          description: "Introduction to web development",
          image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop",
          progress: 100,
          instructor: "Sarah Johnson",
          duration: "15 hours",
          enrolled_date: "2024-01-10",
          completion_date: "2024-02-01",
          price: "150.00",
          subject: { name: "Programming" }
        }
      ]);

      setStats({
        total_courses: 5,
    
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    return "bg-tan";
  };

  const getProgressText = (progress: number) => {
    if (progress === 100) return t('profile.completed');
    if (progress > 0) return t('profile.inProgress');
    return t('profile.notStarted');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tan mx-auto"></div>
            <p className="mt-4 text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Profile Card */}
          <Card className="lg:col-span-1 border-tan/20">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24 mx-auto border-4 border-background shadow-lg">
                    <AvatarImage src={user?.image || undefined} alt={user?.name} />
                    <AvatarFallback className="text-lg bg-tan text-white">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-background">
                    <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse"></div>
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-foreground">{user?.name}</h1>
                  <p className="text-muted-foreground flex items-center justify-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                  <Badge variant="secondary" className="mt-2 bg-tan/10 text-tan border-tan/20">
                    {user?.type}
                  </Badge>
                </div>

                {user?.qr_code && (
                  <div className="bg-muted p-3 rounded-lg inline-block">
                    <div className="text-center">
                      <QrCode className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">ID: {user.qr_code}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <Button 
                    className="w-full bg-tan hover:bg-tan/90 text-white" 
                    onClick={logout}
                  >
                    {t('profile.logout')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <Card className="lg:col-span-2 border-tan/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Award className="w-6 h-6 text-tan" />
                {t('profile.learningStats')}
              </CardTitle>
              <CardDescription>{t('profile.yourLearningProgress')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-tan/5 rounded-lg border border-tan/10">
                  <BookOpen className="w-8 h-8 text-tan mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stats?.total_courses || 0}</div>
                  <div className="text-sm text-muted-foreground">{t('profile.totalCourses')}</div>
                </div>
                
                <div className="text-center p-4 bg-green-500/5 rounded-lg border border-green-500/10">
                  <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stats?.completed_courses || 0}</div>
                  <div className="text-sm text-muted-foreground">{t('profile.completed')}</div>
                </div>
                
                <div className="text-center p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
                  <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stats?.in_progress_courses || 0}</div>
                  <div className="text-sm text-muted-foreground">{t('profile.inProgress')}</div>
                </div>
                
                <div className="text-center p-4 bg-purple-500/5 rounded-lg border border-purple-500/10">
                  <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stats?.total_study_time || '0h'}</div>
                  <div className="text-sm text-muted-foreground">{t('profile.studyTime')}</div>
                </div>
              </div>

              {/* Progress Overview */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{t('profile.overallProgress')}</span>
                    <span className="text-tan font-semibold">
                      {Math.round((stats?.completed_courses || 0) / (stats?.total_courses || 1) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(stats?.completed_courses || 0) / (stats?.total_courses || 1) * 100} 
                    className="h-3 bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Section Only */}
        <Card className="border-tan/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="w-6 h-6 text-tan" />
              {t('profile.myCourses')}
            </CardTitle>
            <CardDescription>
              {enrolledCourses.length} {t('profile.coursesYouAreEnrolledIn')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map((course) => (
                  <div 
                    key={course.id} 
                    className="flex flex-col lg:flex-row items-start gap-6 p-6 rounded-lg border border-tan/20 hover:border-tan/40 transition-all duration-300 hover:shadow-md"
                  >
                    {/* Course Image */}
                    <img 
                      src={course.image || "/api/placeholder/200/150"} 
                      alt={course.title}
                      className="w-full lg:w-48 h-32 rounded-lg object-cover shadow-sm"
                    />
                    
                    {/* Course Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                              {course.subject?.name}
                            </Badge>
                            <Badge variant="outline" className="bg-tan/10 text-tan border-tan/20">
                              ${course.price}
                            </Badge>
                          </div>
                          
                          <h3 className="text-xl font-semibold text-foreground mb-2">
                            {course.title}
                          </h3>
                          
                          <p className="text-muted-foreground mb-3 line-clamp-2">
                            {course.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {course.instructor}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {t('profile.enrolledOn')} {formatDate(course.enrolled_date)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Progress Section */}
                        <div className="flex flex-col items-end gap-3 min-w-[200px]">
                          <div className="text-right">
                            <div className="flex items-center gap-2 justify-end mb-1">
                              <span className={`text-sm font-semibold ${
                                course.progress === 100 ? 'text-green-500' : 
                                course.progress >= 50 ? 'text-blue-500' : 'text-tan'
                              }`}>
                                {course.progress}%
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {getProgressText(course.progress)}
                              </span>
                            </div>
                            <Progress 
                              value={course.progress} 
                              className={`h-2 w-32 bg-muted ${getProgressColor(course.progress)}`}
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              className={`${
                                course.progress === 100 
                                  ? 'bg-green-500 hover:bg-green-600' 
                                  : 'bg-tan hover:bg-tan/90'
                              } text-white`}
                            >
                              {course.progress === 100 ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  {t('profile.completed')}
                                </>
                              ) : (
                                <>
                                  <PlayCircle className="w-4 h-4 mr-1" />
                                  {t('profile.continue')}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-20 h-20 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-2xl font-semibold text-foreground mb-3">
                    {t('profile.noCourses')}
                  </h3>
                  <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
                    {t('profile.enrollInCoursesToSeeThemHere')}
                  </p>
                  <Button size="lg" className="bg-tan hover:bg-tan/90 text-white">
                    {t('profile.browseCourses')}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;