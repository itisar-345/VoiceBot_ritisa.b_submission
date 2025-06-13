import React from 'react';
import { useSpeech } from './context/SpeechContext';

const SpeechTest = () => {
  const {
    isListening,
    startListening,
    stopListening,
    transcript,
    resetTranscript,
    speak,
    speechSupported,
  } = useSpeech();

  return (
    <div style={{ padding: 20 }}>
      <h1>🎙️ Speech Recognition Test</h1>
      <p><strong>Speech Supported:</strong> {speechSupported ? 'Yes' : 'No'}</p>
      <p><strong>Listening:</strong> {isListening ? 'Yes' : 'No'}</p>
      <p><strong>Transcript:</strong> {transcript}</p>

      <button onClick={startListening}>Start Listening</button>
      <button onClick={stopListening}>Stop Listening</button>
      <button onClick={resetTranscript}>Reset</button>
      <button onClick={() => speak(transcript)}>Speak Out</button>
    </div>
  );
};

export default SpeechTest;
