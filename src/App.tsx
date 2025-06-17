import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Details from './pages/Details';

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

function AppContent() {
  const location = useLocation();
  const hideHeader = location.pathname === '/details';
  const hideFooter = location.pathname === '/details';
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!hideHeader && <Header />}
      <main className={!hideHeader ? "flex-grow pt-24" : "flex-grow"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/details" element={<Details />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App; 