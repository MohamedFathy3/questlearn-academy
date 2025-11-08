import { Teacher } from '@/type/teachers';

export const teachersUtils = {
  getRankIcon(rank: number) {
    switch (rank) {
      case 1:
        return { icon: 'crown', className: 'text-yellow-500 animate-pulse' };
      case 2:
        return { icon: 'medal', className: 'text-gray-400 animate-bounce' };
      case 3:
        return { icon: 'award', className: 'text-amber-600 animate-pulse' };
      default:
        return { icon: 'trophy', className: 'text-blue-500' };
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

  getDefaultAvatar(teacher: Teacher) {
    const avatars = [
      'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    ];
    return teacher.image || avatars[teacher.id % avatars.length];
  },

 getTeacherTitle(teacher: Teacher, language: string = 'ar') {
    const type = teacher.teacher_type;
    
    if (language === 'ar') {
      // اللغة العربية
      if (type === 'male') return 'المعلم';
      if (type === 'female') return 'المعلمة';
      return 'المعلم';
    } else {
      // اللغة الإنجليزية
      if (type === 'male') return 'Teacher';
      if (type === 'female') return 'Teacher';
      return 'Teacher';
    }
  },

  calculateGlobalRank(page: number, index: number, perPage: number = 8) {
    return ((page - 1) * perPage) + index + 1;
  }
};