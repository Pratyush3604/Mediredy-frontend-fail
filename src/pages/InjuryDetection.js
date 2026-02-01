import React, { useState } from 'react';
import { detectInjury } from '../services/api';

const InjuryDetection = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert('Please select an image first');
      return;
    }

    setLoading(true);
    try {
      const analysis = await detectInjury(selectedFile);
      setResult(analysis);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze injury. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">🩹 Injury Detection</h1>
      <p className="page-subtitle">Upload an image of your injury for AI-powered assessment</p>

      <div className="file-upload" onClick={() => document.getElementById('injury-file').click()}>
        <input
          id="injury-file"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
        />
        <div style={{ fontSize: '2.8rem', marginBottom: '0.75rem' }}>📸</div>
        <p style={{ color: '#cbd5e1', fontWeight: 500 }}>Click to upload an image of the injury</p>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.4rem' }}>
          Supports: JPG, PNG, GIF
        </p>
      </div>

      {preview && (
        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          <h3 style={{ color: '#cbd5e1', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.75rem' }}>Preview</h3>
          <img 
            src={preview} 
            alt="Injury preview" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '380px', 
              borderRadius: '12px',
              border: '1px solid #1e2d4a',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
            }} 
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleAnalyze}
          disabled={loading || !selectedFile}
        >
          {loading ? 'Analyzing...' : 'Analyze Injury'}
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )}

      {result && !loading && (
        <div className="result-box">
          <h3>Injury Analysis Results</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <strong>Detected Injuries:</strong>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
             {Array.isArray(result?.detected_injuries) && result.detected_injuries.map((injury, idx) => (
            <li key={idx}>{injury}</li>
              ))}
            </ul>
          </div>

          <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <strong>Severity Level:</strong>
            <span style={{ 
              padding: '0.28rem 0.9rem',
              background: result.severity === 'severe' ? 'rgba(239,68,68,0.15)' : 
                         result.severity === 'moderate' ? 'rgba(251,191,36,0.15)' : 'rgba(34,197,94,0.15)',
              color: result.severity === 'severe' ? '#f87171' : 
                     result.severity === 'moderate' ? '#fbbf24' : '#4ade80',
              border: `1px solid ${result.severity === 'severe' ? 'rgba(239,68,68,0.3)' : 
                         result.severity === 'moderate' ? 'rgba(251,191,36,0.3)' : 'rgba(34,197,94,0.3)'}`,
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              textTransform: 'capitalize'
            }}>
              {result.severity}
            </span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <strong>Recommendations:</strong>
            <p style={{ marginTop: '0.4rem', color: '#cbd5e1' }}>{result.recommendations}</p>
          </div>

          <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
            <strong>Detailed Analysis:</strong>
            <div style={{ marginTop: '0.4rem', color: '#cbd5e1' }}>{result.analysis}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InjuryDetection;
