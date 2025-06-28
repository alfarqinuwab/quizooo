import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftOnRectangleIcon, BookOpenIcon, SparklesIcon, InformationCircleIcon, ShieldCheckIcon, ClockIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const TimerCircle = ({ timeLeft }: { timeLeft: number }) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 30) * circumference;
  
  // Dynamic colors based on time left
  const getTimerColors = () => {
    if (timeLeft <= 5) {
      return {
        progressColor: '#DC2626', // Red for urgency
        backgroundColor: '#FEF2F2', // Light red background
        borderColor: '#DC2626',
        textColor: '#DC2626'
      };
    } else if (timeLeft <= 10) {
      return {
        progressColor: '#F59E0B', // Orange for warning
        backgroundColor: '#FFFBEB', // Light orange background
        borderColor: '#F59E0B',
        textColor: '#F59E0B'
      };
    } else {
      return {
        progressColor: '#facc15', // Yellow for normal
        backgroundColor: '#FEFCE8', // Light yellow background
        borderColor: '#facc15',
        textColor: '#6B46C1'
      };
    }
  };

  const colors = getTimerColors();

  return (
    <div className="relative w-[300px] h-[300px]">
      {/* Diagonal stripes background */}
      <div 
        className="absolute inset-0 rounded-full border-8 shadow-2xl overflow-hidden"
        style={{
          borderColor: colors.borderColor,
          backgroundColor: colors.backgroundColor,
          boxShadow: `0 20px 40px ${colors.progressColor}30, 0 0 0 4px #6B46C1`
        }}
      >
        {/* Diagonal stripes pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              ${colors.progressColor} 10px,
              ${colors.progressColor} 20px
            )`
          }}
        />
      </div>
      
      {/* Background circle for progress track */}
      <svg className="absolute inset-4 -rotate-90" width="calc(100% - 32px)" height="calc(100% - 32px)" viewBox="0 0 200 200">
        {/* Background track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="8"
          opacity="0.3"
        />
        {/* Progress circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={colors.progressColor}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${colors.progressColor}60)`
          }}
        />
      </svg>
      
      {/* Inner circle with gradient background */}
      <div 
        className="absolute inset-8 rounded-full border-4 border-white shadow-inner flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${colors.backgroundColor}, white)`,
          boxShadow: `inset 0 4px 8px rgba(107, 70, 193, 0.1), 0 4px 16px ${colors.progressColor}20`
        }}
      >
        {/* Time text with enhanced styling */}
        <div className="text-center">
          <span 
            className="text-[100px] font-extrabold number-font"
            style={{ 
              color: colors.textColor,
              textShadow: `0 2px 4px ${colors.progressColor}30`,
              filter: 'drop-shadow(0 0 8px rgba(107, 70, 193, 0.3))'
            }}
          >
            {timeLeft}
          </span>
          <div 
            className="text-sm font-bold mt-2"
            style={{ color: colors.textColor }}
          >
            ثانية
          </div>
        </div>
      </div>
      
      {/* Pulse animation for low time */}
      {timeLeft <= 5 && (
        <div 
          className="absolute inset-0 rounded-full border-4 animate-ping"
          style={{ borderColor: colors.progressColor }}
        ></div>
      )}
    </div>
  );
};

interface Team {
  name: string;
  avatar: string;
  color: string;
}

const Details = () => {
  const navigate = useNavigate();
  const [className, setClassName] = useState('صف سادس ب');
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTeam, setActiveTeam] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedPowers, setSelectedPowers] = useState<string[]>([]);
  const [correctAnswer] = useState<number>(0); // Index of correct answer (0-based)
  const [questionValue, setQuestionValue] = useState<number>(100);
  const [showMotivationCharacter, setShowMotivationCharacter] = useState(true); // Always show avatar
  const [showMessageBubble, setShowMessageBubble] = useState(false);
  const [motivationMessage, setMotivationMessage] = useState('');
  const [isBubbleAnimatingOut, setIsBubbleAnimatingOut] = useState(false);
  const [isCharacterClosed, setIsCharacterClosed] = useState(false);
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [usedPowerups, setUsedPowerups] = useState<string[]>([]);
  const [bookTimerActive, setBookTimerActive] = useState(false);
  const [bookTimeLeft, setBookTimeLeft] = useState(30);

  // Timeout refs for motivation cycle
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cycleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggleCharacter = () => {
    setIsCharacterClosed(!isCharacterClosed);
    setShowMessageBubble(false);
    setIsBubbleAnimatingOut(false);
    
    // Clear any active timeouts
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
  };

  const handleUsePowerup = (powerupId: string) => {
    // Mark powerup as used globally (for all teams)
    setUsedPowerups(prev => [...prev, powerupId]);
    
    // Handle special cases for specific powerups
    if (powerupId === 'book') {
      // Start the book timer instead of closing modal
      setBookTimerActive(true);
      setBookTimeLeft(30);
    } else {
      // Close modal for other powerups
      setOpenModal(null);
    }
  };

  const isPowerupUsed = (powerupId: string) => {
    return usedPowerups.includes(powerupId);
  };

  // Independent character appearance logic
  useEffect(() => {
    // Motivational messages array
    const motivationalMessages = [
      'تستطيعون فعل ذلك! أنتم فريق رائع! 💪',
      'فكروا جيداً، الإجابة قريبة! 🤔',
      'استخدموا قوتكم الجماعية! ⭐',
      'الوقت في صالحكم، لا تتسرعوا! ⏰',
      'أنتم تتقدمون بشكل ممتاز! 🎯',
      'ثقوا بأنفسكم وبمعلوماتكم! 💡',
      'العمل الجماعي هو سر النجاح! 🤝',
      'ركزوا وستجدون الحل! 🎲',
      'لديكم كل ما تحتاجونه للفوز! 🏆',
      'لا تتوتروا، أنتم تفعلون أمراً رائعاً! 😊'
    ];

    const startMotivationCycle = () => {
      // Don't start cycle if character is closed
      if (isCharacterClosed) return;
      
      // Prepare message
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      setMotivationMessage(randomMessage);
      
      // Show message bubble
      setShowMessageBubble(true);
      setIsBubbleAnimatingOut(false);
      
      // Hide bubble after 3 seconds
      showTimeoutRef.current = setTimeout(() => {
        setIsBubbleAnimatingOut(true);
        
        // Hide bubble completely after zoom out animation (0.3s)
        setTimeout(() => {
          setShowMessageBubble(false);
          setIsBubbleAnimatingOut(false);
          
          // Wait for random interval (5, 10, or 15 seconds) before showing again
          const intervals = [5000, 10000, 15000]; // 5, 10, 15 seconds
          const randomInterval = intervals[Math.floor(Math.random() * intervals.length)];
          
          hideTimeoutRef.current = setTimeout(() => {
            startMotivationCycle();
          }, randomInterval);
        }, 300); // Wait for bubble zoom out animation to complete
      }, 3000); // Show bubble for 3 seconds
    };

    // Start the cycle after initial 5 second delay (or immediately if toggled back on)
    if (!isCharacterClosed) {
      const delay = 5000; // 5 seconds delay
      cycleTimeoutRef.current = setTimeout(() => {
        startMotivationCycle();
      }, delay);
    }

    // Cleanup function to clear all timeouts
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (cycleTimeoutRef.current) clearTimeout(cycleTimeoutRef.current);
    };
  }, [isCharacterClosed]); // Depend on isCharacterClosed to respond to state changes

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
    const savedTeamsData = localStorage.getItem('teamsData');
    if (savedTeamsData) {
      const teamsData = JSON.parse(savedTeamsData);
      // Store the full team data including avatars and colors
      setTeams(teamsData);
    }
    
    // Load active team from localStorage
    const savedActiveTeam = localStorage.getItem('activeGroup');
    if (savedActiveTeam) {
      setActiveTeam(parseInt(savedActiveTeam, 10));
    }
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

  // Listen for active team changes from localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedActiveTeam = localStorage.getItem('activeGroup');
      if (savedActiveTeam) {
        setActiveTeam(parseInt(savedActiveTeam, 10));
      }
    };

    // Check for changes when component mounts or becomes visible
    handleStorageChange();
    
    // Listen for storage changes from other tabs/pages
    window.addEventListener('storage', handleStorageChange);
    
    // Poll for changes every 500ms (since localStorage changes in same tab don't trigger storage event)
    const pollInterval = setInterval(handleStorageChange, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollInterval);
    };
  }, []);

  useEffect(() => {
    const savedPowers = localStorage.getItem('selectedPowers');
    if (savedPowers) setSelectedPowers(JSON.parse(savedPowers));
    
    // Load used powerups
    const savedUsedPowerups = localStorage.getItem('usedPowerups');
    if (savedUsedPowerups) {
      setUsedPowerups(JSON.parse(savedUsedPowerups));
    }
    
    // Load the question value from the selected cell
    const lastPlayedCell = localStorage.getItem('lastPlayedCell');
    const board = localStorage.getItem('board');
    if (lastPlayedCell && board) {
      try {
        const cellData = JSON.parse(lastPlayedCell);
        const boardData = JSON.parse(board);
        if (cellData.row !== undefined && cellData.col !== undefined && boardData[cellData.row]) {
          const cellValue = boardData[cellData.row][cellData.col].value;
          setQuestionValue(cellValue);
          console.log('Question value set to:', cellValue);
        }
      } catch (error) {
        console.error('Error loading question value:', error);
      }
    }
  }, []);

  // Save used powerups to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('usedPowerups', JSON.stringify(usedPowerups));
  }, [usedPowerups]);

  // Book timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (bookTimerActive && bookTimeLeft > 0) {
      interval = setInterval(() => {
        setBookTimeLeft((prev) => {
          if (prev <= 1) {
            setBookTimerActive(false);
            setOpenModal(null); // Auto-close modal when time is up
            return 30; // Reset timer
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [bookTimerActive, bookTimeLeft]);

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
              <header className="w-full bg-primary-purple text-white flex flex-row items-center justify-between px-10 py-6 border-b-4 border-[#facc15] fixed top-0 left-0 right-0 z-50" style={{minHeight: 90}}>
        {/* Left side - Team Turn */}
        <div className="flex items-center gap-4">
          {teams[activeTeam] && (
            <>
              <span className="text-xl text-[#facc15] font-bold">دور الفريق :</span>
              <img 
                src={teams[activeTeam].avatar} 
                alt="Current team avatar" 
                className="w-16 h-16 rounded-full border-4 border-[#facc15] shadow-lg"
              />
              <span className="text-2xl font-bold text-white">{teams[activeTeam].name}</span>
            </>
          )}
        </div>
        
        {/* Center - Class Name */}
        <h1 className="text-4xl font-extrabold mx-auto absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">{className}</h1>
        
        {/* Right side - Navigation */}
        <div className="flex items-center gap-4">
          <span 
            className="text-lg font-bold cursor-pointer hover:text-[#facc15] transition-colors" 
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
      <div className="flex flex-row flex-1 w-full px-8 py-8 gap-8" style={{background: 'repeating-linear-gradient(45deg, #f1f1f1, #f1f1f1 15px, #f4f4f4 15px, #f4f4f4 30px)', marginTop: 120, justifyContent: 'center', alignItems: 'flex-start'}}>
          {/* Timer */}
        <div className="flex flex-col items-center gap-8 min-w-[350px] max-w-[350px] mt-10">
          <TimerCircle timeLeft={timeLeft} />
          <button
            className={`mt-4 flex items-center gap-2 px-8 py-4 rounded-full text-xl font-bold shadow-md transition-colors border-4 border-[#facc15]
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
            {selectedPowers.slice(0, 3).map((power, idx) => {
              const isUsed = isPowerupUsed(power);
              return (
                <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                  <button
                    className={`w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all duration-200 ${
                      isUsed 
                        ? 'bg-gray-400 cursor-not-allowed opacity-50 grayscale' 
                        : 'bg-[#6B46C1] hover:scale-110 cursor-pointer'
                    }`}
                    style={{ borderColor: isUsed ? '#9CA3AF' : '#facc15' }}
                    onMouseEnter={() => !isUsed && setHoveredPower(power)}
                    onMouseLeave={() => setHoveredPower(null)}
                    onClick={() => !isUsed && setOpenModal(power)}
                    disabled={isUsed}
                  >
                    {powerupIcons[power] || <span className="text-white font-bold">?</span>}
                    {/* Used indicator overlay */}
                    {isUsed && (
                      <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">✓</span>
                      </div>
                    )}
                  </button>
                  {/* Tooltip - only show if not used */}
                  {hoveredPower === power && !isUsed && (
                    <div
                      style={tooltipVisibleStyle}
                      className="rise-fade-in"
                    >
                      {powerupExplanations[power]}
                      <div style={tooltipPointerStyle} />
                    </div>
                  )}
                  {/* Used tooltip */}
                  {hoveredPower === power && isUsed && (
                    <div
                      style={{...tooltipVisibleStyle, backgroundColor: '#6B7280', color: 'white'}}
                      className="rise-fade-in"
                    >
                      تم استخدام هذه الأداة في اللعبة
                      <div style={{...tooltipPointerStyle, borderTopColor: '#6B7280'}} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* Center: Question Card */}
        <div className="flex flex-col flex-1 items-center justify-start gap-8 mt-10 relative">
          {/* Points Rectangle */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-12 z-20">
            <div className="bg-primary-purple text-[#facc15] text-6xl font-extrabold rounded-3xl border-8 border-white shadow-lg px-24 py-6 number-font">
              {questionValue}
            </div>
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 w-full min-h-[400px] flex items-center justify-center text-primary-purple text-5xl font-extrabold px-16 py-12 mt-0 mx-auto relative">
              ما هي أركان الإسلام الخمسة؟
            </div>
          </div>
          {showOptions && (
            <div className="flex flex-row gap-4 w-full mt-8">
              {[1,2,3,4].map((opt, idx) => {
                let optionStyle = "bg-white border-2 border-primary-purple text-primary-purple";
                if (selectedOption !== null) {
                  if (selectedOption === idx) {
                    optionStyle = idx === correctAnswer
                      ? "bg-[#059669] border-[#059669] text-white"
                      : "bg-[#DC2626] border-[#DC2626] text-white";
                  } else if (idx === correctAnswer) {
                    optionStyle = "bg-[#059669] border-[#059669] text-white";
                  }
                }
                return (
                  <div
                    key={opt}
                    className={`flex-1 rounded-xl shadow-lg flex items-center justify-center text-lg font-bold py-4 px-6 min-h-[60px] transition-colors duration-200 cursor-pointer ${optionStyle}`}
                    onClick={() => selectedOption === null && setSelectedOption(idx)}
                  >
                    خيار {opt}
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex flex-row gap-6 justify-center w-full mt-8">
            <button className="bg-primary-purple text-white border-2 border-[#facc15] rounded-full px-8 py-3 text-xl font-bold shadow-md">إظهار الإجابة</button>
            <button 
              className="bg-primary-purple text-white border-2 border-[#facc15] rounded-full px-8 py-3 text-xl font-bold shadow-md"
              onClick={() => setShowOptions((prev) => !prev)}
            >
              {showOptions ? 'إخفاء الخيارات' : 'إظهار الخيارات'}
            </button>
          </div>
        </div>
        {/* Right Side: Groups */}
        <div className="flex flex-col gap-6 min-w-[260px] max-w-[260px] w-full mt-10">
          <button className="bg-[#facc15] text-white text-2xl font-bold rounded-full py-4 px-12 shadow-md mb-2 w-full">من جاوب</button>
          {teams.map((team, idx) => (
            <button
              key={idx}
              className={
                'bg-white text-primary-purple border-4 rounded-full py-4 px-6 mb-2 w-full flex items-center gap-4 text-2xl font-bold transition-all duration-200' +
                ((selectedOption !== null || showOptions === false) ? ' cursor-pointer hover:bg-primary-purple/10' : ' cursor-not-allowed opacity-60')
              }
              style={{
                borderColor: team.color || '#6B46C1',
                boxShadow: `0 4px 12px ${team.color || '#6B46C1'}30`
              }}
              disabled={selectedOption === null && showOptions}
              onClick={async () => {
                if (selectedOption === null && showOptions) return;
                
                // Check if answer is correct
                const isCorrectAnswer = selectedOption === correctAnswer;
                
                // 1. Current answering team (for scoring)
                const answeringTeam = idx;
                
                // Get total number of teams to calculate next turn
                const savedTeamsData = localStorage.getItem('teamsData');
                const totalTeams = savedTeamsData ? JSON.parse(savedTeamsData).length : 2;
                
                // 2. Handle board update for Connect Four based on correct/incorrect answer
                const lastPlayedCell = JSON.parse(localStorage.getItem('lastPlayedCell') || '{}');
                const board = JSON.parse(localStorage.getItem('board') || '[]');
                
                console.log('Last played cell:', lastPlayedCell);
                console.log('Current board:', board);
                console.log('Selected team:', idx);
                console.log('Is correct answer:', isCorrectAnswer);
                
                if (lastPlayedCell && lastPlayedCell.row !== undefined && board.length) {
                  if (isCorrectAnswer) {
                    // If correct, assign team avatar to the cell
                    board[lastPlayedCell.row][lastPlayedCell.col].team = answeringTeam;
                    console.log('Assigning team', answeringTeam, 'to cell', lastPlayedCell);
                    
                    // Award points based on the circle value that was clicked
                    const points = board[lastPlayedCell.row][lastPlayedCell.col].value;
                    console.log('Awarding points:', points, 'to team:', answeringTeam);
                    
                    // Get scores from localStorage or initialize
                    let scores = [];
                    try {
                      scores = JSON.parse(localStorage.getItem('scores') || '[]');
                    } catch { scores = []; }
                    while (scores.length < teams.length) scores.push(0);
                    scores[answeringTeam] += points;
                    localStorage.setItem('scores', JSON.stringify(scores));
                    console.log('Updated scores:', scores);
                  } else {
                    // If incorrect, clear the cell (remove team assignment)
                    board[lastPlayedCell.row][lastPlayedCell.col].team = null;
                    console.log('Clearing cell', lastPlayedCell, 'due to incorrect answer');
                    
                    // Optionally deduct points for wrong answer
                    let scores = [];
                    try {
                      scores = JSON.parse(localStorage.getItem('scores') || '[]');
                    } catch { scores = []; }
                    while (scores.length < teams.length) scores.push(0);
                    // Deduct 50 points for wrong answer (you can adjust this)
                    scores[answeringTeam] = Math.max(0, scores[answeringTeam] - 50);
                    localStorage.setItem('scores', JSON.stringify(scores));
                  }
                  
                  localStorage.setItem('board', JSON.stringify(board));
                  console.log('Updated board saved:', board);
                  console.log('Specific cell updated:', board[lastPlayedCell.row][lastPlayedCell.col]);
                  
                  // Verify what's actually in localStorage
                  const storedBoard = localStorage.getItem('board');
                  if (storedBoard) {
                    const parsedStored = JSON.parse(storedBoard);
                    console.log('✅ Verified localStorage board:', parsedStored[lastPlayedCell.row][lastPlayedCell.col]);
                  }
                }
                
                // 3. Advance to next team's turn (regardless of correct/incorrect answer)
                const currentActiveGroup = parseInt(localStorage.getItem('activeGroup') || '0', 10);
                const nextActiveGroup = (currentActiveGroup + 1) % totalTeams;
                localStorage.setItem('activeGroup', nextActiveGroup.toString());
                console.log(`Turn advancing from team ${currentActiveGroup} to team ${nextActiveGroup}`);
                
                // 4. Store the answer result for feedback
                localStorage.setItem('lastAnswerCorrect', isCorrectAnswer.toString());
                
                // 5. Navigate to quiz page
                navigate('/quiz');
              }}
            >
              {/* Team Avatar Circle */}
              <img 
                src={team.avatar} 
                alt={team.name + ' avatar'} 
                className="w-12 h-12 rounded-full object-cover shadow-md" 
                style={{
                  borderWidth: '3px',
                  borderStyle: 'solid',
                  borderColor: team.color || '#6B46C1',
                  boxShadow: `0 0 8px ${team.color || '#6B46C1'}50`
                }}
              />
              {/* Team Name */}
              <span className="flex-1 text-center truncate" style={{ color: team.color || '#6B46C1' }}>
                {team.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Motivational Character */}
      {showMotivationCharacter && (
        <div className="fixed bottom-8 left-8 z-50 flex items-end gap-4">
          {/* Speech Bubble - only show if not closed */}
          {showMessageBubble && !isCharacterClosed && (
            <div 
              className="relative bg-white rounded-2xl shadow-2xl border-4 border-primary-purple p-4 max-w-sm animate-bounce-in"
              style={{
                animation: isBubbleAnimatingOut 
                  ? 'zoomOut 0.3s ease-in forwards' 
                  : 'zoomIn 0.5s ease-out forwards'
              }}
            >
              {/* Speech Bubble Pointer - pointing right towards avatar */}
              <div 
                className="absolute bottom-4 -left-3 w-0 h-0"
                style={{
                  borderRight: '16px solid #6B46C1',
                  borderTop: '8px solid transparent',
                  borderBottom: '8px solid transparent'
                }}
              />
              <div 
                className="absolute bottom-4 -left-2 w-0 h-0"
                style={{
                  borderRight: '14px solid white',
                  borderTop: '7px solid transparent',
                  borderBottom: '7px solid transparent'
                }}
              />
              
              {/* Message Text */}
              <p className="text-primary-purple text-lg font-bold text-right leading-relaxed">
                {motivationMessage}
              </p>
            </div>
          )}
          
          {/* Character Avatar */}
          <div className="relative">
            {/* Toggle Button - positioned outside avatar */}
            <div className="absolute -top-3 -left-3 z-50">
              <button
                onClick={handleToggleCharacter}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-200 border-2 ${
                  isCharacterClosed 
                    ? 'bg-white hover:bg-gray-100 text-green-500 hover:text-green-600 border-gray-200' 
                    : 'bg-white hover:bg-gray-100 text-pink-500 hover:text-red-500 border-gray-200'
                }`}
                style={{ fontSize: '12px' }}
                title={isCharacterClosed ? 'تفعيل الرسائل التحفيزية' : 'إيقاف الرسائل التحفيزية'}
              >
                {isCharacterClosed ? '▶' : '×'}
              </button>
            </div>
            
            <div 
              className={`w-20 h-20 rounded-full border-4 border-white shadow-2xl overflow-hidden ${isCharacterClosed ? 'grayscale opacity-50' : 'animate-gentle-bounce'}`}
              style={{
                background: isCharacterClosed 
                  ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                  : 'linear-gradient(135deg, #facc15, #f59e0b)',
                boxShadow: isCharacterClosed 
                  ? '0 8px 25px rgba(156, 163, 175, 0.3)' 
                  : '0 8px 25px rgba(250, 204, 21, 0.5)'
              }}
            >
              <img 
                src="/assets/avatars/4.png" // Teacher/mentor character
                alt="Motivational Character"
                className={`w-full h-full object-cover ${isCharacterClosed ? 'grayscale' : ''}`}
              />
            </div>
            
            {/* Sparkle Effect - only show if not closed */}
            {!isCharacterClosed && (
              <>
                <div className="absolute -top-2 -right-2 text-yellow-400 text-2xl animate-ping">
                  ✨
                </div>
                <div className="absolute -bottom-1 -left-1 text-purple-500 text-lg animate-pulse">
                  💫
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Animation Styles */}
      <style>{`
        @keyframes zoomIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes zoomOut {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }
        
        @keyframes gentle-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        
        .animate-gentle-bounce {
          animation: gentle-bounce 2s ease-in-out infinite;
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.8s ease-out;
        }
        
        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
      
      {/* Powerup Modals */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]" onClick={() => setOpenModal(null)}>
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 relative" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setOpenModal(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center font-bold transition-colors duration-200"
            >
              ×
            </button>
            
            {/* Modal Content */}
            <div className="text-center">
              {/* Icon */}
              <div className="w-20 h-20 rounded-full bg-primary-purple flex items-center justify-center mx-auto mb-4 border-4 border-yellow-400">
                {powerupIcons[openModal]}
              </div>
              
              {/* Title */}
              <h3 className="text-2xl font-bold text-primary-purple mb-4">
                {openModal === 'teacher' && 'سؤال المعلمة'}
                {openModal === 'book' && 'فتح الكتاب'}
                {openModal === 'assistant' && 'المساعدة الذكية'}
                {openModal === 'change' && 'استبدال السؤال'}
                {openModal === 'shield' && 'درع الحماية'}
                {openModal === 'time' && 'وقت إضافي'}
              </h3>
              
              {/* Content */}
              <div className="text-gray-700 mb-6 text-lg leading-relaxed">
                {openModal === 'teacher' && (
                  <div>
                    <p className="mb-4">يمكنك الآن طلب معلومة أو توضيح للسؤال من المعلمة</p>
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                      <p className="text-primary-purple font-bold">💡 نصيحة من المعلمة:</p>
                      <p className="mt-2">فكروا في الكلمات المفتاحية في السؤال واربطوها بما تعلمتموه سابقاً</p>
                    </div>
                  </div>
                )}
                
                {openModal === 'book' && (
                  <div>
                    {/* Timer Display - clean circular design */}
                    {bookTimerActive && (
                      <div className="flex justify-center mb-6">
                        <div className="relative">
                          {/* Circular Progress Ring */}
                          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                            {/* Background Circle */}
                            <circle
                              cx="60"
                              cy="60"
                              r="50"
                              fill="none"
                              stroke="#E5E7EB"
                              strokeWidth="8"
                            />
                            {/* Progress Circle */}
                            <circle
                              cx="60"
                              cy="60"
                              r="50"
                              fill="none"
                              stroke="#facc15"
                              strokeWidth="8"
                              strokeDasharray={`${2 * Math.PI * 50}`}
                              strokeDashoffset={`${2 * Math.PI * 50 * (1 - bookTimeLeft / 30)}`}
                              className="transition-all duration-1000 ease-linear"
                              strokeLinecap="round"
                            />
                          </svg>
                          
                          {/* Timer Content */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-primary-purple mb-1">{bookTimeLeft}</span>
                            <span className="text-sm font-medium text-gray-600">ثانية</span>
                          </div>
                          
                          {/* Floating Icon */}
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-purple rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white text-lg">📚</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <p className="mb-4 text-center">
                      {bookTimerActive 
                        ? 'يمكنكم الآن البحث في الكتاب! استغلوا الوقت بحكمة' 
                        : 'يمكنكم الآن فتح الكتاب والبحث عن الإجابة'
                      }
                    </p>
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                      <p className="text-primary-purple font-bold">
                        {bookTimerActive ? '⏰ البحث جارٍ...' : '📚 إرشادات البحث:'}
                      </p>
                      <p className="mt-2">
                        {bookTimerActive 
                          ? `ابحثوا بسرعة وفعالية في الكتاب عن الإجابة الصحيحة`
                          : 'ابحثوا في الفهرس أولاً، ثم راجعوا الصفحات ذات الصلة بموضوع السؤال'
                        }
                      </p>
                    </div>
                  </div>
                )}
                
                {openModal === 'assistant' && (
                  <div>
                    <p className="mb-4">المساعدة الذكية متاحة الآن لمساعدتكم</p>
                    <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4">
                      <p className="text-primary-purple font-bold">🤖 مساعدة ذكية:</p>
                      <p className="mt-2">السؤال يتعلق بموضوع أساسي، حاولوا تذكر الأمثلة التي ذكرناها في الدرس</p>
                    </div>
                  </div>
                )}
                
                {openModal === 'change' && (
                  <div>
                    <p className="mb-4">سيتم استبدال هذا السؤال بسؤال آخر من نفس القيمة</p>
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                      <p className="text-primary-purple font-bold">🔄 تم الاستبدال!</p>
                      <p className="mt-2">السؤال الجديد قادم... استعدوا!</p>
                    </div>
                  </div>
                )}
                
                {openModal === 'shield' && (
                  <div>
                    <p className="mb-4">درع الحماية نشط! لن تخسروا نقاط في هذه الجولة</p>
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                      <p className="text-primary-purple font-bold">🛡️ حماية نشطة!</p>
                      <p className="mt-2">يمكنكم الإجابة بدون قلق من خسارة النقاط</p>
                    </div>
                  </div>
                )}
                
                {openModal === 'time' && (
                  <div>
                    <p className="mb-4">تم إضافة وقت إضافي للإجابة</p>
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                      <p className="text-primary-purple font-bold">⏰ +15 ثانية إضافية!</p>
                      <p className="mt-2">استغلوا الوقت الإضافي للتفكير بهدوء</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Action Button */}
              {openModal && isPowerupUsed(openModal) ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">تم استخدام هذه الأداة في اللعبة</p>
                  <button
                    onClick={() => setOpenModal(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-full font-bold text-lg transition-colors duration-200"
                  >
                    إغلاق
                  </button>
                </div>
              ) : openModal === 'book' && bookTimerActive ? (
                <div className="text-center">
                  <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 mb-4">
                    <p className="text-blue-700 font-bold text-lg">⏱️ جلسة البحث نشطة</p>
                    <p className="text-blue-600 mt-2">ابحثوا في الكتاب، سيتم إغلاق النافذة تلقائياً عند انتهاء الوقت</p>
                  </div>
                  <button
                    onClick={() => {
                      setBookTimerActive(false);
                      setBookTimeLeft(30);
                      setOpenModal(null);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold text-lg transition-colors duration-200"
                  >
                    انتهيت من البحث
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleUsePowerup(openModal!)}
                  className="bg-primary-purple hover:bg-primary-purple/90 text-white px-8 py-3 rounded-full font-bold text-lg transition-colors duration-200 border-2 border-yellow-400"
                >
                  استخدم الأداة
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Yellow Bar */}
              <div className="w-full h-1 bg-[#facc15] absolute bottom-3 left-0 right-0" />
      <div className="w-full h-3 bg-primary-purple absolute bottom-0 left-0 right-0" />
    </div>
  );
};

export default Details; 