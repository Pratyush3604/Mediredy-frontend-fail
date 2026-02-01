import React, { useState } from 'react';
import { assessSymptoms } from '../services/api';

const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(false);

  const commonSymptoms = [
    'Fever', 'Cough', 'Headache', 'Sore Throat', 'Fatigue',
    'Nausea', 'Dizziness', 'Shortness of Breath', 'Body Aches',
    'Chills', 'Runny Nose', 'Vomiting', 'Diarrhea', 'Chest Pain',
    'Abdominal Pain', 'Rash', 'Joint Pain', 'Loss of Taste',
    'Eye Pain', 'Ear Pain', 'Back Pain', 'Weakness'
  ];

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleAssess = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }
    setLoading(true);
    try {
      const result = await assessSymptoms(selectedSymptoms, additionalInfo);
      setAssessment(result);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to assess symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setAdditionalInfo('');
    setAssessment(null);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">🩺 Symptom Assessment</h1>
      <p className="page-subtitle">Select your symptoms to get an AI-powered health assessment</p>

      <div className="form-group">
        <label>Select Your Symptoms:</label>
        <div className="symptom-list">
          {commonSymptoms.map((symptom) => (
            <div
              key={symptom}
              className={`symptom-item ${selectedSymptoms.includes(symptom) ? 'selected' : ''}`}
              onClick={() => toggleSymptom(symptom)}
            >
              {symptom}
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Additional Information (Optional):</label>
        <textarea
          placeholder="Describe any other symptoms, duration, severity, or relevant medical history..."
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleAssess}
          disabled={loading || selectedSymptoms.length === 0}
        >
          {loading ? 'Analyzing...' : 'Assess Symptoms'}
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

      {assessment && !loading && (
        <div className="result-box">
          <h3>Assessment Results</h3>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Your Symptoms:</strong>{' '}
            <span style={{ color: '#94a3b8' }}>{assessment.symptoms.join(', ')}</span>
          </div>
          <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8', color: '#cbd5e1' }}>
            {assessment.assessment}
          </div>
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem 1.2rem', 
            background: 'rgba(251,191,36,0.07)',
            border: '1px solid rgba(251,191,36,0.25)',
            borderRadius: '8px'
          }}>
            <strong style={{ color: '#fbbf24' }}>⚠️ {assessment.disclaimer}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
