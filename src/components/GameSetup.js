import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';

const GameSetup = () => {
  const navigate = useNavigate();
  const { setStage, setLessons } = useQuiz();
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedLessons, setSelectedLessons] = useState([]);

  const handleStart = () => {
    if (selectedStage && selectedLessons.length > 0) {
      setStage(selectedStage);
      setLessons(selectedLessons);
      navigate('/quiz-questions');
    } else {
      alert('الرجاء اختيار المرحلة والدروس');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-center text-2xl mb-4">اختر</h2>
      <div className="flex justify-center gap-4 mb-8">
        <select 
          className="p-2 border rounded"
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
        >
          <option value="">المرحلة</option>
          <option value="1">المرحلة الأولى</option>
          <option value="2">المرحلة الثانية</option>
          <option value="3">المرحلة الثالثة</option>
        </select>
        <select className="p-2 border rounded">
          <option>الصف</option>
        </select>
        <select className="p-2 border rounded">
          <option>المادة</option>
        </select>
      </div>

      <h3 className="text-center text-xl mb-4">الدروس</h3>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className={`w-40 h-24 border-2 border-[#4B3FA7] rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors ${
              selectedLessons.includes(`lesson-${i}`) ? 'bg-[#4B3FA7]/10' : ''
            }`}
            onClick={() => {
              const lessonId = `lesson-${i}`;
              setSelectedLessons(prev => 
                prev.includes(lessonId) 
                  ? prev.filter(id => id !== lessonId)
                  : [...prev, lessonId]
              );
            }}
          >
            <div className="bg-[#FFD600] rounded-t-lg p-2 text-center">
              الدرس الأول
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mb-8">
        <a href="#" className="text-[#4B3FA7]">عرض الكل</a>
      </div>

      <div className="flex justify-center items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-[#FFD600] flex items-center justify-center">
          <span className="text-white font-bold">1</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#FFD600] flex items-center justify-center">
          <span className="text-white font-bold">2</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-[#FFD600] flex items-center justify-center">
          <span className="text-white font-bold">3</span>
        </div>
      </div>

      <div className="text-center">
        <button 
          onClick={handleStart}
          className="bg-[#4B3FA7] text-white px-8 py-4 rounded-lg text-lg hover:bg-[#4B3FA7]/90 transition-colors"
        >
          ابدأ
        </button>
      </div>
    </div>
  );
};

export default GameSetup; 