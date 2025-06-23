import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const navItems = [
    { name: 'الصفحة الرئيسية', path: '/' },
    { 
      name: 'نبذة عنا', 
      path: '/about',
      button: {
        name: 'العب الآن',
        path: '/'
      }
    }
  ];

  const headerVariants = {
    hidden: { 
      y: -100, 
      opacity: 0,
      scale: 0.95
    },
    visible: { 
      y: 0, 
      opacity: 1,
      scale: 1
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: -20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      transition={{ 
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }}
      className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b-4 border-[#facc15]"
      dir="rtl"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24 relative">
          {/* Logo */}
          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.4 }}
          >
            <Link to="/" className="flex items-center justify-center">
              <div 
                className="rounded-full flex items-center justify-center transition-all duration-300 ease-in-out" 
                style={{ 
                  height: isScrolled ? '80px' : '200px', 
                  width: isScrolled ? '80px' : '200px',
                  marginTop: isScrolled ? '8px' : '34px',
                  backgroundColor: isScrolled ? 'transparent' : '#facc15',
                  overflow: 'hidden'
                }}
              >
                <img 
                  src="/assets/logo.png" 
                  alt="Logo" 
                  className="w-auto transition-all duration-300 ease-in-out" 
                  style={{ 
                    height: isScrolled ? '64px' : '161px', 
                    marginTop: isScrolled ? '0' : '39px' 
                  }} 
                />
              </div>
            </Link>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-8 space-x-reverse">
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                variants={itemVariants}
                transition={{ duration: 0.4 }}
                className="flex items-center space-x-4 space-x-reverse"
              >
                <Link
                  to={item.path}
                  className={`relative px-3 py-2 text-gray-800 hover:text-[#6B46C1] transition-colors duration-200 font-medium
          ${location.pathname === item.path ? 'text-[#6B46C1]' : ''}`}
                >
                  {item.name}
                  {location.pathname === item.path && item.path !== '/' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6B46C1] rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
                {item.button && (
                  <Link
                    to={item.button.path}
                    className="inline-flex items-center px-6 py-2 bg-[#facc15] text-white rounded-full font-medium hover:bg-[#facc15]/90 transition-colors duration-200 shadow-sm"
                  >
                    {item.button.name}
                  </Link>
                )}
              </motion.div>
            ))}
          </nav>
          
          {/* Login Button */}
          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.4 }}
            className="hidden md:flex items-center"
          >
            <Link
              to="/login"
              className="flex items-center space-x-2 space-x-reverse text-gray-800 hover:text-[#6B46C1] transition-colors duration-200"
            >
              <span className="font-medium">تسجيل الدخول</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            variants={itemVariants}
            transition={{ duration: 0.4 }}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 