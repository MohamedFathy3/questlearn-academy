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

  const categories = [
    { name: t('home.categories.webDevelopment'), icon: Code, courses: 1250, color: "text-blue-500" },
    { name: t('home.categories.business'), icon: Briefcase, courses: 890, color: "text-green-500" },
    { name: t('home.categories.design'), icon: Palette, courses: 675, color: "text-purple-500" },
    { name: t('home.categories.photography'), icon: Camera, courses: 445, color: "text-orange-500" },
    { name: t('home.categories.music'), icon: Music, courses: 320, color: "text-pink-500" },
    { name: t('home.categories.marketing'), icon: Zap, courses: 580, color: "text-yellow-500" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      <Course/>   
      <HonorBoard />

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t('home.topCategories.title')} <span className="text-tan">{t('home.topCategories.highlight')}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.topCategories.description')}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="group cursor-pointer course-card-hover bg-background border-0 shadow-soft 
                          animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className={`inline-flex p-4 rounded-full bg-muted/50 group-hover:bg-primary/10 
                                 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12`}>
                    <category.icon className={`w-8 h-8 ${category.color} group-hover:text-primary 
                                             transition-all duration-500 transform group-hover:scale-125`} />
                  </div>
                  <div className="transform transition-all duration-500 group-hover:translate-y-[-4px]">
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {category.courses} {t('home.categories.courses')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <HonorBoardStatent/>
    </div>
  );
};

export default Home;