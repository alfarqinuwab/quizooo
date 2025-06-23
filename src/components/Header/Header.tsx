import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
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
      className="fixed top-0 left-0 right-0 z-50 bg-[#6B46C1] shadow-sm border-b-4 border-[#facc15]"
      dir="rtl"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 relative">
          {/* Login Button */}
          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.4 }}
            className="absolute left-4 flex items-center"
          >
            <Link
              to="/login"
              className="flex items-center space-x-2 space-x-reverse text-white/90 hover:text-[#facc15] transition-colors duration-200"
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
                          className={`relative px-3 py-2 text-white/90 hover:text-[#facc15] transition-colors duration-200 font-medium
          ${location.pathname === item.path ? 'text-[#facc15]' : ''}`}
                >
                  {item.name}
                  {location.pathname === item.path && item.path !== '/' && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#facc15] rounded-full"
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

          {/* Mobile Menu Button */}
          <motion.button
            variants={itemVariants}
            transition={{ duration: 0.4 }}
            className="md:hidden absolute right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Menu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-6 h-6 text-white"
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