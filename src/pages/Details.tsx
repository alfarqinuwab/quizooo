import React, { useState, useEffect } from 'react';
import { ArrowLeftOnRectangleIcon, UserIcon, BookOpenIcon, SparklesIcon, InformationCircleIcon, ShieldCheckIcon, ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const TimerCircle = ({ timeLeft }: { timeLeft: number }) => {
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 30) * circumference;
  const progressColor = timeLeft <= 5 ? '#EF4444' : '#F59E0B';

  return (
    <div className="relative w-[350px] h-[350px]">
      {/* Clock outline */}
      <div className="absolute inset-0 border-8 border-gray-300 rounded-full"></div>
      
      {/* Timer progress */}
      <svg className="absolute inset-0 -rotate-90" width="100%" height="100%" viewBox="0 0 180 180">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
          strokeLinecap="round"
        />
      </svg>
      
      {/* Time text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[120px] font-bold text-primary-purple number-font">{timeLeft}</span>
      </div>
    </div>
  );
};

const Details = () => {
  const navigate = useNavigate();
  const [className, setClassName] = useState('صف سادس ب');
  const [teams, setTeams] = useState<string[]>([]);
  const [activeGroup, setActiveGroup] = useState<number>(-1);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedPowers, setSelectedPowers] = useState<string[]>([]);

  const handleQuestionsBoardClick = () => {
    // Get the last clicked rectangle from localStorage
    const lastClickedRectangle = localStorage.getItem('lastClickedRectangle');
    if (lastClickedRectangle) {
      // Add it to visited rectangles if not already there
      const visitedRectangles = JSON.parse(localStorage.getItem('visitedRectangles') || '[]');
      if (!visitedRectangles.includes(lastClickedRectangle)) {
        visitedRectangles.push(lastClickedRectangle);
        localStorage.setItem('visitedRectangles', JSON.stringify(visitedRectangles));
      }
    }
    // Clear the last clicked rectangle
    localStorage.removeItem('lastClickedRectangle');
    navigate('/quiz');
  };

  useEffect(() => {
    // يمكن إضافة منطق لتحميل اسم الصف من التخزين المحلي أو API
    const savedClassName = localStorage.getItem('className');
    if (savedClassName) {
      setClassName(savedClassName);
    }
  }, []);

  React.useEffect(() => {
    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
  }, []);

  React.useEffect(() => {
    const updateActiveGroup = () => {
      const saved = localStorage.getItem('activeGroup');
      if (saved) setActiveGroup(parseInt(saved, 10));
    };
    updateActiveGroup();
    window.addEventListener('focus', updateActiveGroup);
    return () => window.removeEventListener('focus', updateActiveGroup);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (!timerRunning && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeLeft]);

  useEffect(() => {
    const savedPowers = localStorage.getItem('selectedPowers');
    if (savedPowers) setSelectedPowers(JSON.parse(savedPowers));
  }, []);

  // Map powerup id to icon
  const powerupIcons: Record<string, JSX.Element> = {
    teacher: <InformationCircleIcon className="w-8 h-8 text-white" />,
    book: <BookOpenIcon className="w-8 h-8 text-white" />,
    assistant: <SparklesIcon className="w-8 h-8 text-white" />,
    change: <ArrowPathIcon className="w-8 h-8 text-white" />,
    shield: <ShieldCheckIcon className="w-8 h-8 text-white" />,
    time: <ClockIcon className="w-8 h-8 text-white" />,
  };

  // Tooltip explanations for each powerup
  const powerupExplanations: Record<string, string> = {
    teacher: 'اسأل المعلمة عن معلومة أو توضيح للسؤال.',
    book: 'يمكنك فتح الكتاب للبحث عن الإجابة.',
    assistant: 'احصل على مساعدة ذكية لحل السؤال.',
    change: 'استبدل هذا السؤال بسؤال آخر.',
    shield: 'درع الحماية: لا تخسر نقاط في هذه الجولة.',
    time: 'احصل على وقت إضافي للإجابة.',
  };

  const [hoveredPower, setHoveredPower] = useState<string | null>(null);

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    color: '#6B46C1',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    zIndex: 1000,
    pointerEvents: 'none',
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
    marginBottom: '8px',
    maxWidth: '340px',
    minWidth: '220px',
    textAlign: 'center',
  };

  const tooltipPointerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderTop: '8px solid white',
  };

  const tooltipVisibleStyle: React.CSSProperties = {
    ...tooltipStyle,
    opacity: 1,
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      {/* Header */}
      <header className="w-full bg-primary-purple text-white flex flex-row items-center justify-between px-10 py-6 border-b-4 border-[#F59E0B] fixed top-0 left-0 right-0 z-50" style={{minHeight: 90}}>
        <div className="w-24" /> {/* Spacer */}
        <h1 className="text-4xl font-extrabold mx-auto absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">{className}</h1>
        <div className="flex items-center gap-4">
          <span 
            className="text-lg font-bold cursor-pointer hover:text-[#F59E0B] transition-colors" 
            onClick={handleQuestionsBoardClick}
          >
            لوحة الأسئلة
          </span>
          <span className="mx-2">|</span>
          <span className="text-lg font-bold">خروج</span>
          <ArrowLeftOnRectangleIcon className="w-7 h-7" />
        </div>
      </header>
      {/* Main Content */}
      <div className="flex flex-row flex-1 w-full px-8 py-8 gap-8" style={{background: '#fff', marginTop: 90, justifyContent: 'center', alignItems: 'flex-start'}}>
        {/* Timer */}
        <div className="flex flex-col items-center gap-8 min-w-[350px] max-w-[350px] mt-10">
          <TimerCircle timeLeft={timeLeft} />
          <button
            className={`mt-4 flex items-center gap-2 px-8 py-4 rounded-full text-xl font-bold shadow-md transition-colors border-4 border-[#F59E0B]
              ${timeLeft === 0 ? 'bg-red-500 text-white cursor-not-allowed' : 'bg-primary-purple text-white hover:bg-primary-purple/90'}`}
            onClick={() => {
              if (timeLeft === 0) return;
              setTimerRunning((prev) => !prev);
            }}
            disabled={timeLeft === 0}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {timeLeft === 0 ? (
                // Stop icon
                <rect x="6" y="6" width="12" height="12" fill="white" />
              ) : timerRunning ? (
                // Pause icon
                <g>
                  <rect x="6" y="4" width="4" height="16" fill="white" />
                  <rect x="14" y="4" width="4" height="16" fill="white" />
                </g>
              ) : (
                // Play icon
                <polygon points="5,3 19,12 5,21" fill="white" />
              )}
            </svg>
            {timeLeft === 0 ? 'انتهى الوقت' : timerRunning ? 'إيقاف' : 'تشغيل'}
          </button>
          {/* Powerups Circles */}
          <div className="flex flex-row gap-6 mt-4 relative">
            {selectedPowers.slice(0, 3).map((power, idx) => (
              <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                <div
                  className="w-20 h-20 rounded-full bg-[#6B46C1] flex items-center justify-center border-4"
                  style={{ borderColor: '#F59E0B' }}
                  onMouseEnter={() => setHoveredPower(power)}
                  onMouseLeave={() => setHoveredPower(null)}
                >
                  {powerupIcons[power] || <span className="text-white font-bold">?</span>}
                </div>
                {/* Tooltip */}
                {hoveredPower === power && (
                  <div
                    style={tooltipVisibleStyle}
                    className="rise-fade-in"
                  >
                    {powerupExplanations[power]}
                    <div style={tooltipPointerStyle} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Center: Question Card */}
        <div className="flex flex-col flex-1 items-center justify-start gap-8 mt-10 relative">
          {/* Points Rectangle */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-12 z-20">
            <div className="bg-primary-purple text-[#F59E0B] text-6xl font-extrabold rounded-3xl border-8 border-white shadow-lg px-24 py-6 number-font">
              100
            </div>
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 w-full min-h-[520px] flex items-center justify-center text-primary-purple text-6xl font-extrabold px-40 py-32 mt-0 mx-auto relative">
              ما هي أركان الإسلام الخمسة؟
            </div>
          </div>
          {showOptions && (
            <div className="grid grid-cols-2 gap-6 w-full mt-8">
              {[1,2,3,4].map((opt, idx) => {
                let optionStyle = "bg-white border border-gray-200 text-primary-purple";
                if (selectedOption !== null) {
                  if (selectedOption === idx) {
                    optionStyle = idx === 0
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-red-500 border-red-500 text-white";
                  } else if (idx === 0) {
                    optionStyle = "bg-green-500 border-green-500 text-white";
                  }
                }
                return (
                  <div
                    key={opt}
                    className={`rounded-2xl shadow-lg flex items-center justify-center text-2xl font-extrabold py-12 px-4 min-h-[80px] transition-colors duration-200 cursor-pointer ${optionStyle}`}
                    style={{ minWidth: '180px' }}
                    onClick={() => selectedOption === null && setSelectedOption(idx)}
                  >
                    خيار {opt}
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex flex-row gap-6 justify-center w-full mt-8">
            <button className="bg-primary-purple text-white border-2 border-[#F59E0B] rounded-full px-8 py-3 text-xl font-bold shadow-md">إظهار الإجابة</button>
            <button 
              className="bg-primary-purple text-white border-2 border-[#F59E0B] rounded-full px-8 py-3 text-xl font-bold shadow-md"
              onClick={() => setShowOptions((prev) => !prev)}
            >
              {showOptions ? 'إخفاء الخيارات' : 'إظهار الخيارات'}
            </button>
          </div>
        </div>
        {/* Right Side: Groups */}
        <div className="flex flex-col gap-6 min-w-[260px] max-w-[260px] w-full mt-10">
          <button className="bg-[#F59E0B] text-white text-2xl font-bold rounded-full py-4 px-12 shadow-md mb-2 w-full">من جاوب</button>
          {teams.map((team, idx) => (
            <button
              key={idx}
              className={
                'bg-white text-primary-purple border-4 border-primary-purple text-2xl font-bold rounded-full py-4 px-12 mb-2 w-full' +
                ((selectedOption !== null || showOptions === false) ? ' cursor-pointer hover:bg-primary-purple/10' : ' cursor-not-allowed opacity-60')
              }
              disabled={selectedOption === null && showOptions}
              onClick={async () => {
                if (selectedOption === null && showOptions) return;
                // 1. Save selected group
                localStorage.setItem('activeGroup', idx.toString());
                // 2. Award points to this group
                const lastClickedRectangle = localStorage.getItem('lastClickedRectangle');
                if (lastClickedRectangle) {
                  // Rectangle id is like 'center-100', extract the number
                  const match = lastClickedRectangle.match(/-(\d+)$/);
                  const points = match ? parseInt(match[1], 10) : 0;
                  // Get scores from localStorage or initialize
                  let scores = [];
                  try {
                    scores = JSON.parse(localStorage.getItem('scores') || '[]');
                  } catch { scores = []; }
                  while (scores.length < teams.length) scores.push(0);
                  scores[idx] += points;
                  localStorage.setItem('scores', JSON.stringify(scores));
                }
                // 3. Navigate to quiz page
                navigate('/quiz');
              }}
            >
              {team}
            </button>
          ))}
        </div>
      </div>
      {/* Bottom Yellow Bar */}
      <div className="w-full h-1 bg-[#F59E0B] absolute bottom-3 left-0 right-0" />
      <div className="w-full h-3 bg-primary-purple absolute bottom-0 left-0 right-0" />
    </div>
  );
};

export default Details; 