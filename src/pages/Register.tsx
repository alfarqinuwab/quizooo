import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const handleGoogleRegister = () => {
    alert('جاري توجيهك إلى صفحة إنشاء حساب مع Google...');
    const googleAuthUrl = 'https://accounts.google.com/oauth/authorize?' +
      'client_id=YOUR_CLIENT_ID&' +
      'redirect_uri=' + encodeURIComponent(window.location.origin + '/auth/google/callback') +
      '&response_type=code&' +
      'scope=email profile&' +
      'access_type=offline';
    window.open(googleAuthUrl, '_blank', 'width=500,height=600');
  };

  const handleMicrosoftRegister = () => {
    alert('جاري توجيهك إلى صفحة إنشاء حساب مع Microsoft...');
    const microsoftAuthUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?' +
      'client_id=YOUR_MICROSOFT_CLIENT_ID&' +
      'redirect_uri=' + encodeURIComponent(window.location.origin + '/auth/microsoft/callback') +
      '&response_type=code&' +
      'scope=openid email profile&' +
      'response_mode=query';
    window.open(microsoftAuthUrl, '_blank', 'width=500,height=600');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col justify-between relative overflow-hidden" dir="rtl">
      {/* Header */}
      <header className="flex justify-between items-center px-10 py-6">
        <div></div>
        <div></div>
      </header>

      {/* Main register card */}
      <main className="flex flex-1 items-center justify-center z-10 -mt-20">
        <div className="bg-white rounded-3xl shadow-xl px-12 py-6 w-full max-w-xl flex flex-col items-center relative animate-login-fade-slide">
          <h2 className="text-2xl font-extrabold mb-2 text-gray-800 text-center">إنشاء حساب جديد</h2>
          <p className="text-gray-500 mb-4 text-center">أدخل بياناتك لإنشاء حساب جديد</p>
          
          <form className="w-full flex flex-col gap-3">
            <input
              type="text"
              placeholder="الاسم"
              className="w-full px-5 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg bg-gray-50 text-right"
            />
            <input
              type="tel"
              placeholder="رقم الهاتف"
              className="w-full px-5 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg bg-gray-50 text-right"
            />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full px-5 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg bg-gray-50 text-right"
            />
            <div className="w-full relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="كلمة المرور"
                className="w-full px-5 py-3 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg bg-gray-50 text-right"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.671-2.568A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.293 5.03M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6.364 6.364L19.07 4.93" /></svg>
                )}
              </button>
            </div>
            <input
              type="text"
              placeholder="المدرسة"
              className="w-full px-5 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg bg-gray-50 text-right"
            />
            <button type="submit" className="w-full bg-[#6B46C1] hover:bg-[#facc15] text-white font-bold py-3 rounded-xl text-lg transition-colors mb-2">إنشاء الحساب</button>
          </form>
          
          <div className="flex items-center w-full my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-3 text-gray-400 text-sm">أو أنشئ حساب بواسطة</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          
          <div className="flex flex-col gap-4 w-full justify-center mb-4 mt-6">
            <button className="flex items-center justify-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-white hover:bg-gray-50 font-bold text-gray-700 text-lg" onClick={handleGoogleRegister}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
              إنشاء حساب مع Google
            </button>
            <button className="flex items-center justify-center gap-3 border border-gray-200 rounded-lg px-4 py-3 bg-white hover:bg-gray-50 font-bold text-gray-700 text-lg" onClick={handleMicrosoftRegister}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="w-6 h-6" />
              إنشاء حساب مع Microsoft
            </button>
          </div>
          
          <div className="text-center text-gray-500 text-sm mt-2">
            لديك حساب بالفعل؟ <button className="text-yellow-500 font-bold hover:underline" onClick={handleLoginClick}>تسجيل الدخول</button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm py-6">
        جميع الحقوق محفوظة @wework 2022 | سياسة الخصوصية
      </footer>
    </div>
  );
};

export default Register; 