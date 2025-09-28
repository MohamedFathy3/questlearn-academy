import heroBackground from "@/assets/hero.jpg";

export default function Hero() {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center my-8 md:my-12 lg:my-16">
      <div className="relative w-[95%] max-w-7xl h-full">
        {/* الصورة مع انحناءات جميلة */}
        <div 
          className="relative w-full h-full rounded-2xl md:rounded-3xl lg:rounded-4xl overflow-hidden shadow-2xl"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Overlay gradient لتحسين المظهر */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
          
          {/* تأثير إضاءة خفيف */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-black/2"></div>
        </div>
        
        {/* Scroll Indicator أنيق */}
        <div className="absolute -bottom-4 md:-bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-gray-100 hover:scale-110 transition-transform duration-300">
            <div className="w-1.5 h-2 md:w-2 md:h-3 bg-gray-600 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
}