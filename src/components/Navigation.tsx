import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Search,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
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
  const isArabic = i18n.language === "ar";

  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: t("nav.home"), path: "/" },
    { name: t("nav.courses"), path: "/courses" },
    { name: t("nav.honorBoard"), path: "/honor-board" },
    { name: t("nav.Board"), path: "/HonerBoard" },
    { name: t("nav.contact"), path: "/contact" },
    { name: t("nav.library_student"), path: "/library_student" },
    { name: t("nav.library_teacher"), path: "/library_teacher" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleProfile = () => {
    if (user?.type === "parent" || user?.type === "Perant") {
      navigate("/profileParent");
    } else {
      navigate("/profile");
    }
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
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50"
          : "bg-background/80 backdrop-blur-md border-b border-transparent"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4">
        {/* Header Row */}
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 transition-all duration-500 hover:scale-105 active:scale-95"
          >
            <img
              src="/logo.png"
              alt="LearnHub Logo"
              className="w-24 h-20 md:w-32 lg:w-36 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-2">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? "text-primary bg-primary/10 shadow-inner"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.name}
                {isActive(item.path) && (
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-primary rounded-full animate-pulse"
                  ></div>
                )}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Toggles */}
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 p-2 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-muted/50"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary/20"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                      {user?.name?.charAt(0).toUpperCase() || (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                  )}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                {isProfileOpen && (
                  <div
                    className={`absolute ${
                      isArabic ? "left-0" : "right-0"
                    } top-full mt-2 w-60 bg-background/95 backdrop-blur-xl rounded-xl shadow-2xl border border-border/50 animate-slide-in-fade`}
                  >
                    <div className="p-4 border-b border-border/50">
                      <div className="flex items-center gap-3">
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
                          <p className="font-semibold text-foreground truncate">
                            {user?.name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-all duration-300"
                        onClick={handleProfile}
                      >
                        <User className="w-4 h-4" />
                        {t("nav.profile")}
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 px-3 py-2 text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all duration-300"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        {t("nav.logout")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="hover:scale-105">
                    {t("nav.signIn")}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:scale-105">
                    {t("nav.signUp")}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-muted/50 hover:scale-110 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-slide-in-down">
            <form onSubmit={handleSearch} className="relative mb-4 px-4">
              <Search
                className={`absolute ${
                  isArabic ? "right-3" : "left-3"
                } top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground`}
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("common.search")}
                className={`${
                  isArabic ? "pr-10 text-right" : "pl-10"
                } bg-muted/50 border-transparent`}
              />
            </form>

            <div className="space-y-2 px-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105 ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary font-semibold"
                      : "hover:bg-muted/50"
                  } ${isArabic ? "text-right" : "text-left"}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
