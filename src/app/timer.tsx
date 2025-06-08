export interface PomodoroSettingsType {
  workDuration: number; // in seconds
  shortBreakDuration: number; // in seconds
  longBreakDuration: number; // in seconds
  cyclesBeforeLongBreak: number;
}

'use client';

import React, { useState, useEffect, useRef } from 'react';

interface TimerProps {
  pomodoroMode: boolean;
  pomodoroSettings: PomodoroSettingsType;
}

const Timer: React.FC<TimerProps> = ({ pomodoroMode, pomodoroSettings }) => {
  const [inputMinutes, setInputMinutes] = useState<string>('0');
  const [inputSeconds, setInputSeconds] = useState<string>('0');
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Pomodoro specific states (internal to Timer component)
  const [pomodoroCycle, setPomodoroCycle] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [pomodorosCompleted, setPomodorosCompleted] = useState<number>(0);

  // Effect to correctly initialize/reset Pomodoro state when mode changes or on initial load in Pomodoro mode
  useEffect(() => {
    if (pomodoroMode) {
      setTime(pomodoroSettings.workDuration);
      setPomodoroCycle('work');
      setPomodorosCompleted(0);
      setIsRunning(false); // Start paused
    } else {
      // If switching from Pomodoro to regular, reset time and stop.
      // If already in regular, this key change from page.tsx should handle reset if needed.
      setTime(0);
      setInputMinutes('0');
      setInputSeconds('0');
      setIsRunning(false);
    }
  }, [pomodoroMode, pomodoroSettings.workDuration]); // pomodoroSettings.workDuration is a stable part of the object prop

  // Effect to update displayed time if settings for the current PAUSED cycle are changed by the user
  useEffect(() => {
    if (pomodoroMode && !isRunning) {
      if (pomodoroCycle === 'work') {
        setTime(pomodoroSettings.workDuration);
      } else if (pomodoroCycle === 'shortBreak') {
        setTime(pomodoroSettings.shortBreakDuration);
      } else if (pomodoroCycle === 'longBreak') {
        setTime(pomodoroSettings.longBreakDuration);
      }
    }
  }, [pomodoroMode, isRunning, pomodoroCycle, pomodoroSettings]);


  // Main timer countdown and Pomodoro cycle logic
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    let timer: NodeJS.Timeout;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0 && isRunning) {
      handleTimerEnd();
      if (pomodoroMode) {
        let nextCycleInternal: 'work' | 'shortBreak' | 'longBreak' = pomodoroCycle;
        let nextTimeInternal: number;
        let currentPomodorosCompleted = pomodorosCompleted;

        if (pomodoroCycle === 'work') {
          currentPomodorosCompleted++;
          setPomodorosCompleted(currentPomodorosCompleted);
          if (currentPomodorosCompleted > 0 && currentPomodorosCompleted % pomodoroSettings.cyclesBeforeLongBreak === 0) {
            nextCycleInternal = 'longBreak';
            nextTimeInternal = pomodoroSettings.longBreakDuration;
          } else {
            nextCycleInternal = 'shortBreak';
            nextTimeInternal = pomodoroSettings.shortBreakDuration;
          }
        } else { // shortBreak or longBreak
          nextCycleInternal = 'work';
          nextTimeInternal = pomodoroSettings.workDuration;
        }
        setPomodoroCycle(nextCycleInternal);
        setTime(nextTimeInternal);
        setIsRunning(true); // Auto-start next cycle
      } else {
        setIsRunning(false);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, time, pomodoroMode, pomodoroSettings, pomodoroCycle, pomodorosCompleted]);

  const handleStart = () => {
    // In Pomodoro mode, time is set by effects or cycle transitions.
    // In regular mode, if time is 0, it shouldn't start. This is handled by button disabled state.
    // If time is 0 and pomodoroMode is true, the effect for pomodoroMode change already set the initial work duration.
    if (pomodoroMode && time === 0 && pomodoroCycle === 'work' && pomodorosCompleted === 0) {
       setTime(pomodoroSettings.workDuration);
    }
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    stopSound();
    if (pomodoroMode) {
      setTime(pomodoroSettings.workDuration);
      setPomodoroCycle('work');
      setPomodorosCompleted(0);
    } else {
      setTime(0);
      setInputMinutes('0');
      setInputSeconds('0');
    }
  };

  const handleSetTime = () => {
    if (pomodoroMode) return; // Should be disabled, but as a safeguard
    const minutes = parseInt(inputMinutes, 10);
    const seconds = parseInt(inputSeconds, 10);
    if ((!isNaN(minutes) && minutes >= 0) && (!isNaN(seconds) && seconds >= 0)) {
      const newTime = minutes * 60 + seconds;
      setTime(newTime);
      if (newTime === 0) {
        setIsRunning(false);
      }
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleTimerEnd = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Time's up!");
    }
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
      <h1 className="text-9xl font-bold my-4 transition-transform transform hover:scale-110">
        {formatTime(time)}
      </h1>

      {pomodoroMode && (
        <div className="my-3 text-center">
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">Mode: Pomodoro</p>
          <p className="text-lg capitalize text-gray-600 dark:text-gray-300">Current Phase: {pomodoroCycle.replace('Break', ' Break')}</p>
          <p className="text-lg text-gray-600 dark:text-gray-300">Pomodoros Completed: {pomodorosCompleted}</p>
        </div>
      )}

      <div className="flex flex-col items-center space-y-4">
        <label htmlFor="inputMinutes" className="text-sm font-medium text-gray-700 dark:text-gray-300">Minutes</label>
        <input
          id="inputMinutes"
          type="number"
          value={inputMinutes}
          onChange={(e) => setInputMinutes(e.target.value)}
          placeholder="Minutes"
          disabled={pomodoroMode}
          className="w-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-lg text-zinc-800 dark:text-zinc-200 bg-white dark:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <label htmlFor="inputSeconds" className="text-sm font-medium text-gray-700 dark:text-gray-300">Seconds</label>
        <input
          id="inputSeconds"
          type="number"
          value={inputSeconds}
          onChange={(e) => setInputSeconds(e.target.value)}
          placeholder="Seconds"
          disabled={pomodoroMode}
          className="w-32 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-lg text-zinc-800 dark:text-zinc-200 bg-white dark:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
        />
        <button
          onClick={handleSetTime}
          className="px-6 py-3 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={pomodoroMode}
        >
          Set Custom Timer
        </button>
      </div>
      <div className=" flex space-x-3 items-center ">
        <button
          onClick={handleStart}
          disabled={isRunning || (time === 0 && !pomodoroMode) || (pomodoroMode && isRunning)}
          className="px-4 py-2 bg-green-700 text-white rounded disabled:opacity-50"
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
