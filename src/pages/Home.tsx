import React, { useRef, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, BookOpenIcon, ShieldCheckIcon, ClockIcon, ArrowPathIcon, SparklesIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const stages = ['المرحلة الابتدائية', 'المرحلة المتوسطة', 'المرحلة الثانوية', 'عام'];
const grades = ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس', 'عام'];
const subjects = ['الرياضيات', 'العلوم', 'اللغة العربية', 'اللغة الإنجليزية', 'التاريخ', 'الجغرافيا', 'عام'];
const powerups = [
  { id: 'teacher', name: 'معلومة من المعلمة', icon: <InformationCircleIcon className="w-6 h-6" /> },
  { id: 'book', name: 'افتح الكتاب', icon: <BookOpenIcon className="w-6 h-6" /> },
  { id: 'assistant', name: 'مساعدة ذكية', icon: <SparklesIcon className="w-6 h-6" /> },
  { id: 'change', name: 'استبدال السؤال', icon: <ArrowPathIcon className="w-6 h-6" /> },
  { id: 'shield', name: 'درع الحماية', icon: <ShieldCheckIcon className="w-6 h-6" /> },
  { id: 'time', name: 'وقت إضافي', icon: <ClockIcon className="w-6 h-6" /> },
];
const teamNames = [
  'اسم الفريق الأول',
  'اسم الفريق الثاني',
  'اسم الفريق الثالث',
  'اسم الفريق الرابع',
  'اسم الفريق الخامس',
  'اسم الفريق السادس',
];

// Simulate 20 lessons
const lessons = Array.from({ length: 20 }, (_, i) => `الدرس ${i + 1}`);

const units = Array.from({ length: 5 }, (_, i) => `وحدة ${i + 1}`);

const Home: React.FC = () => {
  const teamSetupRef = useRef<HTMLDivElement>(null);
  const [teamCount, setTeamCount] = useState(6);
  const [selectedPowers, setSelectedPowers] = useState<string[]>([]);
  const [showAllLessons, setShowAllLessons] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);

  const togglePower = (powerId: string) => {
    if (selectedPowers.includes(powerId)) {
      setSelectedPowers(selectedPowers.filter(id => id !== powerId));
    } else if (selectedPowers.length < 3) {
      setSelectedPowers([...selectedPowers, powerId]);
    }
  };

  const handleLessonSelect = (index: number) => {
    setSelectedLesson(index);
  };

  const handleUnitSelect = (index: number) => {
    setSelectedUnit(index);
  };

  // Show only first 8 unless showAllLessons is true
  const displayedLessons = showAllLessons ? lessons : lessons.slice(0, 8);

  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center">
      {/* Main Title */}
      <h1 className="main-section-title">اختر</h1>

      {/* Dropdowns */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-12 w-full max-w-4xl mx-auto">
        {/* Stage Dropdown */}
        <div className="relative w-full md:w-1/3">
          <select className="form-select pr-12">
            <option value="">المرحلة</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
          <ChevronDownIcon className="w-6 h-6 text-border-purple absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {/* Grade Dropdown */}
        <div className="relative w-full md:w-1/3">
          <select className="form-select pr-12">
            <option value="">الصف</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
          <ChevronDownIcon className="w-6 h-6 text-border-purple absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {/* Subject Dropdown */}
        <div className="relative w-full md:w-1/3">
          <select className="form-select pr-12">
            <option value="">المادة</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          <ChevronDownIcon className="w-6 h-6 text-border-purple absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Section Title */}
      <h2 className="main-section-title mb-6 mt-0">الدروس</h2>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-6xl mb-16 px-2 md:px-0">
        {displayedLessons.map((lesson, idx) => (
          <div
            key={idx}
            onClick={() => handleLessonSelect(idx)}
            className={`card-diagonal-bg custom-border custom-rounded custom-shadow flex flex-col overflow-hidden aspect-square cursor-pointer transition-all duration-300 ${
              selectedLesson === idx 
                ? 'bg-primary-purple' 
                : selectedLesson !== null 
                  ? 'bg-gray-200' 
                  : ''
            }`}
          >
            <div 
              className={`font-extrabold text-lg py-4 px-4 text-center transition-colors duration-300 ${
                selectedLesson === idx 
                  ? 'bg-primary-purple text-white' 
                  : selectedLesson !== null 
                    ? 'bg-gray-300 text-gray-600' 
                    : 'bg-accent-orange text-white'
              }`} 
              style={{borderBottom: '3px solid #6B46C1'}}
            >
              {lesson}
            </div>
            <div className="flex-1 flex items-center justify-center">
            </div>
          </div>
        ))}
      </div>

      {/* Units Section - Only show when showAllLessons is true */}
      {showAllLessons && (
        <>
          <h2 className="main-section-title mb-6 mt-0">الوحدات</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-6xl mb-16 px-2 md:px-0">
            {units.map((unit, idx) => (
              <div
                key={idx}
                onClick={() => handleUnitSelect(idx)}
                className={`card-diagonal-bg custom-border custom-rounded custom-shadow flex flex-col overflow-hidden aspect-square cursor-pointer transition-all duration-300 ${
                  selectedUnit === idx 
                    ? 'bg-primary-purple' 
                    : selectedUnit !== null 
                      ? 'bg-gray-200' 
                      : ''
                }`}
              >
                <div 
                  className={`font-extrabold text-lg py-4 px-4 text-center transition-colors duration-300 ${
                    selectedUnit === idx 
                      ? 'bg-primary-purple text-white' 
                      : selectedUnit !== null 
                        ? 'bg-gray-300 text-gray-600' 
                        : 'bg-accent-orange text-white'
                  }`} 
                  style={{borderBottom: '3px solid #6B46C1'}}
                >
                  {unit}
                </div>
                <div className="flex-1 flex items-center justify-center">
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Show All Link - Moved below units section */}
      <div className="w-full flex justify-center mb-16">
        <button
          className="text-primary-purple font-bold text-lg flex items-center gap-1 hover:text-accent-orange transition-colors bg-transparent border-none shadow-none"
          onClick={() => setShowAllLessons((prev) => !prev)}
        >
          <span>{showAllLessons ? 'إخفاء' : 'عرض الكل'}</span>
          {showAllLessons ? (
            <ChevronUpIcon className="w-5 h-5" />
          ) : (
            <ChevronDownIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Team Setup Section */}
      <div ref={teamSetupRef} className="w-full max-w-4xl mx-auto px-4 mb-24">
        {/* Class Name Input - Full Width */}
        <div className="w-full mb-4">
          <input
            type="text"
            placeholder="اسم الصف"
            className="custom-border custom-rounded px-6 py-3 text-lg font-bold w-full outline-none focus:ring-2 focus:ring-primary-purple bg-white text-text-dark"
          />
        </div>

        {/* Team Count and Names Container */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* Team Count Selector */}
          <div className="relative w-full md:w-1/4">
            <select
              value={teamCount}
              onChange={e => setTeamCount(Number(e.target.value))}
              className="form-select pr-12"
            >
              {[2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} عدد الفرق</option>
              ))}
            </select>
          </div>

          {/* Team Names Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-3/4">
            {teamNames.slice(0, teamCount).map((name, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={name}
                className="custom-border custom-rounded px-6 py-3 text-base font-bold text-primary-purple bg-white outline-none focus:ring-2 focus:ring-primary-purple"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Power-ups Section */}
      <div className="w-full max-w-4xl mx-auto px-4 mb-12">
        <div className="flex items-center justify-center gap-4 mb-2">
          <h2 className="main-section-title mb-0 mt-0">اختر وسائل مساعدة</h2>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-purple text-white font-bold">
            {selectedPowers.length}
          </div>
        </div>
        <p className="text-primary-purple font-bold mb-6 text-center">فقط ثلاثة وسائل مساعدة</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {powerups.map((power) => (
            <button
              key={power.id}
              onClick={() => togglePower(power.id)}
              className={`custom-border custom-rounded px-4 py-3 flex items-center justify-center gap-2 text-lg font-bold transition-all ${
                selectedPowers.includes(power.id) 
                  ? 'bg-primary-purple text-white border-primary-purple' 
                  : selectedPowers.length === 3 
                    ? 'bg-white text-gray-400 border-gray-400' 
                    : 'bg-white text-primary-purple border-primary-purple'
              }`}
              disabled={selectedPowers.length === 3 && !selectedPowers.includes(power.id)}
            >
              <span className={selectedPowers.length === 3 && !selectedPowers.includes(power.id) ? 'text-gray-400' : ''}>
                {power.icon}
              </span>
              {power.name}
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="w-full flex justify-center mb-12">
        <button className="custom-btn bg-primary-purple border-button-yellow text-xl px-20 py-4 shadow-button text-white rounded-[2rem]" style={{borderWidth: '3px', borderColor: '#F59E0B'}}>
          ابدأ
        </button>
      </div>
    </div>
  );
};

export default Home; 