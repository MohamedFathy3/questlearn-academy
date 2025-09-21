import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Menu, X, User, ShoppingCart } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 transition-smooth hover:opacity-80">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">LearnHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition-smooth hover:text-primary ${
                isActive("/") ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/courses"
              className={`transition-smooth hover:text-primary ${
                isActive("/courses") ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              Courses
            </Link>
            <Link
              to="/categories"
              className={`transition-smooth hover:text-primary ${
                isActive("/categories") ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              Categories
            </Link>
            <Link
              to="/about"
              className={`transition-smooth hover:text-primary ${
                isActive("/about") ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              About
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search courses, instructors..."
                className="pl-10 bg-muted/50 border-transparent focus:bg-background transition-smooth"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <ShoppingCart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
            <Button className="hidden md:flex bg-gradient-primary hover:opacity-90 transition-smooth">
              Sign In
            </Button>

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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10 bg-muted/50 border-transparent"
                />
              </div>
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg transition-smooth ${
                  isActive("/") ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className={`px-4 py-2 rounded-lg transition-smooth ${
                  isActive("/courses") ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Courses
              </Link>
              <Link
                to="/categories"
                className={`px-4 py-2 rounded-lg transition-smooth ${
                  isActive("/categories") ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/about"
                className={`px-4 py-2 rounded-lg transition-smooth ${
                  isActive("/about") ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Button className="bg-gradient-primary hover:opacity-90 transition-smooth">
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;