import { motion } from 'framer-motion';

const TypingIndicator = () => {
  const dotStyle = {
    width: 8,  // 2 * 4 px (Tailwind 2 means 0.5rem = 8px)
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
    opacity: 0.6,
  };

  return (
    <motion.div 
      style={{ display: 'flex', alignItems: 'center', gap: 4 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          style={dotStyle}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: dot * 0.2,
          }}
        />
      ))}
    </motion.div>
  );
};

export default TypingIndicator;
