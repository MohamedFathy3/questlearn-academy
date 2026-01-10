import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Sparkles, Clock, TrendingUp, Star, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import CourseCard from "@/components/CourseCard";
import { useLatestCourses } from '@/hooks/useLatestCourses';
import { useLatestCoursesLogic } from '@/hooks/LatestCourses.logic';
import { Course } from '@/type/LatestCourses.types';

// Helper functions
const shouldShowPopularBadge = (subscribersCount: number): boolean => subscribersCount > 100;
const shouldShowNewBadge = (createdAt: string): boolean => {
  const daysSinceCreation = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceCreation < 7;
};

export default function LatestCourses() {
  const { t, i18n } = useTranslation();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // البيانات
  const {
    courses,
    loading,
    error,
    fetchCourses
  } = useLatestCourses();

  // الـ Logic
  const { transformCourseData } = useLatestCoursesLogic();

  // Loading State
  if (loading) {
    return (
      <section className="py-16 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
            </div>
            <p className="text-lg text-muted-foreground animate-pulse">{t('common.loading')}</p>
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500 animate-fade-in-up">
            <p>{t('common.error')}: {error}</p>
            <Button onClick={fetchCourses} className="mt-4 animate-bounce-in">
              {t('courses.tryAgain', 'Try Again')}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Main UI
  return (
    <section className="py-16 bg-muted/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-4 h-4 bg-primary/30 rounded-full animate-ping"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-blue-400/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-10 w-6 h-6 bg-cyan-400/20 rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <HeaderSection t={t} />

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <EmptyState t={t} fetchCourses={fetchCourses} />
        ) : (
          <CoursesGrid 
            courses={courses}
            transformCourseData={transformCourseData}
            hoveredCard={hoveredCard}
            setHoveredCard={setHoveredCard}
            t={t}
          />
        )}
      </div>
    </section>
  );
}

// Sub-components
const HeaderSection = ({ t }: { t: any }) => (
  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-12">
    <div className="mb-6 lg:mb-0 animate-fade-in-left">
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="secondary" className="bg-primary/10 text-primary border-0 animate-pulse-glow">
          <TrendingUp className="w-3 h-3 mr-1" />
          {t('courses.freshContent')}
        </Badge>
        <Sparkles className="w-5 h-5 text-primary animate-spin" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
        {t('courses.newlyAdded')} <span className="text-tan bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-text-shine">{t('nav.courses')}</span>
      </h2>
      
      <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
        {t('courses.newlyAddedDesc')}
      </p>
    </div>
    
    <Link to="/courses" className="animate-fade-in-right">
      <Button 
        variant="ghost" 
        className="hidden sm:flex group relative overflow-hidden border border-border hover:border-primary/30 transition-all duration-500 hover:scale-105"
      >
        <span className="relative z-10 flex items-center gap-2">
          {t('courses.viewAllCourses')}
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </Button>
    </Link>
  </div>
);

const EmptyState = ({ t, fetchCourses }: { t: any; fetchCourses: () => void }) => (
  <div className="text-center py-12 bg-white rounded-2xl border border-border shadow-soft animate-fade-in-up">
    <div className="relative inline-block mb-4">
      <BookOpen className="w-16 h-16 text-muted-foreground mx-auto animate-float" />
      <div className="absolute -top-1 -right-1">
        <div className="w-6 h-6 bg-primary/20 rounded-full animate-ping"></div>
      </div>
    </div>
    <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
      {t('courses.noCoursesAvailable')}
    </h3>
    <p className="text-muted-foreground mb-4">{t('courses.checkBackLater')}</p>
    <Button 
      onClick={fetchCourses} 
      className="animate-bounce-in hover:scale-105 transition-transform duration-300"
    >
      <RefreshCw className="w-4 h-4 mr-2" />
      {t('courses.refresh')}
    </Button>
  </div>
);

interface CoursesGridProps {
  courses: Course[];
  transformCourseData: (course: Course) => any;
  hoveredCard: number | null;
  setHoveredCard: (id: number | null) => void;
  t: any;
}

const CoursesGrid = ({ courses, transformCourseData, hoveredCard, setHoveredCard, t }: CoursesGridProps) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {courses.map((course, index) => (
        <CourseCardWrapper
          key={course.id}
          course={course}
          index={index}
          transformCourseData={transformCourseData}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
          t={t}
        />
      ))}
    </div>

    {/* Mobile View All Button */}
    <div className="text-center mt-8 sm:hidden animate-fade-in-up" style={{ animationDelay: '600ms' }}>
      <Link to="/courses">
        <Button 
          variant="outline" 
          className="w-full sm:w-auto group relative overflow-hidden hover:scale-105 transition-transform duration-300"
        >
          <span className="relative z-10 flex items-center gap-2">
            {t('courses.viewAllCourses')}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </Button>
      </Link>
    </div>

    {/* CTA Section */}
    <CTASection t={t} />
  </>
);

const CourseCardWrapper = ({ 
  course, 
  index, 
  transformCourseData, 
  hoveredCard, 
  setHoveredCard,
  t 
}: any) => (
  <div 
    className="animate-fade-in-up relative group"
    style={{ animationDelay: `${index * 100}ms` }}
    onMouseEnter={() => setHoveredCard(course.id)}
    onMouseLeave={() => setHoveredCard(null)}
  >
    {/* Hover Effects */}
    <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 ${
      hoveredCard === course.id ? 'scale-105' : 'scale-100'
    }`}></div>
    
    <div className={`absolute inset-0 bg-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 ${
      hoveredCard === course.id ? 'animate-pulse-glow' : ''
    }`}></div>

    {/* Course Card */}
    <div className={`relative transform transition-all duration-500 ${
      hoveredCard === course.id ? 'scale-102 -translate-y-2' : 'scale-100'
    }`}>
      <CourseCard {...transformCourseData(course)} />
    </div>

    {/* Badges */}
    {shouldShowPopularBadge(course.subscribers_count) && (
      <FloatingBadge 
        position="top-right"
        isHovered={hoveredCard === course.id}
        badgeType="popular"
        t={t}
      />
    )}

    {shouldShowNewBadge(course.created_at) && (
      <FloatingBadge 
        position="top-left"
        isHovered={hoveredCard === course.id}
        badgeType="new"
        t={t}
      />
    )}
  </div>
);

const FloatingBadge = ({ position, isHovered, badgeType, t }: any) => {
  const positionClasses = position === 'top-right' ? '-top-2 -right-2' : '-top-2 -left-2';
  const transformClass = position === 'top-right' ? 'rotate-12' : '-rotate-12';
  
  return (
    <div className={`absolute ${positionClasses} z-10 transition-all duration-500 ${
      isHovered ? `scale-110 ${transformClass}` : 'scale-100'
    }`}>
      <Badge className={`${
        badgeType === 'popular' ? 'bg-green-500' : 'bg-blue-500'
      } text-white border-0 shadow-glow ${
        badgeType === 'popular' ? 'animate-pulse-glow' : 'animate-bounce'
      }`}>
        {badgeType === 'popular' ? (
          <>
            <Star className="w-3 h-3 mr-1" />
            {t('courses.popular')}
          </>
        ) : (
          <>
            <Clock className="w-3 h-3 mr-1" />
            {t('courses.new')}
          </>
        )}
      </Badge>
    </div>
  );
};

const CTASection = ({ t }: { t: any }) => (
  <div className="text-center mt-12 animate-fade-in-up" style={{ animationDelay: '700ms' }}>
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
      <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        {t('courses.readyToStart')}
      </h3>
      <p className="text-muted-foreground mb-4">
        {t('courses.joinStudents')}
      </p>
      <Link to="/courses">
        <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-glow hover:shadow-glow-lg transition-all duration-500 hover:scale-105 group">
          <span className="relative z-10 flex items-center gap-2">
            <Sparkles className="w-4 h-4 group-hover:animate-spin" />
            {t('courses.exploreAllCourses')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </Button>
      </Link>
    </div>
  </div>
);