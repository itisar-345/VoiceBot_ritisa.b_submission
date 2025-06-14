export const speak = (text, language) => {
  const utterance = new SpeechSynthesisUtterance(text);

  // Map language to appropriate voice
  if (language === 'en') {
    utterance.lang = 'en-US';
  } else if (language === 'hi' || language === 'hinglish') {
    utterance.lang = 'hi-IN'; // Use Hindi voice for Hinglish
  }

  window.speechSynthesis.speak(utterance);
};