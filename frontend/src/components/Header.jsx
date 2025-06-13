import { Settings, PlusCircle, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useConversation } from '../context/ConversationContext';

const Header = ({ onSettingsClick, isSidebarOpen, setIsSidebarOpen }) => {
  const { clearMessages } = useConversation();

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.leftGroup}>
          {/* Sidebar Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            style={styles.toggleButton}
          >
            {isSidebarOpen ? (
              <PanelLeftClose style={styles.icon} />
            ) : (
              <PanelLeft style={styles.icon} />
            )}
          </button>

          <div style={styles.leftSection}>
            <div style={styles.logoCircle}>
              <span style={styles.logoText}>AI</span>
            </div>
            <div style={styles.titleContainer}>
              <h1 style={styles.title}>SalesAssist AI</h1>
              <p style={styles.subtitle}>Your multilingual sales companion</p>
            </div>
          </div>
        </div>

        <div style={styles.rightSection}>
          <button onClick={clearMessages} aria-label="Start a new chat" style={styles.newChatButton}>
            <PlusCircle style={styles.plusIcon} />
            <span style={styles.newChatText}>New Chat</span>
          </button>

          <button onClick={onSettingsClick} aria-label="Settings" style={styles.settingsButton}>
            <Settings style={styles.settingsIcon} />
          </button>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    background: 'linear-gradient(to right, #2563eb, #1e40af)',
    boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.7), 0 4px 6px -4px rgba(37, 99, 235, 0.7)',
    position: 'relative',
    zIndex: 10,
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  toggleButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '0.75rem',
    color: 'white',
    transition: 'color 0.2s ease',
  },
  icon: {
    width: '24px',
    height: '24px',
    color: 'white',
  },
  leftSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '9999px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    fontWeight: 600,
    fontSize: '1.125rem',
  },
  logoText: {
    fontWeight: 600,
    fontSize: '1.125rem',
    userSelect: 'none',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'white',
    margin: 0,
    userSelect: 'none',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#bfdbfe',
    margin: 0,
    userSelect: 'none',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  newChatButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    padding: '0.375rem 0.75rem',
    fontSize: '0.875rem',
    color: 'white',
    backgroundColor: 'transparent',
    borderRadius: '9999px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    border: 'none',
  },
  plusIcon: {
    width: '16px',
    height: '16px',
  },
  newChatText: {
    display: 'inline',
  },
  settingsButton: {
    padding: '0.5rem',
    borderRadius: '9999px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    border: 'none',
    color: 'white',
  },
  settingsIcon: {
    width: '20px',
    height: '20px',
  },
};

export default Header;
