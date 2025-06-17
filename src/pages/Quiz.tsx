import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

const POINTS = [100, 200, 300, 400];

const HEADER_HEIGHT = 120; // px (increased height)

const Quiz = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<string[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [activeGroup, setActiveGroup] = useState(() => {
    const saved = localStorage.getItem('activeGroup');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [className, setClassName] = useState('');
  const [visitedRectangles, setVisitedRectangles] = useState<string[]>(() => {
    const saved = localStorage.getItem('visitedRectangles');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const savedTeams = localStorage.getItem('teams');
    if (savedTeams) {
      const teamNames = JSON.parse(savedTeams);
      setTeams(teamNames);
      setScores(Array(teamNames.length).fill(0));
    }
    const savedClass = localStorage.getItem('className');
    if (savedClass) setClassName(savedClass);

    // Check for visited rectangles on component mount
    const savedVisited = localStorage.getItem('visitedRectangles');
    if (savedVisited) {
      setVisitedRectangles(JSON.parse(savedVisited));
    }
  }, []);

  useEffect(() => {
    if (teams.length === 0) return;
    const shouldAdvance = localStorage.getItem('shouldAdvanceGroup');
    if (shouldAdvance === 'true') {
      setActiveGroup(prev => {
        const next = (prev + 1) % teams.length;
        localStorage.setItem('activeGroup', next.toString());
        return next;
      });
      localStorage.removeItem('shouldAdvanceGroup');
    }
  }, [teams]);

  // Save visited rectangles to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('visitedRectangles', JSON.stringify(visitedRectangles));
  }, [visitedRectangles]);

  useEffect(() => {
    // Check for saved visited rectangles
    const savedVisited = localStorage.getItem('visitedRectangles');
    if (savedVisited) {
      setVisitedRectangles(JSON.parse(savedVisited));
    }

    // Cleanup function to reset visited rectangles when leaving the page
    return () => {
      localStorage.removeItem('visitedRectangles');
    };
  }, []);

  const handleScore = (idx: number, delta: number) => {
    setScores(prev => prev.map((score, i) => (i === idx ? score + delta : score)));
  };

  const handleRectangleClick = (value: number, column: string) => {
    const rectangleId = `${column}-${value}`;
    if (!visitedRectangles.includes(rectangleId)) {
      const newVisited = [...visitedRectangles, rectangleId];
      setVisitedRectangles(newVisited);
      localStorage.setItem('visitedRectangles', JSON.stringify(newVisited));
      localStorage.setItem('lastClickedRectangle', rectangleId);
      navigate('/details');
    }
  };

  const getRectangleClasses = (value: number, column: string) => {
    const rectangleId = `${column}-${value}`;
    const isVisited = visitedRectangles.includes(rectangleId);
    
    const baseClasses = "border-4 rounded-2xl flex items-center justify-center text-5xl font-extrabold h-[130px] w-full shadow-md font-[Oswald]";
    const visitedClasses = "bg-gray-100 border-gray-400 text-gray-400 cursor-not-allowed";
    const unvisitedClasses = "bg-white border-primary-purple text-primary-purple cursor-pointer hover:bg-primary-purple/10 transition-colors";

    return `${baseClasses} ${isVisited ? visitedClasses : unvisitedClasses}`;
  };

  return (
    <div className="w-screen h-screen relative bg-background font-sans overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-primary-purple text-white py-10 px-8 flex items-center justify-between border-b-4 border-[#F59E0B]" style={{height: HEADER_HEIGHT}}>
        <button className="flex items-center gap-2 text-lg font-bold mr-auto">
          <ArrowLeftOnRectangleIcon className="w-7 h-7" />
          خروج
        </button>
        <h1 className="text-6xl font-extrabold mx-auto absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          {className}
        </h1>
        <div className="w-16" /> {/* Spacer */}
      </header>
      {/* Main Content (question-area) */}
      <div
        className="question-area absolute left-0 right-0"
        style={{
          top: `${HEADER_HEIGHT}px`,
          bottom: '0',
          width: '100vw',
          height: 'auto',
          padding: 0,
        }}
      >
        {/* Always show the questions area directly */}
        <div className="flex flex-row items-center justify-center gap-8 w-full h-full">
          {/* Extra Right Points Column */}
          <div className="flex flex-col gap-8 flex-1 min-w-[300px] max-w-[450px] h-full justify-center mt-8">
            {POINTS.map((pt, i) => (
              <div
                key={i}
                className={getRectangleClasses(pt, 'extra-right')}
                onClick={() => handleRectangleClick(pt, 'extra-right')}
              >
                {pt}
              </div>
            ))}
            <div
              className={getRectangleClasses(500, 'extra-right')}
              onClick={() => handleRectangleClick(500, 'extra-right')}
            >
              500
            </div>
          </div>
          {/* Right Points */}
          <div className="flex flex-col gap-8 flex-1 min-w-[300px] max-w-[450px] h-full justify-center mt-8">
            {POINTS.map((pt, i) => (
              <div
                key={i}
                className={getRectangleClasses(pt, 'right')}
                onClick={() => handleRectangleClick(pt, 'right')}
              >
                {pt}
              </div>
            ))}
            <div
              className={getRectangleClasses(500, 'right')}
              onClick={() => handleRectangleClick(500, 'right')}
            >
              500
            </div>
          </div>
          {/* Center: New 5 Rectangles */}
          <div className="flex flex-col gap-8 flex-1 min-w-[300px] max-w-[450px] h-full justify-center mt-8">
            <div
              className={getRectangleClasses(100, 'center')}
              onClick={() => handleRectangleClick(100, 'center')}
            >
              100
            </div>
            <div
              className={getRectangleClasses(200, 'center')}
              onClick={() => handleRectangleClick(200, 'center')}
            >
              200
            </div>
            <div
              className={getRectangleClasses(300, 'center')}
              onClick={() => handleRectangleClick(300, 'center')}
            >
              300
            </div>
            <div
              className={getRectangleClasses(400, 'center')}
              onClick={() => handleRectangleClick(400, 'center')}
            >
              400
            </div>
            <div
              className={getRectangleClasses(500, 'center')}
              onClick={() => handleRectangleClick(500, 'center')}
            >
              500
            </div>
          </div>
          {/* Left Points */}
          <div className="flex flex-col gap-8 flex-1 min-w-[300px] max-w-[450px] h-full justify-center mt-8">
            {POINTS.map((pt, i) => (
              <div
                key={i}
                className={getRectangleClasses(pt, 'left')}
                onClick={() => handleRectangleClick(pt, 'left')}
              >
                {pt}
              </div>
            ))}
            <div
              className={getRectangleClasses(500, 'left')}
              onClick={() => handleRectangleClick(500, 'left')}
            >
              500
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Groups Bar - always full width, fixed */}
      <div className="bottom-group fixed left-0 right-0 bottom-0 w-full bg-white border-t-4 border-primary-purple py-4 px-8 flex flex-row justify-center items-end gap-8 z-40">
        {teams.map((team, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1">
            <button
              className={`rounded-full px-6 py-3 text-2xl font-bold mb-2 transition-all duration-200 flex items-center justify-center w-full shadow-lg
                ${activeGroup === idx
                  ? 'bg-[#F59E0B] text-primary-purple border-4 border-[#F59E0B] transform scale-105'
                  : 'bg-primary-purple text-white border-4 border-[#F59E0B] hover:bg-primary-purple/90'}
              `}
              onClick={() => {
                setActiveGroup(idx);
                localStorage.setItem('activeGroup', idx.toString());
              }}
            >
              {team}
            </button>
            <div className="flex items-center bg-white rounded-full p-4 shadow-lg w-full justify-between border-4 border-[#F59E0B] h-[80px]">
              <button
                className="rounded-full w-12 h-12 flex items-center justify-center bg-primary-purple hover:bg-primary-purple/90 transition-colors shadow-md border-4 border-[#F59E0B]"
                onClick={() => handleScore(idx, -100)}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="15" fill="#6B46C1" />
                  <rect x="8" y="13.5" width="16" height="5" rx="2.5" fill="white" />
                </svg>
              </button>
              <span className="text-4xl font-extrabold text-center text-primary-purple number-font">{scores[idx]}</span>
              <button
                className="rounded-full w-12 h-12 flex items-center justify-center bg-primary-purple hover:bg-primary-purple/90 transition-colors shadow-md border-4 border-[#F59E0B]"
                onClick={() => handleScore(idx, 100)}
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="15" fill="#6B46C1" />
                  <rect x="8" y="13.5" width="16" height="5" rx="2.5" fill="white" />
                  <rect x="13.5" y="8" width="5" height="16" rx="2.5" fill="white" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quiz; 