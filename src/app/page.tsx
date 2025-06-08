'use client';
import Timer, { PomodoroSettingsType } from './timer';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [pomodoroMode, setPomodoroMode] = useState<boolean>(false);
  const initialPomodoroSettings: PomodoroSettingsType = {
    workDuration: 25 * 60,
    shortBreakDuration: 5 * 60,
    longBreakDuration: 15 * 60,
    cyclesBeforeLongBreak: 4,
  };
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettingsType>(initialPomodoroSettings);


  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <main className="flex flex-col min-h-screen">
      <div className="p-5 w-full items-center justify-between font-mono text-sm lg:flex shadow-lg shadow-cyan-500/50">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          
          <code className="font-mono font-bold">{currentTime}</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
         <h3 className="mb-3 text-2xl font-semibold px-5">timerX</h3>
        </div>
      </div>

      <div className="flex flex-col items-center flex-grow w-full px-4 py-8 visible opacity-100">
        {/* Pomodoro UI Elements */}
        <div className="mb-8">
          <button
            onClick={() => {
              setPomodoroMode(!pomodoroMode);
              // Optionally reset timer or settings when toggling mode
            }}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md transition-colors duration-150"
          >
            {pomodoroMode ? 'Switch to Regular Timer' : 'Switch to Pomodoro Timer'}
          </button>
        </div>

        {pomodoroMode && (
          <div className="p-6 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">Pomodoro Settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Work (min)</label>
                <input
                  type="number"
                  value={pomodoroSettings.workDuration / 60}
                  onChange={(e) => setPomodoroSettings(s => ({ ...s, workDuration: Math.max(1, parseInt(e.target.value) || 1) * 60 }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Short Break (min)</label>
                <input
                  type="number"
                  value={pomodoroSettings.shortBreakDuration / 60}
                  onChange={(e) => setPomodoroSettings(s => ({ ...s, shortBreakDuration: Math.max(1, parseInt(e.target.value) || 1) * 60 }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Long Break (min)</label>
                <input
                  type="number"
                  value={pomodoroSettings.longBreakDuration / 60}
                  onChange={(e) => setPomodoroSettings(s => ({ ...s, longBreakDuration: Math.max(1, parseInt(e.target.value) || 1) * 60 }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cycles for Long Break</label>
                <input
                  type="number"
                  value={pomodoroSettings.cyclesBeforeLongBreak}
                  onChange={(e) => setPomodoroSettings(s => ({ ...s, cyclesBeforeLongBreak: Math.max(1, parseInt(e.target.value) || 1) }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
            </div>
          </div>
        )}

        <div className="p-10 justify-center font-bold">
        <Timer
          key={pomodoroMode ? 'pomodoro' : 'regular'} // Force re-render on mode change
          pomodoroMode={pomodoroMode}
          pomodoroSettings={pomodoroSettings}
        />
        </div>
      </div>
    <footer className="font-bold text-lg text-slate-400 text-center py-5 mt-auto">Made with 🍕</footer>
    </main>
  );
}
