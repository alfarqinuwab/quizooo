import React, { useRef, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, BookOpenIcon, ShieldCheckIcon, ClockIcon, ArrowPathIcon, SparklesIcon, InformationCircleIcon, UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';

const stages = ['المرحلة الابتدائية', 'المرحلة المتوسطة', 'المرحلة الثانوية', 'عام'];
const grades = ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس', 'عام'];
const subjects = ['الرياضيات', 'العلوم', 'اللغة العربية', 'اللغة الإنجليزية', 'التاريخ', 'الجغرافيا', 'عام'];
const powerups = [
  { id: 'teacher', name: 'معلومة من المعلمة', icon: <InformationCircleIcon className="w-8 h-8" /> },
  { id: 'book', name: 'افتح الكتاب', icon: <BookOpenIcon className="w-8 h-8" /> },
  { id: 'assistant', name: 'مساعدة ذكية', icon: <SparklesIcon className="w-8 h-8" /> },
  { id: 'change', name: 'استبدال السؤال', icon: <ArrowPathIcon className="w-8 h-8" /> },
  { id: 'shield', name: 'درع الحماية', icon: <ShieldCheckIcon className="w-8 h-8" /> },
  { id: 'time', name: 'وقت إضافي', icon: <ClockIcon className="w-8 h-8" /> },
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
  const helpersRef = useRef<HTMLDivElement>(null);
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<string[]>(['', '']);
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
    // Auto scroll to team setup section when a lesson is selected
    if (teamSetupRef.current) {
      teamSetupRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUnitSelect = (index: number) => {
    setSelectedUnit(index);
  };

  const addTeam = () => {
    if (teams.length < 6) {
      setTeams([...teams, '']);
      setTeamCount(teamCount + 1);
    }
  };

  const removeTeam = (index: number) => {
    const newTeams = teams.filter((_, i) => i !== index);
    setTeams(newTeams);
    setTeamCount(teamCount - 1);
  };

  // Show only first 10 unless showAllLessons is true
  const displayedLessons = showAllLessons ? lessons : lessons.slice(0, 10);

  return (
    <div className="w-[1920px] min-h-screen bg-background flex flex-col items-center mx-auto">
      {/* Main Title */}
      <h1 className="main-section-title">اختر</h1>

      {/* Dropdowns */}
      <div className="flex justify-center items-center gap-6 mb-12 w-[1600px]">
        {/* Stage Dropdown */}
        <div className="relative w-[500px]">
          <select className="form-select pl-12 px-8 py-7 text-2xl">
            <option value="">المرحلة</option>
            {stages.map((stage) => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
          <ChevronDownIcon className="w-10 h-10 text-border-purple absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {/* Grade Dropdown */}
        <div className="relative w-[500px]">
          <select className="form-select pl-12 px-8 py-7 text-2xl">
            <option value="">الصف</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
          <ChevronDownIcon className="w-10 h-10 text-border-purple absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {/* Subject Dropdown */}
        <div className="relative w-[500px]">
          <select className="form-select pl-12 px-8 py-7 text-2xl">
            <option value="">المادة</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          <ChevronDownIcon className="w-10 h-10 text-border-purple absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Section Title */}
      <h2 className="main-section-title mb-6 mt-0">الدروس</h2>

      {/* Lessons Grid */}
      <div className="grid grid-cols-5 gap-8 w-[1600px] mb-16">
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
          <div className="grid grid-cols-5 gap-8 w-[1600px] mb-16">
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

      {/* Show All Link */}
      <div className="w-[1600px] flex justify-center mb-16">
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
      <div ref={teamSetupRef} className="w-[1600px] mx-auto mb-24">
        {/* Section Title */}
        <h2 className="main-section-title mb-12 mt-0 flex items-center justify-center gap-2">
          <UserGroupIcon className="w-8 h-8" />
          معلومات الفرق
        </h2>

        {/* Main Container */}
        <div className="flex flex-col items-center gap-8">
          {/* Top Row - Class Name */}
          <div className="w-[1200px]">
            {/* Class Name Input */}
            <div>
              <input
                type="text"
                placeholder="اسم الصف"
                className="custom-border custom-rounded px-8 py-7 text-3xl font-bold w-full outline-none focus:ring-2 focus:ring-primary-purple bg-white text-text-dark"
              />
            </div>
          </div>

          {/* Team Names Grid */}
          <div className="w-[1200px]">
            {/* Team Names Label */}
            <div className="mb-4 flex items-center gap-2">
              <UserGroupIcon className="w-8 h-8 text-primary-purple" />
              <h3 className="text-2xl font-bold text-primary-purple">أسماء الفرق</h3>
            </div>

            <div className="flex flex-col gap-6">
              {teams.map((team, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -top-3 right-4 bg-white px-2 text-primary-purple font-bold text-xl z-10">
                    فريق {index + 1}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={team}
                      onChange={(e) => {
                        const newTeams = [...teams];
                        newTeams[index] = e.target.value;
                        setTeams(newTeams);
                      }}
                      placeholder={`اسم الفريق ${index + 1}`}
                      className="custom-border custom-rounded px-8 py-6 text-2xl font-bold w-full outline-none focus:ring-2 focus:ring-primary-purple bg-white text-primary-purple"
                    />
                    {teams.length > 2 && (
                      <button
                        onClick={() => removeTeam(index)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Team Button */}
            {teams.length < 6 && (
              <button
                onClick={addTeam}
                className="mt-4 flex items-center gap-2 bg-primary-purple text-white px-8 py-4 rounded-lg hover:bg-primary-purple/90 transition-colors text-xl font-bold"
              >
                <PlusIcon className="w-6 h-6" />
                إضافة فريق
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Power-ups Section */}
      <div ref={helpersRef} className="w-[1200px] mx-auto px-4 mb-12">
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
              onClick={() => {
                togglePower(power.id);
                // Auto scroll to start button when 3 helpers are selected
                if (selectedPowers.length === 2 && !selectedPowers.includes(power.id)) {
                  const startButton = document.querySelector('.custom-btn');
                  if (startButton) {
                    startButton.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              className={`custom-border custom-rounded px-8 py-6 flex items-center justify-center gap-2 text-xl font-bold transition-all ${
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