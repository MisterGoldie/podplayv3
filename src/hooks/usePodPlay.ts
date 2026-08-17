"use client";

import { Context, sdk } from "@farcaster/miniapp-sdk";
import { useCallback, useEffect, useState } from "react";
import { GameLogic } from "~/components/game/GameLogic";
import { NotificationManager } from "~/components/game/NotificationManager";
import { useBoardRotation } from "~/hooks/useBoardRotation";
import { useGameSounds } from "~/hooks/useGameSounds";
import { useGameTimer } from "~/hooks/useGameTimer";
import { updateGameResult } from "~/services/api";
import { shouldSendNotification } from "~/utils/notificationUtils";
import { getGameStatus } from "~/utils/gameStatus";
import { playOutcomeSound } from "~/utils/playOutcomeSound";
import { preloadAssets } from "~/utils/optimizations";
import {
  Board,
  Difficulty,
  GameState,
  MenuStep,
  PlayerPiece,
} from "~/types/game";

const emptyBoard = (): Board => Array(9).fill(null);

type Result = "win" | "loss" | "tie";

async function recordResult(
  fid: string | undefined,
  result: Result,
  difficulty?: Difficulty
) {
  if (!fid) return;
  try {
    await updateGameResult(fid, result, difficulty);
  } catch (error) {
    console.error("Error updating game result:", error);
  }
}

async function notifyResult(
  fid: string | undefined,
  type: "win" | "loss" | "draw"
) {
  if (!fid) return;
  try {
    await NotificationManager.sendGameNotification(type, fid);
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}

export function usePodPlay(frameContext?: Context.MiniAppContext) {
  const fid = frameContext?.user?.fid?.toString();
  const profileImage = frameContext?.user?.pfpUrl ?? "";

  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState<GameState>("menu");
  const [menuStep, setMenuStep] = useState<MenuStep>("game");
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [isXNext, setIsXNext] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState<PlayerPiece>("chili");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [gameSession, setGameSession] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [endedByTimer, setEndedByTimer] = useState(false);
  const [winner, setWinner] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [hasSentThanksNotification, setHasSentThanksNotification] =
    useState(false);

  const sounds = useGameSounds(isMuted, gameState);
  const { boardRef, resetTransform } = useBoardRotation(
    difficulty,
    board,
    gameState,
    gameSession
  );

  const sendThanksNotification = useCallback(async () => {
    if (!fid || hasSentThanksNotification) return;
    await NotificationManager.sendThanksNotification(fid);
    setHasSentThanksNotification(true);
  }, [fid, hasSentThanksNotification]);

  const handleTimeout = useCallback(async () => {
    setEndedByTimer(true);
    sounds.stopCountdownSound();
    sounds.stopGameJingle();
    if (!isMuted) {
      sounds.playLosing();
    }
    await recordResult(fid, "loss", difficulty);
    await notifyResult(fid, "loss");
  }, [difficulty, fid, isMuted, sounds]);

  const timerActive =
    timerStarted &&
    !GameLogic.calculateWinner(board) &&
    !board.every((square) => square !== null);

  const { timeLeft, setTimeLeft } = useGameTimer({
    isActive: timerActive,
    onTimeUp: handleTimeout,
    onStopCountdown: sounds.stopCountdownSound,
  });

  useEffect(() => {
    preloadAssets()
      .catch((error) => console.error("Error loading assets:", error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleStartGame = useCallback(
    (diff: Difficulty, piece: PlayerPiece) => {
      sounds.playClick();
      sounds.stopOpeningTheme();

      setTimeout(() => {
        setBoard(emptyBoard());
        setIsXNext(true);
        setTimerStarted(false);
        setEndedByTimer(false);
        setShowLeaderboard(false);
        setWinner(false);
        setIsDraw(false);
        setGameSession((prev) => prev + 1);
        setGameState("game");
        setSelectedPiece(piece);
        setDifficulty(diff);
        resetTransform();
      }, 300);
    },
    [resetTransform, sounds]
  );

  const handleMove = useCallback(
    async (index: number) => {
      if (
        board[index] ||
        GameLogic.calculateWinner(board) ||
        !isXNext ||
        timeLeft <= 0
      ) {
        return;
      }

      sounds.playClick();

      const newBoard = [...board];
      newBoard[index] = selectedPiece;
      setBoard(newBoard);
      setIsXNext(false);

      if (!timerStarted) {
        setTimerStarted(true);
      }

      if (GameLogic.calculateWinner(newBoard)) {
        sounds.stopGameJingle();
        sounds.stopCountdownSound();
        setTimerStarted(false);
        setWinner(true);
        setTimeLeft(0);
        playOutcomeSound("/sounds/winning.mp3", sounds.playWinning);

        await recordResult(fid, "win", difficulty);
        if (fid && (await shouldSendNotification("win"))) {
          await notifyResult(fid, "win");
        }
        await sendThanksNotification();
        return;
      }

      setTimeout(async () => {
        if (timeLeft <= 0 || GameLogic.calculateWinner(newBoard)) return;

        const computerMove = GameLogic.getComputerMove(
          newBoard,
          difficulty,
          selectedPiece
        );
        if (computerMove === -1) return;

        const nextBoard = [...newBoard];
        nextBoard[computerMove] = "X";
        setBoard(nextBoard);
        setIsXNext(true);

        if (GameLogic.calculateWinner(nextBoard)) {
          sounds.stopGameJingle();
          sounds.stopCountdownSound();
          setWinner(true);
          playOutcomeSound("/sounds/losing.mp3", sounds.playLosing);
          await recordResult(fid, "loss", difficulty);
          await notifyResult(fid, "loss");
        } else if (nextBoard.every((square) => square !== null)) {
          sounds.stopGameJingle();
          sounds.stopCountdownSound();
          setIsDraw(true);
          playOutcomeSound("/sounds/drawing.mp3", sounds.playDrawing);
          await recordResult(fid, "tie");
          await notifyResult(fid, "draw");
        }
      }, 500);
    },
    [
      board,
      difficulty,
      fid,
      isXNext,
      selectedPiece,
      sendThanksNotification,
      setTimeLeft,
      sounds,
      timeLeft,
      timerStarted,
    ]
  );

  const resetGame = useCallback(() => {
    sounds.playClick();
    sounds.stopCountdownSound();
    sounds.stopGameJingle();
    sounds.playOpeningTheme();
    setShowLeaderboard(false);
    resetTransform();

    setTimeout(() => {
      setGameState("menu");
      setMenuStep("game");
      setBoard(emptyBoard());
      setIsXNext(true);
      setTimerStarted(false);
      setWinner(false);
      setIsDraw(false);
      setEndedByTimer(false);
      setGameSession((prev) => prev + 1);
    }, 300);
  }, [resetTransform, sounds]);

  const handlePlayAgain = useCallback(() => {
    sounds.playClick();
    sounds.stopCountdownSound();
    sounds.stopGameJingle();
    setShowLeaderboard(false);

    setTimeout(() => {
      setEndedByTimer(false);
      setWinner(false);
      setIsDraw(false);
      resetTransform();
      setBoard(emptyBoard());
      setIsXNext(true);
      setTimerStarted(false);
      setGameSession((prev) => prev + 1);
      setTimeout(() => sounds.playGameJingle(), 50);
    }, 300);
  }, [resetTransform, sounds]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) {
        sounds.stopGameJingle();
        sounds.stopOpeningTheme();
        sounds.stopCountdownSound();
      }
      return next;
    });
  }, [sounds]);

  const handleViewLeaderboard = useCallback(() => {
    setShowLeaderboard(true);
    sounds.playClick();
    if (!isMuted) {
      sounds.stopGameJingle();
    }
  }, [isMuted, sounds]);

  const handleBackFromLeaderboard = useCallback(() => {
    setShowLeaderboard(false);
    sounds.playClick();
    sounds.stopGameJingle();
    resetGame();
  }, [resetGame, sounds]);

  const handleShare = useCallback(() => {
    sounds.playClick();
    const shareText = "Have you played POD Play v3? 🕹️";
    const shareUrl = "https://podplayv3.vercel.app";
    sdk.actions.openUrl(
      `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(shareUrl)}`
    );
  }, [sounds]);

  useEffect(() => {
    if (gameState !== "game" || board.some((square) => square !== null)) {
      return;
    }

    const cpuMove = Math.floor(Math.random() * 9);
    const timeout = setTimeout(() => {
      const nextBoard = [...board];
      nextBoard[cpuMove] = "X";
      setBoard(nextBoard);
      setIsXNext(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, [gameState, board]);

  return {
    isLoading,
    gameState,
    menuStep,
    setMenuStep,
    setSelectedPiece,
    selectedPiece,
    board,
    boardRef,
    timeLeft,
    winner,
    isDraw,
    endedByTimer,
    showLeaderboard,
    isMuted,
    profileImage,
    sounds,
    toggleMute,
    handleStartGame,
    handleMove,
    handlePlayAgain,
    resetGame,
    handleViewLeaderboard,
    handleBackFromLeaderboard,
    handleShare,
    getGameStatus: () =>
      getGameStatus(board, selectedPiece, isXNext, endedByTimer),
  };
}
