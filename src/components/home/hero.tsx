import { useEffect, useState } from "react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

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
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* المحتوى على اليسار */}
          <div className={`flex-1 text-white transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}>
            {/* العنوان الرئيسي */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Professional Academy{" "}
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent block">
                  EDU
                </span>
              </h1>
            </div>
            
            {/* الشعار والوصف */}
            <div className="space-y-6 mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold text-white/90 leading-tight">
                Your Gateway to Excellence in Education
              </h2>
              <p className="text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed">
                Join thousands of students on their journey to academic success with our comprehensive online learning platform.
              </p>
            </div>

            {/* حقلين الإدخال */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mb-8">
              <div className="space-y-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <input 
                  type="password" 
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* الأزرار */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg flex items-center justify-center gap-3">
                <span>Start Learning Now</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3">
                <span>Explore Courses</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* الجانب الأيمن مع العناصر البصرية */}
          <div className={`flex-1 flex justify-center transition-all duration-1000 delay-500 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            <div className="relative">
              {/* دائرة رئيسية */}
              <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-white/10 rounded-full mx-auto flex items-center justify-center backdrop-blur-sm border border-white/20 shadow-2xl">
                <div className="text-center text-white/90">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/30">
                    <svg className="w-12 h-12 md:w-16 md:h-16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold">Interactive Learning</p>
                  <p className="text-blue-200 mt-2">Experience the future of education</p>
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
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-1000 delay-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/70 text-sm">Scroll Down</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
            <div className="w-1 h-3 bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>

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