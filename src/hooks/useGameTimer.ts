"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GAME_SECONDS = 15;

interface UseGameTimerOptions {
  isActive: boolean;
  onTimeUp: () => void;
}

export function useGameTimer({ isActive, onTimeUp }: UseGameTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const onTimeUpRef = useRef(onTimeUp);
  const firedRef = useRef(false);

  onTimeUpRef.current = onTimeUp;

  const resetTimer = useCallback(() => {
    firedRef.current = false;
    setTimeLeft(GAME_SECONDS);
  }, []);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const id = window.setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => window.clearInterval(id);
  }, [isActive]);

  useEffect(() => {
    if (!isActive || timeLeft !== 0 || firedRef.current) {
      return;
    }
    firedRef.current = true;
    onTimeUpRef.current();
  }, [isActive, timeLeft]);

  return { timeLeft, resetTimer };
}
