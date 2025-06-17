import React, { useState, useEffect } from 'react';
import { ArrowLeftOnRectangleIcon, UserIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const TimerCircle = ({ timeLeft }: { timeLeft: number }) => {
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 30) * circumference;

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
          stroke="#8B5CF6"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      
      {/* Time text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[120px] font-bold text-primary-purple">{timeLeft}</span>
      </div>
    </div>
  );
};

const Details = () => {
  const navigate = useNavigate();
  const [className, setClassName] = useState('صف سادس ب');
  const [teams, setTeams] = useState<string[]>([]);
  const [activeGroup, setActiveGroup] = useState<number>(-1);

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
      <div className="flex flex-row flex-1 w-full px-8 py-8 gap-4" style={{background: '#fff', marginTop: 90, justifyContent: 'center', alignItems: 'flex-start'}}>
        {/* Right Side: Timer and Powerups */}
        <div className="flex flex-col items-center gap-2 min-w-[260px] max-w-[300px] mt-2 ml-32">
          {/* Timer */}
          <TimerCircle timeLeft={30} />
          {/* Powerups */}
          <div className="flex flex-row gap-4">
            <div className="w-14 h-14 rounded-full bg-[#F59E0B] flex items-center justify-center shadow-md">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div className="w-14 h-14 rounded-full bg-[#F59E0B] flex items-center justify-center shadow-md">
              <BookOpenIcon className="w-8 h-8 text-white" />
            </div>
            <div className="w-14 h-14 rounded-full bg-[#F59E0B] flex items-center justify-center shadow-md">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </div>
          </div>
        </div>

        {/* Center: Question Card */}
        <div className="flex flex-col flex-1 items-center justify-start gap-8 mt-10">
          <div className="flex flex-col items-center w-full">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 w-[1550px] max-w-none min-h-[520px] flex items-center justify-center text-primary-purple text-6xl font-extrabold px-40 py-32 mt-0 mx-auto" style={{marginTop: 0}}>
              ما هي أركان الإسلام الخمسة؟
            </div>
          </div>
          <div className="flex flex-row gap-6 justify-center w-full">
            <button className="bg-primary-purple text-white border-2 border-[#F59E0B] rounded-xl px-8 py-3 text-xl font-bold shadow-md">إظهار الإجابة</button>
            <button className="bg-primary-purple text-white border-2 border-[#F59E0B] rounded-xl px-8 py-3 text-xl font-bold shadow-md">إظهار الخيارات</button>
          </div>
        </div>

        {/* Left Side: Groups */}
        <div className="flex flex-col gap-6 min-w-[220px] max-w-[260px] w-full mt-8">
          <button className="bg-[#F59E0B] text-white text-2xl font-bold rounded-full py-4 px-12 shadow-md mb-2 w-full">من جاوب</button>
          {teams.map((team, idx) => (
            <button
              key={idx}
              className={
                (activeGroup === idx
                  ? 'bg-primary-purple text-white shadow-md'
                  : 'border-4 border-primary-purple text-primary-purple bg-white')
                + ' text-2xl font-bold rounded-full py-4 px-12 mb-2 w-full'
              }
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