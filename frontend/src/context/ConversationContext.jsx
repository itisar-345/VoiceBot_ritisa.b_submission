import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSpeech } from './SpeechContext';

const ConversationContext = createContext(undefined);

const STORAGE_KEY = 'voice_assistant_conversations';
const CONVERSATION_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};

export const ConversationProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [allConversations, setAllConversations] = useState({});
  const { speak } = useSpeech();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      const now = Date.now();

      const validConversations = (data.conversations || [])
        .filter(conv => now - new Date(conv.timestamp).getTime() < CONVERSATION_EXPIRY)
        .map(conv => ({
          ...conv,
          timestamp: new Date(conv.timestamp),
          score: conv.score || 0
        }));

      setConversations(validConversations);

      const validAllConversations = {};
      Object.entries(data.allConversations || {}).forEach(([id, conv]) => {
        if (now - new Date(conv.timestamp).getTime() < CONVERSATION_EXPIRY) {
          validAllConversations[id] = {
            ...conv,
            timestamp: new Date(conv.timestamp),
            score: conv.score || 0,
            messages: (conv.messages || []).map(msg => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          };
        }
      });

      setAllConversations(validAllConversations);

      if (data.currentConversationId && validAllConversations[data.currentConversationId]) {
        setCurrentConversationId(data.currentConversationId);
        setMessages(validAllConversations[data.currentConversationId].messages || []);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      conversations,
      currentConversationId,
      allConversations
    }));
  }, [conversations, currentConversationId, allConversations]);

  const addMessage = useCallback((message) => {
    const newMessage = {
      ...message,
      id: uuidv4(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);

    if (!currentConversationId) {
      const newId = uuidv4();
      const title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');

      setCurrentConversationId(newId);
      setConversations(prev => [{
        id: newId,
        title,
        timestamp: new Date(),
        messageCount: 1,
        score: 0
      }, ...prev]);

      setAllConversations(prev => ({
        ...prev,
        [newId]: {
          id: newId,
          title,
          messages: [newMessage],
          timestamp: new Date(),
          score: 0
        }
      }));
    } else {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === currentConversationId
            ? { ...conv, messageCount: conv.messageCount + 1, timestamp: new Date() }
            : conv
        )
      );

      setAllConversations(prev => ({
        ...prev,
        [currentConversationId]: {
          ...prev[currentConversationId],
          messages: [...(prev[currentConversationId].messages || []), newMessage],
          timestamp: new Date()
        }
      }));
    }

    return newMessage;
  }, [currentConversationId]);

  const processMessage = useCallback(async (content) => {
    const pendingMessageId = uuidv4();
    const pendingMessage = {
      id: pendingMessageId,
      sender: 'assistant',
      content: '',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, pendingMessage]);

    if (currentConversationId) {
      setAllConversations(prev => ({
        ...prev,
        [currentConversationId]: {
          ...prev[currentConversationId],
          messages: [...(prev[currentConversationId].messages || []), pendingMessage]
        }
      }));
    }

    try {
      // Replace direct processQuery call with API call
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: content,
          messages: messages.filter(m => m.sender === 'user').map(m => m.content)
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const finalMessage = {
        ...pendingMessage,
        content: data.response
      };

      setMessages(prev => prev.map(msg => msg.id === pendingMessageId ? finalMessage : msg));

      if (currentConversationId) {
        setAllConversations(prev => ({
          ...prev,
          [currentConversationId]: {
            ...prev[currentConversationId],
            messages: (prev[currentConversationId].messages || []).map(msg =>
              msg.id === pendingMessageId ? finalMessage : msg
            ),
            timestamp: new Date()
          }
        }));
      }

      speak(data.response);
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = "I apologize, but I'm having trouble processing your request. Could you try again?";
      const errorFinalMessage = {
        ...pendingMessage,
        content: errorMessage
      };

      setMessages(prev => prev.map(msg => msg.id === pendingMessageId ? errorFinalMessage : msg));

      if (currentConversationId) {
        setAllConversations(prev => ({
          ...prev,
          [currentConversationId]: {
            ...prev[currentConversationId],
            messages: (prev[currentConversationId].messages || []).map(msg =>
              msg.id === pendingMessageId ? errorFinalMessage : msg
            )
          }
        }));
      }

      speak(errorMessage);
    }
  }, [messages, speak, currentConversationId]);

  const loadConversation = useCallback((id) => {
    const conversation = allConversations[id];
    if (conversation) {
      setCurrentConversationId(id);
      setMessages(conversation.messages || []);

      setConversations(prev =>
        prev.map(conv => conv.id === id ? { ...conv, timestamp: new Date() } : conv)
      );

      setAllConversations(prev => ({
        ...prev,
        [id]: { ...prev[id], timestamp: new Date() }
      }));
    }
  }, [allConversations]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(null);
  }, []);

  const rateConversation = useCallback((id, score) => {
    setConversations(prev => prev.map(conv =>
      conv.id === id ? { ...conv, score } : conv
    ));

    setAllConversations(prev => ({
      ...prev,
      [id]: { ...prev[id], score }
    }));
  }, []);

  const deleteConversation = useCallback((id) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    setAllConversations(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });

    if (currentConversationId === id) {
      setCurrentConversationId(null);
      setMessages([]);
    }
  }, [currentConversationId]);

  return (
    <ConversationContext.Provider
      value={{
        messages,
        addMessage,
        processMessage,
        clearMessages,
        conversations,
        currentConversationId,
        setCurrentConversationId,
        rateConversation,
        deleteConversation,
        loadConversation
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
