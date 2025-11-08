import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy } from 'lucide-react';
import { Student,PaginationInfo } from '@/type/students';
import { StudentCard } from './student-card';
import { StudentsSkeleton } from './students-skeleton';

interface StudentsGridProps {
  students: Student[];
  pagination: PaginationInfo;
  loading: boolean;
  isVisible: boolean;
  currentPage: number;
}

export const StudentsGrid: React.FC<StudentsGridProps> = ({
  students,
  pagination,
  loading,
  isVisible,
  currentPage
}) => {
  const { t } = useTranslation();

  if (loading) {
    return <StudentsSkeleton />;
  }

  if (students.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p>{t('students.noData', 'No students data available at the moment')}</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {students.map((student, index) => {
        const globalRank = ((currentPage - 1) * 8) + index + 1;
        
        return (
          <StudentCard
            key={student.id}
            student={student}
            globalRank={globalRank}
            isVisible={isVisible}
            index={index}
          />
        );
      })}
    </div>
  );
};