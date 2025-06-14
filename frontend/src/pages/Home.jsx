import React, { useState, useContext, useEffect, useRef } from 'react';
import VoiceInput from '../components/VoiceInput';
import ThemeToggle from '../components/ThemeToggle';
import SlidingSidebar from '../components/SlidingSidebar';
import { speak } from '../utils/speak';
import axios from 'axios';
import { AuthContext } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { LogOut, Mic } from 'lucide-react';
import '../styles/app.css';
import '../styles/slider.css';

const Home = () => {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([[]]);
  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const [dark, setDark] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [language, setLanguage] = useState('en');
  const chatMessagesRef = useRef(null);
  const [translations, setTranslations] = useState({});

  if (!context) {
    console.error('AuthContext is undefined. Ensure Home is wrapped in AuthProvider.');
    return <div>Error: Auth context not available</div>;
  }

  const { user, logout } = context;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
    document.body.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark, user, navigate]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [sessions, activeSessionIndex]);

  const messages = sessions[activeSessionIndex] || [];

  const detectHinglish = (text) => {
    const hindiWords = ['bhai', 'yaar', 'kya', 'hai', 'nahi', 'acha', 'thik', 'bol', 'dekh'];
    const words = text.toLowerCase().split(/\s+/);
    const hasHindi = words.some((word) => hindiWords.includes(word));
    const hasEnglish = words.some((word) => /^[a-zA-Z]+$/.test(word));
    return hasHindi && hasEnglish;
  };

  const translateHinglish = (text, targetLanguage) => {
    if (!text || typeof text !== 'string') {
      return text;
    }

    if (targetLanguage === 'en') {
      return text
        .replace(/bhai/gi, 'brother')
        .replace(/yaar/gi, 'friend')
        .replace(/kya hai/gi, 'what is')
        .replace(/nahi/gi, 'no')
        .replace(/acha/gi, 'good')
        .replace(/thik/gi, 'okay');
    } else if (targetLanguage === 'hi') {
      return text
        .replace(/brother/gi, 'भाई')
        .replace(/friend/gi, 'यार')
        .replace(/what is/gi, 'क्या है')
        .replace(/no/gi, 'नहीं')
        .replace(/good/gi, 'अच्छा')
        .replace(/okay/gi, 'ठीक');
    }

    return text;
  };

  const handleTranslate = (msgIndex, text, targetLanguage) => {
    const key = `${activeSessionIndex}-${msgIndex}`;
    const translatedText = translateHinglish(text, targetLanguage);
    setTranslations((prev) => ({
      ...prev,
      [key]: translatedText,
    }));
  };

  const addMessageToSession = (msg) => {
    setSessions((prev) => {
      const newSessions = [...prev];
      newSessions[activeSessionIndex] = [...(newSessions[activeSessionIndex] || []), msg];
      return newSessions;
    });
  };

  const handleAudioSubmit = async (audioBlob, userTranscript) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const formData = new FormData();
    formData.append('audio', audioBlob, 'voice-input.webm');
    formData.append('language', language);

    try {
      addMessageToSession({
        type: 'user',
        message: userTranscript || ' Voice message...',
        audioUrl,
        transcript: userTranscript || 'Transcription not available',
      });

      const res = await axios.post('/api/ai/voice', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      let { reply, language: responseLanguage, transcript: botTranscript } = res.data;

      if (detectHinglish(reply)) {
        responseLanguage = 'hinglish';
      }

      addMessageToSession({
        type: 'ai',
        message: reply,
        transcript: botTranscript || 'Transcription not available',
      });
      speak(reply, responseLanguage);
    } catch (error) {
      console.error('Voice error:', error);
      addMessageToSession({ type: 'ai', message: '⚠️ Could not process voice input.' });
    }
  };

  const handleTextSubmit = async (text) => {
    if (!text.trim()) return;
    addMessageToSession({ type: 'user', message: text });

    let effectiveLanguage = language;
    if (detectHinglish(text)) {
      effectiveLanguage = 'hinglish';
    }

    try {
      const res = await axios.post('/api/ai/text', {
        text,
        language: effectiveLanguage,
      });
      let { reply, language: responseLanguage } = res.data;

      if (effectiveLanguage === 'hinglish') {
        responseLanguage = 'hinglish';
      }

      addMessageToSession({ type: 'ai', message: reply });
      speak(reply, responseLanguage);
    } catch (error) {
      console.error('Text error:', error);
      addMessageToSession({ type: 'ai', message: '⚠️ Could not process your message.' });
    }
  };

  const handleNewChat = () => {
    setSessions((prev) => {
      const newSessions = [[], ...prev];
      setActiveSessionIndex(0);
      return newSessions;
    });
  };

  const deleteSession = (index) => {
    setSessions((prev) => {
      const newSessions = [...prev];
      newSessions.splice(index, 1);
      setActiveSessionIndex((prevIdx) =>
        prevIdx >= newSessions.length ? newSessions.length - 1 : prevIdx
      );
      return newSessions.length === 0 ? [[]] : newSessions;
    });
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`app-container ${dark ? 'dark' : 'light'}`}>
      <main className="chat-main">
        <SlidingSidebar
          sessions={sessions}
          activeSessionIndex={activeSessionIndex}
          setActiveSessionIndex={setActiveSessionIndex}
          onNewChat={handleNewChat}
          deleteSession={deleteSession}
          setSessions={setSessions}
          isVisible={isSidebarVisible}
          setIsVisible={setIsSidebarVisible}
        />
        <div
          className={`chat-content ${isSidebarVisible ? 'content-shifted' : 'content-full'}`}
        >
          <header className="chat-header">
            <h1 className="header-title">SalesAssist Voice AI</h1>
            <div className="header-toggle">
              <div className="language-selector">
                <select
                  className="language-dropdown"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                </select>
                <span className="language-symbol">🌐</span>
              </div>
              <ThemeToggle dark={dark} setDark={setDark} />
              <div className="auth-buttons">
                {user && (
                  <button className="auth-button" onClick={handleLogout}>
                    <LogOut size={18} />
                  </button>
                )}
              </div>
            </div>
          </header>
          <section className="chat-messages" ref={chatMessagesRef}>
            {messages.length === 0 && (
              <p className="empty-chat">💬 Start a conversation...</p>
            )}
            {messages.map((msg, idx) => {
              const key = `${activeSessionIndex}-${idx}`;
              const translatedText = translations[key];
              const isHinglish = detectHinglish(msg.message);
              return (
                <div key={idx} className={`chat-message ${msg.type}`}>
                  <div>
                    {msg.audioUrl ? (
                      <>
                        <Mic size={16} /> <span>{msg.message}</span>
                        <audio controls src={msg.audioUrl} />
                      </>
                    ) : (
                      <span>{msg.message}</span>
                    )}
                    {msg.transcript && (
                      <span className="transcript">Transcript: {msg.transcript}</span>
                    )}
                    {translatedText && (
                      <span className="transcript">Translated: {translatedText}</span>
                    )}
                    {isHinglish && !translatedText && (
                      <div>
                        <button
                          className="translate-btn"
                          onClick={() => handleTranslate(idx, msg.message, 'en')}
                        >
                          Translate to English
                        </button>
                        <button
                          className="translate-btn"
                          onClick={() => handleTranslate(idx, msg.message, 'hi')}
                        >
                          Translate to Hindi
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
          <footer className="chat-input">
            <VoiceInput onAudioSubmit={handleAudioSubmit} onTextSubmit={handleTextSubmit} />
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Home;