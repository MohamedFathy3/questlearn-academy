import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Award, Star, Medal, Crown } from 'lucide-react';

const topStudents = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    nameAr: 'أحمد حسن',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    points: 2540,
    coursesCompleted: 15,
    certificates: 12,
    rank: 1,
    specialization: 'Web Development',
    specializationAr: 'تطوير الويب'
  },
  {
    id: 2,
    name: 'Fatima Al-Zahra',
    nameAr: 'فاطمة الزهراء',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    points: 2340,
    coursesCompleted: 13,
    certificates: 10,
    rank: 2,
    specialization: 'Data Science',
    specializationAr: 'علم البيانات'
  },
  {
    id: 3,
    name: 'Omar Al-Rashid',
    nameAr: 'عمر الراشد',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    points: 2180,
    coursesCompleted: 11,
    certificates: 9,
    rank: 3,
    specialization: 'Digital Marketing',
    specializationAr: 'التسويق الرقمي'
  },
  {
    id: 4,
    name: 'Layla Mohammed',
    nameAr: 'ليلى محمد',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    points: 1980,
    coursesCompleted: 9,
    certificates: 7,
    rank: 4,
    specialization: 'UX/UI Design',
    specializationAr: 'تصميم تجربة المستخدم'
  },
  {
    id: 5,
    name: 'Youssef Ibrahim',
    nameAr: 'يوسف إبراهيم',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    points: 1850,
    coursesCompleted: 8,
    certificates: 6,
    rank: 5,
    specialization: 'Mobile Development',
    specializationAr: 'تطوير التطبيقات'
  }
];

const achievements = [
  {
    id: 1,
    title: 'Course Champion',
    titleAr: 'بطل الدورات',
    description: 'Completed 5 courses in one month',
    descriptionAr: 'أكمل 5 دورات في شهر واحد',
    student: 'Ahmed Hassan',
    studentAr: 'أحمد حسن',
    icon: Trophy,
    color: 'text-yellow-500'
  },
  {
    id: 2,
    title: 'Perfect Score',
    titleAr: 'الدرجة المثالية',
    description: 'Achieved 100% in Advanced React course',
    descriptionAr: 'حقق 100% في دورة React المتقدمة',
    student: 'Fatima Al-Zahra',
    studentAr: 'فاطمة الزهراء',
    icon: Star,
    color: 'text-blue-500'
  },
  {
    id: 3,
    title: 'Speed Learner',
    titleAr: 'سريع التعلم',
    description: 'Completed JavaScript course in record time',
    descriptionAr: 'أكمل دورة JavaScript في وقت قياسي',
    student: 'Omar Al-Rashid',
    studentAr: 'عمر الراشد',
    icon: Award,
    color: 'text-green-500'
  },
  {
    id: 4,
    title: 'Community Helper',
    titleAr: 'مساعد المجتمع',
    description: 'Helped 50+ students in discussion forums',
    descriptionAr: 'ساعد أكثر من 50 طالب في منتديات النقاش',
    student: 'Layla Mohammed',
    studentAr: 'ليلى محمد',
    icon: Medal,
    color: 'text-purple-500'
  }
];

const HonorBoard = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <Trophy className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="gradient-hero text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t('honorBoard.title')}
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            {t('honorBoard.subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Top Students Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient">
            {t('honorBoard.topStudents')}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topStudents.map((student) => (
              <Card key={student.id} className="gradient-card shadow-medium course-card-hover relative overflow-hidden">
                {/* Rank Badge */}
                <div className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'} ${getRankBgColor(student.rank)} text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold`}>
                  {getRankIcon(student.rank)}
                  #{student.rank}
                </div>
                
                <CardHeader className="text-center pt-8">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={student.avatar} alt={isArabic ? student.nameAr : student.name} />
                    <AvatarFallback>{(isArabic ? student.nameAr : student.name).charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">
                    {isArabic ? student.nameAr : student.name}
                  </CardTitle>
                  <Badge variant="secondary" className="mx-auto">
                    {isArabic ? student.specializationAr : student.specialization}
                  </Badge>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{student.points}</div>
                      <div className="text-sm text-muted-foreground">{t('honorBoard.points')}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">{student.coursesCompleted}</div>
                      <div className="text-sm text-muted-foreground">{t('honorBoard.coursesCompleted')}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-success">{student.certificates}</div>
                      <div className="text-sm text-muted-foreground">{t('honorBoard.certificatesEarned')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Achievements Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 text-gradient">
            {t('honorBoard.achievements')}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="gradient-card shadow-soft hover:shadow-medium transition-smooth">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full bg-muted`}>
                      <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">
                        {isArabic ? achievement.titleAr : achievement.title}
                      </h3>
                      <p className="text-muted-foreground mb-2">
                        {isArabic ? achievement.descriptionAr : achievement.description}
                      </p>
                      <Badge variant="outline">
                        {isArabic ? achievement.studentAr : achievement.student}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HonorBoard;