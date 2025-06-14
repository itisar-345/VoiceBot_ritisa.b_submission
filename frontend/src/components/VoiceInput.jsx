import React, { useRef, useState } from 'react';
import { Mic, Send } from 'lucide-react';
import '../styles/voice.css';

const VoiceInput = ({ onAudioSubmit, onTextSubmit }) => {
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [text, setText] = useState('');
  const [transcript, setTranscript] = useState('');
  const chunks = useRef([]);

  const startTranscription = () => {
    let simulatedTranscript = '';
    const words = ['Hello', 'this', 'is', 'a', 'test', 'voice', 'message'];
    let wordIndex = 0;

    const interval = setInterval(() => {
      if (!recording) {
        clearInterval(interval);
        return;
      }
      if (wordIndex < words.length) {
        simulatedTranscript += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
        setTranscript(simulatedTranscript);
        wordIndex++;
      } else {
        clearInterval(interval);
      }
    }, 500);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      setRecording(true);
      setTranscript('');

      mediaRecorderRef.current.ondataavailable = (e) => chunks.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunks.current, { type: 'audio/webm' });
        chunks.current = [];
        onAudioSubmit(audioBlob, transcript);
      };

      mediaRecorderRef.current.start();
      startTranscription();
      setTimeout(() => stopRecording(), 5000);
    } catch (err) {
      console.error('Microphone access error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleMicClick = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onTextSubmit(text.trim());
      setText('');
    }
  };

  return (
    <div className="input-wrapper">
      <form onSubmit={handleTextSubmit} className="search-bar-form">
        <div className="search-bar-container">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="search-bar"
          />
          <button
            type="button"
            className={`mic-button ${recording ? 'recording' : ''}`}
            onClick={handleMicClick}
            aria-label={recording ? 'Stop recording' : 'Start recording'}
          >
            <Mic size={20} />
          </button>
          <button type="submit" className="send-button">
            <Send size={20} />
          </button>
        </div>
      </form>
      {recording && <p className="mic-status">Listening... {transcript}</p>}
    </div>
  );
};

export default VoiceInput;