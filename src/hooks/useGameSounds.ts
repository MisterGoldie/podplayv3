"use client";

import { useEffect, useMemo } from "react";
import { SoundManager } from "~/components/game/SoundManager";
import { GameState } from "~/types/game";

function safeCall(fn: (() => void) | undefined) {
  return () => {
    try {
      fn?.();
    } catch (error) {
      console.error("Error in sound handler:", error);
    }
  };
}

export function useGameSounds(isMuted: boolean, gameState: GameState) {
  const sounds = SoundManager({ isMuted, gameState });

  useEffect(() => {
    if (document.documentElement.hasAttribute("data-interaction-listeners")) {
      return;
    }

    document.documentElement.setAttribute("data-interaction-listeners", "true");

    const handleInteraction = () => {
      document.documentElement.classList.add("user-interacted");
    };

    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      document.documentElement.removeAttribute("data-interaction-listeners");
    };
  }, []);

  return useMemo(
    () => ({
      playClick: safeCall(sounds.playClick),
      playWinning: safeCall(sounds.playWinning),
      playLosing: safeCall(sounds.playLosing),
      playDrawing: safeCall(sounds.playDrawing),
      playCountdownSound: safeCall(sounds.playCountdownSound),
      stopCountdownSound: safeCall(sounds.stopCountdownSound),
      stopGameJingle: safeCall(sounds.stopGameJingle),
      stopOpeningTheme: safeCall(sounds.stopOpeningTheme),
      playGameJingle: safeCall(sounds.playGameJingle),
      playOpeningTheme: safeCall(sounds.playOpeningTheme),
    }),
    [
      sounds.playClick,
      sounds.playWinning,
      sounds.playLosing,
      sounds.playDrawing,
      sounds.playCountdownSound,
      sounds.stopCountdownSound,
      sounds.stopGameJingle,
      sounds.stopOpeningTheme,
      sounds.playGameJingle,
      sounds.playOpeningTheme,
    ]
  );
}
