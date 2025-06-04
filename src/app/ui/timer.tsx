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
    <div className="space-y-4">
      <p>
        Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </p>
      {message && <p className="text-green-500">{message}</p>}
      <div className="flex justify-between gap-4">
        <button 
        className="cursor-pointer w-full bg-secondary-400 text-white p-2 rounded-2xl drop-shadow-bold" 
        onClick={() => setIsRunning(true)} disabled={isRunning || time === 0}
        >
        Start
        </button>
        <button
        className="cursor-pointer w-full bg-primary-100 text-primary-400 p-2 rounded-2xl drop-shadow-regular"
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
      
    </div>
  );
}