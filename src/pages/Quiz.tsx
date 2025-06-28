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
  const [shownWinNotifications, setShownWinNotifications] = useState<Set<string>>(new Set());
  const [showMotivationMessage, setShowMotivationMessage] = useState(false);
  const [motivationTeam, setMotivationTeam] = useState<number>(0);
  const [animatingCell, setAnimatingCell] = useState<{row: number, col: number} | null>(null);
  const [newWinsToShow, setNewWinsToShow] = useState<WinLine[]>([]);
  
  // Motivation messages array
  const motivationMessages = [
    'أحسنتم! إجابة ممتازة! 🎉',
    'رائع! استمروا هكذا! ⭐', 
    'ممتاز! فريق قوي! 💪',
    'أبدعتم! إجابة صحيحة! 🌟',
    'عمل رائع! مبروك! 🎊',
    'فريق ذكي! أحسنتم! 🧠',
    'مذهل! استمروا! 🚀',
    'فريق متميز! بارك الله فيكم! 🏆'
  ];

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

    // Load shown win notifications from localStorage
    const savedShownNotifications = localStorage.getItem('shownWinNotifications');
    if (savedShownNotifications) {
      const parsedShownNotifications = JSON.parse(savedShownNotifications);
      setShownWinNotifications(new Set(parsedShownNotifications));
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
      
      // Show motivation message for correct answers
      if (wasCorrect) {
        setMotivationTeam(activeGroup);
        setShowMotivationMessage(true);
        
        // Get the cell that was just played and trigger flip animation
        const lastPlayedCell = localStorage.getItem('lastPlayedCell');
        if (lastPlayedCell) {
          try {
            const cellData = JSON.parse(lastPlayedCell);
            setAnimatingCell({ row: cellData.row, col: cellData.col });
            // Clear animation after 1 second
            setTimeout(() => {
              setAnimatingCell(null);
            }, 1000);
          } catch (error) {
            console.error('Error parsing last played cell:', error);
          }
        }
        
        // Auto-hide motivation message after 3 seconds
        setTimeout(() => {
          setShowMotivationMessage(false);
        }, 3000);
      }
      
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
        
        // Check for new wins that haven't been shown yet
        const newWins = wins.filter(win => {
          const winId = `${win.team}-${win.direction}-${win.cells.map(c => `${c.row}-${c.col}`).join('-')}`;
          return !shownWinNotifications.has(winId);
        });
        
                 if (newWins.length > 0) {
           // Add new wins to shown notifications
           const updatedShownNotifications = new Set(shownWinNotifications);
           newWins.forEach(win => {
             const winId = `${win.team}-${win.direction}-${win.cells.map(c => `${c.row}-${c.col}`).join('-')}`;
             updatedShownNotifications.add(winId);
             
             const teamName = teams[win.team]?.name || `Team ${win.team + 1}`;
             console.log(`🎉 NEW WIN: ${teamName} has a ${win.direction} win!`);
           });
           
           setShownWinNotifications(updatedShownNotifications);
           localStorage.setItem('shownWinNotifications', JSON.stringify(Array.from(updatedShownNotifications)));
           
           // Show new win notifications
           setNewWinsToShow(newWins);
           
           // Auto-hide new win notifications after 5 seconds
           setTimeout(() => {
             setNewWinsToShow([]);
           }, 5000);
         }
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
    setShownWinNotifications(new Set());
    setNewWinsToShow([]);
    localStorage.setItem('board', JSON.stringify(defaultBoard));
    localStorage.setItem('winLines', JSON.stringify([]));
    localStorage.removeItem('shownWinNotifications');
    console.log('🔄 Board reset to default state');
  };

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden" style={{margin: 0, padding: 0}}>
      {/* Flip Animation Styles */}
      <style>{`
        .flip-animation {
          animation: flipToAvatar 1s ease-in-out;
        }
        
        @keyframes flipToAvatar {
          0% { 
            transform: rotateY(0deg); 
          }
          50% { 
            transform: rotateY(90deg); 
          }
          100% { 
            transform: rotateY(0deg); 
          }
        }
        
        .flip-animation .flip-front {
          animation: hideFront 1s ease-in-out;
        }
        
        .flip-animation .flip-back {
          animation: showBack 1s ease-in-out;
        }
        
        @keyframes hideFront {
          0% { opacity: 1; }
          50% { opacity: 0; }
          51% { opacity: 0; }
          100% { opacity: 0; }
        }
        
        @keyframes showBack {
          0% { opacity: 0; }
          50% { opacity: 0; }
          51% { opacity: 1; }
          100% { opacity: 1; }
        }
        
        .flip-front {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 1;
        }
        
        .flip-back {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
        }
      `}</style>
      
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
        
        {/* Notifications in header */}
        {(newWinsToShow.length > 0 || showMotivationMessage) ? (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            {/* Win notifications - only show new wins */}
            {newWinsToShow.map((winLine, idx) => {
              const teamName = teams[winLine.team]?.name || `Team ${winLine.team + 1}`;
              const teamColor = getTeamColor(winLine.team, teams);
              return (
                <div
                  key={`new-win-${idx}`}
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
            
            {/* Motivation message */}
            {showMotivationMessage && teams[motivationTeam] && (
              <div
                className="bg-white rounded-2xl px-6 py-2 shadow-2xl border-4 animate-bounce-in"
                style={{ borderColor: getTeamColor(motivationTeam, teams) }}
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={teams[motivationTeam].avatar} 
                    alt={teams[motivationTeam].name}
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ borderColor: getTeamColor(motivationTeam, teams) }}
                  />
                  <span className="text-lg font-bold whitespace-nowrap" style={{ color: getTeamColor(motivationTeam, teams) }}>
                    {motivationMessages[Math.floor(Math.random() * motivationMessages.length)]}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : null}
        
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
                  const isAnimating = animatingCell?.row === rowIdx && animatingCell?.col === colIdx;
                  
                  // Debug logging for cells with teams
                  if (hasTeam) {
                    console.log(`🎯 RENDERING Cell [${rowIdx},${colIdx}] with team:`, cell.team);
                    console.log('Team data:', teamData);
                    console.log('Team color:', teamColor);
                  }
                  
                  return (
                    <div key={rowIdx} className="relative">
                      <button
                        className={`rounded-full w-32 h-32 flex items-center justify-center text-4xl font-bold shadow-md transition-colors duration-200 relative z-10 overflow-hidden ${isInWinLine ? 'cursor-default' : ''} ${isAnimating ? 'flip-animation' : ''}`}
                        style={{
                          background: isInWinLine ? '#9CA3AF' : teamColor, // Grey out winning circles
                          color: hasTeam ? '#fff' : '#6B46C1',
                          cursor: !hasTeam && !isInWinLine ? 'pointer' : 'default',
                          border: isInWinLine ? `6px solid #6B5B95` : (hasTeam ? `4px solid ${teamColor}` : '4px solid #6B46C1'),
                          opacity: isInWinLine ? 0.8 : 1, // Slightly reduce opacity but keep visible
                          filter: isInWinLine ? 'grayscale(0.7)' : 'none', // Add grayscale filter for winning circles
                          pointerEvents: isInWinLine ? 'none' : 'auto' // Disable clicks on winning circles
                        }}
                        onClick={() => handleCellClick(rowIdx, colIdx)}
                        disabled={hasTeam || isInWinLine}
                      >
                        {/* Diagonal stripes background - only for winning circles */}
                        {isInWinLine && (
                          <div 
                            className="absolute inset-0"
                            style={{
                              opacity: 0.30,
                              backgroundImage: `repeating-linear-gradient(
                                45deg,
                                transparent,
                                transparent 8px,
                                rgba(255,255,255,0.8) 8px,
                                rgba(255,255,255,0.8) 16px
                              )`
                            }}
                          />
                        )}
                        {isAnimating ? (
                          // Flip animation content
                          <>
                            <div className="flip-front">
                              <span style={{ color: '#6B46C1' }}>{cell.value}</span>
                            </div>
                            <div className="flip-back">
                              {teamData?.avatar ? (
                                <img 
                                  src={teamData.avatar} 
                                  alt="avatar" 
                                  className="w-20 h-20 rounded-full border-2 border-white" 
                                  style={{
                                    filter: isInWinLine ? 'grayscale(1) brightness(0.7)' : 'none'
                                  }}
                                />
                              ) : (
                                <div 
                                  className="w-20 h-20 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-white font-bold text-2xl border-2 border-white"
                                  style={{
                                    filter: isInWinLine ? 'grayscale(1) brightness(0.7)' : 'none'
                                  }}
                                >
                                  {teamData?.name?.charAt(0) || (cell.team !== null ? cell.team + 1 : '?')}
                                </div>
                              )}
                            </div>
                          </>
                        ) : hasTeam ? (
                          // Normal team content
                          teamData?.avatar ? (
                            <img 
                              src={teamData.avatar} 
                              alt="avatar" 
                              className="w-20 h-20 rounded-full border-2 border-white" 
                              style={{
                                filter: isInWinLine ? 'grayscale(1) brightness(0.7)' : 'none'
                              }}
                            />
                          ) : (
                            <div 
                              className="w-20 h-20 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-white font-bold text-2xl border-2 border-white"
                              style={{
                                filter: isInWinLine ? 'grayscale(1) brightness(0.7)' : 'none'
                              }}
                            >
                              {teamData?.name?.charAt(0) || (cell.team !== null ? cell.team + 1 : '?')}
                            </div>
                          )
                        ) : (
                          // Empty circle content
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
        <div className="bg-gray-100 border-l-4 border-primary-purple flex flex-col justify-start items-start py-4 px-4" style={{width: SIDEBAR_WIDTH, minWidth: SIDEBAR_WIDTH, maxWidth: SIDEBAR_WIDTH, gap: teams.length > 4 ? '8px' : teams.length > 2 ? '12px' : '16px'}}>
          {teams.map((team, idx) => {
            // Responsive sizing based on team count
            const isCompact = teams.length > 4;
            const isMedium = teams.length > 2 && teams.length <= 4;
            const avatarSize = isCompact ? '80px' : isMedium ? '100px' : '120px';
            const buttonHeight = isCompact ? 'h-10' : isMedium ? 'h-12' : 'h-14';
            const textSize = isCompact ? 'text-lg' : isMedium ? 'text-xl' : 'text-xl';
            const scoreSize = isCompact ? 'text-xl' : isMedium ? 'text-2xl' : 'text-2xl';
            
            // Count how many wins this team has
            const teamWinCount = winLines.filter(winLine => winLine.team === idx).length;
            const badgeSize = isCompact ? '24px' : isMedium ? '28px' : '32px';
            const badgeFontSize = isCompact ? '12px' : isMedium ? '14px' : '16px';
            
            return (
            <div 
              key={idx} 
              className="w-full rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl"
              style={{
                backgroundColor: activeGroup === idx ? (team.color || '#6B46C1') : '#f8f9fa',
                borderWidth: '3px',
                borderStyle: 'solid',
                borderColor: team.color || '#6B46C1',
                boxShadow: `0 8px 25px ${team.color || '#6B46C1'}50`,
                padding: isCompact ? '12px' : isMedium ? '16px' : '24px',
              }}
            >
              <div className={`flex flex-row items-center justify-center w-full ${isCompact ? 'gap-2' : 'gap-4'}`}>
                {/* الصورة */}
                <div className="relative">
                  <img 
                    src={team.avatar} 
                    alt={team.name + ' avatar'} 
                    className="rounded-full bg-white shadow-lg object-cover" 
                    style={{
                      width: avatarSize,
                      height: avatarSize,
                      borderWidth: isCompact ? '3px' : '5px',
                      borderStyle: 'solid',
                      borderColor: activeGroup === idx ? '#fff' : (team.color || '#6B46C1'),
                      boxShadow: activeGroup === idx ? `0 0 15px rgba(255,255,255,0.8)` : `0 0 15px ${team.color || '#6B46C1'}40`
                    }}
                  />
                  {/* Win count badge */}
                  {teamWinCount > 0 && (
                    <div 
                      className="absolute -top-1 -right-1 rounded-full flex items-center justify-center font-bold shadow-lg"
                      style={{
                        width: badgeSize,
                        height: badgeSize,
                        backgroundColor: '#facc15',
                        color: '#6B46C1',
                        fontSize: badgeFontSize,
                        border: '3px solid white',
                        boxShadow: '0 4px 12px rgba(250, 204, 21, 0.6)',
                        zIndex: 10
                      }}
                    >
                      {teamWinCount}
                    </div>
                  )}
                </div>
                {/* عمود المستطيلين */}
                <div className={`flex flex-col items-center justify-center flex-1 ${isCompact ? 'gap-1' : 'gap-3'}`}>
                  {/* المستطيل البنفسجي */}
                  <button
                    className={`rounded-full w-full ${buttonHeight} ${textSize} font-bold transition-all duration-300 flex items-center justify-center shadow-lg px-4 ${
                      activeGroup === idx ? 'animate-pulse' : ''
                    }`}
                    style={{
                      borderWidth: '3px',
                      borderStyle: 'solid',
                      borderColor: activeGroup === idx ? '#fff' : (team.color || '#6B46C1'),
                      backgroundColor: activeGroup === idx ? 'rgba(255,255,255,0.9)' : (team.color || '#6B46C1'),
                      color: activeGroup === idx ? (team.color || '#6B46C1') : '#fff',
                      fontWeight: 'bold',
                      boxShadow: activeGroup === idx 
                        ? `0 0 20px rgba(255,255,255,0.8)` 
                        : '0 2px 8px rgba(0, 0, 0, 0.2)',
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
                    className={`flex items-center bg-white rounded-full shadow-lg justify-between w-full ${isCompact ? 'h-[50px] p-2' : 'h-[60px] p-3'}`}
                    style={{
                      borderWidth: '3px',
                      borderStyle: 'solid',
                      borderColor: activeGroup === idx ? '#fff' : (team.color || '#6B46C1')
                    }}
                  >
                    <button
                      className={`rounded-full flex items-center justify-center transition-colors shadow-md hover:scale-110 ${isCompact ? 'w-8 h-8' : 'w-10 h-10'}`}
                      style={{
                        backgroundColor: team.color || '#6B46C1',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderColor: activeGroup === idx ? '#fff' : (team.color || '#6B46C1')
                      }}
                      onClick={() => handleScore(idx, -100)}
                    >
                      <svg width={isCompact ? "20" : "24"} height={isCompact ? "20" : "24"} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="15" fill={team.color || '#6B46C1'} />
                        <rect x="8" y="13.5" width="16" height="5" rx="2.5" fill="white" />
                      </svg>
                    </button>
                    <span 
                      className={`${scoreSize} font-extrabold text-center number-font`}
                      style={{ color: team.color || '#6B46C1' }}
                    >
                      {scores[idx]}
                    </span>
                    <button
                      className={`rounded-full flex items-center justify-center transition-colors shadow-md hover:scale-110 ${isCompact ? 'w-8 h-8' : 'w-10 h-10'}`}
                      style={{
                        backgroundColor: team.color || '#6B46C1',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderColor: activeGroup === idx ? '#fff' : (team.color || '#6B46C1')
                      }}
                      onClick={() => handleScore(idx, 100)}
                    >
                      <svg width={isCompact ? "20" : "24"} height={isCompact ? "20" : "24"} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="15" fill={team.color || '#6B46C1'} />
                        <rect x="8" y="13.5" width="16" height="5" rx="2.5" fill="white" />
                        <rect x="13.5" y="8" width="5" height="16" rx="2.5" fill="white" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Quiz; 