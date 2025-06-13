import { motion } from 'framer-motion';
import { formatRelativeTime } from '../utils/timeUtils';
import TypingIndicator from './TypingIndicator';

const MessageItem = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 24,
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          order: isUser ? 1 : 2,
        }}
      >
        <div
          style={{
            borderRadius: 24,
            padding: '12px 16px',
            backgroundColor: isUser ? '#3b82f6' : '#fff',
            color: isUser ? '#fff' : '#1f2937',
            borderTopRightRadius: isUser ? 0 : 24,
            borderTopLeftRadius: isUser ? 24 : 0,
            boxShadow: isUser
              ? 'none'
              : '0 1px 3px rgba(0,0,0,0.1)',
            border: isUser ? 'none' : '1px solid #f3f4f6',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}
        >
          {message.content ? (
            <p style={{ margin: 0 }}>{message.content}</p>
          ) : (
            <TypingIndicator />
          )}
        </div>

        <div
          style={{
            fontSize: 12,
            color: '#6b7280', // gray-500
            marginTop: 4,
            textAlign: isUser ? 'right' : 'left',
          }}
        >
          {formatRelativeTime(message.timestamp)}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageItem;
