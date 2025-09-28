import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Menu, X, User, ShoppingCart, LogOut } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useAuth } from "@/context/AuthContext"; // تأكد من المسار

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  // استخدام الـ AuthContext
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: t('nav.home'), path: "/" },
    { name: t('nav.courses'), path: "/courses" },
    { name: t('nav.honorBoard'), path: "/honor-board" },
    { name: t('nav.Board'), path: "/HonerBoard" },

  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0  z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between ">
          {/* Logo - باستخدام صورة من public */}
<Link to="/" className="flex items-center space-x-3 transition-smooth hover:opacity-80 flex-1 max-w-xs">
  <img 
    src="/logo.png"
    alt="LearnHub Logo"
    className="w-20 h-13 md:w-32 md:h-20 lg:w-40 lg:h-24 object-contain"
    onError={(e) => {
      e.currentTarget.style.display = 'none';
      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
      if (fallback) {
        fallback.style.display = 'flex';
      }
    }}
  />
  {/* Fallback */}
  <div 
    className="w-24 h-16 md:w-32 md:h-20 lg:w-40 lg:h-24 bg-gradient-primary rounded-xl flex items-center justify-center hidden px-4"
    style={{ display: 'none' }}
  >
    <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-white" />
  </div>
</Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-smooth hover:text-tan m-3 ${
                  isActive(item.path) ? "text-tan font-semibold" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
              <Input
                placeholder={t('common.search')}
                className={`${isArabic ? 'pr-10 text-right' : 'pl-10'} bg-muted/50 border-transparent focus:bg-background transition-smooth`}
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            <LanguageToggle />
            <ThemeToggle />
            
            {/* سلة التسوق - تظهر للجميع */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <ShoppingCart className="w-5 h-5" />
            </Button>

            {/* إذا كان المستخدم مسجل دخول */}
            {isAuthenticated ? (
              <>
                {/* Profile Dropdown/Button */}
                <div className="flex items-center space-x-2">
                  {/* صورة البروفايل إذا موجودة */}
                  {user?.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
                    />
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={handleProfile}
                      className="relative"
                    >
                      <User className="w-5 h-5" />
                    </Button>
                  )}
                  
                  {/* زر تسجيل الخروج */}
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleLogout}
                    title={t('nav.logout')}
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>

                  {/* اسم المستخدم في الشاشات الكبيرة */}
                  <span className="hidden lg:block text-sm font-medium text-muted-foreground">
                    {user?.name}
                  </span>
                </div>
              </>
            ) : (
              /* إذا كان غير مسجل دخول */
              <>
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
                <Link to="/login">
                  <Button className="hidden md:flex bg-tan  text-white hover:bg-tan/90 transition-smooth">
                    {t('nav.signIn')}
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {/* شريط البحث في الموبايل */}
              <div className="relative">
                <Search className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
                <Input
                  placeholder={t('common.search')}
                  className={`${isArabic ? 'pr-10 text-right' : 'pl-10'} bg-muted/50 border-transparent`}
                />
              </div>

              {/* عناصر التنقل */}
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg transition-smooth ${
                    isActive(item.path) ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* إذا كان المستخدم مسجل دخول - قسم الموبايل */}
              {isAuthenticated ? (
                <div className="space-y-2 px-4">
                  {/* معلومات المستخدم */}
                  <div className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
                    {user?.image ? (
                      <img 
                        src={user.image} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  {/* أزرار الموبايل */}
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={handleProfile}
                  >
                    <User className="w-4 h-4 mr-2" />
                    {t('nav.profile')}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.logout')}
                  </Button>
                </div>
              ) : (
                /* إذا كان غير مسجل دخول - قسم الموبايل */
                <div className="space-y-2 px-4">
                  <Link to="/login" className="w-full block">
                    <Button className="w-full bg-gradient-primary hover:opacity-90 transition-smooth">
                      {t('nav.signIn')}
                    </Button>
                  </Link>
                </div>
              )}

              {/* الإعدادات */}
              <div className="flex gap-2 px-4">
                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;