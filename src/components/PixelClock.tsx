import React, { useState, useEffect } from 'react';

// Pixel Style Clock Component
export const PixelClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    return time.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="font-mono text-white text-lg tracking-tighter">
      {formatTime(time).split('').map((char, i) => (
        <span 
          key={i} 
          className={`
            inline-block w-5 h-6 mx-0.5 text-center 
            bg-gray-900 border-2 border-gray-700
            ${char === ':' ? 'bg-transparent border-transparent' : ''}
          `}
        >
          {char}
        </span>
      ))}
    </div>
  );
};