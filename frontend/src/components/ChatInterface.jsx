import { useRef, useEffect } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { useConversation } from '../context/ConversationContext';
import { useSpeech } from '../context/SpeechContext';
import { Mic, MicOff } from 'lucide-react';

const ChatInterface = () => {
  const messagesEndRef = useRef(null);
  const { messages } = useConversation();
  const { isListening, startListening, stopListening, speechSupported } = useSpeech();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div
      style={{
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 16px',
        }}
      >
        <div
          style={{
            maxWidth: '768px',
            margin: '0 auto',
          }}
        >
          <MessageList />
          <div ref={messagesEndRef} />
        </div>
      </div>

      {speechSupported && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '128px',
            transform: 'translateX(-50%)',
          }}
        >
          <button
            onClick={() => (isListening ? stopListening() : startListening())}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
            style={{
              padding: '24px',
              borderRadius: '9999px',
              boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isListening ? '#ef4444' : '#3b82f6',
              color: '#ffffff',
              transform: isListening ? 'scale(1.1)' : 'none',
            }}
          >
            {isListening ? <MicOff size={32} /> : <Mic size={32} />}
          </button>
        </div>
      )}

      <div
        style={{
          position: 'sticky',
          bottom: 0,
          width: '100%',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <div
          style={{
            maxWidth: '768px',
            margin: '0 auto',
          }}
        >
          <InputArea />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
