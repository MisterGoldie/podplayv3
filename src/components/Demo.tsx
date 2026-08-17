"use client";

import { Context } from "@farcaster/miniapp-sdk";
import { AnimatePresence, motion } from "framer-motion";
import Leaderboard from "~/components/Leaderboard";
import GameBoard from "~/components/game/GameBoard";
import { GameFrame, GameLoadingScreen } from "~/components/game/GameFrame";
import GameMenu from "~/components/game/GameMenu";
import HomePage from "~/components/game/HomePage";
import { usePodPlay } from "~/hooks/usePodPlay";

type DemoProps = {
  frameContext?: Context.MiniAppContext;
};

export default function Demo({ frameContext }: DemoProps) {
  const game = usePodPlay(frameContext);

  if (game.isLoading) {
    return <GameLoadingScreen />;
  }

  return (
    <GameFrame
      isMuted={game.isMuted}
      onMuteToggle={game.toggleMute}
      showMenuBackground={game.gameState !== "game"}
      timeLeft={game.timeLeft}
      showTimer={game.gameState === "game" && !game.showLeaderboard}
      insets={frameContext?.client.safeAreaInsets}
    >
      <div className="relative flex flex-col items-center justify-center w-full h-full px-4">
        <AnimatePresence mode="wait">
          {game.gameState === "menu" ? (
            game.menuStep === "game" ? (
              <motion.div
                key="home"
                className="w-full h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <HomePage
                  frameContext={frameContext}
                  profileImage={game.profileImage}
                  onPlayClick={() => {
                    game.sounds.playClick();
                    game.setMenuStep("piece");
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key={`menu-${game.menuStep}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <GameMenu
                  menuStep={game.menuStep === "difficulty" ? "difficulty" : "piece"}
                  onSelectPiece={(piece) => {
                    game.setSelectedPiece(piece);
                    game.setMenuStep("difficulty");
                  }}
                  onSelectDifficulty={(diff) =>
                    game.handleStartGame(diff, game.selectedPiece)
                  }
                  onBack={() =>
                    game.setMenuStep(
                      game.menuStep === "difficulty" ? "piece" : "game"
                    )
                  }
                  playClick={game.sounds.playClick}
                />
              </motion.div>
            )
          ) : (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              key="game-container"
            >
              <motion.div
                className="relative flex h-full w-full flex-col items-center justify-center"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  {game.showLeaderboard ? (
                    <motion.div
                      key="leaderboard"
                      className="flex h-full min-h-0 w-full flex-col px-2 pt-10 pb-3"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Leaderboard
                        currentUserFid={frameContext?.user?.fid?.toString()}
                        pfpUrl={frameContext?.user?.pfpUrl}
                        onBackToMenu={game.handleBackFromLeaderboard}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="gameboard"
                      className="flex h-full w-full flex-col items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GameBoard
                        timeLeft={game.timeLeft}
                        getGameStatus={game.getGameStatus}
                        boardRef={game.boardRef}
                        board={game.board}
                        handleMove={game.handleMove}
                        handlePlayAgain={game.handlePlayAgain}
                        resetGame={game.resetGame}
                        winner={game.winner}
                        isDraw={game.isDraw}
                        endedByTimer={game.endedByTimer}
                        handleViewLeaderboard={game.handleViewLeaderboard}
                        handleGameBoardShare={game.handleShare}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {game.gameState === "menu" && game.menuStep === "game" && (
        <div className="absolute bottom-4 w-full flex justify-center pointer-events-none">
          <div className="text-xs text-fuchsia-200/50 text-shadow">version 1.8</div>
        </div>
      )}
    </GameFrame>
  );
}
