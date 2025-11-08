import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy } from 'lucide-react';
import { Teacher,PaginationInfo } from '@/type/teachers';
import { TeacherCard } from './teacher-card';
import { TeachersSkeleton } from './teachers-skeleton';

interface TeachersGridProps {
  teachers: Teacher[];
  pagination: PaginationInfo;
  loading: boolean;
  isVisible: boolean;
  currentPage: number;
}

export const TeachersGrid: React.FC<TeachersGridProps> = ({
  teachers,
  pagination,
  loading,
  isVisible,
  currentPage
}) => {
  const { t } = useTranslation();

  if (loading) {
    return <TeachersSkeleton />;
  }

  if (teachers.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>{t('teachers.noData', 'لا توجد بيانات للمعلمين حالياً')}</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {teachers.map((teacher, index) => {
        const globalRank = ((currentPage - 1) * 8) + index + 1;
        
        return (
          <TeacherCard
            key={teacher.id}
            teacher={teacher}
            globalRank={globalRank}
            isVisible={isVisible}
            index={index}
          />
        );
      })}
    </div>
  );
};