import { Button } from "~/components/ui/Button";
import Image from "next/image";
import { RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Square = "X" | "scarygary" | "chili" | "podplaylogo" | null;

interface GameBoardProps {
  timeLeft: number;
  getGameStatus: () => string;
  boardRef: RefObject<HTMLDivElement | null>;
  board: Square[];
  handleMove: (index: number) => void;
  handlePlayAgain: () => void;
  resetGame: () => void;
  winner: boolean;
  isDraw: boolean;
  endedByTimer: boolean;
  handleViewLeaderboard: () => void;
  handleGameBoardShare: () => void;
}

function PieceMark({ square }: { square: Exclude<Square, null> }) {
  const src = square === "X" ? "/mainlogo.png" : `/${square}.png`;
  const alt = square === "X" ? "Maxi" : square;

  return (
    <motion.div
      key={square}
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.4, opacity: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 18 }}
    >
      <Image
        src={src}
        alt={alt}
        width={52}
        height={52}
        className="h-[52px] w-[52px] object-contain drop-shadow-[0_0_12px_rgba(232,121,249,0.7)]"
      />
    </motion.div>
  );
}

export default function GameBoard({
  getGameStatus,
  boardRef,
  board,
  handleMove,
  handlePlayAgain,
  resetGame,
  winner,
  isDraw,
  endedByTimer,
  handleViewLeaderboard,
  handleGameBoardShare,
}: GameBoardProps) {
  const gameOver = winner || isDraw || endedByTimer;

  return (
    <motion.div
      className="grid h-full w-full grid-rows-[1fr_auto_1fr] items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="flex items-end justify-center pb-4 text-center text-white text-xl text-shadow"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {getGameStatus()}
      </motion.div>

      <div
        ref={boardRef}
        className="justify-self-center will-change-transform"
        style={{ transformOrigin: "center center" }}
      >
        <div className="relative h-[268px] w-[268px]">
          <div className="absolute -inset-3 rounded-full bg-fuchsia-500/20 blur-2xl" />
          <div className="relative h-full w-full overflow-hidden rounded-[36px] bg-[#140822] shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(192,38,211,0.28),transparent_58%)]" />
            <div className="absolute inset-[10px] rounded-[28px] border border-fuchsia-300/25" />

            <div className="pointer-events-none absolute inset-[46px]">
              <div className="absolute left-1/3 top-0 h-full w-px bg-gradient-to-b from-transparent via-fuchsia-300/50 to-transparent" />
              <div className="absolute left-2/3 top-0 h-full w-px bg-gradient-to-b from-transparent via-fuchsia-300/50 to-transparent" />
              <div className="absolute top-1/3 left-0 h-px w-full bg-gradient-to-r from-transparent via-fuchsia-300/50 to-transparent" />
              <div className="absolute top-2/3 left-0 h-px w-full bg-gradient-to-r from-transparent via-fuchsia-300/50 to-transparent" />
            </div>

            <div className="relative grid h-full w-full grid-cols-3 grid-rows-3 place-items-center p-4">
              {board.map((square, index) => (
                <motion.button
                  key={index}
                  type="button"
                  disabled={Boolean(square) || gameOver}
                  onClick={() => handleMove(index)}
                  className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full"
                  whileHover={square || gameOver ? undefined : { scale: 1.08 }}
                  whileTap={square || gameOver ? undefined : { scale: 0.92 }}
                >
                  <span
                    className={`absolute inset-0 rounded-full ${
                      square
                        ? "bg-[#1d0a33] shadow-[inset_0_6px_12px_rgba(0,0,0,0.45),0_0_18px_rgba(232,121,249,0.45)] ring-2 ring-fuchsia-300/70"
                        : "bg-[#1d0a33] shadow-[inset_0_8px_16px_rgba(0,0,0,0.55)] ring-1 ring-white/15 hover:ring-fuchsia-300/80 hover:shadow-[0_0_16px_rgba(232,121,249,0.35)]"
                    }`}
                  />
                  {!square && (
                    <span className="absolute h-2 w-2 rounded-full bg-fuchsia-200/40" />
                  )}
                  <span className="relative z-10">
                    <AnimatePresence mode="wait">
                      {square ? <PieceMark square={square} /> : null}
                    </AnimatePresence>
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="flex w-full items-start justify-center px-4 pt-5"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        <AnimatePresence>
          {gameOver && (
            <motion.div
              className="grid grid-cols-2 gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
            >
              <Button
                onClick={handlePlayAgain}
                className="h-[42px] text-lg pod-btn-primary"
              >
                Play Again
              </Button>
              <Button
                onClick={resetGame}
                className="h-[42px] text-lg"
              >
                Back to Menu
              </Button>
              <Button
                onClick={handleViewLeaderboard}
                className="h-[42px] text-lg"
              >
                Leaderboard
              </Button>
              <Button
                onClick={handleGameBoardShare}
                className="h-[42px] text-lg"
              >
                Share Game
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
