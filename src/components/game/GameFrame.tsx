"use client";

import { ReactNode } from "react";
import AudioController from "~/components/game/AudioController";

type SafeAreaInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

interface GameFrameProps {
  children: ReactNode;
  isMuted: boolean;
  onMuteToggle: () => void;
  showMenuBackground: boolean;
  timeLeft?: number;
  showTimer?: boolean;
  insets?: SafeAreaInsets;
}

export function GameFrame({
  children,
  isMuted,
  onMuteToggle,
  showMenuBackground,
  timeLeft,
  showTimer,
  insets,
}: GameFrameProps) {
  return (
    <div className="bg-[#140822] w-full h-[100dvh] flex items-stretch justify-center overflow-hidden">
      <div
        className="w-full max-w-[424px] h-full flex flex-col bg-[#140822]"
        style={{
          paddingTop: insets?.top ?? 0,
          paddingBottom: insets?.bottom ?? 0,
          paddingLeft: insets?.left ?? 0,
          paddingRight: insets?.right ?? 0,
        }}
      >
        <div className="relative flex-1 min-h-0 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(192,38,211,0.22),transparent_58%)]" />
          {showMenuBackground && (
            <div className="absolute inset-0 opacity-40 flex items-center justify-center pointer-events-none">
              <div className="relative h-[280px] w-[280px] rounded-[36px] border border-fuchsia-300/15 bg-[#140822]/40">
                <div className="absolute inset-[42px]">
                  <div className="absolute left-1/3 top-0 h-full w-px bg-gradient-to-b from-transparent via-fuchsia-300/40 to-transparent" />
                  <div className="absolute left-2/3 top-0 h-full w-px bg-gradient-to-b from-transparent via-fuchsia-300/40 to-transparent" />
                  <div className="absolute top-1/3 left-0 h-px w-full bg-gradient-to-r from-transparent via-fuchsia-300/40 to-transparent" />
                  <div className="absolute top-2/3 left-0 h-px w-full bg-gradient-to-r from-transparent via-fuchsia-300/40 to-transparent" />
                </div>
                <div className="grid h-full w-full grid-cols-3 grid-rows-3 place-items-center p-5">
                  {Array(9)
                    .fill(null)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="h-12 w-12 rounded-full bg-[#1d0a33]/80 ring-1 ring-white/10"
                      />
                    ))}
                </div>
              </div>
            </div>
          )}

          <AudioController isMuted={isMuted} onMuteToggle={onMuteToggle} />

          {showTimer && (
            <div className="absolute top-3 right-4 z-50 rounded-full border border-fuchsia-300/30 bg-[#1d0a33] px-3 py-1 text-sm text-fuchsia-100 shadow-[0_0_12px_rgba(232,121,249,0.25)]">
              {timeLeft}s
            </div>
          )}

          <div className="absolute inset-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function GameLoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] bg-[#140822]">
      <div className="w-16 h-16 border-4 border-fuchsia-400 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_20px_rgba(232,121,249,0.45)]" />
      <p className="text-fuchsia-100 text-xl">Loading POD Play...</p>
    </div>
  );
}
