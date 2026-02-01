import React, { useState } from 'react';
import { analyzeVitalSigns } from '../services/api';

const VitalSigns = () => {
  const [vitals, setVitals] = useState({
    heart_rate: '',
    spo2: '',
    temperature: '',
    blood_pressure: ''
  });

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setVitals(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnalyze = async () => {
    const hasData = Object.values(vitals).some(v => v !== '');
    if (!hasData) {
      alert('Please enter at least one vital sign');
      return;
    }

    setLoading(true);
    try {
      const vitalData = {
        heart_rate: vitals.heart_rate ? parseInt(vitals.heart_rate) : null,
        spo2: vitals.spo2 ? parseInt(vitals.spo2) : null,
        temperature: vitals.temperature ? parseFloat(vitals.temperature) : null,
        blood_pressure: vitals.blood_pressure || null
      };

      const result = await analyzeVitalSigns(vitalData);
      setAnalysis(result);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze vital signs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setVitals({
      heart_rate: '',
      spo2: '',
      temperature: '',
      blood_pressure: ''
    });
    setAnalysis(null);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">💓 Vital Signs Monitoring</h1>
      <p className="page-subtitle">Enter your vital signs below for an AI-powered analysis</p>

      {/* Input fields */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>

        {/* Heart Rate */}
        <div className="vital-card">
          <label className="vital-label">❤️ Heart Rate</label>
          <input
            type="number"
            placeholder="e.g. 72"
            value={vitals.heart_rate}
            onChange={(e) => handleChange('heart_rate', e.target.value)}
          />
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
            Normal: 60–100 BPM
          </div>
        </div>

        {/* SpO2 */}
        <div className="vital-card">
          <label className="vital-label">🫁 SpO2</label>
          <input
            type="number"
            placeholder="e.g. 98"
            value={vitals.spo2}
            onChange={(e) => handleChange('spo2', e.target.value)}
          />
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
            Normal: 95–100 %
          </div>
        </div>

        {/* Temperature */}
        <div className="vital-card">
          <label className="vital-label">🌡️ Temperature</label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 36.5"
            value={vitals.temperature}
            onChange={(e) => handleChange('temperature', e.target.value)}
          />
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
            Normal: 36.1–37.2 °C
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="vital-card">
          <label className="vital-label">💉 Blood Pressure</label>
          <input
            type="text"
            placeholder="e.g. 120/80"
            value={vitals.blood_pressure}
            onChange={(e) => handleChange('blood_pressure', e.target.value)}
          />
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
            Normal: 90/60–120/80
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze Vital Signs'}
        </button>

        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )}

      {/* Result */}
      {analysis && !loading && (
        <div className="result-box">
          <h3>Vital Signs Analysis</h3>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Your Vital Signs:</strong>
            <ul style={{ marginTop: '0.5rem', color: '#cbd5e1' }}>
              {analysis.vitals.heart_rate && <li>Heart Rate: {analysis.vitals.heart_rate} BPM</li>}
              {analysis.vitals.spo2 && <li>SpO2: {analysis.vitals.spo2}%</li>}
              {analysis.vitals.temperature && <li>Temperature: {analysis.vitals.temperature}°C</li>}
              {analysis.vitals.blood_pressure && <li>Blood Pressure: {analysis.vitals.blood_pressure}</li>}
            </ul>
          </div>
          <div style={{ whiteSpace: 'pre-line', color: '#cbd5e1', lineHeight: 1.7 }}>
            {analysis.analysis}
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalSigns;
