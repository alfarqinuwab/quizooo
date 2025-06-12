import React from 'react';
import { useNavigate } from 'react-router-dom';

const Results: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center">
      <div className="w-full max-w-2xl flex flex-col items-center mt-12 mb-12 px-4">
        <h1 className="main-section-title mb-8 mt-0">النتائج</h1>
        <div className="bg-white custom-border custom-rounded custom-shadow flex flex-col items-center w-full py-10 px-4 mb-8">
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-2xl font-extrabold text-primary-purple mb-2">أحسنت!</h2>
          <p className="text-lg font-bold text-text-dark mb-8">لقد أكملت الاختبار بنجاح</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-8">
            <div className="bg-background custom-border custom-rounded flex flex-col items-center py-6 px-2">
              <div className="text-3xl font-extrabold text-primary-purple mb-2">85%</div>
              <div className="text-lg font-bold text-text-dark">النسبة المئوية</div>
            </div>
            <div className="bg-background custom-border custom-rounded flex flex-col items-center py-6 px-2">
              <div className="text-3xl font-extrabold text-primary-purple mb-2">17/20</div>
              <div className="text-lg font-bold text-text-dark">الأسئلة الصحيحة</div>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
            <button
              onClick={() => navigate('/quiz')}
              className="custom-btn custom-btn-blue border-button-yellow text-xl w-full shadow-button"
              style={{borderWidth: '3px', borderColor: '#F59E0B'}}
            >
              حاول مرة أخرى
            </button>
            <button
              onClick={() => navigate('/')}
              className="custom-btn custom-btn-outline text-xl w-full"
              style={{borderWidth: '3px'}}
            >
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results; 