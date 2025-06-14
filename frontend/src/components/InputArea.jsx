import { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { useConversation } from '../context/ConversationContext';
import { useSpeech } from '../context/SpeechContext';
import { useSettings } from '../context/SettingsContext';
import VoiceWaveform from './VoiceWaveform';

const InputArea = () => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const { addMessage, processMessage } = useConversation();
  const { selectedLanguage } = useSettings();
  const { isListening, transcript, resetTranscript, startListening, stopListening } = useSpeech();

  // Update input when transcript changes
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
    }
  }, [transcript]);

  // Focus input when not listening
  useEffect(() => {
    if (!isListening && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isListening]);

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (!input.trim()) return;

    addMessage({ 
      sender: 'user', 
      content: input.trim(),
      language: selectedLanguage.code // Add language info to message
    });
    
    processMessage(input.trim(), selectedLanguage.code); // Pass language to processor
    setInput('');
    resetTranscript();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(selectedLanguage.code); // Start listening with selected language
      setInput(''); // Clear input when starting to listen
    }
  };

  return (
    <div style={{ padding: '16px', position: 'relative' }}>
      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              selectedLanguage.code === 'hi' 
                ? 'संदेश टाइप करें या बोलें...' 
                : `Type or speak in ${selectedLanguage.name}...`
            }
            rows={1}
            style={{
              width: '100%',
              padding: '12px 96px 12px 16px',
              borderRadius: '16px',
              border: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              resize: 'none',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              transition: 'box-shadow 0.2s ease',
              minHeight: '60px',
              paddingRight: '96px',
            }}
          />

          {/* Voice input button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            style={{
              position: 'absolute',
              right: '56px',
              bottom: '8px',
              padding: '10px',
              borderRadius: '16px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isListening ? '#ef4444' : '#3b82f6',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            <Mic size={20} />
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={!input.trim()}
            style={{
              position: 'absolute',
              right: '8px',
              bottom: '8px',
              padding: '10px',
              borderRadius: '16px',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              backgroundColor: input.trim() ? '#3b82f6' : '#f3f4f6',
              color: input.trim() ? 'white' : '#9ca3af',
              boxShadow: input.trim()
                ? '0 4px 6px -1px rgba(59, 130, 246, 0.5), 0 2px 4px -1px rgba(59, 130, 246, 0.06)'
                : 'none',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            <Send size={20} />
          </button>
        </div>

        {/* Voice waveform indicator */}
        {isListening && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              color: '#2563eb',
              marginTop: '8px',
            }}
          >
            <VoiceWaveform />
            <p style={{ fontSize: '14px', fontWeight: '500' }}>
              {selectedLanguage.code === 'hi' 
                ? 'सुन रहा हूँ...' 
                : `Listening in ${selectedLanguage.name}...`}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default InputArea;