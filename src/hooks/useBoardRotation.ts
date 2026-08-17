"use client";

import { useCallback, useEffect, useRef } from "react";
import { Board, Difficulty, GameState } from "~/types/game";

const BASE_SPEED = 0.35;
const SPEED_PER_PIECE = 0.08;

export function useBoardRotation(
  difficulty: Difficulty,
  board: Board,
  gameState: GameState,
  gameSession: number
) {
  const boardRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const angleRef = useRef(0);
  const speedRef = useRef(BASE_SPEED);
  const spinningRef = useRef(false);

  const applyAngle = useCallback((angle: number) => {
    if (boardRef.current) {
      boardRef.current.style.transform = `rotate(${angle}deg)`;
    }
  }, []);

  const stopSpin = useCallback(() => {
    spinningRef.current = false;
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
  }, []);

  const resetTransform = useCallback(() => {
    stopSpin();
    angleRef.current = 0;
    applyAngle(0);
  }, [applyAngle, stopSpin]);

  const pieceCount = board.filter(Boolean).length;
  const hasPieces = pieceCount > 0;
  speedRef.current = BASE_SPEED + pieceCount * SPEED_PER_PIECE;

  useEffect(() => {
    const shouldSpin =
      difficulty === "hard" && gameState === "game" && hasPieces;

    if (!shouldSpin) {
      resetTransform();
      return;
    }

    spinningRef.current = true;

    const tick = () => {
      if (!spinningRef.current) return;
      angleRef.current = (angleRef.current + speedRef.current) % 360;
      applyAngle(angleRef.current);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      stopSpin();
    };
  }, [
    applyAngle,
    difficulty,
    gameSession,
    gameState,
    hasPieces,
    resetTransform,
    stopSpin,
  ]);

  return { boardRef, resetTransform };
}
