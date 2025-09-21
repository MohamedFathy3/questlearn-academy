import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, Grid, List, ChevronDown } from "lucide-react";
import CourseCard from "@/components/CourseCard";

const Courses = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Sample courses data
  const courses = [
    {
      id: "1",
      title: "Complete Web Development Bootcamp 2024",
      instructor: "Angela Yu",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
      price: 49.99,
      originalPrice: 199.99,
      rating: 4.8,
      studentsCount: 85342,
      duration: "65 hours",
      level: "Beginner" as const,
      category: "Web Development",
      isBestseller: true,
    },
    {
      id: "2",
      title: "Machine Learning A-Z: AI & Python",
      instructor: "Kirill Eremenko",
      thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
      price: 0,
      rating: 4.9,
      studentsCount: 67891,
      duration: "44 hours",
      level: "Intermediate" as const,
      category: "Data Science",
      isNew: true,
    },
    {
      id: "3",
      title: "Digital Marketing Masterclass",
      instructor: "Phil Ebiner",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      price: 34.99,
      originalPrice: 149.99,
      rating: 4.7,
      studentsCount: 43567,
      duration: "28 hours",
      level: "Beginner" as const,
      category: "Marketing",
    },
    {
      id: "4",
      title: "UI/UX Design Fundamentals",
      instructor: "Daniel Walter Scott",
      thumbnail: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
      price: 39.99,
      originalPrice: 179.99,
      rating: 4.6,
      studentsCount: 29834,
      duration: "32 hours",
      level: "Beginner" as const,
      category: "Design",
      isBestseller: true,
    },
    {
      id: "5",
      title: "React Native - The Practical Guide 2024",
      instructor: "Maximilian Schwarzmüller",
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
      price: 54.99,
      originalPrice: 189.99,
      rating: 4.8,
      studentsCount: 52341,
      duration: "48 hours",
      level: "Intermediate" as const,
      category: "Mobile Development",
    },
    {
      id: "6",
      title: "Photography Masterclass: Complete Guide",
      instructor: "Phil Ebiner",
      thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=300&fit=crop",
      price: 0,
      rating: 4.5,
      studentsCount: 38975,
      duration: "22 hours",
      level: "Beginner" as const,
      category: "Photography",
      isNew: true,
    },
    {
      id: "7",
      title: "Python for Data Science and Machine Learning",
      instructor: "Jose Portilla",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
      price: 44.99,
      originalPrice: 174.99,
      rating: 4.9,
      studentsCount: 94567,
      duration: "52 hours",
      level: "Intermediate" as const,
      category: "Programming",
    },
    {
      id: "8",
      title: "Graphic Design Masterclass",
      instructor: "Lindsay Marsh",
      thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
      price: 29.99,
      originalPrice: 119.99,
      rating: 4.4,
      studentsCount: 27834,
      duration: "35 hours",
      level: "Beginner" as const,
      category: "Design",
    },
  ];

  const categories = [
    "All Categories",
    "Web Development",
    "Data Science",
    "Marketing",
    "Design",
    "Mobile Development",
    "Photography",
    "Programming",
  ];

  const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];
  const priceRanges = ["All Prices", "Free", "$0-$50", "$50-$100", "$100+"];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            All <span className="text-gradient">Courses</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover thousands of courses across various categories
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-xl p-6 shadow-soft mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search courses..." 
                  className="pl-10 bg-background"
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
                Filters
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Categories" />
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
                <label className="text-sm font-medium">Level</label>
                <Select>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Levels" />
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
                <label className="text-sm font-medium">Price</label>
                <Select>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Prices" />
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
                <label className="text-sm font-medium">Sort by</label>
                <Select>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Most Popular" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Applied Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Web Development
            <button className="ml-2 hover:text-destructive">×</button>
          </Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Beginner
            <button className="ml-2 hover:text-destructive">×</button>
          </Badge>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
            Clear all filters
          </Button>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{courses.length}</span> results
          </p>
        </div>

        <Separator className="mb-8" />

        {/* Courses Grid */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Courses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Courses;