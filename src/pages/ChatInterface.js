import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: 'Hello! I\'m Mediredy AI Doctor. How can I help you today? You can ask me about symptoms, medications, health concerns, or general medical questions.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    setLoading(true);
    try {
      // Prepare history for API
      const history = messages.map(msg => ({
        role: msg.role === 'ai' ? 'assistant' : 'user',
        content: msg.content
      }));

      const response = await sendChatMessage(userMessage, history);
      
      // Add AI response
      setMessages([...newMessages, { role: 'ai', content: response.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([
        ...newMessages, 
        { 
          role: 'ai', 
          content: 'I apologize, but I encountered an error. Please try again.' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'ai',
        content: 'Chat cleared. How can I help you today?'
      }
    ]);
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 className="page-title">💬 Chat with AI Doctor</h1>
          <p className="page-subtitle">Ask medical questions and get instant AI-powered answers</p>
        </div>
        <button className="btn btn-secondary" onClick={handleClearChat}>
          Clear Chat
        </button>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.7 }}>
                {message.role === 'ai' ? '🤖 AI Doctor' : '👤 You'}
              </div>
              <div style={{ whiteSpace: 'pre-line' }}>{message.content}</div>
            </div>
          ))}
          {loading && (
            <div className="message ai">
              <div style={{ fontWeight: 600, marginBottom: '0.35rem', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.7 }}>
                🤖 AI Doctor
              </div>
              <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <button 
            className={`btn ${isListening ? 'btn-primary' : 'btn-secondary'}`}
            onClick={toggleVoiceInput}
            style={{ padding: '0.7rem 1rem', minWidth: '44px' }}
            title="Voice input"
          >
            🎤
          </button>
          <input
            className="chat-input"
            type="text"
            placeholder={isListening ? "Listening..." : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading || isListening}
          />
          <button 
            className="btn btn-primary" 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{ padding: '0.7rem 1.6rem' }}
          >
            Send
          </button>
        </div>
      </div>

      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1rem 1.25rem', 
        background: 'rgba(56,189,248,0.06)',
        border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: '10px'
      }}>
        <strong style={{ color: '#38bdf8', fontSize: '0.85rem' }}>💡 Try asking:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.4rem', color: '#64748b', fontSize: '0.84rem' }}>
          <li>"What could cause a persistent headache?"</li>
          <li>"When should I see a doctor for a fever?"</li>
          <li>"What are the side effects of ibuprofen?"</li>
          <li>"How do I treat a minor burn at home?"</li>
        </ul>
      </div>
    </div>
  );
};

export default ChatInterface;
