import React, { useState, useEffect } from 'react';
import { FaClock, FaHourglassHalf } from 'react-icons/fa';

const Timer = ({ duration = 600, onTimeUp, isRunning }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center justify-center space-x-2 bg-yellow-100 p-4 rounded-lg shadow-lg animate-pulse">
      {isRunning ? (
        <FaClock className="text-blue-500 w-8 h-8 animate-spin" />
      ) : (
        <FaHourglassHalf className="text-red-500 w-8 h-8" />
      )}
      <div className="text-3xl font-bold text-blue-600">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
};

export default Timer;