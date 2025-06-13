import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

const DEFAULT_LANGUAGES = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'hi-IN', name: 'Hindi' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
];

export const SettingsProvider = ({ children }) => {
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(DEFAULT_LANGUAGES[0]);
  const [availableLanguages, setAvailableLanguages] = useState(DEFAULT_LANGUAGES);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const setVoiceList = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setAvailableVoices(voices);

          const defaultVoice =
            voices.find((voice) => voice.lang.startsWith(selectedLanguage.code)) || voices[0];
          setSelectedVoice(defaultVoice);

          const supportedLanguages = Array.from(
            new Set(voices.map((voice) => voice.lang.split('-')[0]))
          );

          setAvailableLanguages(
            DEFAULT_LANGUAGES.filter((lang) =>
              supportedLanguages.some((supported) => lang.code.startsWith(supported))
            )
          );
        }
      };

      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = setVoiceList;
      }

      setVoiceList();
    }
  }, [selectedLanguage.code]);

  return (
    <SettingsContext.Provider
      value={{
        voiceRate,
        setVoiceRate,
        voicePitch,
        setVoicePitch,
        availableVoices,
        selectedVoice,
        setSelectedVoice,
        selectedLanguage,
        setSelectedLanguage,
        availableLanguages,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
