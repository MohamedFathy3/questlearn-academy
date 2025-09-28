import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Play, Star, Users, Award, BookOpen, Code, Briefcase, Palette, Camera, Music, Zap } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";
import CourseCard from "@/components/CourseCard";
import { Link } from "react-router-dom";
import Hero from '@/components/home/hero';
import Course from '@/components/home/course';
import HonorBoard from '@/components/home/honerBoard';
import HonorBoardStatent from '@/components/home/honerBoardStaudent';
const Home = () => {
  const { t } = useTranslation();
  // Sample featured courses data


  const categories = [
    { name: "Web Development", icon: Code, courses: 1250, color: "text-blue-500" },
    { name: "Business", icon: Briefcase, courses: 890, color: "text-green-500" },
    { name: "Design", icon: Palette, courses: 675, color: "text-purple-500" },
    { name: "Photography", icon: Camera, courses: 445, color: "text-orange-500" },
    { name: "Music", icon: Music, courses: 320, color: "text-pink-500" },
    { name: "Marketing", icon: Zap, courses: 580, color: "text-yellow-500" },
  ];

 

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Explore Popular <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover courses across diverse fields and start your learning journey today
            </p>
          </div>
          <HonorBoard />
          <HonorBoardStatent/>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="group cursor-pointer course-card-hover bg-background border-0 shadow-soft">
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`inline-flex p-4 rounded-full bg-muted/50 group-hover:bg-primary/10 transition-smooth`}>
                    <category.icon className={`w-8 h-8 ${category.color} group-hover:text-primary transition-smooth`} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-smooth">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.courses} courses
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

<Course/>   

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-white leading-tight">
              Ready to Start Your
              <br />
              Learning Journey?
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Join over 2 million students and professionals who are already learning on LearnHub. 
              Start with any course and unlock your potential today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 transition-smooth text-lg px-8">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 transition-smooth text-lg px-8"
              >
                Explore Courses
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-32 left-40 w-12 h-12 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;