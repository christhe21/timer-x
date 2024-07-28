'use client';

import React, { useState, useEffect, useRef } from 'react';

const Timer: React.FC = () => {
  const [inputMinutes, setInputMinutes] = useState<string>('0');
  const [inputSeconds, setInputSeconds] = useState<string>('0');
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    let timer: NodeJS.Timeout;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0 && isRunning) {
      setIsRunning(false);
      handleTimerEnd();
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setInputMinutes('0');
    setInputSeconds('0');
    stopSound();
  };

  const handleSetTime = () => {
    const minutes = parseInt(inputMinutes, 10);
    const seconds = parseInt(inputSeconds, 10);
    if ((!isNaN(minutes) && minutes >= 0) && (!isNaN(seconds) && seconds >= 0)) {
      setTime(minutes * 60 + seconds);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleTimerEnd = () => {
    // Send notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Time's up!");
    }

    // Play sound
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="text-center p-4 flex flex-col items-center space-y-4">
      <h1 className="text-6xl font-bold my-4 transition-transform transform hover:scale-110">
        {formatTime(time)}
      </h1>
      <div className="flex flex-col items-center space-y-4">
        <label>min🔻</label>
        <input
          type="number"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(e.target.value)}
          placeholder="Minutes"
          className="w-22 px-4 py-2 border rounded text-lg text-zinc-800"
        />
        <label>sec🔻</label>
        <input
          type="number"
          value={inputSeconds}
          onChange={(e) => setInputSeconds(e.target.value)}
          placeholder="Seconds"
          className="w-22 px-4 py-2 border rounded text-lg text-zinc-800"
        />
        <button 
          onClick={handleSetTime} 
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Set Timer
        </button>
      </div>
      <div className=" flex space-x-3 items-center ">
        <button 
          onClick={handleStart} 
          disabled={isRunning || time === 0}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Start
        </button>
        <button 
          onClick={handlePause} 
          disabled={!isRunning}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
        >
          Pause
        </button>
        <button 
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          Reset
        </button>
      </div>
      <audio ref={audioRef} src="/alarm.mp3" />
    </div>
  );
};

export default Timer;
