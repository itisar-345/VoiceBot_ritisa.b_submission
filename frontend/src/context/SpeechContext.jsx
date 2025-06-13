import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSettings } from './SettingsContext';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SpeechContext = createContext(undefined);

export const useSpeech = () => {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error('useSpeech must be used within a SpeechProvider');
  }
  return context;
};

export const SpeechProvider = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const recognitionRef = useRef(null);
  const { voiceRate, voicePitch, selectedVoice, selectedLanguage } = useSettings();

  const {
    transcript: fallbackTranscript,
    listening: fallbackListening,
    resetTranscript: resetFallbackTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      try {
        recognitionRef.current = new SpeechRecognitionAPI();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = selectedLanguage.code;

        recognitionRef.current.onresult = (event) => {
          const resultTranscript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join('');
          setTranscript(resultTranscript);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        setSpeechSupported(true);
        setUseFallback(false);
      } catch (err) {
        console.warn('Fallback to react-speech-recognition due to error:', err);
        setUseFallback(true);
      }
    } else {
      if (browserSupportsSpeechRecognition) {
        console.warn('Using fallback: react-speech-recognition');
        setUseFallback(true);
        setSpeechSupported(true);
      } else {
        console.warn('Speech recognition not supported.');
        setSpeechSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage, browserSupportsSpeechRecognition]);

  const startListening = useCallback(() => {
    if (useFallback) {
      SpeechRecognition.startListening({ continuous: true, language: selectedLanguage.code });
    } else if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage.code;
      recognitionRef.current.start();
    }
    setIsListening(true);
  }, [selectedLanguage, useFallback]);

  const stopListening = useCallback(() => {
    if (useFallback) {
      SpeechRecognition.stopListening();
    } else if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, [useFallback]);

  const resetTranscript = useCallback(() => {
    if (useFallback) {
      resetFallbackTranscript();
    } else {
      setTranscript('');
    }
  }, [useFallback, resetFallbackTranscript]);

  const speak = useCallback(
    (text) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = voiceRate;
        utterance.pitch = voicePitch;
        utterance.lang = selectedLanguage.code;

        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        window.speechSynthesis.speak(utterance);
      }
    },
    [voiceRate, voicePitch, selectedVoice, selectedLanguage]
  );

  return (
    <SpeechContext.Provider
      value={{
        isListening: useFallback ? fallbackListening : isListening,
        startListening,
        stopListening,
        transcript: useFallback ? fallbackTranscript : transcript,
        resetTranscript,
        speak,
        speechSupported,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};
