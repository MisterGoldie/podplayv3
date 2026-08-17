"use client";

import { useCallback, useEffect } from "react";

interface SoundManagerProps {
  isMuted: boolean;
  gameState: "menu" | "game";
  onSoundStateChange?: () => void;
}

let menuAudio: HTMLAudioElement | null = null;
let gameAudio: HTMLAudioElement | null = null;
let clickAudio: HTMLAudioElement | null = null;
let isMenuPlaying = false;
let isGamePlaying = false;

function getMenuAudio() {
  if (typeof window === "undefined") return null;
  if (!menuAudio) {
    menuAudio = new Audio("/sounds/openingtheme.mp3");
    menuAudio.loop = true;
    menuAudio.volume = 0.3;
  }
  return menuAudio;
}

function getGameAudio() {
  if (typeof window === "undefined") return null;
  if (!gameAudio) {
    gameAudio = new Audio("/sounds/jingle.mp3");
    gameAudio.loop = true;
    gameAudio.volume = 0.3;
  }
  return gameAudio;
}

function getClickAudio() {
  if (typeof window === "undefined") return null;
  if (!clickAudio) {
    clickAudio = new Audio("/sounds/click.mp3");
    clickAudio.volume = 1.0;
  }
  return clickAudio;
}

function stopAudio(audio: HTMLAudioElement | null) {
  if (!audio || audio.paused) return;
  audio.pause();
  audio.currentTime = 0;
}

export function SoundManager({ isMuted, gameState }: SoundManagerProps) {
  useEffect(() => {
    getMenuAudio();
    getGameAudio();
    getClickAudio();
  }, []);

  useEffect(() => {
    const menu = getMenuAudio();
    const game = getGameAudio();

    if (isMuted) {
      stopAudio(menu);
      stopAudio(game);
      isMenuPlaying = false;
      isGamePlaying = false;
      return;
    }

    if (gameState === "menu" && !isMenuPlaying) {
      stopAudio(game);
      isGamePlaying = false;
      if (menu) {
        menu.currentTime = 0;
        menu
          .play()
          .then(() => {
            isMenuPlaying = true;
          })
          .catch((err) => {
            console.warn("Menu audio failed:", err);
          });
      }
    } else if (gameState === "game" && !isGamePlaying) {
      stopAudio(menu);
      isMenuPlaying = false;
      if (game) {
        game.currentTime = 0;
        game
          .play()
          .then(() => {
            isGamePlaying = true;
          })
          .catch((err) => {
            console.warn("Game audio failed:", err);
          });
      }
    }
  }, [isMuted, gameState]);

  const playClick = useCallback(() => {
    const click = getClickAudio();
    if (isMuted || !click) return;
    click.currentTime = 0;
    click.play().catch((err) => console.warn("Click sound failed:", err));
  }, [isMuted]);

  const playWinning = useCallback(() => {
    if (isMuted) return;
    const audio = new Audio("/sounds/winning.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => console.warn("Winning sound failed:", err));
  }, [isMuted]);

  const playLosing = useCallback(() => {
    if (isMuted) return;
    const audio = new Audio("/sounds/losing.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => console.warn("Losing sound failed:", err));
  }, [isMuted]);

  const playDrawing = useCallback(() => {
    if (isMuted) return;
    const audio = new Audio("/sounds/drawing.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => console.warn("Drawing sound failed:", err));
  }, [isMuted]);

  const playCountdownSound = useCallback(() => {
    if (isMuted) return;
    const audio = new Audio("/sounds/countdown.mp3");
    audio.volume = 0.5;
    audio.play().catch((err) => console.warn("Countdown sound failed:", err));
  }, [isMuted]);

  const stopCountdownSound = useCallback(() => {}, []);

  const stopGameJingle = useCallback(() => {
    stopAudio(getGameAudio());
    isGamePlaying = false;
  }, []);

  const stopOpeningTheme = useCallback(() => {
    stopAudio(getMenuAudio());
    isMenuPlaying = false;
  }, []);

  const playGameJingle = useCallback(() => {
    const game = getGameAudio();
    if (isMuted || !game) return;
    game.currentTime = 0;
    game
      .play()
      .then(() => {
        isGamePlaying = true;
      })
      .catch((err) => console.warn("Game jingle failed:", err));
  }, [isMuted]);

  const playOpeningTheme = useCallback(() => {
    const menu = getMenuAudio();
    if (isMuted || !menu) return;
    menu.currentTime = 0;
    menu
      .play()
      .then(() => {
        isMenuPlaying = true;
      })
      .catch((err) => console.warn("Opening theme failed:", err));
  }, [isMuted]);

  const playGameOver = useCallback(() => {}, []);

  return {
    playClick,
    playWinning,
    playLosing,
    playDrawing,
    playGameOver,
    playCountdownSound,
    stopCountdownSound,
    stopGameJingle,
    stopOpeningTheme,
    playGameJingle,
    playOpeningTheme,
  };
}
