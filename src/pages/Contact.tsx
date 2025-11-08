import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Send, Mail, Phone, User, MessageCircle, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
const API_BASE_URL = "/api";
import Hero from '@/components/home/hero';

const ContactUs = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    type: 'complaint', // 'complaint' or 'suggestion'
    userType: 'student' // 'student', 'teacher', 'parent'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send immediately without waiting
    fetch(`${API_BASE_URL}/contact-us`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        type: formData.type,
        userType: formData.userType
      }),
    }).catch(error => {
      console.error('Error:', error);
    });
    
    // Show immediate success
    setIsSubmitted(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
        type: 'complaint',
        userType: 'student'
      });
      setIsSubmitted(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <Hero />
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300/10 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-300/10 rounded-full blur-3xl"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, delay: 4 }}
        />
      </div>

      {/* Contact Form Section */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-2 mb-4"
              >
                <MessageCircle className="w-8 h-8 text-blue-600" />
                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {t('contact.subtitle')}
                </span>
              </motion.div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t('contact.formTitle')} 
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {t('contact.description')}
              </p>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 hover:shadow-glow transition-all duration-500"
            >
              {isSubmitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{t('contact.submitted')}</h3>
                  <p className="text-gray-600">{t('contact.submittedMessage')}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Type Selection */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {t('contact.form.type')}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, type: 'complaint'})}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-300 ${
                          formData.type === 'complaint' 
                            ? 'border-red-500 bg-red-50 text-red-700' 
                            : 'border-gray-300 bg-white/50 hover:bg-gray-50'
                        }`}
                      >
                        <AlertCircle className="w-5 h-5" />
                        {t('contact.types.complaint')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, type: 'suggestion'})}
                        className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-300 ${
                          formData.type === 'suggestion' 
                            ? 'border-green-500 bg-green-50 text-green-700' 
                            : 'border-gray-300 bg-white/50 hover:bg-gray-50'
                        }`}
                      >
                        <Lightbulb className="w-5 h-5" />
                        {t('contact.types.suggestion')}
                      </button>
                    </div>
                  </motion.div>

                  {/* User Type Selection */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {t('contact.form.userType')}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['student', 'teacher', 'parent'].map((userType) => (
                        <button
                          key={userType}
                          type="button"
                          onClick={() => setFormData({...formData, userType})}
                          className={`p-3 rounded-xl border-2 transition-all duration-300 ${
                            formData.userType === userType 
                              ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' 
                              : 'border-gray-300 bg-white/50 hover:bg-gray-50'
                          }`}
                        >
                          {t(`contact.userTypes.${userType}`)}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Name Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.name')}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pr-3 pl-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 hover:bg-white/70"
                        placeholder={t('contact.form.namePlaceholder')}
                      />
                    </div>
                  </motion.div>

                  {/* Phone Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.phone')}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full pr-3 pl-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 hover:bg-white/70"
                        placeholder={t('contact.form.phonePlaceholder')}
                      />
                    </div>
                  </motion.div>

                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.email')}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pr-3 pl-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 hover:bg-white/70"
                        placeholder={t('contact.form.emailPlaceholder')}
                      />
                    </div>
                  </motion.div>

                  {/* Message Field */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.message')}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 hover:bg-white/70 resize-none"
                      placeholder={
                        formData.type === 'complaint' 
                          ? t('contact.form.complaintPlaceholder')
                          : t('contact.form.suggestionPlaceholder')
                      }
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    <Send className="w-5 h-5" />
                    {t('contact.form.submit')}
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-8 text-lg text-gray-600"
            >
              <p>{t('contact.quickResponse')}</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;