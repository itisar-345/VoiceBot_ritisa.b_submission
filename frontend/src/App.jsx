import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import SettingsPanel from './components/SettingsPanel';
import Sidebar from './components/Sidebar';
import { ConversationProvider } from './context/ConversationContext';
import { SettingsProvider } from './context/SettingsContext';
import { SpeechProvider } from './context/SpeechContext';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // API health check
    fetch('/api/health')
      .then(res => {
        if (!res.ok) throw new Error('Backend not connected');
        return res.json();
      })
      .then(data => console.log('Backend connected:', data))
      .catch(err => console.error('Backend connection error:', err));
  }, []);

  return (
    <SettingsProvider>
      <SpeechProvider>

        <ConversationProvider>
          <div style={styles.appContainer}>
            <Header
              onSettingsClick={() => setIsSettingsOpen(true)}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
            <div style={styles.mainWrapper}>
              <div
                style={{
                  overflow: 'hidden',
                  transition: 'width 0.3s ease',
                  width: isSidebarOpen ? '256px' : '0',
                  // Ensure sidebar styles are correctly applied
                  ...styles.sidebar,
                }}
              >
                <Sidebar />
              </div>

              <main
                style={{
                  flex: 1,
                }}
              >
                <ChatInterface />
              </main>
            </div>

            <SettingsPanel
              isOpen={isSettingsOpen}
              onClose={() => setIsSettingsOpen(false)}
            />
          </div>
        </ConversationProvider>

      </SpeechProvider>
    </SettingsProvider>
  );
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
  },
  mainWrapper: {
    display: 'flex',
    flex: 1,
    position: 'relative',
  },
  sidebar: {
    overflow: 'hidden',
    transition: 'width 0.3s ease',
  },
  icon: {
    width: '20px',
    height: '20px',
    color: '#4b5563',
  },
  chatArea: {
    flex: 1,
  },
};
export default App;
