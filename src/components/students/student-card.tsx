import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Users, Star, MapPin, GraduationCap } from 'lucide-react';
import { Student } from '@/type/students';
import { studentsUtils } from '@/utils/students.ts';

interface StudentCardProps {
  student: Student;
  globalRank: number;
  isVisible: boolean;
  index: number;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  globalRank,
  isVisible,
  index
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const rankBgColor = studentsUtils.getRankBgColor(globalRank);
  const avatarUrl = studentsUtils.getDefaultAvatar(student);
  const { level, color: levelColor } = studentsUtils.getStudentLevel(student.courses.length, t);
  const successRate = studentsUtils.calculateSuccessRate(student);
  const { icon: rankIcon } = studentsUtils.getRankIcon(globalRank);



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
    >
      {/* تأثير خلفي متحرك */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 dark:from-green-950/20 dark:to-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Rank Badge */}
      <div className={`absolute top-4 right-4 ${rankBgColor} text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold z-10 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
        <span className="text-lg">{rankIcon}</span>
        #{globalRank}
      </div>
      
      <CardHeader className="text-center pt-8 pb-4 relative z-10">
        {/* Avatar */}
        <div className="relative mx-auto mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
          <Avatar className="w-20 h-20 border-4 border-white shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative z-10">
            <AvatarImage 
              src={avatarUrl} 
              alt={student.name}
              className="transition-all duration-500 group-hover:brightness-110"
            />
            <AvatarFallback className="text-sm bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold transition-all duration-500 group-hover:scale-110">
              {student.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <CardTitle className="text-lg transition-all duration-300 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:scale-105">
          {student.name}
        </CardTitle>
        
        <div className="flex flex-col gap-2 mt-2">
          {/* الصف الدراسي */}
          {student.stage && (
            <Badge 
              variant="secondary" 
              className="mx-auto text-xs transition-all duration-300 group-hover:bg-green-100 group-hover:text-green-700 dark:group-hover:bg-green-900/30"
            >
              <GraduationCap className="w-3 h-3 mr-1" />
              {student.stage.name}
            </Badge>
          )}
          
          {/* الدولة */}
          {student.country && (
            <Badge 
              variant="outline" 
              className="mx-auto text-xs transition-all duration-300 group-hover:border-green-300"
            >
              <MapPin className="w-3 h-3 mr-1" />
              {student.country.name}
            </Badge>
          )}
          
          {/* المستوى */}
          <Badge 
            variant="default"
            className={`mx-auto text-xs ${levelColor} bg-${levelColor.replace('text-', 'bg-')}/10 transition-all duration-300`}
          >
            {level}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        {/* Student Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="transform transition-all duration-300 group-hover:scale-110">
            <div className="text-xl font-bold text-primary flex flex-col items-center gap-1">
              <BookOpen className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:text-blue-500" />
              {student.courses.length}
            </div>
            <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
              {t('students.totalCourses', 'Total Courses')}
            </div>
          </div>
          
          <div className="transform transition-all duration-300 group-hover:scale-110">
            <div className="text-xl font-bold text-green-600 flex flex-col items-center gap-1">
              <Users className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:text-green-500" />
              {student.courses.reduce((total, course) => total + (course.teacher ? 1 : 0), 0)}
            </div>
            <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
              {t('students.teachers', 'Teachers')}
            </div>
          </div>
          
          <div className="transform transition-all duration-300 group-hover:scale-110">
            <div className="text-xl font-bold text-amber-600 flex flex-col items-center gap-1">
              <Star className="w-4 h-4 transition-all duration-300 group-hover:scale-125 group-hover:text-yellow-500" />
              {successRate.toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground group-hover:font-medium">
              {t('students.averageScore', 'Average Score')}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground">
            <span>{t('students.progress', 'Progress')}</span>
            <span>{successRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 transition-all duration-300 group-hover:bg-gray-300">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${successRate}%` }}
            ></div>
          </div>
        </div>
      </CardContent>

      {/* تأثير Hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-300 dark:group-hover:border-green-600 rounded-lg transition-all duration-500 pointer-events-none"></div>
    </Card>
  );
};