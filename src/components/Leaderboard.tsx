import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

type LeaderboardEntry = {
  fid: string;
  username: string;
  wins: number;
  losses: number;
  ties: number;
  easyWins: number;
  mediumWins: number;
  hardWins: number;
  podScore: number;
  pfp?: string;
};

type LeaderboardView = "top" | "personal";

type LeaderboardProps = {
  currentUserFid?: string;
  pfpUrl?: string;
  onBackToMenu: () => void;
};

function shareGame() {
  const shareText = "Have you played POD Play v3? 🕹️";
  const shareUrl = "https://podplayv3.vercel.app";
  sdk.actions.openUrl(
    `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(shareUrl)}`
  );
}

export default function Leaderboard({
  currentUserFid,
  pfpUrl,
  onBackToMenu,
}: LeaderboardProps) {
  const [view, setView] = useState<LeaderboardView>("top");
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserData, setCurrentUserData] = useState<LeaderboardEntry | null>(
    null
  );

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const url = currentUserFid
          ? `/api/firebase?userFid=${currentUserFid}`
          : "/api/firebase";
        const response = await fetch(url);
        const data = await response.json();
        setLeaderboard(data.leaderboard ?? []);
        if (data.userData) {
          setCurrentUserData(data.userData);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [currentUserFid]);

  const podRank =
    currentUserFid == null
      ? null
      : (() => {
          const ranked = [...leaderboard].sort(
            (a, b) => (b.podScore || 0) - (a.podScore || 0)
          );
          const index = ranked.findIndex((e) => e.fid === currentUserFid);
          return index === -1 ? ranked.length + 1 : index + 1;
        })();

  const winRank =
    currentUserFid == null
      ? null
      : (() => {
          const index = leaderboard.findIndex((e) => e.fid === currentUserFid);
          return index === -1 ? leaderboard.length + 1 : index + 1;
        })();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center text-fuchsia-100">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-2">
      <div className="pod-panel flex min-h-0 flex-1 flex-col overflow-hidden p-3">
        <h2 className="mb-3 shrink-0 text-center text-xl font-bold text-white">
          {view === "top" ? "Leaderboard" : "My Stats"}
        </h2>

        {view === "top" ? (
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.fid}
                className="flex min-w-0 items-center gap-2 rounded-2xl border border-fuchsia-300/15 bg-[#1d0a33] px-2.5 py-2"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-fuchsia-300/30 bg-[#140822] text-[11px] font-bold text-fuchsia-200">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-white">
                    {entry.username}
                  </div>
                  <div className="truncate font-mono text-[10px] text-fuchsia-200/70">
                    fid:{entry.fid}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-bold text-green-400">
                    {entry.wins}W
                    <span className="ml-1 text-xs font-semibold text-yellow-400">
                      {(entry.podScore ?? 0).toFixed(1)}
                    </span>
                  </div>
                  <div className="text-[10px] text-fuchsia-200/70">
                    E:{entry.easyWins || 0} M:{entry.mediumWins || 0} H:
                    {entry.hardWins || 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : currentUserData ? (
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
            <div className="flex min-w-0 items-center gap-3">
              {pfpUrl ? (
                <img
                  src={pfpUrl}
                  alt="Profile"
                  className="h-11 w-11 shrink-0 rounded-full border-2 border-fuchsia-300/60 object-cover"
                />
              ) : null}
              <div className="min-w-0">
                <div className="truncate text-lg text-white">
                  {currentUserData.username}
                </div>
                <div className="text-sm text-fuchsia-200/80">
                  Win Rank #{winRank}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-[#140822] p-2 text-center">
                <div className="text-xl font-bold text-green-400">
                  {currentUserData.wins}
                </div>
                <div className="text-[11px] text-fuchsia-200/80">Wins</div>
              </div>
              <div className="rounded-xl bg-[#140822] p-2 text-center">
                <div className="text-xl font-bold text-red-400">
                  {currentUserData.losses}
                </div>
                <div className="text-[11px] text-fuchsia-200/80">Losses</div>
              </div>
              <div className="rounded-xl bg-[#140822] p-2 text-center">
                <div className="text-xl font-bold text-sky-400">
                  {currentUserData.ties}
                </div>
                <div className="text-[11px] text-fuchsia-200/80">Ties</div>
              </div>
            </div>

            <div className="rounded-xl border border-fuchsia-300/15 bg-[#140822] p-3">
              <h3 className="mb-2 text-center text-sm text-white">
                Wins by Difficulty
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-emerald-300">
                    {currentUserData.easyWins}
                  </div>
                  <div className="text-[11px] text-fuchsia-200/80">Easy</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-yellow-300">
                    {currentUserData.mediumWins}
                  </div>
                  <div className="text-[11px] text-fuchsia-200/80">Medium</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-rose-300">
                    {currentUserData.hardWins}
                  </div>
                  <div className="text-[11px] text-fuchsia-200/80">Hard</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-[#140822] p-3 text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {currentUserData.podScore?.toFixed(1)}
                </div>
                <div className="text-[11px] text-fuchsia-200/80">POD Score</div>
              </div>
              <div className="rounded-xl bg-[#140822] p-3 text-center">
                <div className="text-2xl font-bold text-fuchsia-200">
                  #{podRank}
                </div>
                <div className="text-[11px] text-fuchsia-200/80">POD Rank</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-white">
            No stats available
          </div>
        )}
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-2">
        <button type="button" onClick={shareGame} className="pod-btn h-10 text-sm font-semibold">
          Share
        </button>
        {view === "top" ? (
          <button
            type="button"
            onClick={() => setView("personal")}
            className="pod-btn h-10 text-sm font-semibold"
          >
            My Stats
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setView("top")}
            className="pod-btn h-10 text-sm font-semibold"
          >
            Top 10
          </button>
        )}
        <button
          type="button"
          onClick={onBackToMenu}
          className="pod-btn-primary col-span-2 h-10 text-sm font-semibold"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}
