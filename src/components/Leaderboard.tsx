import { useEffect, useState } from 'react';
import Image from 'next/image';
import { sdk } from '@farcaster/miniapp-sdk';

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

type LeaderboardView = 'top' | 'personal';

type LeaderboardProps = {
  currentUserFid?: string;
  pfpUrl?: string;
};

const shareText = `Have you played POD Play v3? 🕹️\npodplayv3.vercel.app`;

export default function Leaderboard({ currentUserFid, pfpUrl }: LeaderboardProps) {
  const [view, setView] = useState<LeaderboardView>('top');
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserData, setCurrentUserData] = useState<LeaderboardEntry | null>(null);

  const handleViewChange = (newView: LeaderboardView) => {
    setView(newView);
    // Remove jingle from here since it's handled by useEffect
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const url = currentUserFid 
          ? `/api/firebase?userFid=${currentUserFid}`
          : '/api/firebase';
          
        const response = await fetch(url);
        const data = await response.json();
        setLeaderboard(data.leaderboard);
        if (data.userData) {
          setCurrentUserData(data.userData);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [currentUserFid]);

  if (isLoading) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      {view === 'top' ? (
        <div className="flex flex-col gap-3">
          <div className="pod-panel p-4 w-full max-h-[500px] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Leaderboard
            </h2>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div 
                  key={entry.fid}
                  className="flex justify-between items-center bg-[#1d0a33] p-3 rounded-2xl hover:bg-[#2a1048] transition-all border border-fuchsia-300/15"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-[#140822] rounded-full border border-fuchsia-300/30">
                      <span className="text-fuchsia-200 text-sm font-bold">#{index + 1}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-semibold text-base">{entry.username}</span>
                      <span className="text-[10px] text-fuchsia-200/70 font-mono">fid:{entry.fid}</span>
                    </div>
                  </div>
                  <div className="text-right bg-[#140822] px-3 py-1 rounded-xl border border-fuchsia-300/15">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-green-400 font-bold text-base">{entry.wins}W</span>
                      <span className="text-yellow-400 font-bold text-sm">({entry.podScore?.toFixed(1)}PS)</span>
                    </div>
                    <div className="text-[10px] text-fuchsia-200/70 font-medium">
                      E:{entry.easyWins || 0} M:{entry.mediumWins || 0} H:{entry.hardWins || 0}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-center mt-3">
                <button
                  onClick={() => {
                    const shareText = 'Have you played POD Play v3? 🕹️';
                    const shareUrl = 'podplayv3.vercel.app';
                    sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(shareUrl)}`);
                  }}
                  className="pod-btn w-[85%] py-2 text-lg mx-auto"
                >
                  Share Game
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleViewChange('personal')}
            className="pod-btn w-[85%] py-2 text-lg mx-auto"
          >
            View My Stats
          </button>
        </div>
      ) : (
        <div className="pod-panel p-4 w-full max-h-[500px] overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-4 text-center text-shadow">
            My Stats
          </h2>
          {currentUserData ? (
            <div className="space-y-4">
              <div className="bg-[#1d0a33] p-4 rounded-2xl border border-fuchsia-300/15">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={pfpUrl} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full border-2 border-fuchsia-300/60 shadow-[0_0_12px_rgba(232,121,249,0.4)]"
                  />
                  <div className="flex flex-col">
                    <span className="text-xl text-white">{currentUserData.username}</span>
                    <span className="text-base text-fuchsia-200/80">
                      Win Rank #{leaderboard.findIndex(e => e.fid === currentUserFid) === -1 
                        ? leaderboard.length + 1 
                        : leaderboard.findIndex(e => e.fid === currentUserFid) + 1}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-[#140822] rounded-lg">
                    <div className="text-green-400 text-2xl font-bold">{currentUserData.wins}</div>
                    <div className="text-sm text-fuchsia-200/80">Wins</div>
                  </div>
                  <div className="text-center p-3 bg-[#140822] rounded-lg">
                    <div className="text-red-400 text-2xl font-bold">{currentUserData.losses}</div>
                    <div className="text-sm text-fuchsia-200/80">Losses</div>
                  </div>
                  <div className="text-center p-3 bg-[#140822] rounded-lg">
                    <div className="text-blue-400 text-2xl font-bold">{currentUserData.ties}</div>
                    <div className="text-sm text-fuchsia-200/80">Ties</div>
                  </div>
                </div>

                <div className="bg-[#140822] p-3 rounded-2xl border border-fuchsia-300/15">
                  <h3 className="text-white text-lg mb-3 text-center">Wins by Difficulty</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <div className="text-green-300 text-xl font-bold">{currentUserData.easyWins}</div>
                      <div className="text-xs text-fuchsia-200/80">Easy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-300 text-xl font-bold">{currentUserData.mediumWins}</div>
                      <div className="text-xs text-fuchsia-200/80">Medium</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-300 text-xl font-bold">{currentUserData.hardWins}</div>
                      <div className="text-xs text-fuchsia-200/80">Hard</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 p-3 bg-[#140822] rounded-lg">
                  <div className="text-center">
                    <div className="text-yellow-400 text-3xl font-bold">
                      {currentUserData.podScore?.toFixed(1)}
                    </div>
                    <div className="text-sm text-fuchsia-200/80">POD Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-fuchsia-200/80 text-3xl font-bold">
                      #{leaderboard
                        .slice()
                        .sort((a, b) => b.podScore - a.podScore)
                        .findIndex(e => e.fid === currentUserFid) === -1
                          ? leaderboard.length + 1
                          : leaderboard
                            .slice()
                            .sort((a, b) => b.podScore - a.podScore)
                            .findIndex(e => e.fid === currentUserFid) + 1}
                    </div>
                    <div className="text-sm text-fuchsia-200/80">POD Rank</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 justify-center">
                <button
                  onClick={() => {
                    const shareText = 'Have you played POD Play v3? 🕹️';
                    const shareUrl = 'podplayv3.vercel.app';
                    sdk.actions.openUrl(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(shareUrl)}`);
                  }}
                  className="pod-btn w-[85%] py-2 text-lg mx-auto"
                >
                  Share Game
                </button>
                
                <button
                  onClick={() => handleViewChange('top')}
                  className="pod-btn w-[85%] py-2 text-lg mx-auto"
                >
                  Back to Leaderboard
                </button>
              </div>
            </div>
          ) : (
            <div className="text-white text-center">No stats available</div>
          )}
        </div>
      )}
    </div>
  );
} 
////