"use client";

import { ReactNode } from "react";
import AudioController from "~/components/game/AudioController";

interface GameFrameProps {
  children: ReactNode;
  isMuted: boolean;
  onMuteToggle: () => void;
  showMenuBackground: boolean;
  timeLeft?: number;
  showTimer?: boolean;
}

export function GameFrame({
  children,
  isMuted,
  onMuteToggle,
  showMenuBackground,
  timeLeft,
  showTimer,
}: GameFrameProps) {
  return (
    <div className="bg-[#1A0B2E] w-full min-h-screen flex items-center justify-center">
      <div className="w-[424px] h-[695px] mx-auto relative bg-[#1A0B2E] overflow-hidden">
        {showMenuBackground && (
          <div className="absolute inset-0 opacity-20 flex items-center justify-center">
            <div className="w-[400px] h-[400px] relative">
              <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400/50 via-purple-400 to-purple-400/50" />
              <div className="absolute right-1/3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400/50 via-purple-400 to-purple-400/50" />
              <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400/50 via-purple-400 to-purple-400/50" />
              <div className="absolute bottom-1/3 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400/50 via-purple-400 to-purple-400/50" />
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                {Array(9)
                  .fill(null)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center text-purple-400/30 text-6xl font-bold"
                    >
                      {i % 2 === 0 ? "X" : "O"}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        <AudioController isMuted={isMuted} onMuteToggle={onMuteToggle} />

        {showTimer && (
          <div className="absolute top-4 right-4 text-white text-sm">
            {timeLeft}s
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}

export function GameLoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-900">
      <div className="w-16 h-16 border-4 border-purple-500 border-t-white rounded-full animate-spin mb-4" />
      <p className="text-white text-xl">Loading POD Play...</p>
    </div>
  );
}
