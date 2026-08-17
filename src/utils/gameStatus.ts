import { GameLogic } from "~/components/game/GameLogic";
import { Board, PlayerPiece } from "~/types/game";

export function getGameStatus(
  board: Board,
  selectedPiece: PlayerPiece,
  isPlayerTurn: boolean,
  endedByTimer: boolean
): string {
  const winner = GameLogic.calculateWinner(board);
  const isDraw = !winner && board.every((square) => square !== null);

  if (winner) {
    return winner === selectedPiece ? "You Won!" : "CPU Won";
  }
  if (isDraw) {
    return "It's a Draw!";
  }
  if (endedByTimer) {
    return "Time's Up!";
  }
  return isPlayerTurn ? "Your Turn" : "Maxi's Turn";
}
