export function calculatePODScore(
  wins: number,
  ties: number,
  losses: number,
  totalGames: number
): number {
  const baseScore = wins * 2 + ties + losses * 0.5;
  const gamesBonus = Math.floor(totalGames / 25) * 10;
  return Math.round((baseScore + gamesBonus) * 10) / 10;
}
