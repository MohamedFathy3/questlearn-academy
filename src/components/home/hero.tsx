import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] flex items-center justify-center overflow-hidden">
      {/* الخلفية الزرقاء مع أنيميشن */}
      <div 
        className={`absolute inset-0 w-full h-full transition-all duration-1000 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
        } bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700`}
      >
        {/* تأثير إضاءة متحرك */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 transition-all duration-2000"
          style={{
            animation: 'lightSweep 6s ease-in-out infinite'
          }}
        ></div>
        
        {/* تأثير نقاط متحركة */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-white rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-white rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        </div>
      </div>

      {/* المحتوى مع تخطيط جديد */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
        <div className={`flex flex-col lg:flex-row items-center justify-between gap-12 ${
          isArabic ? 'lg:flex-row-reverse' : ''
        }`}>
          
          {/* المحتوى على اليسار (أو اليمين في العربية) */}
          <div className={`flex-1 text-white transition-all duration-1000 delay-300 ${
            isVisible 
              ? 'translate-x-0 opacity-100' 
              : isArabic 
                ? 'translate-x-10 opacity-0' 
                : '-translate-x-10 opacity-0'
          }`}>
            {/* العنوان الرئيسي */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                {t('hero.title')}
              </h1>
            </div>
            
            {/* الشعار والوصف */}
            <div className="space-y-6 mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-white/90 leading-tight">
                {t('hero.subtitle')}
              </h2>
              <p className="text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed">
                {t('hero.description')}
              </p>
            </div>

            {/* الأزرار */}
            <div className={`flex flex-col sm:flex-row gap-4 ${isArabic ? 'sm:flex-row-reverse' : ''}`}>
              <Link
                to="/login"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg flex items-center justify-center gap-3"
              >
                <span>{t('hero.startLearning')}</span>
                <svg 
                  className={`w-5 h-5 transform ${isArabic ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <Link
                to="/courses"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
              >
                <span>{t('hero.exploreCourses')}</span>
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* الجانب الأيمن مع العناصر البصرية */}
          <div className={`flex-1 flex justify-center transition-all duration-1000 delay-500 ${
            isVisible 
              ? 'translate-x-0 opacity-100' 
              : isArabic 
                ? '-translate-x-10 opacity-0' 
                : 'translate-x-10 opacity-0'
          }`}>
            <div className="relative">
              {/* دائرة رئيسية */}
              <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-white/10 rounded-full mx-auto flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-2xl">
               <div className="text-center text-white/90">
  <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/30 p-1">
    <img 
      src="/slider.jpeg" 
      alt="slider" 
      className="w-full h-full rounded-full object-cover border-2 border-white/40 scale-105"
      onError={(e) => {
        e.currentTarget.src = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=200&h=200&fit=crop&crop=center";
      }}
    />
  </div>
  <p className="text-xl font-semibold">
    {t('hero.interactiveLearning')}
  </p>
  <p className="text-blue-200 mt-2">
    {t('hero.experienceFuture')}
  </p>
</div>
              </div>
              
              {/* نقاط متحركة حول الدائرة */}
              <div className="absolute -top-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce shadow-lg"></div>
              <div className="absolute -top-4 right-8 w-4 h-4 bg-green-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute bottom-4 -right-4 w-5 h-5 bg-red-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '1s'}}></div>
              <div className="absolute bottom-8 left-4 w-3 h-3 bg-purple-400 rounded-full animate-bounce shadow-lg" style={{animationDelay: '1.5s'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
     
      {/* Wave Effect في الأسفل */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent dark:from-gray-900"></div>

      {/* أنيميشن الـ lightSweep */}
      <style>{`
        @keyframes lightSweep {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }
      `}</style>
    </section>
  );
}