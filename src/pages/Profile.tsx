import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
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
  Shield
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
  teacher: {
    name: string;
    image?: string;
  };
  subject: {
    name: string;
  };
  details: Array<{
    id: number;
    title: string;
    content_type: string;
  }>;
  stage?: {
    name: string;
  };
  country?: {
    name: string;
  };
}

interface EnrolledCourse {
  id: number;
  title: string;
  description: string;
  image: string;
  progress: number;
  instructor: string;
  instructorImage?: string;
  duration: string;
  enrolled_date: string;
  price: string;
  subject: {
    name: string;
  };
  stage?: string;
  country?: string;
  total_lessons: number;
  completed_lessons: number;
}

interface ProfileStats {
  total_courses: number;
  total_study_time: string;
  overall_progress: number;
  success_rate: number;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    processUserData();
  }, [user]);

  const processUserData = () => {
    try {
      setLoading(true);
      
      if (user?.courses?.length > 0) {
        console.log("🎯 Processing user courses:", user.courses);
        
        const formattedCourses = user.courses.map((course: Course) => {
          const totalLessons = course.details?.length || 0;
          const completedLessons = calculateCompletedLessons(course);
          const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

          return {
            id: course.id,
            title: course.title,
            description: course.description,
            image: course.image || "https://www.shutterstock.com/image-vector/online-courses-elearning-vector-background-260nw-1725725059.jpg",
            progress: progress,
            instructor: course.teacher?.name || t('profile.unknownInstructor'),
            instructorImage: course.teacher?.image,
            duration: `${totalLessons} ${t('profile.lessons')}`,
            enrolled_date: getEnrollmentDate(course),
            price: course.price,
            subject: course.subject,
            stage: course.stage?.name,
            country: course.country?.name,
            total_lessons: totalLessons,
            completed_lessons: completedLessons
          };
        });
        
        setEnrolledCourses(formattedCourses);

        const totalCourses = formattedCourses.length;
        const overallProgress = totalCourses > 0 ? 
          Math.round(formattedCourses.reduce((sum, course) => sum + course.progress, 0) / totalCourses) : 0;
        const successRate = calculateSuccessRate(formattedCourses);

        setStats({
          total_courses: totalCourses,
          total_study_time: calculateTotalStudyTime(formattedCourses),
          overall_progress: overallProgress,
          success_rate: successRate
        });
      } else {
        setEnrolledCourses([]);
        setStats({
          total_courses: 0,
          total_study_time: "0h 0m",
          overall_progress: 0,
          success_rate: 0
        });
      }

    } catch (error) {
      console.error("❌ Error processing user data:", error);
      setEnrolledCourses([]);
      setStats({
        total_courses: 0,
        total_study_time: "0h 0m",
        overall_progress: 0,
        success_rate: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletedLessons = (course: Course): number => {
    const total = course.details?.length || 0;
    return Math.floor(Math.random() * (total + 1));
  };

  const calculateTotalStudyTime = (courses: EnrolledCourse[]): string => {
    const totalMinutes = courses.reduce((total, course) => {
      return total + (course.total_lessons * 45);
    }, 0);
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  const calculateSuccessRate = (courses: EnrolledCourse[]): number => {
    if (courses.length === 0) return 0;
    const avgProgress = courses.reduce((sum, course) => sum + course.progress, 0) / courses.length;
    return Math.round(avgProgress);
  };

  const getEnrollmentDate = (course: Course): string => {
    const dates = ['2024-01-15', '2024-01-20', '2024-02-01', '2024-02-10'];
    return dates[Math.floor(Math.random() * dates.length)];
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-1 h-80 bg-white/50 dark:bg-gray-800/50 rounded-2xl"></div>
              <div className="lg:col-span-2 h-80 bg-white/50 dark:bg-gray-800/50 rounded-2xl"></div>
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-40 bg-white/50 dark:bg-gray-800/50 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/30 py-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Profile Card */}
          <Card className="lg:col-span-1 border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-tan to-amber-600"></div>
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="relative inline-block">
                  <div className="relative">
                    <Avatar className="w-28 h-28 mx-auto border-4 border-white dark:border-gray-800 shadow-2xl">
                      <AvatarImage src={user?.image || undefined} alt={user?.name} />
                      <AvatarFallback className="text-xl bg-gradient-to-br from-tan to-amber-600 text-white font-semibold">
                        {user?.name ? getInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-4 border-white dark:border-gray-800 shadow-lg">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2 mt-2">
                      <Mail className="w-4 h-4" />
                      {user?.email}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary" className="bg-tan/10 text-tan border-tan/20 px-3 py-1">
                      {user?.type || t('profile.student')}
                    </Badge>
                    {user?.total_rate && (
                      <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
                        <Star className="w-3 h-3 fill-yellow-500 mr-1" />
                        {user.total_rate}/5
                      </Badge>
                    )}
                  </div>
                </div>

                {user?.qr_code && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <QrCode className="w-10 h-10 mx-auto mb-3 text-gray-400 dark:text-gray-500" />
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Student ID</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{user.qr_code}</p>
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    className="w-full bg-gradient-to-r from-tan to-amber-600 hover:from-amber-600 hover:to-tan text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    onClick={logout}
                  >
                    {t('profile.logout')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <Card className="lg:col-span-2 border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
                <Award className="w-7 h-7 text-tan" />
                {t('profile.learningStats')}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                {t('profile.yourLearningProgress')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { 
                    icon: BookOpen, 
                    value: stats?.total_courses || 0, 
                    label: t('profile.totalCourses'), 
                    gradient: 'from-blue-500 to-blue-600'
                  },
                  { 
                    icon: GraduationCap, 
                    value: stats?.success_rate || 0, 
                    label: t('profile.successRate'), 
                    gradient: 'from-green-500 to-green-600',
                    suffix: '%'
                  },
                  { 
                    icon: Clock, 
                    value: stats?.total_study_time || '0h 0m', 
                    label: t('profile.studyTime'), 
                    gradient: 'from-orange-500 to-orange-600'
                  },
                  { 
                    icon: Award, 
                    value: stats?.overall_progress || 0, 
                    label: t('profile.overallProgress'), 
                    gradient: 'from-purple-500 to-purple-600',
                    suffix: '%'
                  }
                ].map((stat, index) => (
                  <div 
                    key={stat.label}
                    className="text-center p-6 rounded-xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}{stat.suffix || ''}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Progress Overview */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 dark:text-white">{t('profile.learningProgress')}</span>
                  <span className="text-tan font-bold text-lg">
                    {stats?.overall_progress || 0}%
                  </span>
                </div>
                <Progress 
                  value={stats?.overall_progress || 0} 
                  className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Section */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden">
          <div className="h-3 bg-gradient-to-r from-green-500 to-emerald-600"></div>
          <CardHeader className="pb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
                  <BookOpen className="w-7 h-7 text-tan" />
                  {t('profile.myCourses')}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                  {enrolledCourses.length} {t('profile.coursesYouAreEnrolledIn')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map((course, index) => (
                  <div 
                    key={course.id} 
                    className="group flex flex-col lg:flex-row items-start gap-6 p-6 rounded-xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-700/50 border border-gray-200/50 dark:border-gray-700/50 hover:border-tan/40 transition-all duration-500 hover:shadow-lg"
                  >
                    {/* Course Image */}
                    <div className="relative w-full lg:w-56 h-40 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={course.image || "/api/placeholder/224/160"} 
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
                              {course.subject?.name}
                            </Badge>
                            <Badge variant="outline" className="bg-tan/10 text-tan border-tan/20 font-medium">
                              ${course.price}
                            </Badge>
                            {course.stage && (
                              <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 font-medium">
                                {course.stage}
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-tan transition-colors duration-300">
                            {course.title}
                          </h3>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={course.instructorImage} />
                                <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-600">
                                  {getInitials(course.instructor)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{course.instructor}</span>
                            </div>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(course.enrolled_date)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Progress Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex-1">
                                <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  <span>{t('profile.progress')}</span>
                                  <span className={course.progress === 100 ? 'text-green-600' : 'text-tan'}>
                                    {course.progress}%
                                  </span>
                                </div>
                                <Progress 
                                  value={course.progress} 
                                  className={`h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${getProgressColor(course.progress)}`}
                                />
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {course.completed_lessons}/{course.total_lessons} {t('profile.lessonsCompleted')}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                                  <Link to={`/Detailscourse/${course.id}`}>

                            <Button 
                              size="sm"
                              className={`font-medium transition-all duration-300 hover:scale-105 ${
                                course.progress === 100 
                                  ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
                                  : 'bg-tan hover:bg-tan/90 shadow-tan/20'
                              } text-white shadow-lg`}
                            >
                              {course.progress === 100 ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  {t('profile.completed')}
                                </>
                              ) : (
                                <>
                                    <PlayCircle className="w-4 h-4 mr-2" />
                                    {t('profile.continue')}
                                </>
                              )}
                            </Button>
                                  </Link>
  
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {t('profile.noCourses')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                    {t('profile.enrollInCoursesToSeeThemHere')}
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-tan to-amber-600 hover:from-amber-600 hover:to-tan text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8"
                  >
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