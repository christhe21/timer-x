'use client';
import Timer from './timer';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <main >
      <div className="p-5 w-full items-center justify-between font-mono text-sm lg:flex shadow-lg shadow-cyan-500/50">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300S bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          
          <code className="font-mono font-bold">{currentTime}</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
         <h3 className="mb-3 text-2xl font-semibold px-5">timerX</h3>
        </div>
      </div>

      <div className="p-10 justify-center font-bold">
      <Timer />
      </div>
    <footer className='font-bold text-lg text-slate-400 text-center'>Made with 🍕</footer>
    </main>
  );
}
