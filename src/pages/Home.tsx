import React, { useRef, useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, BookOpenIcon, ShieldCheckIcon, ClockIcon, ArrowPathIcon, SparklesIcon, InformationCircleIcon, UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const avatarImages = [
  '/assets/avatars/1.png',
  '/assets/avatars/2.png',
  '/assets/avatars/3.png',
  '/assets/avatars/4.png',
  '/assets/avatars/5.png',
  '/assets/avatars/6.png',
];

const stages = ['المرحلة الابتدائية', 'المرحلة المتوسطة', 'المرحلة الثانوية', 'عام'];
const grades = ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس', 'عام'];
const terms = ['الفصل الأول', 'الفصل الثاني'];

// Comprehensive subjects data in JSON format
const subjectsData = {
  allSubjects: [
    'الرياضيات',
    'العلوم', 
    'اللغة العربية',
    'اللغة الإنجليزية',
    'اجتماعيات',
    'التربية الإسلامية',
    'التربية الفنية',
    'التربية البدنية',
    'الحاسوب',
    'المهارات الحياتية',
    'التفكير النقدي',
    'الثقافة المالية'
  ],
  stageSubjects: {
    primary: [
      'الرياضيات',
      'العلوم', 
      'اللغة العربية',
      'التربية الإسلامية',
      'التربية الفنية',
      'التربية البدنية'
    ],
    middle: [
      'الرياضيات',
      'العلوم', 
      'اللغة العربية',
      'اللغة الإنجليزية',
      'اجتماعيات',
      'التربية الإسلامية',
      'التربية الفنية',
      'التربية البدنية',
      'الحاسوب'
    ],
    high: [
      'الرياضيات',
      'العلوم', 
      'اللغة العربية',
      'اللغة الإنجليزية',
      'اجتماعيات',
      'التربية الإسلامية',
      'التربية الفنية',
      'التربية البدنية',
      'الحاسوب',
      'المهارات الحياتية',
      'التفكير النقدي',
      'الثقافة المالية'
    ]
  }
};

const powerups = [
  { id: 'teacher', name: 'معلومة من المعلمة', icon: <InformationCircleIcon className="w-6 h-6" /> },
  { id: 'book', name: 'افتح الكتاب', icon: <BookOpenIcon className="w-6 h-6" /> },
  { id: 'assistant', name: 'مساعدة ذكية', icon: <SparklesIcon className="w-6 h-6" /> },
  { id: 'change', name: 'استبدال السؤال', icon: <ArrowPathIcon className="w-6 h-6" /> },
  { id: 'shield', name: 'درع الحماية', icon: <ShieldCheckIcon className="w-6 h-6" /> },
  { id: 'time', name: 'وقت إضافي', icon: <ClockIcon className="w-6 h-6" /> },
];

// Simulate 20 units
const units = Array.from({ length: 20 }, (_, i) => `وحدة ${i + 1}`);

// New section items
const newSectionItems = ['المرحلة الإبتدائية', 'المرحلة الاعدادية', 'المرحلة الثانوية'];

interface Team {
  name: string;
  avatar: string;
}

const Home: React.FC = () => {
  const teamSetupRef = useRef<HTMLDivElement>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamNameInput, setTeamNameInput] = useState('');
  const [availableAvatars, setAvailableAvatars] = useState<string[]>(avatarImages);
  const [selectedPowers, setSelectedPowers] = useState<string[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [showAllUnits, setShowAllUnits] = useState(false);
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [className, setClassName] = useState('');
  const [selectedNewItem, setSelectedNewItem] = useState<number | null>(null);
  const teamInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // Function to automatically determine the current term based on the month
  const getCurrentTerm = () => {
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-11, so add 1
    
    // From September (9) to January (1): First term
    // From February (2) to June (6): Second term
    if (currentMonth >= 9 || currentMonth === 1) {
      return { index: 0, name: terms[0] }; // First term
    } else if (currentMonth >= 2 && currentMonth <= 6) {
      return { index: 1, name: terms[1] }; // Second term
    } else {
      // July and August - default to first term
      return { index: 0, name: terms[0] };
    }
  };

  const currentTerm = getCurrentTerm();



  useEffect(() => {
    localStorage.setItem('selectedPowers', JSON.stringify(selectedPowers));
  }, [selectedPowers]);

  const togglePower = (powerId: string) => {
    if (selectedPowers.includes(powerId)) {
      setSelectedPowers(selectedPowers.filter(id => id !== powerId));
    } else if (selectedPowers.length < 3) {
      setSelectedPowers([...selectedPowers, powerId]);
    }
  };

  const handleUnitSelect = (index: number) => {
    if (selectedUnit === index) {
      setSelectedUnit(null);
    } else {
      setSelectedUnit(index);
    }
  };

  const handleSubjectSelect = (index: number) => {
    if (selectedSubject === index) {
      setSelectedSubject(null);
    } else {
      setSelectedSubject(index);
    }
  };

  const handleNewItemSelect = (index: number) => {
    if (selectedNewItem === index) {
      setSelectedNewItem(null);
    } else {
      setSelectedNewItem(index);
      // Reset subject selection when stage changes
      setSelectedSubject(null);
      setShowAllSubjects(false);
    }
  };

  const handleGradeSelect = (index: number) => {
    if (selectedGrade === index) {
      setSelectedGrade(null);
    } else {
      setSelectedGrade(index);
    }
  };

  const addTeam = () => {
    if (teamNameInput.trim() !== '' && teams.length < 6 && availableAvatars.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableAvatars.length);
      const selectedAvatar = availableAvatars[randomIndex];

      setTeams([...teams, { name: teamNameInput.trim(), avatar: selectedAvatar }]);
      setAvailableAvatars(availableAvatars.filter(avatar => avatar !== selectedAvatar));
      setTeamNameInput('');
    }
  };

  const removeTeam = (index: number) => {
    const teamToRemove = teams[index];
    const newTeams = teams.filter((_, i) => i !== index);
    setTeams(newTeams);
    setAvailableAvatars([...availableAvatars, teamToRemove.avatar]);
  };

  const handleStart = () => {
    // التحقق من أن جميع الفرق لديها أسماء
    const validTeams = teams.filter(team => team.name.trim() !== '');
    if (validTeams.length < 2) {
      alert('يجب إدخال اسمين فريقين على الأقل');
      return;
    }
    // حفظ أسماء الفرق واسم الصف في localStorage
    localStorage.setItem('teams', JSON.stringify(validTeams.map(t => t.name)));
    localStorage.setItem('className', className);
    // الانتقال إلى صفحة المسابقة
    navigate('/quiz');
  };

  // Show only first 5 unless showAll is true
  const displayedUnits = showAllUnits ? units : units.slice(0, 5);
  
  // Filter subjects based on selected stage
  const getFilteredSubjects = () => {
    if (selectedNewItem === null) {
      // Show all subjects by default
      return subjectsData.allSubjects;
    }
    
    if (selectedNewItem === 0) {
      // Primary stage
      return subjectsData.stageSubjects.primary;
    } else if (selectedNewItem === 1) {
      // Middle stage
      return subjectsData.stageSubjects.middle;
    } else if (selectedNewItem === 2) {
      // High school stage
      return subjectsData.stageSubjects.high;
    }
    
    return subjectsData.allSubjects;
  };
  
  const filteredSubjects = getFilteredSubjects();
  // Show all subjects by default, unless user explicitly chooses to show less
  const displayedSubjects = filteredSubjects;

  return (
    <div className="w-[1920px] min-h-screen bg-background flex flex-col items-center mx-auto">
      {/* New Section - Above "اختر" */}
      <div className="w-[1800px] mb-12">
        <h2 className="main-section-title mb-6 mt-12">المرحلة</h2>
        
        {/* Current Term Display */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold text-primary-purple">الفصل الحالي:</h3>
            <div className="custom-rounded custom-shadow flex items-center justify-center px-6 py-3 bg-primary-purple text-white border-3 border-primary-purple">
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">{currentTerm.name}</span>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="font-bold text-sm text-primary-purple">{currentTerm.index + 1}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 w-[1800px] mb-8">
          {newSectionItems.map((item, idx) => {
            const isSelected = selectedNewItem === idx;
            const isDimmed = selectedNewItem !== null && !isSelected;
            return (
              <div
                key={idx}
                onClick={() => handleNewItemSelect(idx)}
                className={`card-diagonal-bg custom-rounded custom-shadow flex flex-col overflow-hidden aspect-square cursor-pointer transition-all duration-300
                  ${isSelected ? 'bg-primary-purple border-3 border-primary-purple' : isDimmed ? 'bg-gray-300 border-3 border-gray-500' : 'custom-border'}
                `}
                style={!isSelected && !isDimmed ? { backgroundColor: '#facc15' } : {}}
              >
                <div className="flex-1 flex items-center justify-center relative">
                  {idx === 0 && (
                    <img 
                      src="/assets/primary-school-student.png" 
                      alt="المرحلة الإبتدائية" 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${isDimmed ? 'filter grayscale' : ''}`}
                      style={{ objectPosition: '50% 20%' }}
                    />
                  )}
                  {idx === 1 && (
                    <img 
                      src="/assets/middle-school-student.png" 
                      alt="المرحلة الاعدادية" 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${isDimmed ? 'filter grayscale' : ''}`}
                      style={{ objectPosition: '50% 20%' }}
                    />
                  )}
                  {idx === 2 && (
                    <img 
                      src="/assets/high-school-student.png" 
                      alt="المرحلة الثانوية" 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${isDimmed ? 'filter grayscale' : ''}`}
                      style={{ objectPosition: '50% 20%' }}
                    />
                  )}
                </div>
                <div 
                  className={`font-extrabold text-xl py-5 px-3 text-center transition-colors duration-300 text-white
                    ${isSelected ? 'bg-primary-purple' : isDimmed ? 'bg-gray-300 text-gray-700' : ''}
                  `}
                  style={{
                    borderTop: isDimmed ? '3px solid #6B7280' : '3px solid #6B46C1',
                    backgroundColor: !isSelected && !isDimmed ? '#facc15' : undefined
                  }}
                >
                  {item}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Title */}
      <h1 className="main-section-title">اختر</h1>

      {/* Grade Selection */}
      <div className="w-[1800px] mb-12">
        <h2 className="main-section-title mb-6 mt-0">الصف</h2>
        <div className="grid grid-cols-7 gap-6 w-full mb-8">
          {grades.map((grade, idx) => {
            const isSelected = selectedGrade === idx;
            const isDimmed = selectedGrade !== null && !isSelected;
            return (
              <div
                key={idx}
                onClick={() => handleGradeSelect(idx)}
                className={`custom-rounded custom-shadow flex items-center justify-center p-4 cursor-pointer transition-all duration-300 h-20 border-3 relative overflow-hidden
                  ${isSelected ? 'bg-primary-purple border-primary-purple text-white' : isDimmed ? 'bg-gray-300 border-gray-500 text-gray-700' : 'bg-yellow-400 border-primary-purple text-primary-purple'}
                `}
                style={isDimmed ? {
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 16px)'
                } : !isSelected ? {
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(139,69,19,0.05) 8px, rgba(139,69,19,0.05) 16px)'
                } : {}}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg text-center">{grade}</span>
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <span className="font-bold text-lg text-primary-purple">{idx + 1}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>



      {/* Always show subjects section */}
      <div className="w-[1800px] mb-12">
        {/* Subjects Section */}
        <h2 className="main-section-title mb-6 mt-0">المادة</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 w-[1800px] mb-8">
            {displayedSubjects.map((subject, idx) => {
              const isSelected = selectedSubject === idx;
              const isDimmed = selectedSubject !== null && !isSelected;
              return (
              <div
                key={idx}
                onClick={() => handleSubjectSelect(idx)}
                  className={`card-diagonal-bg custom-rounded custom-shadow flex flex-col overflow-hidden aspect-square cursor-pointer transition-all duration-300
                    ${isSelected ? 'bg-primary-purple border-3 border-primary-purple' : isDimmed ? 'bg-gray-300 border-3 border-gray-500' : 'custom-border'}
                  `}
                  style={!isSelected && !isDimmed ? { backgroundColor: '#facc15' } : {}}
              >
                <div 
                    className={`font-extrabold text-lg py-4 px-4 text-center transition-colors duration-300 text-white
                      ${isSelected ? 'bg-primary-purple' : isDimmed ? 'bg-gray-300 text-gray-700' : ''}
                    `}
                    style={{
                      borderBottom: isDimmed ? '3px solid #6B7280' : '3px solid #6B46C1',
                      backgroundColor: !isSelected && !isDimmed ? '#facc15' : undefined
                    }}
                >
                  {subject}
                </div>
                <div className="flex-1 relative">
                  {subject === 'الرياضيات' && (
                    <img 
                      src="/assets/subjects/math-icon.png" 
                      alt="الرياضيات" 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${isDimmed ? 'filter grayscale' : ''}`}
                      style={{ objectPosition: '30% 40%' }}
                      onError={(e) => {
                        // Fallback to a text representation if image fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  {subject === 'العلوم' && (
                    <img 
                      src="/assets/subjects/science-icon.png" 
                      alt="العلوم" 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${isDimmed ? 'filter grayscale' : ''}`}
                      style={{ objectPosition: '50% 40%' }}
                      onError={(e) => {
                        // Fallback to a text representation if image fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  {subject === 'اللغة العربية' && (
                    <img 
                      src="/assets/subjects/arabic-icon.png" 
                      alt="اللغة العربية" 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${isDimmed ? 'filter grayscale' : ''}`}
                      style={{ objectPosition: '50% 25%' }}
                      onError={(e) => {
                        // Fallback to a text representation if image fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  {subject === 'اللغة الإنجليزية' && (
                    <img 
                      src="/assets/subjects/english-icon.png" 
                      alt="اللغة الإنجليزية" 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${isDimmed ? 'filter grayscale' : ''}`}
                      style={{ objectPosition: '50% 40%' }}
                      onError={(e) => {
                        // Fallback to a text representation if image fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  {subject === 'اجتماعيات' && (
                    <img 
                      src="/assets/subjects/history-icon.png" 
                      alt="اجتماعيات" 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${isDimmed ? 'filter grayscale' : ''}`}
                      style={{ objectPosition: '50% 25%' }}
                      onError={(e) => {
                        // Fallback to a text representation if image fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  {subject === 'التربية الإسلامية' && (
                    <img 
                      src="/assets/subjects/islamic-icon.png" 
                      alt="التربية الإسلامية" 
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${isDimmed ? 'filter grayscale' : ''}`}
                      style={{ objectPosition: '50% 25%' }}
                      onError={(e) => {
                        // Fallback to a text representation if image fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  {/* Icons for additional subjects */}
                  {subject === 'التربية الفنية' && (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-200 to-pink-400">
                      <div className="text-4xl">🎨</div>
                    </div>
                  )}
                  {subject === 'التربية البدنية' && (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-green-200 to-green-400">
                      <div className="text-4xl">⚽</div>
                    </div>
                  )}
                  {subject === 'الحاسوب' && (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400">
                      <div className="text-4xl">💻</div>
                    </div>
                  )}
                  {subject === 'المهارات الحياتية' && (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-200 to-yellow-400">
                      <div className="text-4xl">🌟</div>
                    </div>
                  )}
                  {subject === 'التفكير النقدي' && (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-200 to-purple-400">
                      <div className="text-4xl">🧠</div>
                    </div>
                  )}
                  {subject === 'الثقافة المالية' && (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-green-200 to-green-400">
                      <div className="text-4xl">💰</div>
                    </div>
                  )}
                  {/* Default icon for subjects without specific images */}
                  {!['الرياضيات', 'العلوم', 'اللغة العربية', 'اللغة الإنجليزية', 'اجتماعيات', 'التربية الإسلامية', 'التربية الفنية', 'التربية البدنية', 'الحاسوب', 'المهارات الحياتية', 'التفكير النقدي', 'الثقافة المالية'].includes(subject) && (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-purple/20 to-primary-purple/40">
                      <div className="text-4xl font-bold text-primary-purple">📚</div>
                    </div>
                  )}
                </div>
              </div>
              );
            })}
                    </div>
        </div>

      {selectedSubject !== null && (
        <>
          {/* Units Section */}
          <h2 className="main-section-title mb-6 mt-0">الوحدات</h2>
          <div className="grid grid-cols-5 gap-8 w-[1800px] mb-8">
            {displayedUnits.map((unit, idx) => {
              const isSelected = selectedUnit === idx;
              const isDimmed = selectedUnit !== null && !isSelected;
              return (
              <div
                key={idx}
                onClick={() => handleUnitSelect(idx)}
                  className={`card-diagonal-bg custom-rounded custom-shadow flex flex-col overflow-hidden aspect-square cursor-pointer transition-all duration-300
                    ${isSelected ? 'bg-primary-purple border-3 border-primary-purple' : isDimmed ? 'bg-gray-300 border-3 border-gray-500' : 'custom-border'}
                  `}
                  style={!isSelected && !isDimmed ? { backgroundColor: '#facc15' } : {}}
              >
                <div 
                    className={`font-extrabold text-lg py-4 px-4 text-center transition-colors duration-300 text-white
                      ${isSelected ? 'bg-primary-purple' : isDimmed ? 'bg-gray-300 text-gray-700' : ''}
                    `}
                    style={{
                      borderBottom: isDimmed ? '3px solid #6B7280' : '3px solid #6B46C1',
                      backgroundColor: !isSelected && !isDimmed ? '#facc15' : undefined
                    }}
                >
                  {unit}
                </div>
                <div className="flex-1 flex items-center justify-center">
                </div>
              </div>
              );
            })}
          </div>

          {/* Show All Link */}
          <div className="w-[1800px] flex justify-center mb-16">
            <button
              className="text-primary-purple font-bold text-lg flex items-center gap-1 transition-colors bg-transparent border-none shadow-none"
              onMouseEnter={(e) => e.currentTarget.style.color = '#facc15'}
              onMouseLeave={(e) => e.currentTarget.style.color = ''}
              onClick={() => setShowAllUnits((prev) => !prev)}
            >
              <span>{showAllUnits ? 'إخفاء' : 'عرض الكل'}</span>
              {showAllUnits ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </>
      )}

      {/* Team Setup Section */}
      <div ref={teamSetupRef} className="w-[1800px] mx-auto mb-24 mt-16">
        {/* Section Title */}
        <h2 className="main-section-title mb-12 mt-0 flex items-center justify-center gap-2">
          <UserGroupIcon className="w-8 h-8" />
          معلومات الفرق
        </h2>

        {/* Main Container */}
        <div className="flex flex-col items-center gap-8">
          {/* Top Row - Class Name */}
          <div className="w-[1400px]">
            {/* Class Name Input */}
            <div>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    // الانتقال إلى حقل إدخال اسم الفريق الأول
                    teamInputRefs.current[0]?.focus();
                  }
                }}
                placeholder="اسم الصف"
                className="custom-border custom-rounded px-8 py-7 text-3xl font-bold w-full outline-none focus:ring-2 focus:ring-primary-purple bg-white text-text-dark"
              />
            </div>
          </div>

          {/* Team Names Grid */}
          <div className="w-[1400px]">
            {/* Team Names Label */}
            <div className="mb-4 flex items-center gap-2">
              <UserGroupIcon className="w-8 h-8 text-primary-purple" />
              <h3 className="text-2xl font-bold text-primary-purple">أسماء الفرق</h3>
            </div>

            <div className="relative group">
                  <div className="custom-label">
                اسم الفريق
                  </div>
                    <input
                      type="text"
                value={teamNameInput}
                onChange={(e) => setTeamNameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                            addTeam();
                        }
                      }}
                placeholder="اكتب اسم الفريق هنا"
                      className="custom-input"
                    />
            </div>

            {/* Add Team Button */}
            <button
              onClick={addTeam}
              disabled={teams.length >= 6 || !teamNameInput.trim()}
              className={`mt-4 flex items-center gap-2 custom-btn ${
                (teams.length >= 6 || !teamNameInput.trim())
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : ''
              }`}
            >
              <PlusIcon className="w-6 h-6" />
              إضافة فريق
            </button>
          </div>

          {/* Teams Display Section */}
          <div className="w-full pt-8">
            <div className="flex justify-center items-end gap-8 flex-wrap">
              {teams.map((team, index) => (
                <div key={index} className="relative flex flex-col items-center gap-3 animate-bounce-in">
                   <button
                    onClick={() => removeTeam(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {/* Team Circle */}
                  <div className="w-36 h-36 rounded-full bg-gradient-to-br from-primary-purple to-purple-600 flex items-center justify-center border-6 border-primary-purple shadow-lg overflow-hidden animate-scale-in">
                    <img src={team.avatar} alt={`Avatar for ${team.name}`} className="w-full h-full object-cover transform scale-105" />
                  </div>
                  {/* Team Name */}
                  <span className="text-primary-purple font-bold text-xl animate-fade-in">
                    {team.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Power-ups Section */}
      <div className="w-full max-w-[1800px] mx-auto px-12 mb-12">
        <div className="flex items-center justify-center gap-4 mb-2">
          <h2 className="main-section-title mb-0 mt-0">اختر وسائل مساعدة</h2>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#facc15] text-white font-bold">
            {selectedPowers.length}
          </div>
        </div>
        <p className="text-primary-purple font-bold mb-6 text-center">فقط ثلاثة وسائل مساعدة</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {powerups.map((power) => {
            const isSelected = selectedPowers.includes(power.id);
            const isDimmed = selectedPowers.length === 3 && !selectedPowers.includes(power.id);
            return (
              <button
                key={power.id}
                onClick={() => togglePower(power.id)}
                className={`custom-rounded custom-shadow flex items-center justify-center gap-4 p-4 cursor-pointer transition-all duration-300 h-20 border-3 relative overflow-hidden text-2xl font-bold
                  ${isSelected ? 'bg-primary-purple border-primary-purple text-white' : isDimmed ? 'bg-gray-300 border-gray-500 text-gray-700' : 'border-primary-purple text-primary-purple'}
                `}
                style={isDimmed ? {
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 16px)',
                  backgroundColor: '#d1d5db'
                } : !isSelected ? {
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(250,204,21,0.3) 8px, rgba(250,204,21,0.3) 16px)',
                  backgroundColor: '#facc15'
                } : {}}
                disabled={isDimmed}
              >
                <span className={`flex items-center justify-center ${isDimmed ? 'text-gray-500' : ''}`}>
                  {React.cloneElement(power.icon, { className: 'w-8 h-8' })}
                </span>
                <span className="text-center">{power.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start Button */}
      <div className="w-full flex justify-center mb-12">
        <button
          onClick={handleStart}
          className="custom-btn bg-primary-purple border-button-yellow text-xl px-20 py-4 shadow-button text-white rounded-[2rem]"
          style={{borderWidth: '3px', borderColor: '#facc15'}}
        >
          ابدأ المسابقة
        </button>
      </div>
    </div>
  );
};

export default Home; 