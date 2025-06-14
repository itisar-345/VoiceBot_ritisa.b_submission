import { useRef, useEffect } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import { useConversation } from '../context/ConversationContext';
import { useSettings } from '../context/SettingsContext';
import { useSpeech } from '../context/SpeechContext';
import { Mic, MicOff } from 'lucide-react';

const ChatInterface = () => {
  const messagesEndRef = useRef(null);
  const { messages } = useConversation();
  const { isListening, startListening, stopListening, speechSupported } = useSpeech();
  const { preferredLanguage } = useSettings();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="messages-container">
        <div className="messages-content">
          <MessageList />
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="input-container">
        <InputArea preferredLanguage={preferredLanguage} />
      </div>
    </div>
  );
};

export default ChatInterface;