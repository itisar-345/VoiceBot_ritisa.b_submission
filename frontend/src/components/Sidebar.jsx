import { MessageSquare, Star, StarOff, Trash2 } from 'lucide-react';
import { useConversation } from '../context/ConversationContext';
import { formatRelativeTime } from '../utils/timeUtils';

const Sidebar = () => {
  const {
    conversations,
    currentConversationId,
    loadConversation,
    rateConversation,
    deleteConversation,
  } = useConversation();

  return (
    <div
      style={{
        width: '100%',
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        backgroundColor: '#F9FAFB', // Tailwind's gray-50
        borderRight: '1px solid #E5E7EB', // Tailwind's gray-200
      }}
    >
      <div style={{ padding: '1rem' }}>
        <h2
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#6B7280', // Tailwind's gray-500
            marginBottom: '0.75rem',
          }}
        >
          Chat History
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {conversations.map((conversation) => {
            const isActive = currentConversationId === conversation.id;
            return (
              <div
                key={conversation.id}
                onClick={() => loadConversation(conversation.id)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  backgroundColor: isActive ? '#EFF6FF' : 'transparent', // blue-50
                  color: isActive ? '#1D4ED8' : '#374151', // blue-700 / gray-700
                  transition: 'background-color 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = '#F3F4F6'; // gray-100
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <MessageSquare style={{ width: 16, height: 16, marginTop: 4, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          margin: 0,
                        }}
                      >
                        {conversation.title}
                      </p>
                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: '#6B7280',
                          marginTop: '0.125rem',
                          margin: 0,
                        }}
                      >
                        {formatRelativeTime(conversation.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      flexShrink: 0,
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        rateConversation(conversation.id, conversation.score === 1 ? 0 : 1);
                      }}
                      style={{
                        padding: '0.25rem',
                        color: conversation.score === 1 ? '#FACC15' : '#9CA3AF', // yellow-500 or gray-400
                        cursor: 'pointer',
                      }}
                      title={conversation.score === 1 ? 'Unstar conversation' : 'Star conversation'}
                    >
                      {conversation.score === 1 ? (
                        <Star style={{ width: 16, height: 16, fill: '#FACC15' }} />
                      ) : (
                        <StarOff style={{ width: 16, height: 16 }} />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conversation.id);
                      }}
                      style={{
                        padding: '0.25rem',
                        color: '#9CA3AF',
                        cursor: 'pointer',
                      }}
                      title="Delete conversation"
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')} // red-500
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                    >
                      <Trash2 style={{ width: 16, height: 16 }} />
                    </button>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    marginTop: '0.25rem',
                  }}
                >
                  {conversation.messageCount} messages
                </p>
              </div>
            );
          })}

          {conversations.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                paddingTop: '2rem',
                paddingBottom: '2rem',
                color: '#6B7280',
              }}
            >
              <p style={{ fontSize: '0.875rem' }}>No conversations yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
