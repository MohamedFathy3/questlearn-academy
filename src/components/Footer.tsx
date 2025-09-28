import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import logo from '@/assets/logo.png'

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [languageOpen, setLanguageOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguageOpen(false);
    // تحديث اتجاه الصفحة
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  const isRTL = i18n.language === 'ar';

  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 border-t border-tan/20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
        <Link to="/" className="flex items-center">
  <div className="w-auto h-auto">
    <img 
      src={logo} 
      alt="LearnHub Logo"
      className="max-h-40 object-contain"
    />
  </div>
</Link>


            <p className="text-muted-foreground leading-relaxed">
              {t('footer.description', 'Transform your career with expert-led courses in technology, business, and creative skills. Join millions of learners worldwide.')}
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="hover:bg-tan/10 hover:text-tan transition-colors">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-tan/10 hover:text-tan transition-colors">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-tan/10 hover:text-tan transition-colors">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-tan/10 hover:text-tan transition-colors">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-tan/10 hover:text-tan transition-colors">
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">
              {t('footer.learn', 'Learn')}
            </h3>
            <div className="space-y-3">
              <Link to="/courses" className="block text-muted-foreground hover:text-tan transition-colors">
                {t('courses.title', 'All Courses')}
              </Link>
              <Link to="/categories" className="block text-muted-foreground hover:text-tan transition-colors">
                {t('nav.categories', 'Categories')}
              </Link>
              <Link to="/free-courses" className="block text-muted-foreground hover:text-tan transition-colors">
                {t('footer.freeCourses', 'Free Courses')}
              </Link>
              <Link to="/certificates" className="block text-muted-foreground hover:text-tan transition-colors">
                {t('footer.certificates', 'Certificates')}
              </Link>
              <Link to="/learning-paths" className="block text-muted-foreground hover:text-tan transition-colors">
                {t('footer.learningPaths', 'Learning Paths')}
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">
              {t('footer.support', 'Support')}
            </h3>
            <div className="space-y-3">
              <Link to="/help" className="block text-muted-foreground hover:text-tan transition-colors">
                {t('footer.helpCenter', 'Help Center')}
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-tan transition-colors">
                {t('footer.contact', 'Contact Us')}
              </Link>
              <Link to="/community" className="block text-muted-foreground hover:text-tan transition-colors">
                {t('footer.community', 'Community')}
              </Link>
              <Link to="/blog" className="block text-muted-foreground hover:text-tan transition-colors">
                {t('footer.blog', 'Blog')}
              </Link>
              <Link to="/careers" className="block text-muted-foreground hover:text-tan transition-colors">
                {t('footer.careers', 'Careers')}
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">
              {t('footer.stayUpdated', 'Stay Updated')}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t('footer.newsletterDesc', 'Get the latest courses and learning tips delivered to your inbox.')}
            </p>
            <div className="space-y-3">
              <Input 
                placeholder={t('footer.emailPlaceholder', 'Enter your email')}
                className="bg-background border-tan/20 focus:border-tan focus:ring-tan/20"
              />
              <Button className="w-full bg-tan hover:bg-tan/90 text-white transition-colors shadow-md">
                {t('footer.subscribe', 'Subscribe')}
              </Button>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <Link to="/privacy" className="block hover:text-tan transition-colors">
                {t('footer.privacy', 'Privacy Policy')}
              </Link>
              <Link to="/terms" className="block hover:text-tan transition-colors">
                {t('footer.terms', 'Terms of Service')}
              </Link>
              <Link to="/cookies" className="block hover:text-tan transition-colors">
                {t('footer.cookies', 'Cookie Policy')}
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-tan/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-muted-foreground text-sm">
            © 2024 LearnHub. {t('footer.rights', 'All rights reserved.')}
          </div>
          
          {/* Language Selector */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 hover:text-tan"
                onClick={() => setLanguageOpen(!languageOpen)}
              >
                <Globe className="w-4 h-4" />
                <span>{i18n.language === 'ar' ? 'العربية' : 'English'}</span>
              </Button>
              
              {languageOpen && (
                <div className={`absolute bottom-full mb-2 ${isRTL ? 'left-0' : 'right-0'} bg-background border border-tan/20 rounded-lg shadow-lg z-10 min-w-[120px]`}>
                  <button
                    onClick={() => changeLanguage('en')}
                    className={`w-full px-4 py-2 text-left hover:bg-tan/10 transition-colors ${
                      i18n.language === 'en' ? 'text-tan bg-tan/5' : ''
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('ar')}
                    className={`w-full px-4 py-2 text-left hover:bg-tan/10 transition-colors ${
                      i18n.language === 'ar' ? 'text-tan bg-tan/5' : ''
                    }`}
                  >
                    العربية
                  </button>
                </div>
              )}
            </div>
            
            <span className="flex items-center gap-1">
              💵 USD
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;