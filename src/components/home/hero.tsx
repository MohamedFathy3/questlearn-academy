import { useEffect, useState } from "react";
import heroBackground from "@/assets/hero.jpg";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] flex items-center justify-center overflow-hidden">
      {/* الصورة الرئيسية مع أنيميشن */}
      <div 
        className={`absolute inset-0 w-full h-full transition-all duration-1000 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
        }`}
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay متدرج */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40"></div>
        
        {/* تأثير إضاءة متحرك */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 transition-all duration-2000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            animation: 'lightSweep 6s ease-in-out infinite'
          }}
        ></div>
      </div>

      {/* المحتوى مع أنيميشن */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
        <div className={`text-center text-white transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              profssional
            </span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed text-gray-200">
            Discover your potential with our comprehensive learning platform. 
            Join thousands of students mastering new skills every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg">
              Start Learning Now
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105">
              Explore Courses
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-1000 delay-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="w-10 h-16 border-2 border-white/50 rounded-full flex justify-center p-2">
          <div className="w-1 h-3 bg-white rounded-full animate-bounce"></div>
        </div>
      </div>

      {/* Wave Effect في الأسفل */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
    </section>
  );
}