import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
// Import pages
import Home from './pages/Home';
import SymptomChecker from './pages/SymptomChecker';
import VitalSigns from './pages/VitalSigns';
import InjuryDetection from './pages/InjuryDetection';
import ReportAnalysis from './pages/ReportAnalysis';
import ChatInterface from './pages/ChatInterface';
import AIDoctor from './pages/AIDoctor';
import AboutUs from './pages/AboutUs'; // New About Us page

const navLinks = [
  { to: '/', label: '🏠 Home' },
  { to: '/ai-doctor', label: '🤖 AI Doctor' },
  { to: '/symptoms', label: '🩺 Symptoms' },
  { to: '/vitals', label: '💓 Vital Signs' },
  { to: '/injury', label: '🩹 Injury Detection' },
  { to: '/reports', label: '📋 Report Analysis' },
  { to: '/chat', label: '💬 Chat' },
  { to: '/about-us', label: 'ℹ️ About Us' },
];

function Navbar() {
  const location = useLocation();
  return (
    <nav style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#0f1729',
      borderBottom: '1px solid #1e2d4a',
      gap: '0.75rem'
    }}>
      {/* Brand */}
      <span style={{
        fontFamily: "'DM Serif Display', Georgia, serif",
        fontSize: '1.35rem',
        color: '#14b8a6',
        letterSpacing: '-0.5px',
        fontWeight: 400
      }}>
        ⚕️ Mediredy
      </span>

      {/* Navbar Links */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', justifyContent: 'center' }}>
        {navLinks.map((link, index) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={index}
              to={link.to}
              style={{
                padding: '0.42rem 0.9rem',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.82rem',
                textDecoration: 'none',
                backgroundColor: isActive ? '#14b8a6' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                border: isActive ? '1px solid #14b8a6' : '1px solid #1e2d4a',
                transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
                letterSpacing: '0.2px'
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#14b8a6';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.backgroundColor = 'rgba(20,184,166,0.1)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = '#1e2d4a';
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        {/* NAVBAR */}
        <Navbar />

        {/* MAIN CONTENT */}
        <main className="main-content" style={{ padding: '2rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ai-doctor" element={<AIDoctor />} />
            <Route path="/symptoms" element={<SymptomChecker />} />
            <Route path="/vitals" element={<VitalSigns />} />
            <Route path="/injury" element={<InjuryDetection />} />
            <Route path="/reports" element={<ReportAnalysis />} />
            <Route path="/chat" element={<ChatInterface />} />
            <Route path="/about-us" element={<AboutUs />} /> {/* About Us page route */}
          </Routes>
        </main>

        {/* FOOTER */}
        <footer style={{ 
          padding: '1.2rem 2rem', 
          textAlign: 'center', 
          background: '#0f1729', 
          borderTop: '1px solid #1e2d4a',
          marginTop: '0'
        }}>
          <p style={{ color: '#64748b', fontSize: '0.82rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            ⚠️ Disclaimer: This is an AI-powered medical assistant. Always consult healthcare professionals for medical advice.
          </p>
          <p style={{ fontSize: '0.72rem', marginTop: '0.4rem', color: '#3d4f6b' }}>
            v2.0 — Powered by GPT-4o Vision, Groq, & ElevenLabs
          </p>
        </footer>
      </div>
    </Router>
  );
}
export default App;
