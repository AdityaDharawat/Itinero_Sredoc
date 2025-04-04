import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Feedback from './pages/Feedback';
import AuthPage from './pages/authpage';
import DeepfakeAudio from './pages/TripDetails';
import Navigation from './components/Navigation';
import ChatBot from './components/TravelAssistant';
import FloatingButton from './components/FloatingButton';
import { useState } from 'react';
import { DetectionProvider } from './contexts/DetectionContext';
import { AuthProvider } from './contexts/AuthContext';
import { saveAs } from 'file-saver';
import { Mp3Encoder } from 'lamejs';
import TripDetails from './pages/TripDetails';
import Planner from './pages/Planner';

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // Harry Potter inspired color palette
  const colors = {
    gryffindor: {
      primary: '#740001', // Dark red
      secondary: '#D3A625', // Gold
      accent: '#EEBA30' // Light gold
    },
    slytherin: {
      primary: '#1A472A', // Dark green
      secondary: '#5D5D5D', // Silver
      accent: '#AAAAAA' // Light silver
    },
    ravenclaw: {
      primary: '#0E1A40', // Dark blue
      secondary: '#946B2D', // Bronze
      accent: '#B08D57' // Light bronze
    },
    hufflepuff: {
      primary: '#372E29', // Dark yellow
      secondary: '#FFDB00', // Yellow
      accent: '#FFED86' // Light yellow
    },
    hogwarts: {
      dark: '#2C2C2C', // Castle stone
      light: '#F5F5F5', // Parchment
      accent: '#7F0909' // Signature red
    }
  };

  // Using Ravenclaw theme as base (can be changed to any house)
  const theme = colors.ravenclaw;

  const generateAudioFromText = async (text: string) => {
    if (!text.trim()) return;

    try {
      const sampleRate = 44100;
      const samples = new Int16Array(sampleRate * 2);
      const encoder = new Mp3Encoder(1, sampleRate, 128);

      const mp3Data: Uint8Array[] = [];
      let mp3Buffer = encoder.encodeBuffer(samples);
      if (mp3Buffer.length > 0) mp3Data.push(mp3Buffer);
      mp3Buffer = encoder.flush();
      if (mp3Buffer.length > 0) mp3Data.push(mp3Buffer);

      const mp3Blob = new Blob(mp3Data, { type: 'audio/mp3' });
      setAudioBlob(mp3Blob);
      saveAs(mp3Blob, 'generated_audio.mp3');
    } catch (error) {
      console.error('Error generating MP3 audio:', error);
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const toggleChatBot = () => {
    setChatOpen((prev) => !prev);
  };

  return (
    <Router>
      <AuthProvider>
        <DetectionProvider>
          <div 
            className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
            style={{
              // Adding subtle Harry Potter themed background
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%239C92AC\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'
            }}
          >
            <Navigation appName="Itinero" theme={theme} />
            <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} theme={theme} />
            
            <div className="fixed z-50 bottom-8 right-8 flex flex-col items-end gap-4">
              <FloatingButton
                onClick={toggleChatBot}
                bgColor={`${theme.primary}`}
                hoverColor={`${theme.accent}`}
                textColor="text-white"
                title={chatOpen ? "Close Owl Post" : "Open Owl Post"}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12l9-5-9-5-9 5 9 5z" />
                  </svg>
                }
              />
              {!chatOpen && (
                <>
                  <FloatingButton
                    onClick={() => generateAudioFromText('Sample text for audio generation')}
                    bgColor={`${theme.secondary}`}
                    hoverColor={`${theme.accent}`}
                    textColor="text-white"
                    title="Send Howler"
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    }
                  />
                  {audioBlob && (
                    <FloatingButton
                      onClick={playAudio}
                      bgColor={`${theme.accent}`}
                      hoverColor={`${theme.primary}`}
                      textColor="text-white"
                      title="Play Howler"
                      icon={
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-6.586-4.394A1 1 0 007 7.618v8.764a1 1 0 001.166.986l6.586-1.658a1 1 0 00.752-.986v-3.764a1 1 0 00-.752-.986z" />
                        </svg>
                      }
                    />
                  )}
                </>
              )}
            </div>

            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home theme={theme} />} />
                <Route path="/dashboard" element={<Dashboard theme={theme} />} />
                <Route path="/feedback" element={<Feedback theme={theme} />} />
                <Route path="/auth" element={<AuthPage theme={theme} />} />
                <Route path="/trip/:id" element={<DeepfakeAudio theme={theme} />} />
                <Route path="/trip-details" element={<TripDetails />} />
                <Route path="/planner" element={<Planner />} />
              </Routes>
            </AnimatePresence>
          </div>
        </DetectionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;