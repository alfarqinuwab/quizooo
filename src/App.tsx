import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Navigation';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Results from './pages/Results';

const App: React.FC = () => {
  return (
    <Router>
      <div 
        className="min-h-screen bg-background font-arabic flex flex-col" 
        dir="rtl"
        style={{ direction: 'rtl' }}
      >
        <Header />
        <main className="flex-1 w-full pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App; 