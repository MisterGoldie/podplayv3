"use client";

import { useEffect, useRef } from "react";
import { Board, Difficulty, GameState } from "~/types/game";

export function useBoardRotation(
  difficulty: Difficulty,
  board: Board,
  gameState: GameState,
  gameSession: number
) {
  const boardRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  const resetTransform = () => {
    if (boardRef.current) {
      boardRef.current.style.transform = "rotate(0deg)";
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    if (difficulty !== "hard" || !boardRef.current || gameState !== "game") {
      return;
    }

    const baseSpeed = 0.3;

    const animate = () => {
      if (!boardRef.current) return;
      const rotationSpeed = baseSpeed + board.filter(Boolean).length * 0.1;
      const currentRotation =
        parseFloat(boardRef.current.style.transform.replace(/[^\d.-]/g, "")) ||
        0;
      boardRef.current.style.transform = `rotate(${currentRotation + rotationSpeed}deg)`;
      animationRef.current = requestAnimationFrame(animate);
    };

    if (!board.every((square) => square === null)) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (boardRef.current) {
      boardRef.current.style.transform = "rotate(0deg)";
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (boardRef.current) {
        boardRef.current.style.transform = "rotate(0deg)";
      }
    };
  }, [difficulty, board, gameState, gameSession]);

  return { boardRef, resetTransform };
}
