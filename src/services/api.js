import axios from 'axios';

// Use the backend URL from .env or fallback to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mediredy-backend-3604.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Symptom Assessment
export const assessSymptoms = async (symptoms, additionalInfo) => {
  const response = await api.post('/api/symptom-assessment', {
    symptoms,
    additional_info: additionalInfo,
  });
  return response.data;
};

// Vital Signs
export const analyzeVitalSigns = async (vitals) => {
  const response = await api.post('/api/vital-signs', vitals);
  return response.data;
};

// Injury Detection
export const detectInjury = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/injury-detection', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Report Analysis
export const analyzeReport = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/api/report-analysis', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Chat
export const sendChatMessage = async (message, history = []) => {
  const response = await api.post('/api/chat', {
    message,
    history,
  });
  return response.data;
};

// Voice to Text
export const voiceToText = async (audioFile) => {
  const formData = new FormData();
  formData.append('audio', audioFile);

  const response = await api.post('/api/voice-to-text', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Text to Speech
export const textToSpeech = async (text) => {
  const response = await api.post('/api/text-to-speech', null, {
    params: { text },
  });
  return response.data;
};

// Generate Prescription
export const generatePrescription = async (prescriptionData) => {
  const response = await api.post('/api/generate-prescription', prescriptionData);
  return response.data;
};

// Generate Bill
export const generateBill = async (consultationFee, medications) => {
  const response = await api.post('/api/generate-bill', {
    consultation_fee: consultationFee,
    medications,
  });
  return response.data;
};

// Health Check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Read physical sensors (MAX30102 + MLX90614)
export const readSensors = async () => {
  try {
    const response = await api.get('/api/read-sensors');
    return response.data;
  } catch (error) {
    console.error("Error reading sensors:", error);
    throw error;
  }
};

export default api;
