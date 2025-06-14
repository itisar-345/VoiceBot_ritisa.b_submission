import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2 } from 'lucide-react';
import '../styles/slider.css';

const SlidingSidebar = ({
  sessions,
  activeSessionIndex,
  setActiveSessionIndex,
  onNewChat,
  deleteSession,
  setSessions,
  isVisible,
  setIsVisible,
}) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editName, setEditName] = useState('');

  const handleRename = (index) => {
    setEditingIndex(index);
    setEditName(sessions[index][0]?.message || `Chat ${index + 1}`);
  };

  const handleRenameSubmit = (index) => {
    if (!editName.trim()) return;
    const updatedSessions = [...sessions];
    if (updatedSessions[index].length === 0) {
      updatedSessions[index] = [{ type: 'user', message: editName }];
    } else {
      updatedSessions[index][0] = {
        ...updatedSessions[index][0],
        message: editName,
      };
    }
    setSessions(updatedSessions);
    setEditingIndex(null);
  };

  return (
    <div className="sidebar-container">
      <button
        className="sidebar-toggle-btn"
        onClick={() => setIsVisible((prev) => !prev)}
        aria-label={isVisible ? 'Close sidebar' : 'Open sidebar'}
      >
        {isVisible ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
      <aside className={`sidebar ${isVisible ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Chats</h2>
        </div>
        <div className="session-list-container">
          <div className="session-list">
            <button className="new-chat-btn" onClick={onNewChat}>
              <Plus size={16} /> New Chat
            </button>
            {sessions.map((session, index) => (
              <div
                key={index}
                className={`session-item ${activeSessionIndex === index ? 'active' : ''}`}
                onClick={() => setActiveSessionIndex(index)}
              >
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => handleRenameSubmit(index)}
                    onKeyPress={(e) => e.key === 'Enter' && handleRenameSubmit(index)}
                    autoFocus
                  />
                ) : (
                  <>
                    <span>{session[0]?.message || `Chat ${index + 1}`}</span>
                    <div className="session-actions">
                      <button
                        className="session-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRename(index);
                        }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="session-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(index);
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SlidingSidebar;
