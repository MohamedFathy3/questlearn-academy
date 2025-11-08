import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Users, Star, Crown, Medal, Award, Trophy } from 'lucide-react';
import { Teacher } from '@/type/teachers';
import { teachersUtils } from '@/utils/teachers';

interface TeacherCardProps {
  teacher: Teacher;
  globalRank: number;
  isVisible: boolean;
  index: number;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({
  teacher,
  globalRank,
  isVisible,
  index
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const rankBgColor = teachersUtils.getRankBgColor(globalRank);
  const avatarUrl = teachersUtils.getDefaultAvatar(teacher);

  // دالة الـ navigation
  const handleCardClick = () => {
    navigate(`/profileTeacher/${teacher.id}`);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400 animate-bounce" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600 animate-pulse" />;
      default:
        return <Trophy className="w-4 h-4 text-blue-500" />;
    }
  };

  const teacherTitle = teacher.teacher_type === 'female' 
    ? t('teachers.female', 'المعلمة')
    : t('teachers.male', 'المعلم');

  return (
    <Card 
      className={`group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 shadow-lg relative overflow-hidden transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-10 scale-95'
      }`}
      style={{
        animationDelay: `${index * 150}ms`,
        animationFillMode: 'forwards'
      }}
      onClick={handleCardClick} // إضافة الـ click event هنا
    >
      {/* تأثير خلفي متحرك */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Rank Badge */}
      <div className={`absolute top-4 right-4 ${rankBgColor} text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold z-10 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
        {getRankIcon(globalRank)}
        #{globalRank}
      </div>
      
      <CardHeader className="text-center pt-8 pb-4 relative z-10">
        {/* Avatar */}
        <div className="relative mx-auto mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
          <Avatar className="w-20 h-20 border-4 border-white shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative z-10">
            <AvatarImage 
              src={avatarUrl} 
              alt={teacher.name}
              className="transition-all duration-500 group-hover:brightness-110"
            />
            <AvatarFallback className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold transition-all duration-500 group-hover:scale-110">
              {teacher.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <CardTitle className="text-lg transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-105">
          {teacherTitle} {teacher.name}
        </CardTitle>
        
        <div className="flex flex-col gap-1 mt-2">
          <Badge 
            variant="secondary" 
            className="mx-auto text-xs transition-all duration-300 group-hover:bg-blue-100 group-hover:text-blue-700 dark:group-hover:bg-blue-900/30"
          >
            {teacher.subject?.name || t('common.general', 'عام')}
          </Badge>
          <Badge 
            variant="outline" 
            className="mx-auto text-xs transition-all duration-300 group-hover:border-blue-300"
          >
            {teacher.courses_count} {t('teachers.courses', 'كورس')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        {/* Teacher Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="transform transition-all duration-300 group-hover:scale-110">
            <div className="text-xl font-bold text-primary flex flex-col items-center gap-1">
              <BookOpen className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:text-blue-500" />
              {teacher.courses_count}
            </div>
            <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
              {t('teachers.courses', 'الكورسات')}
            </div>
          </div>
          
          <div className="transform transition-all duration-300 group-hover:scale-110">
            <div className="text-xl font-bold text-green-600 flex flex-col items-center gap-1">
              <Users className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:text-green-500" />
              {teacher.students_count}
            </div>
            <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
              {t('teachers.students', 'الطلاب')}
            </div>
          </div>
          
          <div className="transform transition-all duration-300 group-hover:scale-110">
            <div className="text-xl font-bold text-amber-600 flex flex-col items-center gap-1">
              <Star className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:text-yellow-500" />
              {teacher.total_rate ? teacher.total_rate.toFixed(1) : '0.0'}
            </div>
            <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
              {t('teachers.rating', 'التقييم')}
            </div>
          </div>
        </div>
        
        {/* Total Rating */}
        {teacher.total_rating && (
          <div className="text-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm font-semibold text-muted-foreground transition-all duration-300 group-hover:text-foreground">
              {t('teachers.totalRatings', 'إجمالي التقييمات')}: {teacher.total_rating}
            </div>
          </div>
        )}
      </CardContent>

      {/* تأثير Hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300 dark:group-hover:border-blue-600 rounded-lg transition-all duration-500 pointer-events-none"></div>
    </Card>
  );
};