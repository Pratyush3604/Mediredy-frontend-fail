import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const AIDoctor = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;  
      recognition.interimResults = true;  
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          handleVoiceMessage(transcript);
          setTranscript('');
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech error:', event.error);
        if (event.error === 'no-speech') {
          console.log('No speech detected, still listening...');
        } else if (event.error === 'aborted') {
          setIsListening(false);
        } else {
          setIsListening(false);
          setTimeout(() => {
            if (isListening) startListening();
          }, 1000);
        }
      };
      
      recognition.onend = () => {
        console.log('Recognition ended');
        if (isListening) {
          console.log('Restarting recognition...');
          try {
            recognition.start();
          } catch (e) {
            console.error('Error restarting:', e);
            setIsListening(false);
          }
        }
      };
      
      recognitionRef.current = recognition;
    }

    // Start camera automatically
    startCamera();
  }, []);

  // Add message to chat
  const addMessageToChat = (role, content) => {
    setChatHistory(prev => [...prev, { role, content }]);
  };

  // Start listening
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        console.log('Started listening');
      } catch (e) {
        console.error('Recognition start error:', e);
        if (e.message && e.message.includes('already started')) setIsListening(true);
      }
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        setIsListening(false);
        recognitionRef.current.stop();
        console.log('Stopped listening');
      } catch (e) {
        console.error('Recognition stop error:', e);
        setIsListening(false);
      }
    }
  };

  // Handle voice message
  const handleVoiceMessage = async (text) => {
    if (!text.trim()) return;
    
    addMessageToChat('user', text);
    
    try {
      const history = chatHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      }));
      
      const response = await api.post('/api/chat', {
        message: text,
        history: history
      });
      
      const aiResponse = response.data.response;
      const audioBase64 = response.data.audio;
      
      addMessageToChat('assistant', aiResponse);
      
      if (audioBase64) {
        playAudio(audioBase64);
      } else {
        speakText(aiResponse, 8000); // max 8s
      }
    } catch (error) {
      console.error('Chat error:', error);
      addMessageToChat('assistant', 'I apologize, I encountered an error. Please try again.');
    }
  };

  // Text to speech with max duration
  const speakText = async (text, maxDuration = 30000) => { // 30 seconds
    try {
      const response = await api.post('/api/voice/text-to-speech', { text });
      if (response.data.audio) {
        playAudio(response.data.audio);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.5;

        const timeoutId = setTimeout(() => {
          window.speechSynthesis.cancel();
        }, maxDuration);

        utterance.onend = () => clearTimeout(timeoutId);
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.5;

      const timeoutId = setTimeout(() => {
        window.speechSynthesis.cancel();
      }, maxDuration);

      utterance.onend = () => clearTimeout(timeoutId);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Play audio
  const playAudio = (base64Audio) => {
    const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
    audio.play().catch(e => console.error('Audio play error:', e));
  };

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Camera error:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  // Capture image
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageData);
    
    return imageData;
  };

  // Analyze injury
  const analyzeInjury = async () => {
    const imageData = captureImage();
    if (!imageData) return;
    
    stopListening();
    setIsAnalyzing(true);
    
    try {
      const blob = await fetch(imageData).then(r => r.blob());
      const formData = new FormData();
      formData.append('file', blob, 'injury.jpg');
      
      const response = await api.post('/api/injury-detection', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const analysis = response.data.analysis;
      addMessageToChat('assistant', `🔍 Injury Analysis:\n\n${analysis}`);
      await speakText("I've analyzed the image. " + analysis.substring(0, 200), 8000);
      startListening();
    } catch (error) {
      console.error('Injury analysis error:', error);
      addMessageToChat('assistant', '❌ Failed to analyze injury.');
      alert('Failed to analyze injury.');
      startListening();
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Analyze report (capture)
  const analyzeReport = async () => {
    const imageData = captureImage();
    if (!imageData) return;
    
    stopListening();
    setIsAnalyzing(true);
    
    try {
      const blob = await fetch(imageData).then(r => r.blob());
      const formData = new FormData();
      formData.append('file', blob, 'report.jpg');
      
      const response = await api.post('/api/report-analysis', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const analysis = response.data.analysis;
      addMessageToChat('assistant', `📋 Report Analysis:\n\n${analysis}`);
      await speakText("I've analyzed the report. " + analysis.substring(0, 200), 8000);
      startListening();
    } catch (error) {
      console.error('Report analysis error:', error);
      addMessageToChat('assistant', '❌ Failed to analyze report.');
      alert('Failed to analyze report.');
      startListening();
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">🏥 AI Doctor Consultation</h1>
      <p className="page-subtitle">Voice-powered medical consultation with real-time image analysis</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1.25rem' }}>
        {/* Video Feed Column */}
        <div style={{ 
          background: '#1a2540', 
          border: '1px solid #1e2d4a',
          borderRadius: '14px', 
          padding: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.85rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.05rem', color: '#e2e8f0', fontWeight: 600 }}>📹 Live Camera</h2>
            {isListening && (
              <span style={{ 
                marginLeft: '0.85rem', 
                color: '#14b8a6', 
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.4px'
              }}>
                <span style={{ 
                  animation: 'pulse 2s ease-in-out infinite',
                  marginRight: '0.4rem',
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#14b8a6'
                }}></span>
                Listening
              </span>
            )}
          </div>
          
          {/* Video Container */}
          <div style={{ 
            position: 'relative',
            background: '#0f1729',
            borderRadius: '10px',
            overflow: 'hidden',
            height: '360px',
            border: '1px solid #1e2d4a'
          }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '2px solid #14b8a6',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                }}
              />
            )}
            
            {isAnalyzing && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(15,23,41,0.9)',
                color: '#14b8a6',
                padding: '1rem 1.75rem',
                borderRadius: '10px',
                border: '1px solid #1e2d4a',
                textAlign: 'center',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <div className="spinner" style={{ margin: '0 auto 0.5rem', width: '26px', height: '26px' }}></div>
                Analyzing...
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ 
            display: 'flex',
            gap: '0.45rem',
            marginTop: '0.85rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={isListening ? stopListening : startListening}
              className={`btn ${isListening ? 'btn-danger' : 'btn-primary'}`}
              style={{ fontSize: '0.8rem', padding: '0.6rem 0.75rem', flex: 1, minWidth: '80px' }}
            >
              {isListening ? '🔴 Stop' : '🎤 Start'}
            </button>
            
            <button
              onClick={analyzeInjury}
              disabled={isAnalyzing}
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.6rem 0.75rem', flex: 1, minWidth: '80px' }}
            >
              📸 Injury
            </button>
            
            <button
              onClick={analyzeReport}
              disabled={isAnalyzing}
              className="btn btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.6rem 0.75rem', flex: 1, minWidth: '80px' }}
            >
              📋 Report
            </button>
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div style={{ 
              marginTop: '0.85rem', 
              padding: '0.85rem 1rem', 
              background: '#0f1729', 
              border: '1px solid #1e2d4a',
              borderRadius: '8px'
            }}>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                You're saying
              </p>
              <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.9rem' }}>{transcript}</p>
            </div>
          )}
        </div>

        {/* Chat Column */}
        <div style={{ 
          background: '#1a2540', 
          border: '1px solid #1e2d4a',
          borderRadius: '14px', 
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          height: '560px'
        }}>
          <h2 style={{ margin: '0 0 0.85rem 0', fontSize: '1.05rem', color: '#e2e8f0', fontWeight: 600 }}>💬 Conversation</h2>
          
          {/* Chat Messages */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            marginBottom: '0.5rem',
            padding: '0.5rem',
            scrollbarWidth: 'thin',
            scrollbarColor: '#1e2d4a transparent'
          }}>
            {chatHistory.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                color: '#64748b', 
                fontSize: '0.82rem', 
                padding: '2rem 1rem',
                fontStyle: 'italic'
              }}>
                Start speaking or use the buttons to begin your consultation.
              </div>
            )}
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '0.7rem'
                }}
              >
                <div
                  style={{
                    maxWidth: '82%',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '10px',
                    background: msg.role === 'user' 
                      ? 'linear-gradient(135deg, #0d9488, #14b8a6)' 
                      : '#243352',
                    color: msg.role === 'user' ? '#ffffff' : '#cbd5e1',
                    whiteSpace: 'pre-wrap',
                    fontSize: '0.85rem',
                    lineHeight: 1.55,
                    border: msg.role === 'user' ? 'none' : '1px solid #1e2d4a',
                    boxShadow: msg.role === 'user' ? '0 2px 8px rgba(20,184,166,0.25)' : 'none'
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDoctor;
