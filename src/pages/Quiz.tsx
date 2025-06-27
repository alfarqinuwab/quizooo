import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import React from 'react';

const HEADER_HEIGHT = 96; // px
const SIDEBAR_WIDTH = 420; // px

const ROWS = 5;
const COLS = 7;
const CIRCLE_VALUES = [100, 200, 300, 400, 500, 600];

// Win detection types
type WinLine = {
  team: number;
  cells: { row: number; col: number }[];
  direction: 'horizontal' | 'vertical' | 'diagonal-right' | 'diagonal-left';
};

function getTeamColor(idx: number, teams: { name: string; avatar: string; color: string }[]) {
  // Use the team's assigned color, fallback to default colors if not available
  if (teams[idx]?.color) {
    return teams[idx].color;
  }
  // Fallback colors if team color is not available
  const colors = ['#6B46C1', '#facc15', '#E53E3E', '#319795'];
  return colors[idx % colors.length];
}

const Quiz = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<{ name: string; avatar: string; color: string }[]>([]);
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
  const [board, setBoard] = useState<{ value: number; team: number | null }[][]>([]);
  const [winLines, setWinLines] = useState<WinLine[]>([]);
  const [showWinNotifications, setShowWinNotifications] = useState(true);

  useEffect(() => {
    const savedTeamsData = localStorage.getItem('teamsData');
    if (savedTeamsData) {
      const teamsData = JSON.parse(savedTeamsData);
      console.log('Loading teams data:', teamsData);
      console.log('First team structure:', teamsData[0]);
      setTeams(teamsData);
      const savedScores = localStorage.getItem('scores');
      if (savedScores) {
        setScores(JSON.parse(savedScores));
      } else {
        setScores(Array(teamsData.length).fill(0));
      }
    }
    const savedClass = localStorage.getItem('className');
    if (savedClass) setClassName(savedClass);

    // Check for visited rectangles on component mount
    const savedVisited = localStorage.getItem('visitedRectangles');
    if (savedVisited) {
      setVisitedRectangles(JSON.parse(savedVisited));
    }
    // Load board from localStorage if exists
    const savedBoard = localStorage.getItem('board');
    if (savedBoard) {
      const parsedBoard = JSON.parse(savedBoard);
      console.log('📥 Loading board data from localStorage:', parsedBoard);
      
      // Check for team assignments in loaded board
      let foundTeams = false;
      for (let row = 0; row < parsedBoard.length; row++) {
        for (let col = 0; col < parsedBoard[row].length; col++) {
          if (parsedBoard[row][col].team !== null) {
            console.log(`📍 Initial load found team at [${row},${col}]:`, parsedBoard[row][col]);
            foundTeams = true;
          }
        }
      }
      if (!foundTeams) {
        console.log('❌ No team assignments found in initial board load');
      }
      
      setBoard(parsedBoard);
    } else {
      // Only initialize default board if no saved board exists
      console.log('🆕 No saved board found, creating default board');
      const defaultBoard = Array.from({ length: ROWS }, (_, row) =>
        Array.from({ length: COLS }, (_, col) => ({ value: CIRCLE_VALUES[row % CIRCLE_VALUES.length], team: null }))
      );
      setBoard(defaultBoard);
    }

    // Load win lines from localStorage if exists
    const savedWinLines = localStorage.getItem('winLines');
    if (savedWinLines) {
      const parsedWinLines = JSON.parse(savedWinLines);
      setWinLines(parsedWinLines);
      console.log('🏆 Loading win lines from localStorage:', parsedWinLines);
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
    
    // Check if we just returned from details page with an answer result
    const lastAnswerCorrect = localStorage.getItem('lastAnswerCorrect');
    if (lastAnswerCorrect !== null) {
      const wasCorrect = lastAnswerCorrect === 'true';
      console.log('🔄 QUIZ PAGE - Returned from details:', wasCorrect ? 'Correct answer!' : 'Incorrect answer!');
      localStorage.removeItem('lastAnswerCorrect');
      
      // Add a small delay to ensure localStorage is fully written
      setTimeout(() => {
        // Force re-load the board state from localStorage to ensure UI is updated
        const savedBoard = localStorage.getItem('board');
        console.log('🔍 Raw localStorage board data:', savedBoard);
        
        if (savedBoard) {
          try {
            const parsedBoard = JSON.parse(savedBoard);
            console.log('📋 Parsed board from localStorage:', parsedBoard);
            
            // Check specific cells for team assignments
            let hasTeamAssignments = false;
            for (let row = 0; row < parsedBoard.length; row++) {
              for (let col = 0; col < parsedBoard[row].length; col++) {
                if (parsedBoard[row][col].team !== null && parsedBoard[row][col].team !== undefined) {
                  console.log(`✅ Found team assignment at [${row},${col}]:`, parsedBoard[row][col]);
                  console.log(`Team index: ${parsedBoard[row][col].team}, Available teams:`, teams.length);
                  if (teams.length > 0) {
                    console.log(`Team data:`, teams[parsedBoard[row][col].team]);
                    console.log(`Team color will be:`, getTeamColor(parsedBoard[row][col].team, teams));
                  }
                  hasTeamAssignments = true;
                }
              }
            }
            
            if (!hasTeamAssignments) {
              console.log('❌ No team assignments found in board');
            }
            
            console.log('📊 Setting board state with:', parsedBoard);
            setBoard(parsedBoard);
            
            // Force component re-render
            setActiveGroup(prev => prev); // Trigger re-render
          } catch (e) {
            console.error('❌ Error parsing board from localStorage:', e);
          }
        } else {
          console.log('❌ No board data found in localStorage');
        }
        
        // Also reload scores
        const savedScores = localStorage.getItem('scores');
        if (savedScores) {
          setScores(JSON.parse(savedScores));
        }
      }, 100); // Small delay to ensure localStorage sync
    }
  }, [teams]);

  // Save visited rectangles to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('visitedRectangles', JSON.stringify(visitedRectangles));
  }, [visitedRectangles]);

  // Save board to localStorage whenever it changes and check for wins
  useEffect(() => {
    // Only save if board has been properly initialized
    if (board.length > 0) {
      localStorage.setItem('board', JSON.stringify(board));
      console.log('💾 Board state saved to localStorage:', board);
      
      // Check for wins
      const wins = checkForWins(board);
      setWinLines(wins);
      localStorage.setItem('winLines', JSON.stringify(wins));
      
      if (wins.length > 0) {
        console.log('🏆 Wins detected:', wins);
        wins.forEach(win => {
          const teamName = teams[win.team]?.name || `Team ${win.team + 1}`;
          console.log(`🎉 ${teamName} has a ${win.direction} win!`);
        });
        
        // Show notifications for new wins
        setShowWinNotifications(true);
      }
      
      // Check if we're overwriting team assignments
      let teamCount = 0;
      for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
          if (board[row][col].team !== null) {
            teamCount++;
            console.log(`💾 Saving team assignment at [${row},${col}]:`, board[row][col]);
          }
        }
      }
      if (teamCount === 0) {
        console.log('⚠️ Warning: Saving board with no team assignments');
      }
    }
  }, [board, teams]);

  // Auto-hide win notifications after 5 seconds
  useEffect(() => {
    if (winLines.length > 0 && showWinNotifications) {
      const timer = setTimeout(() => {
        setShowWinNotifications(false);
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [winLines, showWinNotifications]);

  // Listen for storage changes from other tabs/pages
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'board' && e.newValue) {
        console.log('Board updated from storage:', JSON.parse(e.newValue));
        setBoard(JSON.parse(e.newValue));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleScore = (idx: number, delta: number) => {
    setScores(prev => prev.map((score, i) => (i === idx ? score + delta : score)));
  };

  const handleCellClick = (rowIdx: number, colIdx: number) => {
    // Check if this specific cell is available
    if (board[rowIdx][colIdx].team === null) {
      const newBoard = board.map(r => r.slice());
      // Don't assign team yet - wait for answer in Details page
      newBoard[rowIdx][colIdx] = {
        ...newBoard[rowIdx][colIdx],
        team: null // Keep null initially
      };
      setBoard(newBoard);
      // Save the exact cell that was clicked
      localStorage.setItem('lastPlayedCell', JSON.stringify({ row: rowIdx, col: colIdx }));
      localStorage.setItem('board', JSON.stringify(newBoard));
      console.log('Saved cell position:', { row: rowIdx, col: colIdx });
      // Navigate to details page for question
      navigate('/details');
    }
  };



  // Exit button handler
  const handleExit = () => {
    localStorage.removeItem('visitedRectangles');
    localStorage.removeItem('scores');
    localStorage.removeItem('board');
    localStorage.removeItem('lastPlayedCell');
    localStorage.removeItem('activeGroup');
    localStorage.removeItem('lastAnswerCorrect');
    setVisitedRectangles([]);
    navigate('/');
  };

  // Win detection function
  const checkForWins = (board: { value: number; team: number | null }[][]) => {
    const wins: WinLine[] = [];
    
    // Check horizontal wins
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col <= COLS - 4; col++) {
        const team = board[row][col].team;
        if (team !== null && 
            board[row][col + 1].team === team &&
            board[row][col + 2].team === team &&
            board[row][col + 3].team === team) {
          wins.push({
            team,
            cells: [
              { row, col },
              { row, col: col + 1 },
              { row, col: col + 2 },
              { row, col: col + 3 }
            ],
            direction: 'horizontal'
          });
        }
      }
    }
    
    // Check vertical wins
    for (let row = 0; row <= ROWS - 4; row++) {
      for (let col = 0; col < COLS; col++) {
        const team = board[row][col].team;
        if (team !== null &&
            board[row + 1][col].team === team &&
            board[row + 2][col].team === team &&
            board[row + 3][col].team === team) {
          wins.push({
            team,
            cells: [
              { row, col },
              { row: row + 1, col },
              { row: row + 2, col },
              { row: row + 3, col }
            ],
            direction: 'vertical'
          });
        }
      }
    }
    
    // Check diagonal wins (top-left to bottom-right)
    for (let row = 0; row <= ROWS - 4; row++) {
      for (let col = 0; col <= COLS - 4; col++) {
        const team = board[row][col].team;
        if (team !== null &&
            board[row + 1][col + 1].team === team &&
            board[row + 2][col + 2].team === team &&
            board[row + 3][col + 3].team === team) {
          wins.push({
            team,
            cells: [
              { row, col },
              { row: row + 1, col: col + 1 },
              { row: row + 2, col: col + 2 },
              { row: row + 3, col: col + 3 }
            ],
            direction: 'diagonal-right'
          });
        }
      }
    }
    
    // Check diagonal wins (top-right to bottom-left)
    for (let row = 0; row <= ROWS - 4; row++) {
      for (let col = 3; col < COLS; col++) {
        const team = board[row][col].team;
        if (team !== null &&
            board[row + 1][col - 1].team === team &&
            board[row + 2][col - 2].team === team &&
            board[row + 3][col - 3].team === team) {
          wins.push({
            team,
            cells: [
              { row, col },
              { row: row + 1, col: col - 1 },
              { row: row + 2, col: col - 2 },
              { row: row + 3, col: col - 3 }
            ],
            direction: 'diagonal-left'
          });
        }
      }
    }
    
    return wins;
  };

  // Helper function to check if a cell is part of a winning line
  const isCellInWinLine = (row: number, col: number) => {
    return winLines.some(winLine => 
      winLine.cells.some(cell => cell.row === row && cell.col === col)
    );
  };



  // Reset board function to clear all team assignments
  const resetBoard = () => {
    const defaultBoard = Array.from({ length: ROWS }, (_, row) =>
      Array.from({ length: COLS }, (_, col) => ({ value: CIRCLE_VALUES[row % CIRCLE_VALUES.length], team: null }))
    );
    setBoard(defaultBoard);
    setWinLines([]);
    setShowWinNotifications(false);
    localStorage.setItem('board', JSON.stringify(defaultBoard));
    localStorage.setItem('winLines', JSON.stringify([]));
    console.log('🔄 Board reset to default state');
  };





  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden" style={{margin: 0, padding: 0}}>
      {/* Header */}
      <header className="bg-primary-purple text-white flex items-center justify-between border-b-4 border-[#facc15] relative z-50" style={{height: HEADER_HEIGHT, minHeight: HEADER_HEIGHT, maxHeight: HEADER_HEIGHT, flex: '0 0 auto', padding: '0 2rem'}}>
        <button 
          onClick={resetBoard}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm font-bold hover:bg-red-600 transition-colors"
          title="Reset board"
        >
          إعادة تعيين
        </button>
        
        <h1 className="text-4xl font-extrabold mx-auto absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          {className}
        </h1>
        
        {/* Win notifications in header */}
        {winLines.length > 0 && showWinNotifications && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            {winLines.map((winLine, idx) => {
              const teamName = teams[winLine.team]?.name || `Team ${winLine.team + 1}`;
              const teamColor = getTeamColor(winLine.team, teams);
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl px-6 py-2 shadow-2xl border-4 animate-bounce-in"
                  style={{ borderColor: teamColor }}
                >
                  <span className="text-lg font-bold whitespace-nowrap" style={{ color: teamColor }}>
                    🏆 {teamName} حقق خط فوز {winLine.direction === 'horizontal' ? 'أفقي' : 
                                              winLine.direction === 'vertical' ? 'عمودي' : 'قطري'}!
                  </span>
                </div>
              );
            })}
          </div>
        )}
        
        <button 
          className="flex items-center gap-2 text-lg font-bold"
          onClick={handleExit}
        >
          <ArrowLeftOnRectangleIcon className="w-7 h-7" />
          خروج
        </button>
      </header>
      
      {/* Main Content Area - Row Layout */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* Left Side - Connect Four Grid */}
        <div className="flex-1 w-full h-full flex items-center justify-center px-8 pb-8" style={{
          background: 'repeating-linear-gradient(45deg, #f1f1f1, #f1f1f1 15px, #f4f4f4 15px, #f4f4f4 30px)'
        }}>
          {board.length === 0 ? (
            <div className="flex items-center justify-center">
              <div className="text-primary-purple text-2xl font-bold">جاري التحميل...</div>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full max-w-5xl gap-8">
              {/* Category circles for each row */}
              <div className="flex flex-col-reverse gap-2">
                {Array.from({ length: ROWS }).map((_, rowIdx: number) => {
                  // Define category images for each row (you can customize these)
                  const categoryImages = [
                    '/assets/subjects/math-icon.png',      // Row 0 (100 points)
                    '/assets/subjects/science-icon.png',   // Row 1 (200 points)
                    '/assets/subjects/arabic-icon.png',    // Row 2 (300 points)
                    '/assets/subjects/english-icon.png',   // Row 3 (400 points)
                    '/assets/subjects/islamic-icon.png'    // Row 4 (500 points)
                  ];
                  
                  return (
                    <div
                      key={rowIdx}
                      className="w-32 h-32 rounded-full border-4 border-primary-purple shadow-md"
                      style={{
                        backgroundImage: `url(${categoryImages[rowIdx]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                      onError={() => {
                        // Fallback if image doesn't exist - set background to white and show text
                        const element = document.querySelector(`[data-row="${rowIdx}"]`) as HTMLElement;
                        if (element) {
                          element.style.backgroundImage = 'none';
                          element.style.backgroundColor = 'white';
                          element.innerHTML = `<span class="text-2xl font-bold text-primary-purple flex items-center justify-center h-full">${CIRCLE_VALUES[rowIdx]}</span>`;
                        }
                      }}
                      data-row={rowIdx}
                    />
                  );
                })}
              </div>
              
              {/* Main Grid */}
              <div className="grid grid-cols-7 gap-20">
                {Array.from({ length: COLS }).map((_, colIdx: number) => (
                  <div key={colIdx} className="flex flex-col-reverse gap-2">
                    {Array.from({ length: ROWS }).map((_, rowIdx: number) => {
                  const cell = board[rowIdx][colIdx];
                  const hasTeam = cell.team !== null && cell.team !== undefined && typeof cell.team === 'number';
                  const teamData = hasTeam && cell.team !== null ? teams[cell.team] : null;
                  const teamColor = hasTeam && cell.team !== null ? getTeamColor(cell.team, teams) : '#fff';
                  const isInWinLine = isCellInWinLine(rowIdx, colIdx);
                  
                  // Debug logging for cells with teams
                  if (hasTeam) {
                    console.log(`🎯 RENDERING Cell [${rowIdx},${colIdx}] with team:`, cell.team);
                    console.log('Team data:', teamData);
                    console.log('Team color:', teamColor);
                  }
                  
                  return (
                    <div key={rowIdx} className="relative">
                      <button
                        className="rounded-full w-32 h-32 flex items-center justify-center text-4xl font-bold shadow-md transition-colors duration-200 relative z-10"
                        style={{
                          background: teamColor,
                          color: hasTeam ? '#fff' : '#6B46C1',
                          cursor: !hasTeam ? 'pointer' : 'default',
                          border: isInWinLine ? `6px solid gold` : (hasTeam ? `4px solid ${teamColor}` : '4px solid #6B46C1'),
                          opacity: isInWinLine ? 0.4 : 1
                        }}
                        onClick={() => handleCellClick(rowIdx, colIdx)}
                        disabled={hasTeam}
                      >
                        {hasTeam ? (
                          teamData?.avatar ? (
                            <img src={teamData.avatar} alt="avatar" className="w-20 h-20 rounded-full border-2 border-white" />
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-white font-bold text-2xl border-2 border-white">
                              {teamData?.name?.charAt(0) || (cell.team !== null ? cell.team + 1 : '?')}
                            </div>
                          )
                        ) : (
                          <span style={{ color: '#6B46C1' }}>{cell.value}</span>
                        )}
                      </button>
                    </div>
                  );
                  })}
                </div>
              ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Right Sidebar - Teams */}
        <div className="bg-white border-l-4 border-primary-purple flex flex-col justify-start items-start gap-6 py-6 px-4" style={{width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH}}>
          {teams.map((team, idx) => (
            <div key={idx} className="flex flex-row items-center justify-center gap-4 w-full">
              {/* الصورة (كبيرة جداً) */}
              <img 
                src={team.avatar} 
                alt={team.name + ' avatar'} 
                className="w-[154px] h-[154px] rounded-full bg-white shadow-lg object-cover" 
                style={{
                  borderWidth: '6px',
                  borderStyle: 'solid',
                  borderColor: team.color || '#facc15',
                  boxShadow: `0 0 20px ${team.color || '#facc15'}40`
                }}
              />
              {/* عمود المستطيلين */}
              <div className="flex flex-col items-center gap-2 justify-center flex-1">
                {/* المستطيل البنفسجي */}
                <button
                  className={`rounded-full w-full h-16 text-2xl font-bold transition-all duration-300 flex items-center justify-center shadow-lg px-6 mb-0 ${
                    activeGroup === idx ? 'animate-pulse' : ''
                  }`}
                  style={{
                    borderWidth: activeGroup === idx ? '6px' : '4px',
                    borderStyle: 'solid',
                    borderColor: team.color || '#facc15',
                    backgroundColor: activeGroup === idx ? (team.color || '#facc15') : '#6B46C1',
                    color: '#fff',
                    transform: activeGroup === idx ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: activeGroup === idx 
                      ? `0 0 25px ${team.color || '#facc15'}60, 0 0 50px ${team.color || '#facc15'}30` 
                      : '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                  onClick={() => {
                    setActiveGroup(idx);
                    localStorage.setItem('activeGroup', idx.toString());
                  }}
                >
                  <span className="w-full text-center block truncate">
                    {activeGroup === idx && '🎯 '}{team.name}{activeGroup === idx && ' 🎯'}
                  </span>
                </button>
                {/* مستطيل النقاط */}
                <div 
                  className="flex items-center bg-white rounded-full p-4 shadow-lg justify-between h-[70px] w-full mt-0"
                  style={{
                    borderWidth: '3px',
                    borderStyle: 'solid',
                    borderColor: team.color || '#facc15'
                  }}
                >
                  <button
                    className="rounded-full w-12 h-12 flex items-center justify-center transition-colors shadow-md"
                    style={{
                      backgroundColor: team.color || '#6B46C1',
                      borderWidth: '3px',
                      borderStyle: 'solid',
                      borderColor: team.color || '#facc15'
                    }}
                    onClick={() => handleScore(idx, -100)}
                  >
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="15" fill={team.color || '#6B46C1'} />
                      <rect x="8" y="13.5" width="16" height="5" rx="2.5" fill="white" />
                    </svg>
                  </button>
                  <span 
                    className="text-3xl font-extrabold text-center number-font"
                    style={{ color: team.color || '#6B46C1' }}
                  >
                    {scores[idx]}
                  </span>
                  <button
                    className="rounded-full w-12 h-12 flex items-center justify-center transition-colors shadow-md"
                    style={{
                      backgroundColor: team.color || '#6B46C1',
                      borderWidth: '3px',
                      borderStyle: 'solid',
                      borderColor: team.color || '#facc15'
                    }}
                    onClick={() => handleScore(idx, 100)}
                  >
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="15" fill={team.color || '#6B46C1'} />
                      <rect x="8" y="13.5" width="16" height="5" rx="2.5" fill="white" />
                      <rect x="13.5" y="8" width="5" height="16" rx="2.5" fill="white" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz; 