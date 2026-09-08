import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const greetings = [
  "Hello",
  "Bonjour",
  "Hola",
  "Ciao",
  "こんにちは",
  "Namaste"
];

export function Intro({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < greetings.length - 1) {
      const timer = setTimeout(() => {
        setIndex(index + 1);
      }, index === 0 ? 800 : 250);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [index, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-dark text-light"
      initial={{ y: 0 }}
      exit={{ 
        y: "-100%", 
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="flex items-center gap-3"
        >
          <h1 className="text-4xl md:text-5xl font-display font-medium tracking-wide m-0">
            {greetings[index]}
          </h1>
          {index === greetings.length - 1 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-3 h-3 rounded-full bg-accent block"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
