'use client';

import React, { useState, useEffect, useRef } from 'react';

const Timer: React.FC = () => {
  const [inputMinutes, setInputMinutes] = useState<string>('0');
  const [inputSeconds, setInputSeconds] = useState<string>('0');
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pomodoro specific states
  const [pomodoroMode, setPomodoroMode] = useState<boolean>(false); // To toggle between regular and pomodoro mode
  const [pomodoroCycle, setPomodoroCycle] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [pomodorosCompleted, setPomodorosCompleted] = useState<number>(0);
  const [pomodoroSettings, setPomodoroSettings] = useState({
    workDuration: 25 * 60, // 25 minutes in seconds
    shortBreakDuration: 5 * 60, // 5 minutes in seconds
    longBreakDuration: 15 * 60, // 15 minutes in seconds
    cyclesBeforeLongBreak: 4,
  });

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
      handleTimerEnd(); // Call this regardless of mode.
      if (pomodoroMode) {
        if (pomodoroCycle === 'work') {
          const newPomodorosCompleted = pomodorosCompleted + 1;
          setPomodorosCompleted(newPomodorosCompleted);
          if (newPomodorosCompleted % pomodoroSettings.cyclesBeforeLongBreak === 0) {
            setPomodoroCycle('longBreak');
            setTime(pomodoroSettings.longBreakDuration);
          } else {
            setPomodoroCycle('shortBreak');
            setTime(pomodoroSettings.shortBreakDuration);
          }
        } else { // 'shortBreak' or 'longBreak'
          setPomodoroCycle('work');
          setTime(pomodoroSettings.workDuration);
        }
        setIsRunning(true); // Auto-start next cycle
      } else {
        setIsRunning(false);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, time, pomodoroMode, pomodoroCycle, pomodorosCompleted, pomodoroSettings]);

  const handleStart = () => {
    if (pomodoroMode && time === 0) {
      setTime(pomodoroSettings.workDuration);
    }
    setIsRunning(true);
  };
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    stopSound();
    setInputMinutes('0');
    setInputSeconds('0');
    setPomodorosCompleted(0);
    setPomodoroCycle('work');
    if (pomodoroMode) {
      setTime(pomodoroSettings.workDuration);
    } else {
      setTime(0);
    }
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
          className="px-6 py-2 bg-blue-700 text-white rounded "
        >
          Set Timer
        </button>
      </div>
      <div className=" flex space-x-3 items-center ">
        <button 
          onClick={handleStart} 
          disabled={isRunning || time === 0}
          className="px-4 py-2 bg-green-700 text-white rounded  disabled:opacity-50"
        >
          Start
        </button>
        <button 
          onClick={handlePause} 
          disabled={!isRunning}
          className="px-4 py-2 bg-yellow-700 text-white rounded disabled:opacity-50"
        >
          Pause
        </button>
        <button 
          onClick={handleReset}
          className="px-4 py-2 bg-red-700 text-white rounded "
        >
          Reset
        </button>
      </div>
      <audio ref={audioRef} src="/alarm.mp3" />
    </div>
  );
};

export default Timer;
