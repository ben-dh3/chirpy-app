"use client";
import { useState, useEffect } from "react";
import { updatePetProgress } from "../lib/actions";

export default function Timer({ userId, dailyGoal }: { userId: string; dailyGoal: number }) {
  const [time, setTime] = useState(dailyGoal * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && time > 0) {
      interval = setInterval(() => setTime((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const completedMinutes = Math.floor((dailyGoal * 60 - time) / 60);

  return (
    <div>
      <p>
        Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </p>
      {message && <p className="text-green-500">{message}</p>}
      <button onClick={() => setIsRunning(true)} disabled={isRunning || time === 0}>
        Start
      </button>
      <button
        onClick={async () => {
          setIsRunning(false);
          if (completedMinutes > 0) {
            const result = await updatePetProgress(userId, completedMinutes);
            if (result.success && result.goalCompleted) {
              setMessage("Daily Goal Completed!");
            }
          }
          setTime(dailyGoal * 60); 
          setTimeout(() => setMessage(null), 3000);
        }}
        disabled={!isRunning}
      >
        Stop
      </button>
    </div>
  );
}