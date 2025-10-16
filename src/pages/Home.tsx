"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, Play, Star, Users, Award, BookOpen, 
  Code, Briefcase, Palette, Camera, Music, Zap, Sparkles, Rocket, ArrowUp 
} from "lucide-react";
import { Link } from "react-router-dom";
import Hero from '@/components/home/hero';
import Course from '@/components/home/course';
import HonorBoard from '@/components/home/honerBoard';
import HonorBoardStatent from '@/components/home/honerBoardStaudent';

const API_BASE_URL = "/api";

// ✅ Animated counter component
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          startCounter();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [hasAnimated]);

  const startCounter = () => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);
  };

  return <span ref={ref}>{count}{suffix}</span>;
};

const Home = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState([]);

  // ✅ Fetch API data for homepage stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/report-homepage`);
        const result = await response.json();

        if (result.success && result.data) {
          const data = result.data;
          setStats([
            { number: data.total_students, label: t('home.stats.students'), icon: Users, color: "text-blue-500", suffix: "" },
            { number: data.total_courses, label: t('home.stats.courses'), icon: BookOpen, color: "text-green-500", suffix: "" },
            { number: data.total_teachers, label: t('home.stats.instructors'), icon: Award, color: "text-purple-500", suffix: "" },
            { number: data.total_visitors, label: t('home.stats.visitors'), icon: Star, color: "text-orange-500", suffix: "" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching report-homepage:", error);
      }
    };

    fetchStats();
  }, [t]);

  const categories = [
    { name: t('home.categories.webDevelopment'), icon: Code, courses: 1250, color: "text-blue-500", gradient: "from-blue-500 to-cyan-500" },
    { name: t('home.categories.business'), icon: Briefcase, courses: 890, color: "text-green-500", gradient: "from-green-500 to-emerald-500" },
    { name: t('home.categories.design'), icon: Palette, courses: 675, color: "text-purple-500", gradient: "from-purple-500 to-pink-500" },
    { name: t('home.categories.photography'), icon: Camera, courses: 445, color: "text-orange-500", gradient: "from-orange-500 to-red-500" },
    { name: t('home.categories.music'), icon: Music, courses: 320, color: "text-pink-500", gradient: "from-pink-500 to-rose-500" },
    { name: t('home.categories.marketing'), icon: Zap, courses: 580, color: "text-yellow-500", gradient: "from-yellow-500 to-amber-500" },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Background bubbles */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero */}
      <Hero />

      {/* ✅ Animated Stats Section - Dynamic from API */}
      <section className="py-12 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:60px_60px]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.length > 0 ? (
              stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center group animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="bg-background/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-soft hover:shadow-glow transition-all duration-500 hover:scale-105 group-hover:border-primary/30">
                    <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <stat.icon className={`w-6 h-6 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent group-hover:animate-pulse">
                      <AnimatedCounter end={stat.number} duration={2000} suffix={stat.suffix} />
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 group-hover:text-foreground transition-colors duration-300">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-4 text-muted-foreground">Loading statistics...</p>
            )}
          </div>
        </div>
      </section>

      <Course />

      {/* Categories */}
      <section className="py-16 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary animate-spin-in" />
              <Badge variant="secondary" className="text-sm font-semibold animate-bounce-in">
                {t('home.topCategories.badge')}
              </Badge>
              <Sparkles className="w-6 h-6 text-primary animate-spin-in" style={{ animationDelay: '0.2s' }} />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 animate-fade-in-up">
              {t('home.topCategories.title')}{" "}
              <span className="text-tan bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-gradient-shift">
                {t('home.topCategories.highlight')}
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {t('home.topCategories.description')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card 
                key={index}
                className="group cursor-pointer bg-background border border-border/50 shadow-soft 
                          hover:shadow-glow hover:border-primary/30 relative overflow-hidden
                          animate-fade-in-up hover:scale-105 transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <CardContent className="p-6 text-center space-y-4 relative z-10">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br from-background to-muted/50 
                                 group-hover:from-primary/10 group-hover:to-primary/5
                                 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-12
                                 shadow-soft group-hover:shadow-medium`}>
                    <category.icon className={`w-8 h-8 ${category.color} group-hover:text-primary transition-all duration-500 transform group-hover:scale-125`} />
                  </div>
                  <div className="transform transition-all duration-500 group-hover:translate-y-[-4px]">
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors duration-300 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300 font-medium">
                      {category.courses} {t('home.categories.courses')}
                    </p>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <ArrowRight className="w-4 h-4 text-primary animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <HonorBoard />
      <HonorBoardStatent />

      {/* Scroll-to-top button */}
      <div className="fixed bottom-8 right-8 z-50 animate-bounce-in" style={{ animationDelay: '2s' }}>
        
        <Button 
          size="icon" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-glow-lg 
                     hover:shadow-glow hover:scale-110 transition-all duration-300 group"
        >
  <ArrowUp className="w-6 h-6 text-white group-hover:-translate-y-1 transition-transform duration-300" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-primary/20 z-50">
        <div className="h-full bg-gradient-to-r from-primary to-primary/70 animate-gradient-shift"></div>
      </div>
    </div>
  );
};

export default Home;
