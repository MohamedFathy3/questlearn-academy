import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, Grid, List, ChevronDown, Loader2 } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { apiFetch } from '@/lib/api';
import { useTranslation } from 'react-i18next';

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
    certificate_image: string | null;
    experience_image: string | null;
    students_count: number;
    courses_count: number;
    total_income: number;
    total_rate: number;
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
  average_rating?: number;
}

interface ApiResponse {
  data: Course[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
      url: string | null;
      label: string;
      active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  result: string;
  message: string;
  status: number;
}

const Courses = () => {
  const { t, i18n } = useTranslation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    price: "",
    teacher: "",
    sort: "popular"
  });

  // Fetch courses from API
  const fetchCourses = async (page = 1, loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch('/api/course/index', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          filters: {
            active: true // ✅ جلب الكورسات النشطة فقط
          },
          orderBy: filters.sort === 'newest' ? 'created_at' : 'id',
          orderByDirection: filters.sort === 'price-low' ? 'asc' : 'desc',
          perPage: 12, // ✅ زيادة العدد لتحسين تجربة المستخدم
          paginate: true,
          delete: false,
          page: page,
          include: ['teacher', 'subject', 'stage', 'country', 'details'] // ✅ تضمين العلاقات
        })
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch courses');
      }

      if (data.result === "Success" && data.data) {
        // ✅ تصفية الكورسات النشطة فقط
        const activeCourses = data.data.filter(course => course.active !== false);
        
        if (loadMore) {
          setCourses(prev => [...prev, ...activeCourses]);
        } else {
          setCourses(activeCourses);
        }
        
        setHasMore(data.meta.current_page < data.meta.last_page);
        setCurrentPage(data.meta.current_page);
      } else {
        setError(data.message || 'Failed to fetch courses');
      }
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'An error occurred while loading courses');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Apply filters whenever filters or courses change
  useEffect(() => {
    applyFilters();
  }, [filters, courses, searchTerm]);

  // ✅ تطبيق الفلاتر بناءً على البيانات الحقيقية
  const applyFilters = () => {
    let filtered = [...courses];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course => {
        const searchLower = searchTerm.toLowerCase();
        return (
          course.title?.toLowerCase().includes(searchLower) ||
          course.description?.toLowerCase().includes(searchLower) ||
          course.teacher?.name?.toLowerCase().includes(searchLower) ||
          course.subject?.name?.toLowerCase().includes(searchLower) ||
          course.stage?.name?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Category filter - استخدام subject أو stage
    if (filters.category) {
      filtered = filtered.filter(course =>
        course.subject?.name?.toLowerCase() === filters.category.toLowerCase() ||
        course.stage?.name?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Level filter - استخدام البيانات الحقيقية
    if (filters.level) {
      filtered = filtered.filter(course => {
        const transformed = transformCourseData(course);
        return transformed.level.toLowerCase() === filters.level.toLowerCase();
      });
    }

    // Price filter - استخدام الأسعار الحقيقية
    if (filters.price) {
      filtered = filtered.filter(course => {
        const price = parseFloat(course.price || "0");
        if (filters.price === 'free') return price === 0;
        if (filters.price === '$0-$50') return price > 0 && price <= 50;
        if (filters.price === '$50-$100') return price > 50 && price <= 100;
        if (filters.price === '$100+') return price > 100;
        return true;
      });
    }

    // Teacher filter
    if (filters.teacher) {
      filtered = filtered.filter(course =>
        course.teacher?.name?.toLowerCase().includes(filters.teacher.toLowerCase())
      );
    }

    // Sort filter
    if (filters.sort) {
      filtered.sort((a, b) => {
        const aPrice = parseFloat(a.price || "0");
        const bPrice = parseFloat(b.price || "0");
        
        switch (filters.sort) {
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'rating':
            return (b.teacher?.total_rate || 0) - (a.teacher?.total_rate || 0);
          case 'price-low':
            return aPrice - bPrice;
          case 'price-high':
            return bPrice - aPrice;
          case 'popular':
          default:
            return (b.count_student || 0) - (a.count_student || 0);
        }
      });
    }

    setFilteredCourses(filtered);
  };

const transformCourseData = (course: Course) => {
  const originalPrice = parseFloat(course.original_price || "0");
  const currentPrice = parseFloat(course.price || "0");
  const discountValue = parseFloat(course.discount || "0");
  const hasDiscount = originalPrice > currentPrice && discountValue > 0;
  
  // ✅ بيانات المحتوى الحقيقي
  const videoLessons = course.details?.filter(detail => 
    detail.content_type === 'video' && detail.content_link
  ) || [];
  
  const pdfLessons = course.details?.filter(detail => 
    detail.content_type === 'pdf' && detail.file_path
  ) || [];
  
  const liveSessions = course.details?.filter(detail => 
    detail.content_type === 'live' && detail.session_date
  ) || [];

  // ✅ حساب المدة بناءً على المحتوى الحقيقي
  const getEstimatedDuration = () => {
    const totalLessons = videoLessons.length + pdfLessons.length + liveSessions.length;
    if (totalLessons === 0) return t('courses.flexible', 'Flexible');
    
    const videoMinutes = videoLessons.length * 45;
    const pdfMinutes = pdfLessons.length * 30;
    const liveMinutes = liveSessions.length * 60;
    
    const totalMinutes = videoMinutes + pdfMinutes + liveMinutes;
    const totalHours = Math.ceil(totalMinutes / 60);
    
    if (totalHours <= 2) return "1-2 " + t('courses.hours', 'hours');
    if (totalHours <= 5) return "3-5 " + t('courses.hours', 'hours');
    if (totalHours <= 10) return "6-10 " + t('courses.hours', 'hours');
    return totalHours + "+ " + t('courses.hours', 'hours');
  };

  // ✅ تحديد المستوى بناءً على البيانات الحقيقية
  const getCourseLevel = () => {
    const title = course.title ? course.title.toLowerCase() : "";
    const description = course.description ? course.description.toLowerCase() : "";
    
    if (title.includes('basic') || title.includes('intro') || title.includes('beginner') || 
        description.includes('basic') || description.includes('intro') || description.includes('beginner')) {
      return t('courses.beginner', 'Beginner');
    } else if (title.includes('advanced') || title.includes('expert') || 
               description.includes('advanced') || description.includes('expert')) {
      return t('courses.advanced', 'Advanced');
    } else if (title.includes('intermediate') || description.includes('intermediate')) {
      return t('courses.intermediate', 'Intermediate');
    }
    return t('courses.allLevels', 'All Levels');
  };

  // ✅ إصلاح نهائي لـ enrollmentProgress
  const getEnrollmentProgress = () => {
    const maxStudents = 100;
    const currentStudents = course.count_student || course.subscribers_count || 0;
    const percentage = Math.min((currentStudents / maxStudents) * 100, 100);
    return Math.round(percentage);
  };

  const enrollmentProgress = getEnrollmentProgress();

  return {
    // ✅ البيانات الأساسية
    id: course.id.toString(),
    title: course.title || t('courses.untitled', 'Untitled Course'),
    description: course.description || '',
    instructor: course.teacher?.name || t('courses.unknownInstructor', 'Unknown Instructor'),
    instructorImage: course.teacher?.image || null,
    thumbnail: course.image || '/images/placeholder-course.jpg',
    
    // ✅ البيانات المالية
    price: currentPrice,
    originalPrice: hasDiscount ? originalPrice : undefined,
    discount: hasDiscount ? discountValue : undefined,
    currency: course.currency || "EGP",
    isFree: currentPrice === 0,
    
    // ✅ بيانات التقييم
    rating: course.teacher?.total_rate || 0,
    reviewsCount: course.views_count || 0,
    studentsCount: course.count_student || course.subscribers_count || 0,
    
    // ✅ بيانات المحتوى
    duration: getEstimatedDuration(),
    level: getCourseLevel(),
    category: course.subject?.name || course.stage?.name || t('courses.general', 'General'),
    subject: course.subject?.name || '',
    stage: course.stage?.name || '',
    lessonsCount: course.details?.length || 0,
    videoLessonsCount: videoLessons.length,
    resourcesCount: pdfLessons.length,
    liveSessionsCount: liveSessions.length,
    
    // ✅ إصلاح نهائي - تمرير رقم فقط
    enrollmentProgress: enrollmentProgress,
    
    // ✅ بيانات الحالة
    isBestseller: course.views_count > 500 || (course.count_student || 0) > 50,
    isNew: Date.now() - new Date(course.created_at).getTime() < 7 * 24 * 60 * 60 * 1000,
    isTrending: course.views_count > 1000,
    
    // ✅ بيانات المعلم
    teacherRating: course.teacher?.total_rate || 0,
    teacherExperience: course.teacher?.students_count || 0,
    teacherCoursesCount: course.teacher?.courses_count || 0,
    courseType: course.course_type || 'group',
    country: course.country?.name || 'International',
    
    // ✅ مؤشرات المحتوى
    hasVideoContent: videoLessons.length > 0,
    hasResources: pdfLessons.length > 0,
    hasLiveSessions: liveSessions.length > 0,
    hasIntroVideo: !!course.intro_video_url,
    learningPoints: course.what_you_will_learn ? 
      course.what_you_will_learn.split(',').filter(point => point.trim()) : 
      [],
    
    // ✅ بيانات إضافية
    createdAt: course.created_at,
    viewsCount: course.views_count || 0,
    active: course.active !== false
  };
};

  const loadMoreCourses = () => {
    if (hasMore && !loadingMore) {
      fetchCourses(currentPage + 1, true);
    }
  };

  // Get unique categories from courses
  const getUniqueCategories = () => {
    const categories = courses
      .map(course => course.subject?.name || course.stage?.name)
      .filter(Boolean)
      .filter((name): name is string => typeof name === 'string');
    
    return [t('courses.allCategories', 'All Categories'), ...Array.from(new Set(categories))];
  };

  // Get unique teachers from courses
  const getUniqueTeachers = () => {
    const teachers = courses
      .map(course => course.teacher?.name)
      .filter(Boolean)
      .filter((name): name is string => typeof name === 'string');
    
    return [t('courses.allTeachers', 'All Teachers'), ...Array.from(new Set(teachers))];
  };

  const categories = getUniqueCategories();
  const teachers = getUniqueTeachers();
  
  const levels = [
    t('courses.allLevels', 'All Levels'), 
    t('courses.beginner', 'Beginner'), 
    t('courses.intermediate', 'Intermediate'), 
    t('courses.advanced', 'Advanced')
  ];
  
  const priceRanges = [
    t('courses.allPrices', 'All Prices'), 
    t('courses.free', 'Free'), 
    "$0-$50", 
    "$50-$100", 
    "$100+"
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      level: "",
      price: "",
      teacher: "",
      sort: "popular"
    });
    setSearchTerm("");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (error && courses.length === 0) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            <p>{t('common.error', 'Error')}: {error}</p>
            <Button onClick={() => fetchCourses()} className="mt-4">
              {t('common.tryAgain', 'Try Again')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            {t('courses.title', 'All')} <span className="text-tan">{t('courses.courses', 'Courses')}</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('courses.discover', 'Discover thousands of courses across various categories')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-xl p-6 shadow-soft mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
                <Input 
                  placeholder={t('common.search', 'Search courses...')}
                  className={`${i18n.language === 'ar' ? 'pr-10' : 'pl-10'} bg-background`}
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                {t('common.filter', 'Filters')}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className={`${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('courses.category', 'Category')}</label>
                <Select 
                  value={filters.category} 
                  onValueChange={(value) => handleFilterChange('category', value === t('courses.allCategories', 'All Categories').toLowerCase() ? '' : value)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={t('courses.allCategories', 'All Categories')} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('courses.level', 'Level')}</label>
                <Select 
                  value={filters.level} 
                  onValueChange={(value) => handleFilterChange('level', value === t('courses.allLevels', 'All Levels').toLowerCase() ? '' : value)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={t('courses.allLevels', 'All Levels')} />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level.toLowerCase()}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('courses.price', 'Price')}</label>
                <Select 
                  value={filters.price} 
                  onValueChange={(value) => handleFilterChange('price', value === t('courses.allPrices', 'All Prices').toLowerCase() ? '' : value)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={t('courses.allPrices', 'All Prices')} />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range} value={range.toLowerCase()}>
                        {range}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('courses.teacher', 'Teacher')}</label>
                <Select 
                  value={filters.teacher} 
                  onValueChange={(value) => handleFilterChange('teacher', value === t('courses.allTeachers', 'All Teachers').toLowerCase() ? '' : value)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={t('courses.allTeachers', 'All Teachers')} />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher} value={teacher.toLowerCase()}>
                        {teacher}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('common.sort', 'Sort by')}</label>
                <Select 
                  value={filters.sort} 
                  onValueChange={(value) => handleFilterChange('sort', value)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={t('courses.mostPopular', 'Most Popular')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">{t('courses.mostPopular', 'Most Popular')}</SelectItem>
                    <SelectItem value="newest">{t('courses.newest', 'Newest')}</SelectItem>
                    <SelectItem value="rating">{t('courses.highestRated', 'Highest Rated')}</SelectItem>
                    <SelectItem value="price-low">{t('courses.priceLowToHigh', 'Price: Low to High')}</SelectItem>
                    <SelectItem value="price-high">{t('courses.priceHighToLow', 'Price: High to Low')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Applied Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {searchTerm && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {t('common.search', 'Search')}: {searchTerm}
              <button 
                className="ml-2 hover:text-destructive"
                onClick={() => setSearchTerm("")}
              >
                ×
              </button>
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {t('courses.category', 'Category')}: {filters.category}
              <button 
                className="ml-2 hover:text-destructive"
                onClick={() => handleFilterChange('category', '')}
              >
                ×
              </button>
            </Badge>
          )}
          {filters.level && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {t('courses.level', 'Level')}: {filters.level}
              <button 
                className="ml-2 hover:text-destructive"
                onClick={() => handleFilterChange('level', '')}
              >
                ×
              </button>
            </Badge>
          )}
          {filters.price && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {t('courses.price', 'Price')}: {filters.price}
              <button 
                className="ml-2 hover:text-destructive"
                onClick={() => handleFilterChange('price', '')}
              >
                ×
              </button>
            </Badge>
          )}
          {filters.teacher && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {t('courses.teacher', 'Teacher')}: {filters.teacher}
              <button 
                className="ml-2 hover:text-destructive"
                onClick={() => handleFilterChange('teacher', '')}
              >
                ×
              </button>
            </Badge>
          )}
          {(searchTerm || filters.category || filters.level || filters.price || filters.teacher) && (
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={clearFilters}>
              {t('common.clearAll', 'Clear all filters')}
            </Button>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {t('courses.showingResults', 'Showing')} <span className="font-semibold text-foreground">{filteredCourses.length}</span> {t('courses.results', 'results')}
          </p>
        </div>

        <Separator className="mb-8" />

        {/* Courses Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-tan" />
            <span className="ml-2">{t('common.loading', 'Loading courses...')}</span>
          </div>
        ) : filteredCourses.length > 0 ? (
          <>
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            }`}>
              {filteredCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  {...transformCourseData(course)}
                />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-12">
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={loadMoreCourses}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('common.loading', 'Loading...')}
                    </>
                  ) : (
                    t('courses.loadMore', 'Load More Courses')
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">{t('courses.noCoursesFound', 'No courses found')}</h3>
              <p>{t('courses.adjustFilters', 'Try adjusting your filters or search terms')}</p>
            </div>
            <Button onClick={clearFilters}>
              {t('common.clearFilters', 'Clear Filters')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;