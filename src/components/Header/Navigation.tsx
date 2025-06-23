import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-primary-purple border-b-3 border-accent-orange py-0 px-0 w-full transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
      <div className="w-full flex items-center justify-between h-16 max-w-full">
        {/* Logo (right) */}
        <div className="flex items-center h-full px-6">
          <Link to="/" className="text-2xl font-extrabold text-white">شعار</Link>
        </div>
        {/* Centered Menu */}
        <div className="flex-1 flex justify-center items-center h-full space-x-8 space-x-reverse">
          <Link to="/" className="text-white font-bold text-lg hover:text-accent-orange transition-colors">الصفحة الرئيسية</Link>
          <Link to="/about" className="text-white font-bold text-lg hover:text-accent-orange transition-colors">نبذة عنا</Link>
          <Link 
            to="/" 
            className="font-extrabold text-white text-base px-4 py-1.5 rounded-[2rem] border-3 border-accent-orange bg-accent-orange hover:bg-accent-orange/90 transition-colors"
            style={{boxShadow: '0 2px 8px 0 rgba(250,204,21,0.12)'}}
          >
            العب الآن
          </Link>
        </div>
        {/* Login (left) */}
        <div className="flex items-center h-full px-6">
          <Link to="/login" className="flex items-center text-white font-bold text-lg hover:text-accent-orange transition-colors">
            <span className="ml-2">تسجيل دخول</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 