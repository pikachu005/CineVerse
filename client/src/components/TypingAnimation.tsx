import { useState, useEffect } from 'react';

interface TypingAnimationProps {
  text: string;
  className?: string;
}

export function TypingAnimation({ text, className = '' }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const typeText = () => {
      if (isTyping) {
        if (displayedText.length < text.length) {
          setDisplayedText(text.slice(0, displayedText.length + 1));
          timeoutId = setTimeout(typeText, 50 + Math.random() * 50); // 50-100ms per character
        } else {
          // Hold for 5 seconds before deleting
          timeoutId = setTimeout(() => setIsTyping(false), 5000);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(displayedText.slice(0, -1));
          timeoutId = setTimeout(typeText, 30 + Math.random() * 30); // 30-60ms per deletion
        } else {
          // Start typing again
          setIsTyping(true);
          timeoutId = setTimeout(typeText, 500); // Brief pause before retyping
        }
      }
    };

    timeoutId = setTimeout(typeText, 100);
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [displayedText, isTyping, text]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={className}>
      {displayedText}
      <span 
        className={`inline-block w-0.5 h-[1em] bg-current ml-1 transition-opacity duration-100 ${
          showCursor ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />
    </span>
  );
}