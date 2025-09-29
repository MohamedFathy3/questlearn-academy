import { Star, Clock, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom"; // ✅ import useNavigate
import { useCallback } from "react"; // optional but clean

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  price: number;
  originalPrice?: number;
  rating: number;
  studentsCount: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  category: string;
  isNew?: boolean;
  isBestseller?: boolean;
  type?: string;
}

const CourseCard = ({
  id,
  title,
  instructor,
  thumbnail,
  price,
  originalPrice,
  studentsCount,
  duration,
  level,
  category,
  isNew,
  isBestseller,
  type = "recorded"
}: CourseCardProps) => {
  const navigate = useNavigate();

  const discount = originalPrice && originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  // ✅ handleEnroll now navigates to course details
  const handleEnrollClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/course/${id}`);
  }, [id, navigate]);

  return (
    <Link to={`/course/${id}`} className="block">
      <Card className="group course-card-hover bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="relative overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {isNew && (
              <Badge className="bg-tan hover:bg-green-600 text-white border-0 text-xs">
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

        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-blue-500 transition-colors duration-200">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground"> {instructor}</p>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{studentsCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
          </div>

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

        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {price === 0 ? (
              <span className="text-xl font-bold text-green-600">Free</span>
            ) : (
              <>
                <span className="text-xl font-bold text-tan">${price}</span>
                {originalPrice && originalPrice > price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${originalPrice}
                  </span>
                )}
              </>
            )}
          </div>
          <Button 
            size="sm" 
            className="bg-tan hover:bg-tan/90 transition-colors"
            onClick={handleEnrollClick} // ✅ go to course details
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
