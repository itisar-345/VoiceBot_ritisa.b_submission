import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const SettingsPanel = ({ isOpen, onClose }) => {
  const { 
    voiceRate, 
    setVoiceRate, 
    voicePitch, 
    setVoicePitch,
    selectedVoice,
    availableVoices,
    setSelectedVoice,
    selectedLanguage,
    setSelectedLanguage,
    availableLanguages
  } = useSettings();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 40,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              height: '100%',
              width: '100%',
              maxWidth: 384, // approx max-w-md = 24rem
              backgroundColor: '#fff',
              boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
              zIndex: 50,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div style={{ padding: 24 }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: '#111827' /* gray-900 */ }}>
                  Settings
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close settings"
                  style={{
                    padding: 8,
                    borderRadius: '9999px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'} // gray-100
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <X style={{ width: 20, height: 20, color: '#4b5563' }} /> {/* gray-600 */}
                </button>
              </div>

              {/* Voice Settings Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 500, color: '#111827', marginBottom: 16 }}>
                    Voice Settings
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Language */}
                    <div>
                      <label
                        htmlFor="language-select"
                        style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }} // gray-700
                      >
                        Language
                      </label>
                      <select
                        id="language-select"
                        value={selectedLanguage.code}
                        onChange={(e) => {
                          const language = availableLanguages.find(l => l.code === e.target.value);
                          if (language) setSelectedLanguage(language);
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db', // gray-300
                          borderRadius: 6,
                          boxShadow: '0 0 0 1px transparent',
                          fontSize: 14,
                          outline: 'none',
                          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                        }}
                        onFocus={e => {
                          e.currentTarget.style.borderColor = '#3b82f6'; // blue-500
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)';
                        }}
                        onBlur={e => {
                          e.currentTarget.style.borderColor = '#d1d5db';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {availableLanguages.map((language) => (
                          <option key={language.code} value={language.code}>
                            {language.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Voice */}
                    <div>
                      <label
                        htmlFor="voice-select"
                        style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}
                      >
                        Voice
                      </label>
                      <select
                        id="voice-select"
                        value={selectedVoice?.voiceURI || ''}
                        onChange={(e) => {
                          const voice = availableVoices.find(v => v.voiceURI === e.target.value);
                          if (voice) setSelectedVoice(voice);
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: 6,
                          boxShadow: '0 0 0 1px transparent',
                          fontSize: 14,
                          outline: 'none',
                          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                        }}
                        onFocus={e => {
                          e.currentTarget.style.borderColor = '#3b82f6';
                          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)';
                        }}
                        onBlur={e => {
                          e.currentTarget.style.borderColor = '#d1d5db';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {availableVoices
                          .filter(voice => voice.lang.startsWith(selectedLanguage.code.split('-')[0]))
                          .map((voice) => (
                            <option key={voice.voiceURI} value={voice.voiceURI}>
                              {voice.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Rate */}
                    <div>
                      <label
                        htmlFor="rate-slider"
                        style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}
                      >
                        Speech Rate: {voiceRate.toFixed(1)}
                      </label>
                      <input
                        id="rate-slider"
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={voiceRate}
                        onChange={(e) => setVoiceRate(Number(e.target.value))}
                        style={{
                          width: '100%',
                          cursor: 'pointer',
                        }}
                      />
                    </div>

                    {/* Pitch */}
                    <div>
                      <label
                        htmlFor="pitch-slider"
                        style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}
                      >
                        Pitch: {voicePitch.toFixed(1)}
                      </label>
                      <input
                        id="pitch-slider"
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={voicePitch}
                        onChange={(e) => setVoicePitch(Number(e.target.value))}
                        style={{
                          width: '100%',
                          cursor: 'pointer',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div style={{ paddingTop: 16, borderTop: '1px solid #e5e7eb' /* gray-200 */ }}>
                  <h3 style={{ fontSize: 18, fontWeight: 500, color: '#111827', marginBottom: 16 }}>
                    About
                  </h3>
                  <p style={{ color: '#4b5563', fontSize: 14, lineHeight: 1.5 }}>
                    SalesAssist AI is a voice-enabled conversational assistant designed to help users
                    explore products and services with natural language interactions.
                  </p>
                  <p style={{ color: '#4b5563', fontSize: 14, marginTop: 8 }}>
                    Version 1.0.0
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel;
