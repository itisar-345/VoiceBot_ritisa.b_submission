import { motion } from 'framer-motion';
import { useConversation } from '../context/ConversationContext';
import MessageItem from './MessageItem';
import { Mic } from 'lucide-react';

const MessageList = () => {
  const { messages, addMessage, processMessage } = useConversation();

  const handleFollowUpClick = (question) => {
    addMessage({ sender: 'user', content: question });
    processMessage(question);
  };

  return (
    <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {messages.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', padding: '2.5rem 1rem' }}
        >
          <div
            style={{
              width: '4rem',
              height: '4rem',
              margin: '0 auto 1.5rem',
              borderRadius: '9999px',
              backgroundColor: '#DBEAFE', // Tailwind's blue-100
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Mic size={32} color="#2563EB" /> {/* Tailwind's blue-600 */}
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 500, color: '#1F2937', marginBottom: '0.75rem' }}>
            Welcome to SalesAssist AI
          </h2>

          <p
            style={{
              color: '#4B5563',
              maxWidth: '28rem',
              margin: '0 auto',
              lineHeight: '1.625'
            }}
          >
            I'm your multilingual sales assistant. Ask me anything about our products or services using voice or text in your preferred language.
          </p>

          <div
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.5rem',
              maxWidth: '28rem',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          >
            {['Voice enabled', 'Multiple languages', 'Natural responses'].map((text, idx) => (
              <span
                key={idx}
                style={{
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#EFF6FF', // Tailwind's blue-50
                  color: '#2563EB',
                  borderRadius: '9999px',
                  fontSize: '0.875rem'
                }}
              >
                {text}
              </span>
            ))}
          </div>
        </motion.div>
      ) : (
        messages.map((message) => (
          <MessageItem 
            key={message.id} 
            message={message} 
            onFollowUpClick={handleFollowUpClick}
          />
        ))
      )}
    </div>
  );
};

export default MessageList;
