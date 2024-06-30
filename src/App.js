import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [intervalSeconds, setIntervalSeconds] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timeout;
    if (timerRunning && timeLeft !== null) {
      timeout = setTimeout(() => {
        setTimeLeft(prevTimeLeft => {
          if (prevTimeLeft > 0) {
            const newTimeLeft = prevTimeLeft - 1;
            if (intervalSeconds && newTimeLeft % intervalSeconds === 0) {
              playAlert();
            }
            return newTimeLeft;
          } else {
            setTimerRunning(false);
            playAlert();
            return 0;
          }
        });
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [timerRunning, timeLeft, intervalSeconds]);

  const startTimer = () => {
    if (!minutes && !seconds) {
      alert('Please enter a valid time.');
      return;
    }
    const totalSeconds = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
    setTimeLeft(totalSeconds);
    setTimerRunning(true);
  };

  const resetTimer = () => {
    setTimeLeft(null);
    setMinutes('');
    setSeconds('');
     setIntervalSeconds('');
    setTimerRunning(false);
  };

  const playAlert = () => {
    const audio = new Audio(process.env.PUBLIC_URL + '/buzzer.mp3'); // Ensure the file is in the public folder
    audio.currentTime = 0; // Start from the beginning
    audio.play();

    setTimeout(() => {
      audio.pause();
      if (timeLeft > 0) {
        setTimerRunning(true);
      }
    }, 3000); // Play for 3 seconds
    setTimerRunning(false);
  };

  const formattedDateTime = currentDateTime.toLocaleString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });

  return (
    <div className="App">
      <header className="header">
        <nav className="navbar">
          <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Countdown Timer Page</h1>
          <div className="current-time">{formattedDateTime}</div>
        </nav>
      </header>
      <div className="background-image">
        <div className="timer-container">
          <h1 id="timer">{timeLeft !== null ? `${Math.floor(timeLeft / 60)
            .toString()
            .padStart(2, '0')}:${(timeLeft % 60)
            .toString()
            .padStart(2, '0')}` : '00:00'}
          </h1>
          <div className="controls">
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="Minutes"
            />
            <input
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
              placeholder="Seconds"
            />
            <input
              type="number"
              value={intervalSeconds}
              onChange={(e) => setIntervalSeconds(e.target.value)}
              placeholder="Interval(s)"
            />
            <br/>
            <button onClick={startTimer}>Start</button>
            &nbsp;&nbsp;
            <button onClick={resetTimer}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
