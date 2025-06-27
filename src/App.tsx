import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import Details from './pages/Details';
import Login from './pages/Login';
import Register from './pages/Register';
import ChooseUserType from './pages/ChooseUserType';
import FamilyChallenge from './pages/FamilyChallenge';

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

function AppContent() {
  const location = useLocation();
  const hideHeader = location.pathname === '/details' || location.pathname === '/quiz';
  const hideFooter = location.pathname === '/details' || location.pathname === '/login' || location.pathname === '/quiz';
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {!hideHeader && <Header />}
      <main className={!hideHeader ? "flex-grow pt-24" : "flex-grow"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
          <Route path="/details" element={<Details />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/choose-user-type" element={<ChooseUserType />} />
          <Route path="/family-challenge" element={<FamilyChallenge />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App; 