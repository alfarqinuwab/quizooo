import React from 'react';

const QuizQuestions: React.FC = () => {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">الأسئلة</h1>
        
        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[#facc15] font-bold">السؤال 1</span>
            <span className="text-accent-orange">الوقت المتبقي: 30 ثانية</span>
          </div>
          
          <p className="text-xl mb-6">ما هو ناتج 5 × 7؟</p>
          
          {/* Answer Options */}
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 border-2 border-[#facc15] rounded-lg hover:bg-[#facc15] hover:text-white transition-colors">
              35
            </button>
            <button className="p-4 border-2 border-[#facc15] rounded-lg hover:bg-[#facc15] hover:text-white transition-colors">
              30
            </button>
            <button className="p-4 border-2 border-[#facc15] rounded-lg hover:bg-[#facc15] hover:text-white transition-colors">
              40
            </button>
            <button className="p-4 border-2 border-[#facc15] rounded-lg hover:bg-[#facc15] hover:text-white transition-colors">
              45
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
            السابق
          </button>
          <button className="px-6 py-3 bg-[#facc15] text-white rounded-lg hover:bg-[#facc15]/90 transition-colors">
            التالي
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestions; 