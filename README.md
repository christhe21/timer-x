# TimerX

A simple and easy-to-use timer application built with Next.js, React, and Tailwind CSS.

Live Preview: https://timer-x-kappa.vercel.app/

## Features (Updated)

- Set custom timer durations (minutes and seconds).
- Start, pause, and reset the timer.
- Audible alarm when the timer finishes.
- Browser notification when the timer finishes.
- Real-time clock display.
- **Pomodoro Timer Mode:**
    - Configurable work, short break, and long break durations.
    - Configurable number of work cycles before a long break.
    - Automatic cycling through work and break periods.
    - Display of current Pomodoro phase (Work, Short Break, Long Break).
    - Count of completed Pomodoros.

## Using the Pomodoro Timer

1.  **Switch to Pomodoro Mode:** Click the "Switch to Pomodoro Timer" button.
2.  **Configure Durations (Optional):** Adjust the default durations for work sessions, short breaks, and long breaks, as well as the number of work cycles before a long break, using the settings panel that appears in Pomodoro mode.
3.  **Start the Timer:** Click the "Start" button to begin your first work session.
4.  The timer will automatically cycle through work and break periods, playing an alarm and sending a notification at the end of each period.
5.  You can pause, reset, or switch back to the regular timer mode at any time. Resetting in Pomodoro mode will bring you back to the start of a work cycle with your current settings.

## Getting Started

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd timer-x
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for server-side rendering and static site generation.
- [React](https://reactjs.org/) - JavaScript library for building user interfaces.
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript.
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or find any bugs, please open an issue or submit a pull request.

Made with 🍕
