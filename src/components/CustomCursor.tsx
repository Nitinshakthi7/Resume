import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device has a touch screen
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsMobile(true);
      return;
    }

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Find closest interactable element
      const interactable = target.closest('a, button, [data-cursor]');
      
      if (interactable) {
        setIsHovering(true);
        const text = interactable.getAttribute('data-cursor');
        if (text) {
          setHoverText(text);
        } else {
          setHoverText('');
        }
      } else {
        setIsHovering(false);
        setHoverText('');
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (isMobile) return null;

  return (
    <motion.div
      className={cn(
        "fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center rounded-full mix-blend-difference bg-light",
        isHovering && !hoverText ? "scale-150 opacity-50" : "scale-100 opacity-100"
      )}
      animate={{
        x: mousePosition.x - (hoverText ? 40 : 10),
        y: mousePosition.y - (hoverText ? 40 : 10),
        width: hoverText ? 80 : 20,
        height: hoverText ? 80 : 20,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      {hoverText && (
        <span className="text-dark font-sans text-xs font-bold tracking-widest pointer-events-none text-center">
          {hoverText}
        </span>
      )}
    </motion.div>
  );
}
