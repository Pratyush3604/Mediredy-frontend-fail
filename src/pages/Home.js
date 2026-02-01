import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: '🩺',
      title: 'Symptom Assessment',
      description: 'Get AI-powered analysis of your symptoms and health concerns',
      link: '/symptoms'
    },
    {
      icon: '💓',
      title: 'Vital Signs Monitoring',
      description: 'Track and analyze your vital signs with expert recommendations',
      link: '/vitals'
    },
    {
      icon: '🩹',
      title: 'Injury Detection',
      description: 'Upload injury photos for AI-powered assessment and care advice',
      link: '/injury'
    },
    {
      icon: '📋',
      title: 'Report Analysis',
      description: 'Analyze X-rays, MRIs, and other medical reports instantly',
      link: '/reports'
    },
    {
      icon: '💬',
      title: 'Chat with the AI Doctor',
      description: 'Have a conversation with our AI medical assistant anytime',
      link: '/chat'
    },
    {
      icon: '🤖',
      title: 'Talk to the AI Doctor',
      description: 'Have a live consultation with the AI medical assistant',
      link: '/ai-doctor'  // ✅ Corrected link
    }
  ];

  return (
    <div className="page-container">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 className="page-title" style={{ fontSize: '2.6rem', textAlign: 'center' }}>
          Welcome to Mediredy AI Doctor
        </h1>
        <p className="page-subtitle" style={{ fontSize: '1rem', maxWidth: '560px', margin: '0.4rem auto 0' }}>
          Your intelligent medical assistant powered by cutting-edge AI technology
        </p>
      </div>

      <div className="feature-grid">
        {features.map((feature, index) => (
          <Link 
            to={feature.link} 
            key={index} 
            className="feature-card"
            style={{ textDecoration: 'none' }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </Link>
        ))}
      </div>

      <div style={{ 
        marginTop: '2.5rem', 
        padding: '1.5rem 1.75rem', 
        background: 'rgba(251,191,36,0.07)', 
        borderRadius: '12px',
        border: '1px solid rgba(251,191,36,0.25)'
      }}>
        <h3 style={{ color: '#fbbf24', marginBottom: '0.6rem', fontSize: '0.95rem', fontWeight: 600 }}>⚠️ Important Notice</h3>
        <p style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '0.88rem' }}>
          Mediredy AI Doctor is an AI-powered medical assistant designed to provide general health information 
          and preliminary assessments. This tool is not a replacement for professional medical advice, diagnosis, 
          or treatment. Always seek the advice of your physician or other qualified health provider with any 
          questions you may have regarding a medical condition.
        </p>
      </div>
    </div>
  );
};

export default Home;
