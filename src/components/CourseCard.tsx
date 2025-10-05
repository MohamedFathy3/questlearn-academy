import { Star, Clock, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link, useNavigate } from "react-router-dom";
import { useCallback } from "react";

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  rating: number;
  studentsCount: number;
  maxStudents?: number; // ✅ إضافة العدد الأقصى للطلاب
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  category: string;
  isNew?: boolean;
  isBestseller?: boolean;
  type?: string;
  currency?: string;
  enrollmentProgress?: number; // ✅ إضافة نسبة الاشتراك
}

const CourseCard = ({
  id,
  title,
  instructor,
  thumbnail,
  price,
  originalPrice,
  studentsCount,
  maxStudents = 100, // ✅ قيمة افتراضية
  duration,
  level,
  category,
  isNew,
  isBestseller,
  type = "recorded",
  currency = "USD",
  enrollmentProgress // ✅ نسبة الاشتراك
}: CourseCardProps) => {
  const navigate = useNavigate();

  const discount = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  // ✅ حساب نسبة الاشتراك تلقائياً إذا لم تكن موجودة
  const progress = enrollmentProgress !== undefined 
    ? enrollmentProgress 
    : maxStudents > 0 
      ? Math.min(100, (studentsCount / maxStudents) * 100)
      : 0;

  const handleEnrollClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/course/${id}`);
  }, [id, navigate]);

  return (
    <Link to={`/course/${id}`} className="block">
      <Card className="group course-card-hover bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative overflow-hidden flex-shrink-0">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // ✅ صورة بديلة في حالة الخطأ
              e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Course+Image';
            }}
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {isNew && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 text-xs">
                New
              </Badge>
            )}
            {isBestseller && (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 text-xs">
                Bestseller
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {discount}% OFF
              </Badge>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-blue-500 dark:bg-gray-800/90 backdrop-blur text-xs">
              {type === 'recorded' ? ' Recorded' : ' Online'}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-3 flex-grow">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-blue-500 transition-colors duration-200">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground"> {instructor}</p>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{studentsCount.toLocaleString()} enrolled</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
          </div>

          {/* ✅ شريط تقدم الاشتراك */}
          {maxStudents > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Enrollment Progress</span>
                <span>{studentsCount}/{maxStudents} students</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-xs text-muted-foreground text-center">
                {progress.toFixed(0)}% filled
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                level === "Beginner" 
                  ? "border-green-500 text-green-600" 
                  : level === "Intermediate" 
                  ? "border-yellow-500 text-yellow-600" 
                  : level === "Advanced"
                  ? "border-red-500 text-red-600"
                  : "border-blue-500 text-blue-600"
              }`}
            >
              {level}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            {price === 0 ? (
              <span className="text-xl font-bold text-green-600">Free</span>
            ) : (
              <>
                {/* ✅ إزالة علامة الدولار وعرض العملة من API */}
                <span className="text-xl font-bold text-tan">
                  {price.toLocaleString()} {currency}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {originalPrice.toLocaleString()} {currency}
                  </span>
                )}
              </>
            )}
          </div>
          <Button 
            size="sm" 
            className="bg-tan hover:bg-tan/90 transition-colors"
            onClick={handleEnrollClick}
          >
            <BookOpen className="w-4 h-4 mr-1" />
            حجز الآن
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;