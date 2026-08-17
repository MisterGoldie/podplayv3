"use client";

import { useCallback, useEffect, useRef } from "react";
import { GameState } from "~/types/game";

type BgmTrack = "menu" | "game" | "off";

function createAudio(src: string, loop = false, volume = 0.3) {
  const audio = new Audio(src);
  audio.loop = loop;
  audio.volume = volume;
  audio.preload = "auto";
  return audio;
}

async function tryPlay(audio: HTMLAudioElement | null) {
  if (!audio) return;
  try {
    await audio.play();
  } catch {
    // Autoplay can be blocked until a gesture; ignore.
  }
}

function pause(audio: HTMLAudioElement | null, reset = false) {
  if (!audio) return;
  audio.pause();
  if (reset) {
    audio.currentTime = 0;
  }
}

export function useGameSounds(
  isMuted: boolean,
  gameState: GameState,
  gameOver: boolean
) {
  const unlockedRef = useRef(false);
  const menuRef = useRef<HTMLAudioElement | null>(null);
  const gameRef = useRef<HTMLAudioElement | null>(null);
  const clickRef = useRef<HTMLAudioElement | null>(null);
  const countdownRef = useRef<HTMLAudioElement | null>(null);
  const sfxRef = useRef<HTMLAudioElement | null>(null);
  const mutedRef = useRef(isMuted);
  const gameOverRef = useRef(gameOver);
  const trackRef = useRef<BgmTrack>("off");

  mutedRef.current = isMuted;
  gameOverRef.current = gameOver;
  trackRef.current =
    isMuted || !unlockedRef.current
      ? "off"
      : gameState === "menu"
        ? "menu"
        : gameOver
          ? "off"
          : "game";

  const syncBgm = useCallback(() => {
    const track = trackRef.current;
    const menu = menuRef.current;
    const game = gameRef.current;

    if (track === "menu") {
      pause(game, true);
      void tryPlay(menu);
      return;
    }

    if (track === "game") {
      pause(menu, true);
      void tryPlay(game);
      return;
    }

    pause(menu, false);
    pause(game, gameOverRef.current);
  }, []);

  useEffect(() => {
    menuRef.current = createAudio("/sounds/openingtheme.mp3", true, 0.3);
    gameRef.current = createAudio("/sounds/jingle.mp3", true, 0.3);
    clickRef.current = createAudio("/sounds/click.mp3", false, 0.55);
    countdownRef.current = createAudio("/sounds/countdown.mp3", false, 0.5);

    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      syncBgm();
    };

    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      pause(menuRef.current, true);
      pause(gameRef.current, true);
      pause(clickRef.current, true);
      pause(countdownRef.current, true);
      pause(sfxRef.current, true);
    };
  }, [syncBgm]);

  useEffect(() => {
    if (isMuted) {
      pause(countdownRef.current, true);
      pause(sfxRef.current, true);
    }
    syncBgm();
  }, [gameOver, gameState, isMuted, syncBgm]);

  const playSfx = useCallback((src: string) => {
    if (mutedRef.current) return;
    pause(sfxRef.current, true);
    const audio = new Audio(src);
    audio.volume = 0.5;
    sfxRef.current = audio;
    void tryPlay(audio);
  }, []);

  const playClick = useCallback(() => {
    if (mutedRef.current) return;
    const click = clickRef.current;
    if (!click) return;
    click.currentTime = 0;
    void tryPlay(click);
  }, []);

  const stopCountdownSound = useCallback(() => {
    pause(countdownRef.current, true);
  }, []);

  const playCountdownSound = useCallback(() => {
    if (mutedRef.current) return;
    const countdown = countdownRef.current;
    if (!countdown) return;
    countdown.currentTime = 0;
    void tryPlay(countdown);
  }, []);

  return {
    playClick,
    playWinning: () => playSfx("/sounds/winning.mp3"),
    playLosing: () => playSfx("/sounds/losing.mp3"),
    playDrawing: () => playSfx("/sounds/drawing.mp3"),
    playCountdownSound,
    stopCountdownSound,
    stopGameJingle: () => pause(gameRef.current, true),
    stopOpeningTheme: () => pause(menuRef.current, true),
    playGameJingle: () => {
      if (mutedRef.current) return;
      void tryPlay(gameRef.current);
    },
    playOpeningTheme: () => {
      if (mutedRef.current) return;
      void tryPlay(menuRef.current);
    },
  };
}
