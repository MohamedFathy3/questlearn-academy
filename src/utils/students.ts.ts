import { Student } from '@/type/students';

export const studentsUtils = {
  getRankIcon(rank: number) {
    switch (rank) {
      case 1:
        return { icon: '🥇', className: 'text-yellow-500 animate-pulse' };
      case 2:
        return { icon: '🥈', className: 'text-gray-400 animate-bounce' };
      case 3:
        return { icon: '🥉', className: 'text-amber-600 animate-pulse' };
      default:
        return { icon: '🏅', className: 'text-blue-500' };
    }
  },

  getRankBgColor(rank: number) {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/25';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 shadow-lg shadow-gray-400/25';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 shadow-lg shadow-amber-500/25';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg shadow-blue-500/25';
    }
  },

  getDefaultAvatar(student: Student) {
    const avatars = [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=150&h=150&fit=crop&crop=face'
    ];
    return student.image || avatars[student.id % avatars.length];
  },

  getStudentLevel(coursesCount: number, t: any) {
    if (coursesCount >= 10) return { level: t('students.level', 'Advanced'), color: 'text-yellow-600' };
    if (coursesCount >= 5) return { level: t('students.level', 'Intermediate'), color: 'text-green-600' };
    if (coursesCount >= 3) return { level: t('students.level', 'Beginner'), color: 'text-blue-600' };
    return { level: t('students.level', 'Starter'), color: 'text-gray-600' };
  },

  calculateSuccessRate(student: Student) {
    if (student.courses.length === 0) return 0;
    
    // احسب معدل النجاح بناءً على تقييمات الكورسات
    const totalRating = student.courses.reduce((sum, course) => sum + (course.average_rating || 0), 0);
    const averageRating = totalRating / student.courses.length;
    
    // حول التقييم إلى نسبة مئوية (من 5 إلى 100%)
    return (averageRating / 5) * 100;
  },

  calculateGlobalRank(page: number, index: number, perPage: number = 8) {
    return ((page - 1) * perPage) + index + 1;
  }
};