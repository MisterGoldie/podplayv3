"use client";

import { useEffect, useState } from "react";

interface UseGameTimerOptions {
  isActive: boolean;
  onTimeUp: () => void;
  onStopCountdown?: () => void;
}

export function useGameTimer({
  isActive,
  onTimeUp,
  onStopCountdown,
}: UseGameTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          onStopCountdown?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, onTimeUp, onStopCountdown]);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(15);
    }
  }, [isActive]);

  return { timeLeft, setTimeLeft };
}
