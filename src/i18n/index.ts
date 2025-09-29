import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        courses: 'Courses',
        categories: 'Categories',
        about: 'About',
        honorBoard: 'Top Teachers',
        Board: 'Top Students',
        profile: 'Profile'
      },
      profile: {
        title: 'My Profile',
        logout: 'Logout',
        learningStats: 'Learning Stats',
        yourLearningProgress: 'Your learning progress',
        totalCourses: 'Total Courses',
        completed: 'Completed',
        inProgress: 'In Progress',
        notStarted: 'Not Started',
        studyTime: 'Study Time',
        overallProgress: 'Overall Progress',
        myCourses: 'My Courses',
        coursesYouAreEnrolledIn: 'courses you are enrolled in',
        enrolledOn: 'Enrolled on',
        continue: 'Continue Learning',
        noCourses: 'No Courses Yet',
        enrollInCoursesToSeeThemHere: 'Enroll in courses to see them here',
        browseCourses: 'Browse Courses',
        student: 'Student',
        teacher: 'Teacher'
      },
      home: {
        title: 'Welcome to Professional Academy',
        subtitle: 'Your Gateway to Knowledge',
        description: 'Discover thousands of courses from expert instructors and advance your skills',
        startLearning: 'Start Learning Today',
        featuredCourses: 'Featured Courses',
        topCategories: {
          title: 'Explore Popular',
          highlight: 'Categories',
          description: 'Discover courses across diverse fields and start your learning journey today'
        },
        categories: {
          webDevelopment: 'Web Development',
          business: 'Business',
          design: 'Design',
          photography: 'Photography',
          music: 'Music',
          marketing: 'Marketing',
          courses: 'courses'
        },
        joinNow: 'Join Now',
        stats: {
          students: 'Students',
          courses: 'Courses',
          instructors: 'Instructors',
          satisfaction: 'Satisfaction Rate'
        }
      },
      courses: {
        title: 'All Courses',
        filterBy: 'Filter by',
        category: 'Category',
        price: 'Price',
        level: 'Level',
        rating: 'Rating',
        free: 'Free',
        paid: 'Paid',
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        expert: 'Expert',
        freshContent: 'Fresh Content',
        newlyAdded: 'Newly Added Courses',
        newlyAddedDesc: 'Discover our latest courses added to the platform. Fresh content, updated curriculum, and modern teaching approaches.',
        viewAllCourses: 'View All Courses',
        bookNow: 'Book Now',
        readyToStart: 'Ready to start learning?',
        joinStudents: 'Join thousands of students already learning with us',
        exploreAllCourses: 'Explore All Courses',
        new: 'New',
        recorded: 'Recorded',
        hours: 'hours',
        basicMathematics: 'Basic Mathematics',
        instructor: 'Instructor'
      },
      honorBoard: {
        title: 'Students Honor Board',
        subtitle: 'Celebrating Academic Excellence',
        topStudents: 'Top Students This Month',
        achievements: 'Recent Achievements',
        coursesCompleted: 'Courses Completed',
        certificatesEarned: 'Certificates Earned',
        points: 'Points',
        rank: 'Rank',
        teachersTitle: 'Top Teachers',
        teachersSubtitle: 'Meet our most successful instructors',
        studentsTitle: 'Top Students',
        studentsSubtitle: 'Meet our outstanding students'
      },
      footer: {
        description: 'Transform your career with expert-led courses in technology, business, and creative skills. Join millions of learners worldwide.',
        learn: 'Learn',
        freeCourses: 'Free Courses',
        certificates: 'Certificates',
        learningPaths: 'Learning Paths',
        support: 'Support',
        helpCenter: 'Help Center',
        contact: 'Contact Us',
        community: 'Community',
        blog: 'Blog',
        careers: 'Careers',
        stayUpdated: 'Stay Updated',
        newsletterDesc: 'Get the latest courses and learning tips delivered to your inbox.',
        emailPlaceholder: 'Enter your email',
        subscribe: 'Subscribe',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        cookies: 'Cookie Policy',
        rights: 'All rights reserved.',
        followUs: 'Follow Us'
      },
      login: {
        welcomeBack: 'Welcome Back',
        accessAccount: 'Sign in to access your account',
        email: 'Email Address',
        emailPlaceholder: 'example@example.com',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        signingIn: 'Signing in...',
        signIn: 'Sign In',
        or: 'or',
        noAccount: "Don't have an account?",
        signUpNow: 'Sign up now'
      },
      register: {
        title: 'Create Account',
        subtitle: 'Join thousands of learners worldwide',
        name: 'Full Name',
        namePlaceholder: 'Enter your full name',
        email: 'Email Address',
        emailPlaceholder: 'Enter your email',
        profileImage: 'Profile Image (Optional)',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        confirmPassword: 'Confirm Password',
        confirmPasswordPlaceholder: 'Confirm your password',
        createAccount: 'Create Account',
        creatingAccount: 'Creating Account...',
        alreadyHaveAccount: 'Already have an account?',
        signIn: 'Sign In',
        fillAllFields: 'Please fill all fields',
        passwordsDontMatch: 'Passwords do not match',
        passwordLength: 'Password must be at least 6 characters',
        invalidImageType: 'Please select a valid image file',
        imageTooLarge: 'Image size must be less than 5MB',
        registrationFailed: 'Registration failed',
        registrationError: 'An error occurred during registration'
      },
      common: {
        loading: 'Loading...',
        error: 'Something went wrong',
        search: 'Search...',
        filter: 'Filter',
        sort: 'Sort by',
        viewAll: 'View All'
      },
      hero: {
        title: 'Professional Academy',
        subtitle: 'Your Gateway to Excellence in Education',
        description: 'Join thousands of students on their journey to academic success with our comprehensive online learning platform.',
        startLearning: 'Start Learning Now',
        exploreCourses: 'Explore Courses',
        interactiveLearning: 'Interactive Learning',
        experienceFuture: 'Experience the future of education',
        scrollDown: 'Scroll Down'
      },
      teachers: {
        title: 'Top Teachers',
        subtitle: 'Meet our most successful instructors',
        courses: 'Courses',
        students: 'Students',
        rating: 'Rating'
      },
      students: {
        title: 'Top Students',
        subtitle: 'Meet our outstanding students',
        grade: 'Grade',
        country: 'Country',
        completed: 'Completed',
        totalCourses: 'Total Courses'
      }
    }
  },
  ar: {
    translation: {
      nav: {
        home: 'الرئيسية',
        courses: 'الدورات',
        categories: 'الفئات',
        about: 'عن الموقع',
        honorBoard: 'المعلمين المتميزين',
        profile: 'الملف الشخصي',
        Board: 'لوحة شرف الطلاب',
      },
      profile: {
        title: 'ملفي الشخصي',
        logout: 'تسجيل الخروج',
        learningStats: 'إحصائيات التعلم',
        yourLearningProgress: 'تقدمك في التعلم',
        totalCourses: 'إجمالي الكورسات',
        completed: 'مكتمل',
        inProgress: 'قيد التقدم',
        notStarted: 'لم يبدأ',
        studyTime: 'وقت الدراسة',
        overallProgress: 'التقدم العام',
        myCourses: 'كورساتي',
        coursesYouAreEnrolledIn: 'كورسات مسجلة',
        enrolledOn: 'مسجل في',
        continue: 'متابعة التعلم',
        noCourses: 'لا توجد كورسات',
        enrollInCoursesToSeeThemHere: 'سجل في الكورسات لتراها هنا',
        browseCourses: 'تصفح الكورسات',
        student: 'طالب',
        teacher: 'معلم'
      },
      home: {
        title: 'مرحباً بكم في الأكاديمية الاحترافية',
        subtitle: 'بوابتكم إلى المعرفة',
        description: 'اكتشف آلاف الدورات من مدربين خبراء وطور مهاراتك',
        startLearning: 'ابدأ التعلم اليوم',
        featuredCourses: 'الدورات المميزة',
        topCategories: {
          title: 'استكشف أشهر',
          highlight: 'الفئات',
          description: 'اكتشف الدورات في مختلف المجالات وابدأ رحلة التعلم اليوم',
          badge: 'جديد'
        },
        categories: {
          webDevelopment: 'تطوير الويب',
          business: 'الأعمال',
          design: 'التصميم',
          photography: 'التصوير',
          music: 'الموسيقى',
          marketing: 'التسويق',
          courses: 'دورة'
        },
        joinNow: 'انضم الآن',
        stats: {
          students: 'طالب',
          courses: 'كورس',
          instructors: 'مدرس',
          satisfaction: 'معدل الرضا'
        }
      },
      courses: {
        title: 'جميع الدورات',
        filterBy: 'فلترة حسب',
        category: 'الفئة',
        price: 'السعر',
        level: 'المستوى',
        rating: 'التقييم',
        free: 'مجاني',
        paid: 'مدفوع',
        beginner: 'مبتدئ',
        intermediate: 'متوسط',
        expert: 'متقدم',
        freshContent: 'محتوى جديد',
        newlyAdded: 'الكورسات المضافة حديثاً',
        newlyAddedDesc: 'اكتشف أحدث الكورسات المضافة إلى المنصة. محتوى جديد، منهج محدث، وطرق تدريس حديثة.',
        viewAllCourses: 'عرض جميع الكورسات',
        bookNow: 'حجز الآن',
        readyToStart: 'مستعد لبدء التعلم؟',
        joinStudents: 'انضم إلى آلاف الطلاب الذين يتعلمون معنا بالفعل',
        exploreAllCourses: 'استكشف جميع الكورسات',
        new: 'جديد',
        recorded: 'مسجل',
        hours: 'ساعات',
        basicMathematics: 'الرياضيات الأساسية',
        instructor: 'المدرس'
      },
      honorBoard: {
        title: 'لوحة شرف الطلاب',
        subtitle: 'تكريم التميز الأكاديمي',
        topStudents: 'أفضل الطلاب هذا الشهر',
        achievements: 'الإنجازات الأخيرة',
        coursesCompleted: 'الدورات المكتملة',
        certificatesEarned: 'الشهادات المكتسبة',
        points: 'النقاط',
        rank: 'الترتيب',
        teachersTitle: 'المعلمين المتميزين',
        teachersSubtitle: 'تعرف على معلمينا الأكثر تفوقاً وإبداعاً',
        studentsTitle: 'لوحة شرف الطلاب',
        studentsSubtitle: 'تعرف على الطلاب المتفوقين والمتميزين في مسيرتهم التعليمية'
      },
      footer: {
        description: 'حول مسارك المهني مع دورات يقودها خبراء في التكنولوجيا والأعمال والمهارات الإبداعية. انضم إلى ملايين المتعلمين حول العالم.',
        learn: 'التعلم',
        freeCourses: 'دورات مجانية',
        certificates: 'الشهادات',
        learningPaths: 'مسارات التعلم',
        support: 'الدعم',
        helpCenter: 'مركز المساعدة',
        contact: 'اتصل بنا',
        community: 'المجتمع',
        blog: 'المدونة',
        careers: 'الوظائف',
        stayUpdated: 'ابق على اطلاع',
        newsletterDesc: 'احصل على أحدث الدورات ونصائح التعلم في بريدك الإلكتروني.',
        emailPlaceholder: 'أدخل بريدك الإلكتروني',
        subscribe: 'اشترك',
        privacy: 'سياسة الخصوصية',
        terms: 'شروط الخدمة',
        cookies: 'سياسة الكوكيز',
        rights: 'جميع الحقوق محفوظة.',
        followUs: 'تابعنا'
      },
      login: {
        welcomeBack: 'مرحباً بعودتك',
        accessAccount: 'سجل الدخول للوصول إلى حسابك',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'example@example.com',
        password: 'كلمة المرور',
        rememberMe: 'تذكرني',
        forgotPassword: 'نسيت كلمة المرور؟',
        signingIn: 'جارٍ تسجيل الدخول...',
        signIn: 'تسجيل الدخول',
        or: 'أو',
        noAccount: 'ليس لديك حساب؟',
        signUpNow: 'سجل الآن'
      },
      register: {
        title: 'إنشاء حساب',
        subtitle: 'انضم إلى آلاف المتعلمين حول العالم',
        name: 'الاسم الكامل',
        namePlaceholder: 'أدخل اسمك الكامل',
        email: 'البريد الإلكتروني',
        emailPlaceholder: 'أدخل بريدك الإلكتروني',
        profileImage: 'صورة الملف الشخصي (اختياري)',
        password: 'كلمة المرور',
        passwordPlaceholder: 'أدخل كلمة المرور',
        confirmPassword: 'تأكيد كلمة المرور',
        confirmPasswordPlaceholder: 'أكد كلمة المرور',
        createAccount: 'إنشاء حساب',
        creatingAccount: 'جاري إنشاء الحساب...',
        alreadyHaveAccount: 'لديك حساب بالفعل؟',
        signIn: 'تسجيل الدخول',
        fillAllFields: 'يرجى ملء جميع الحقول',
        passwordsDontMatch: 'كلمات المرور غير متطابقة',
        passwordLength: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
        invalidImageType: 'يرجى اختيار ملف صورة صالح',
        imageTooLarge: 'يجب أن يكون حجم الصورة أقل من 5 ميجابايت',
        registrationFailed: 'فشل إنشاء الحساب',
        registrationError: 'حدث خطأ أثناء إنشاء الحساب'
      },
      common: {
        loading: 'جاري التحميل...',
        error: 'حدث خطأ ما',
        search: 'البحث...',
        filter: 'فلترة',
        sort: 'ترتيب حسب',
        viewAll: 'عرض الكل'
      },
      hero: {
        title: 'الأكاديمية الاحترافية',
        subtitle: 'بوابتك نحو التميز في التعليم',
        description: 'انضم إلى آلاف الطلاب في رحلتهم نحو النجاح الأكاديمي مع منصتنا التعليمية الشاملة عبر الإنترنت.',
        startLearning: 'ابدأ التعلم الآن',
        exploreCourses: 'استكشف الكورسات',
        interactiveLearning: 'التعلم التفاعلي',
        experienceFuture: 'جرب مستقبل التعليم',
        scrollDown: 'قم بالتمرير للأسفل'
      },
      teachers: {
        title: 'المعلمين المتميزين',
        subtitle: 'تعرف على معلمينا الأكثر تفوقاً وإبداعاً',
        courses: 'الكورسات',
        students: 'الطلاب',
        rating: 'التقييم'
      },
      students: {
        title: 'لوحة شرف الطلاب',
        subtitle: 'تعرف على الطلاب المتفوقين والمتميزين في مسيرتهم التعليمية',
        grade: 'الصف',
        country: 'البلد',
        completed: 'المكتملة',
        totalCourses: 'الكورسات'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;