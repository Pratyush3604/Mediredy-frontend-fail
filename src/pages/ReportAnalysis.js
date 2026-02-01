import React, { useState } from 'react';
import { analyzeReport } from '../services/api';

const ReportAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('');

  const reportTypes = [
    'Chest X-ray',
    'Abdominal X-ray',
    'Brain MRI',
    'Spinal MRI',
    'Knee X-ray',
    'Hand X-ray',
    'CT Scan',
    'Other Medical Report'
  ];

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
      alert('Please select a report first');
      return;
    }

    setLoading(true);
    try {
      const analysis = await analyzeReport(selectedFile);
      setResult(analysis);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to analyze report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setReportType('');
  };

  return (
    <div className="page-container">
      <h1 className="page-title">📋 Medical Report Analysis</h1>
      <p className="page-subtitle">Upload X-rays, MRIs, or other medical reports for AI analysis</p>

      <div className="form-group">
        <label>Report Type</label>
        <select 
          value={reportType} 
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="">Select report type...</option>
          {reportTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="file-upload" onClick={() => document.getElementById('report-file').click()}>
        <input
          id="report-file"
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
        />
        <div style={{ fontSize: '2.8rem', marginBottom: '0.75rem' }}>🏥</div>
        <p style={{ color: '#cbd5e1', fontWeight: 500 }}>Click to upload your medical report</p>
        <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.4rem' }}>
          Supports: JPG, PNG, PDF
        </p>
      </div>

      {preview && (
        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          <h3 style={{ color: '#cbd5e1', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.75rem' }}>Preview</h3>
          <img 
            src={preview} 
            alt="Report preview" 
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
          {loading ? 'Analyzing...' : 'Analyze Report'}
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
          <h3>Report Analysis Results</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong>Report Type:</strong> <span style={{ color: '#cbd5e1' }}>{result.report_type}</span>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <strong>File Name:</strong> <span style={{ color: '#cbd5e1' }}>{result.filename}</span>
          </div>

          <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>
            <strong>Analysis:</strong>
            <div style={{ marginTop: '0.4rem', color: '#cbd5e1' }}>{result.analysis}</div>
          </div>

          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem 1.2rem', 
            background: 'rgba(251,191,36,0.07)',
            borderRadius: '8px',
            border: '1px solid rgba(251,191,36,0.25)'
          }}>
            <strong style={{ color: '#fbbf24' }}>⚠️ {result.disclaimer}</strong>
          </div>
        </div>
      )}

      <div style={{ 
        marginTop: '2rem', 
        padding: '1.25rem 1.5rem', 
        background: 'rgba(56,189,248,0.06)',
        border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: '10px'
      }}>
        <h4 style={{ color: '#38bdf8', marginBottom: '0.5rem', fontSize: '0.88rem', fontWeight: 600 }}>💡 Supported Report Types</h4>
        <ul style={{ paddingLeft: '1.4rem', color: '#64748b', fontSize: '0.85rem' }}>
          <li>X-rays (Chest, Abdominal, Skeletal)</li>
          <li>MRI Scans (Brain, Spinal, Joint)</li>
          <li>CT Scans</li>
          <li>Ultrasound Reports</li>
          <li>Lab Test Results</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportAnalysis;
