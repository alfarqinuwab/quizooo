import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const userTypes = [
  {
    key: 'teacher_man',
    label: 'معلم',
    img: '/assets/subjects/member/teacher man.png',
  },
  {
    key: 'teacher_women',
    label: 'معلمة',
    img: '/assets/subjects/member/teacher women.png',
  },
  {
    key: 'student_man',
    label: 'طالب',
    img: '/assets/subjects/member/student man.png',
  },
  {
    key: 'student_lady',
    label: 'طالبة',
    img: '/assets/subjects/member/student lady.png',
  },
];

const ChooseUserType: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (selected) {
      navigate(`/register?type=${selected}`);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-[#F4F4F4] pt-24" dir="rtl">
      <div className="bg-white rounded-3xl shadow-xl px-10 py-10 w-full max-w-4xl min-h-[300px] flex flex-col items-center animate-bounce-in">
        <h1 className="text-2xl font-extrabold mb-1 text-gray-800 text-center mt-1">اختر نوع الحساب</h1>
        <div className="flex-1 flex flex-col justify-center w-full">
          <div className="flex flex-row justify-center gap-12 w-full mb-8 mt-12">
            {userTypes.map((type) => (
              <button
                key={type.key}
                type="button"
                onClick={() => setSelected(selected === type.key ? null : type.key)}
                className="flex flex-col items-center focus:outline-none transition-all duration-200 min-h-[200px] justify-between"
              >
                <div className={`rounded-full overflow-hidden w-40 h-40 flex items-center justify-center bg-gray-100 border-4 border-[#facc15] transition-all duration-300 origin-bottom ${selected === type.key ? 'scale-125 ring-4 ring-[#6B46C1]' : selected ? 'grayscale opacity-40' : ''}`}>
                  <img src={type.img} alt={type.label} className="w-36 h-36 object-cover" />
                </div>
                <span className={`mt-1 font-bold transition-all duration-300 ${selected === type.key ? 'text-2xl text-[#6B46C1]' : selected ? 'text-lg text-gray-400' : 'text-lg text-gray-500'}`}>{type.label}</span>
              </button>
            ))}
          </div>
          <button
            className={`w-full py-3 rounded-xl text-xl font-bold transition-colors ${selected ? 'bg-[#6B46C1] text-white hover:bg-[#facc15] hover:text-[#6B46C1]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            onClick={handleNext}
            disabled={!selected}
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseUserType; 