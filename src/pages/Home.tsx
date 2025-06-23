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
const grades = ['الصف الأول', 'الصف الثاني', 'الصف الثالث', 'الصف الرابع', 'الصف الخامس', 'الصف السادس'];
const terms = ['الفصل الأول', 'الفصل الثاني'];

// Comprehensive subjects data in JSON format
const subjectsData = {
  allSubjects: [
    { title: 'اللغة العربية', image: '/assets/subjects/arabic-icon.png' },
    { title: 'اللغة الانجليزية', image: '/assets/subjects/english-icon.png' },
    { title: 'رياضيات', image: '/assets/subjects/math-icon.png' },
    { title: 'اجتماعيات', image: '/assets/subjects/history-icon.png' },
    { title: 'التربية الإسلامية', image: '/assets/subjects/islamic-icon.png' },
    { title: 'علوم', image: '/assets/subjects/science-icon.png' },
    { title: 'تربية اسرية', image: '/assets/subjects/family-education-icon.png' },
    { title: 'حاسوب', image: '/assets/subjects/computer-icon.png' }
  ],
  stageSubjects: {
    primary: [
      { title: 'اللغة العربية', image: '/assets/subjects/arabic-icon.png' },
      { title: 'اللغة الانجليزية', image: '/assets/subjects/english-icon.png' },
      { title: 'رياضيات', image: '/assets/subjects/math-icon.png' },
      { title: 'اجتماعيات', image: '/assets/subjects/history-icon.png' },
      { title: 'التربية الإسلامية', image: '/assets/subjects/islamic-icon.png' },
      { title: 'علوم', image: '/assets/subjects/science-icon.png' },
      { title: 'تربية اسرية', image: '/assets/subjects/family-education-icon.png' },
      { title: 'حاسوب', image: '/assets/subjects/computer-icon.png' }
    ],
    middle: [
      { title: 'اللغة العربية', image: '/assets/subjects/New folder/arabic-2.png' },
      { title: 'اللغة الإنجليزية', image: '/assets/subjects/New folder/english-2.png' },
      { title: 'التربية الإسلامية', image: '/assets/subjects/New folder/islamic-2.png' },
      { title: 'اجتماعيات', image: '/assets/subjects/New folder/history-2.png' },
      { title: 'التربية الأسرية', image: '/assets/subjects/New folder/family-education-2.png' },
      { title: 'حاسوب', image: '/assets/subjects/New folder/computer-2.png' },
      { title: 'اللغة الفرنسية', image: '/assets/subjects/New folder/french-2.png' },
      { title: 'رياضيات', image: '/assets/subjects/New folder/math-2.png' },
      { title: 'علوم', image: '/assets/subjects/New folder/science-2.png' },
      { title: 'مواطنة', image: '/assets/subjects/New folder/citizenship-2.png' }
    ],
    high: [
      { title: 'التربية الأسرية', image: '/assets/subjects/New folder (2)/اسر.png', background: '#fffdf8' },
      { title: 'التربية الإسلامية', image: '/assets/subjects/New folder (2)/تربية اسلامية.png', background: '#fffdf8' },
      { title: 'التربية البدنية', image: '/assets/subjects/New folder (2)/بدن.png', background: '#fffffb' },
      { title: 'المواطنة', image: '/assets/subjects/New folder (2)/مواطنة.png', background: '#fef6e6' },
      { title: 'رياضيات', image: '/assets/subjects/New folder (2)/ريض.png', background: '#fdf8f0' },
      { title: 'مواد علمية', image: '/assets/subjects/New folder (2)/علوم.png', background: '#fffdfa' },
      { title: 'اللغة الإنجليزية', image: '/assets/subjects/english-icon.png', background: '#fefbf7' },
      { title: 'اللغة العربية', image: '/assets/subjects/New folder (2)/اللغة العربية.png', background: '#fefbf7' },
      { title: 'اللغة الفرنسية', image: '/assets/subjects/New folder (2)/france.png', background: '#fffbf0' },
      { title: 'اجتماعيات', image: '/assets/subjects/New folder (2)/مواد اجتماعية.png', background: '#fffcfb' },
      { title: 'مواد تجارية', image: '/assets/subjects/New folder (2)/مواد تجارية.png', background: '#fefcf8' },
      { title: 'تقن', image: '/assets/subjects/New folder (2)/تقن.png', background: '#fefdf9' }
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

  const preparatoryGrades = ['صف اول إعدادي', 'صف ثاني إعدادي', 'صف ثالث إعدادي'];
  const highGrades = ['أول ثانوي', 'ثاني ثانوي', 'ثالث ثانوي'];
  const displayedGrades = selectedNewItem === 1 ? preparatoryGrades : selectedNewItem === 2 ? highGrades : grades;

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
      // Scroll to start button when third power is selected
      if (selectedPowers.length === 2) {
        setTimeout(() => {
          const startButton = document.querySelector('.start-button-section');
          if (startButton) {
            startButton.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    }
  };

  const handleUnitSelect = (index: number) => {
    if (selectedUnit === index) {
      setSelectedUnit(null);
    } else {
      setSelectedUnit(index);
      // Scroll to team setup section
      setTimeout(() => {
        const teamSetupSection = document.querySelector('.team-setup-section');
        if (teamSetupSection) {
          teamSetupSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  const handleSubjectSelect = (index: number) => {
    if (selectedSubject === index) {
      setSelectedSubject(null);
    } else {
      setSelectedSubject(index);
      // Scroll to units section
      setTimeout(() => {
        const unitsSection = document.querySelector('.units-section');
        if (unitsSection) {
          unitsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
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
      // Scroll to main title with offset
      setTimeout(() => {
        const mainTitle = document.querySelector('.main-title');
        if (mainTitle) {
          const elementRect = mainTitle.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          const middle = absoluteElementTop - (window.innerHeight / 2);
          window.scrollTo({
            top: middle,
            behavior: 'smooth'
          });
        }
      }, 300);
    }
  };

  const handleGradeSelect = (index: number) => {
    if (selectedGrade === index) {
      setSelectedGrade(null);
    } else {
      setSelectedGrade(index);
      // Scroll to subjects section with offset
      setTimeout(() => {
        const subjectsSection = document.querySelector('.subjects-section');
        if (subjectsSection) {
          const elementRect = subjectsSection.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          const middle = absoluteElementTop - (window.innerHeight / 2);
          window.scrollTo({
            top: middle,
            behavior: 'smooth'
          });
        }
      }, 300);
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

  const getSubjectBackgroundColor = (subjectTitle: string) => {
    if (selectedNewItem === 2) {
      const subject = subjectsData.stageSubjects.high.find((s: any) => s.title === subjectTitle);
      return subject?.background || '#fef7ee';
    }
    // Middle Stage Colors
    if (selectedNewItem === 1) {
      switch (subjectTitle) {
        case 'اللغة العربية': return '#fffaf3';
        case 'اللغة الإنجليزية': return '#fbf3e7';
        case 'رياضيات': return '#f7ede3';
        case 'اجتماعيات': return '#f7e8cc';
        case 'التربية الإسلامية': return '#fdfaf7';
        case 'علوم': return '#fef7e8';
        case 'التربية الأسرية': return '#f7eee1';
        case 'حاسوب': return '#f7f4ed';
        case 'اللغة الفرنسية': return '#fef7ee';
        case 'مواطنة': return '#f4ece1';
        default: return '#fef7ee';
      }
    }

    // Primary Stage Colors
    switch (subjectTitle) {
      case 'اللغة العربية': return '#fef9f2';
      case 'اللغة الانجليزية': return '#fefaf5';
      case 'رياضيات': return '#fdf7f3';
      case 'اجتماعيات': return '#fef6e9';
      case 'التربية الإسلامية': return '#faeede';
      case 'علوم': return '#fffdf8';
      case 'تربية اسرية': return '#fff8ee';
      case 'حاسوب': return '#f7f4ed';
      default: return '#fef7ee';
    }
  };
  

  return (
    <div className="min-h-screen bg-background flex flex-col items-center mx-auto container">
      {/* New Section - Above "اختر" */}
      <div className="container mb-12">
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
        <div className="grid grid-cols-3 gap-6 container mb-8">
          {newSectionItems.map((item, idx) => {
            const isSelected = selectedNewItem === idx;
            const isDimmed = selectedNewItem !== null && !isSelected;
            return (
              <div
                key={idx}
                onClick={() => handleNewItemSelect(idx)}
                className={`custom-rounded flex flex-col overflow-hidden aspect-square cursor-pointer transition-all duration-300
                  ${isSelected ? '' : isDimmed ? '' : ''}
                `}
              >
                <div className="flex-1 flex items-center justify-center relative">
                  <img 
                    src={idx === 0 ? "/assets/level/level-1.png" : idx === 1 ? "/assets/level/level-2.png" : "/assets/level/level-3.png"} 
                    alt={item} 
                    className={`absolute inset-0 w-full h-full object-contain transition-all duration-300 ${isDimmed ? 'filter grayscale opacity-50' : ''}`}
                    style={{ objectPosition: '50% 20%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Title */}
      <h1 className="main-section-title main-title">قم بأختيار الصف الدراسي</h1>

      {/* Grade Selection */}
      <div className="container mb-12 grade-selection">
        <div className={`grid ${(selectedNewItem === 1 || selectedNewItem === 2) ? 'grid-cols-3 justify-center' : 'grid-cols-6'} gap-6 w-full mb-8`}>
          {displayedGrades.map((grade, idx) => {
            const isSelected = selectedGrade === idx;
            const isDimmed = selectedGrade !== null && !isSelected;
            return (
              <div
                key={idx}
                onClick={() => handleGradeSelect(idx)}
                className={`custom-rounded custom-shadow flex items-center justify-center p-4 cursor-pointer transition-all duration-300 h-20 border-3 relative overflow-hidden w-full
                  ${isSelected ? 'bg-primary-purple border-primary-purple text-white' : isDimmed ? 'bg-gray-300 border-gray-500 text-gray-700' : 'bg-yellow-400 border-primary-purple text-primary-purple'}
                `}
                style={isDimmed ? {
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 16px)'
                } : !isSelected ? {
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(139,69,19,0.05) 8px, rgba(139,69,19,0.05) 16px)',
                  backgroundColor: '#facc15'
                } : {}}
              >
                <div className="flex items-center gap-3 w-full justify-center">
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
      <div className="container mb-12 subjects-section">
        {/* Subjects Section */}
        <h2 className="main-section-title mb-6 mt-0 text-primary-purple">قم بتحديد المادة الدراسية</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full">
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
                  className="flex-1 relative"
                  style={!isDimmed ? { 
                    backgroundColor: getSubjectBackgroundColor(subject.title)
                  } : {}}
                >
                  <img 
                    src={subject.image} 
                    alt={subject.title} 
                    className={`absolute inset-0 w-full h-full object-contain transition-all duration-300 ${isDimmed ? 'filter grayscale' : ''} hover:scale-110`}
                    onError={(e) => {
                      // Fallback to a text representation if image fails to load
                      e.currentTarget.style.display = 'none';
                      // Show fallback emoji based on subject
                      const fallbackDiv = document.createElement('div');
                      fallbackDiv.className = 'absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-purple/20 to-primary-purple/40';
                      fallbackDiv.innerHTML = '<div class="text-4xl font-bold text-primary-purple">📚</div>';
                      e.currentTarget.parentNode?.appendChild(fallbackDiv);
                    }}
                  />
                </div>
                <div 
                    className={`font-extrabold text-lg py-4 px-4 text-center transition-colors duration-300 relative z-10
                      ${isSelected ? 'bg-primary-purple text-white' : isDimmed ? 'bg-gray-300 text-gray-700' : 'text-primary-purple'}
                    `}
                    style={{
                      borderTop: isDimmed ? '3px solid #6B7280' : '3px solid #6B46C1',
                      backgroundColor: !isSelected && !isDimmed ? '#facc15' : undefined
                    }}
                >
                  {subject.title}
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
          <div className="grid grid-cols-5 gap-8 w-full units-section">
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
          <div className="container flex justify-center mb-16">
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
      <div ref={teamSetupRef} className="container mx-auto mb-24 mt-16 team-setup-section">
        {/* Section Title */}
        <h2 className="main-section-title mb-12 mt-0 flex items-center justify-center gap-2">
          <UserGroupIcon className="w-8 h-8" />
          معلومات الفرق
        </h2>

        {/* Main Container */}
        <div className="flex flex-col items-center gap-8">
          {/* Top Row - Class Name */}
          <div className="container">
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
          <div className="container">
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
      <div className="container mx-auto mb-12">
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
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,0,0,0.1) 8px, rgba(0,0,0,0.1) 16px)'
                } : !isSelected ? {
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(139,69,19,0.05) 8px, rgba(139,69,19,0.05) 16px)',
                  backgroundColor: '#facc15'
                } : {
                  backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 16px)'
                }}
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
      <div className="container flex justify-center mb-12 start-button-section">
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