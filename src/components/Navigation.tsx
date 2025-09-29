import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Menu, X, User, ShoppingCart, LogOut, ChevronDown, Bell } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useAuth } from "@/context/AuthContext";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  
  const { user, logout, isAuthenticated } = useAuth();

  // Animation for scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    setIsProfileOpen(false);
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-500 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50' 
        : 'bg-background/80 backdrop-blur-md shadow-soft border-b border-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-22">
          {/* Logo with animation */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 transition-all duration-500 hover:scale-105 active:scale-95 flex-1 max-w-xs"
          >
            <img 
              src="/logo.png"
              alt="LearnHub Logo"
              className="w-20 h-13 md:w-32 md:h-20 lg:w-40 lg:h-24 object-contain transition-all duration-500"
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
              className="w-24 h-16 md:w-32 md:h-20 lg:w-40 lg:h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center hidden px-4 shadow-lg animate-pulse"
              style={{ display: 'none' }}
            >
              <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
          </Link>

          {/* Desktop Navigation with hover animations */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  isActive(item.path) 
                    ? "text-primary font-semibold bg-primary/10 shadow-inner" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                } animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.name}
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full animate-pulse"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Search Bar with animation */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors duration-300`} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.search')}
                className={`${isArabic ? 'pr-10 text-right' : 'pl-10'} bg-muted/50 border-transparent focus:bg-background transition-all duration-300 focus:scale-105 focus:shadow-lg`}
              />
            </form>
          </div>

          {/* Right Actions with enhanced animations */}
          <div className="flex items-center space-x-2">
            <LanguageToggle />
            <ThemeToggle />
            
            {/* Notification Bell */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hidden md:flex transition-all duration-300 hover:scale-110 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:shadow-lg"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background"></span>
            </Button>

            {/* Shopping Cart with animation */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden md:flex transition-all duration-300 hover:scale-110 hover:bg-green-50 dark:hover:bg-green-950/30 hover:shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
            </Button>

            {/* User Section */}
            {isAuthenticated ? (
              <div className="relative">
                {/* Profile Dropdown Trigger */}
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 p-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-muted/50"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  {user?.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary/20 transition-all duration-300 hover:border-primary"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                      {user?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                    </div>
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </Button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-background/95 backdrop-blur-xl rounded-xl shadow-2xl border border-border/50 animate-slide-in-fade">
                    <div className="p-4 border-b border-border/50">
                      <div className="flex items-center space-x-3">
                        {user?.image ? (
                          <img 
                            src={user.image} 
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                            {user?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">{user?.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start px-3 py-2 rounded-lg transition-all duration-300 hover:bg-muted hover:scale-105"
                        onClick={handleProfile}
                      >
                        <User className="w-4 h-4 mr-3" />
                        {t('nav.profile')}
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start px-3 py-2 rounded-lg text-red-600 transition-all duration-300 hover:bg-red-50 hover:scale-105 hover:text-red-700"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        {t('nav.logout')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Login/Signup Buttons */
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    className="hidden md:flex transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    {t('nav.signIn')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    className="hidden md:flex bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-blue-600 hover:to-purple-700"
                  >
                    {t('nav.signUp')}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle with animation */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden transition-all duration-300 hover:scale-110 hover:bg-muted/50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 animate-spin-in" />
              ) : (
                <Menu className="w-5 h-5 animate-pulse" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu with enhanced animations */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-slide-in-down">
            {/* Search in Mobile */}
            <form onSubmit={handleSearch} className="relative mb-4 px-4">
              <Search className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.search')}
                className={`${isArabic ? 'pr-10 text-right' : 'pl-10'} bg-muted/50 border-transparent transition-all duration-300`}
              />
            </form>

            {/* Mobile Navigation Items */}
            <div className="space-y-2 px-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                    isActive(item.path) 
                      ? "bg-primary/10 text-primary font-semibold shadow-inner" 
                      : "hover:bg-muted/50"
                  } animate-fade-in-up`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile User Section */}
            <div className="mt-6 pt-4 border-t border-border/50">
              {isAuthenticated ? (
                <div className="space-y-3 px-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl transition-all duration-300 hover:scale-105">
                    {user?.image ? (
                      <img 
                        src={user.image} 
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  {/* Mobile Action Buttons */}
                  <Button 
                    variant="outline" 
                    className="w-full justify-center py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    onClick={handleProfile}
                  >
                    <User className="w-4 h-4 mr-2" />
                    {t('nav.profile')}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-center py-3 rounded-xl text-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-red-50 hover:text-red-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('nav.logout')}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 px-4">
                  <Link to="/login" className="block" onClick={() => setIsMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full justify-center py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      {t('nav.signIn')}
                    </Button>
                  </Link>
                  <Link to="/register" className="block" onClick={() => setIsMenuOpen(false)}>
                    <Button 
                      className="w-full justify-center py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      {t('nav.signUp')}
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Settings */}
              <div className="flex justify-center gap-4 px-4 mt-4 pt-4 border-t border-border/50">
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