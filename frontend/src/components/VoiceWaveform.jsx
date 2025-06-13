import { motion } from 'framer-motion';

const VoiceWaveform = () => {
  const bars = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    // Fixed heights for a nice waveform effect
    height: 10 + i * 8, // [10, 18, 26, 34, 42]
  }));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {bars.map((bar) => (
        <motion.div
          key={bar.id}
          style={{
            width: 4,
            backgroundColor: '#3b82f6', // Tailwind's blue-500
            borderRadius: 9999,
            height: 5,
          }}
          initial={{ height: 5 }}
          animate={{ height: [5, bar.height, 5] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: bar.id * 0.15,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default VoiceWaveform;
