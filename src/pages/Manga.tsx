import Footer from '@/components/Footer'
import Header from '@/components/Header'
import React, { useState, useEffect } from 'react'

// Updated text constant
const FULL_TEXT = "Coming Soon......" 
// Define the delay (in milliseconds) between each character
const TYPING_SPEED = 150; 
// Define the pause (in milliseconds) after the text is fully typed before it starts over
const PAUSE_DURATION = 1500; // 1.5 seconds

const Manga = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true); 
  
  useEffect(() => {
    if (isTyping) {
      let index = 0;
      
      // Phase 1: Typing
      const typingInterval = setInterval(() => {
        setDisplayedText((currentText) => {
          if (index < FULL_TEXT.length) {
            // Append the next character
            return currentText + FULL_TEXT.charAt(index++);
          } else {
            // Text is fully typed. Stop typing, start the pause phase.
            clearInterval(typingInterval);
            setIsTyping(false);
            return currentText; 
          }
        });
      }, TYPING_SPEED);

      return () => clearInterval(typingInterval);
      
    } else {
      // Phase 2: Pause and Reset
      // Use a timeout to wait, then clear the text and set isTyping back to true to restart.
      const pauseTimeout = setTimeout(() => {
        setDisplayedText(''); // Clear the text
        setIsTyping(true);    // Restart the typing phase
      }, PAUSE_DURATION);

      return () => clearTimeout(pauseTimeout);
    }
  }, [isTyping]); // Rerun this effect whenever isTyping changes

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Centers content vertically and horizontally */}
      <section className="flex-grow flex items-center justify-center">
        <h3 className='p-4 text-red-600 text-3xl font-bold'>
          {displayedText}
          
          {/* Blinking cursor effect */}
          <span className="inline-block w-1 bg-white ml-1 animate-pulse h-8 align-middle"></span>
        </h3>
      </section>

      <Footer />
    </div>
  )
}

export default Manga;
