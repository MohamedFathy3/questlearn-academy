import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
  Globe,
  Smartphone,
  Infinity
} from "lucide-react";

const CourseDetail = () => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Sample course data
  const course = {
    id: "1",
    title: "Complete Web Development Bootcamp 2024",
    subtitle: "Become a Full-Stack Web Developer with just ONE course",
    instructor: {
      name: "Angela Yu",
      title: "Senior Web Developer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      students: 850000,
      courses: 12,
    },
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop",
    price: 49.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviewsCount: 125430,
    studentsCount: 85342,
    duration: "65 hours",
    lessons: 145,
    level: "Beginner",
    category: "Web Development",
    lastUpdated: "December 2024",
    language: "English",
    isBestseller: true,
    description: `Master web development by building 25+ websites and mobile apps using HTML, CSS, Javascript, PHP, Python, MySQL & more!`,
    whatYouWillLearn: [
      "Build 16 web development projects for your portfolio",
      "Master both frontend and backend development",
      "Learn the latest frameworks and libraries",
      "Build responsive websites that work on all devices",
      "Create dynamic web applications with databases",
      "Deploy your websites to the cloud",
    ],
    requirements: [
      "No programming experience needed",
      "A computer with internet connection",
      "Willingness to learn and practice",
    ],
    curriculum: [
      {
        title: "Introduction to Web Development",
        lessons: 8,
        duration: "2h 30m",
        lectures: [
          { title: "Welcome to the Course", duration: "05:23", isPreview: true },
          { title: "Course Curriculum Overview", duration: "12:45", isPreview: true },
          { title: "Setting Up Your Development Environment", duration: "18:32" },
          { title: "Your First HTML Page", duration: "15:20" },
        ]
      },
      {
        title: "HTML Fundamentals",
        lessons: 12,
        duration: "4h 15m",
        lectures: [
          { title: "HTML Structure and Elements", duration: "22:10" },
          { title: "Forms and Input Elements", duration: "28:45" },
          { title: "Semantic HTML5", duration: "19:30" },
        ]
      },
      {
        title: "CSS Styling and Layout",
        lessons: 18,
        duration: "6h 45m",
        lectures: [
          { title: "CSS Selectors and Properties", duration: "25:15" },
          { title: "Flexbox Layout", duration: "35:20" },
          { title: "CSS Grid System", duration: "42:10" },
        ]
      },
    ],
    reviews: [
      {
        id: "1",
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        date: "2 weeks ago",
        comment: "This course is absolutely amazing! Angela explains everything so clearly and the projects are very practical. I went from zero knowledge to building my own websites!",
        helpful: 24,
      },
      {
        id: "2", 
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        date: "1 month ago",
        comment: "Best web development course on the platform! The curriculum is comprehensive and up-to-date. Highly recommend for beginners and intermediate developers.",
        helpful: 18,
      },
    ]
  };

  const discount = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-success text-success-foreground">Bestseller</Badge>
                <Badge variant="outline">{course.category}</Badge>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                {course.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{course.rating}</span>
                  <span className="text-muted-foreground">({course.reviewsCount.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{course.studentsCount.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{course.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                  <AvatarFallback>{course.instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">Created by {course.instructor.name}</p>
                  <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
                </div>
              </div>

              <p className="text-muted-foreground">
                Last updated {course.lastUpdated} • {course.language}
              </p>
            </div>

            {/* Course Preview Video */}
            <div className="relative rounded-xl overflow-hidden shadow-medium">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full h-64 lg:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Button size="lg" className="bg-white/20 backdrop-blur hover:bg-white/30 border border-white/30">
                  <Play className="w-6 h-6 mr-2" />
                  Preview Course
                </Button>
              </div>
            </div>
          </div>

          {/* Purchase Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-medium">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-primary">${course.price}</span>
                    <span className="text-xl text-muted-foreground line-through">${course.originalPrice}</span>
                    <Badge variant="destructive">{discount}% OFF</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    💰 Full Lifetime Access
                  </p>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-gradient-primary hover:opacity-90 transition-smooth text-lg py-6">
                    Enroll Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    Add to Cart
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">30-Day Money-Back Guarantee</p>
                  <div className="flex justify-center gap-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={isWishlisted ? "text-red-500" : ""}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                      Wishlist
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">This course includes:</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-muted-foreground" />
                      <span>{course.duration} on-demand video</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>15 articles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-muted-foreground" />
                      <span>25 downloadable resources</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Infinity className="w-4 h-4 text-muted-foreground" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <span>Access on mobile and TV</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-muted-foreground" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>What you'll learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{course.description}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Course Content</h3>
                <p className="text-muted-foreground">
                  {course.curriculum.length} sections • {course.lessons} lectures • {course.duration} total length
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {course.curriculum.map((section, index) => (
                <Card key={index}>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-smooth">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {section.lessons} lectures • {section.duration}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {section.lectures.map((lecture, lectureIndex) => (
                        <div key={lectureIndex} className="flex items-center justify-between py-2 hover:bg-muted/30 px-2 rounded transition-smooth">
                          <div className="flex items-center gap-3">
                            <PlayCircle className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{lecture.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {lecture.isPreview && (
                              <Badge variant="outline" className="text-xs">Preview</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">{lecture.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="instructor" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                    <AvatarFallback className="text-2xl">
                      {course.instructor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-4 flex-1">
                    <div>
                      <h3 className="text-2xl font-bold">{course.instructor.name}</h3>
                      <p className="text-lg text-muted-foreground">{course.instructor.title}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{course.instructor.rating}</div>
                        <div className="text-sm text-muted-foreground">Instructor Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{course.instructor.students.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{course.instructor.courses}</div>
                        <div className="text-sm text-muted-foreground">Courses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">125K</div>
                        <div className="text-sm text-muted-foreground">Reviews</div>
                      </div>
                    </div>

                    <p className="leading-relaxed">
                      Angela is a developer with a passion for teaching. She is the lead instructor at the London App Brewery, 
                      London's leading Programming Bootcamp. She has helped hundreds of thousands of students learn to code and 
                      change their lives by becoming a developer.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold">Student Feedback</h3>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xl font-bold">{course.rating}</span>
                <span className="text-muted-foreground">({course.reviewsCount.toLocaleString()} reviews)</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-20">
                    <span>{rating}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress value={rating === 5 ? 85 : rating === 4 ? 12 : 2} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-12">
                    {rating === 5 ? '85%' : rating === 4 ? '12%' : '2%'}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {course.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.avatar} alt={review.name} />
                        <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{review.name}</h4>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="leading-relaxed">{review.comment}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <button className="hover:text-primary transition-smooth">
                            Helpful ({review.helpful})
                          </button>
                          <button className="hover:text-primary transition-smooth">Report</button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline">Load More Reviews</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetail;