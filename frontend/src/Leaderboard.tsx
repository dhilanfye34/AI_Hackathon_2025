import React, { useEffect, useState } from 'react';
import { getLeaderboard } from './api';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardEntry {
  username: string;
  points: number;
}

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        setError('Failed to load leaderboard');
      }
    };

    fetchLeaderboard();
  }, []);

  if (error) {
    return (
      <div className="eco-card p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Trophy className="w-8 h-8 text-eco-green-500 mr-3" />
        <h2 className="text-3xl font-bold text-eco-green-800">Top Contributors</h2>
      </div>

      <div className="eco-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-eco-green-50">
              <th className="px-6 py-4 text-left text-eco-green-700">Rank</th>
              <th className="px-6 py-4 text-left text-eco-green-700">Username</th>
              <th className="px-6 py-4 text-right text-eco-green-700">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-eco-green-100">
            {leaderboard.map((entry, index) => (
              <tr key={entry.username} className="hover:bg-eco-green-50/50 transition-colors">
                <td className="px-6 py-4 flex items-center">
                  {index < 3 ? (
                    <Medal className={`w-5 h-5 mr-2 ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                      'text-earth-300'
                    }`} />
                  ) : (
                    <span className="w-5 h-5 mr-2 inline-block text-center">{index + 1}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-700">{entry.username}</td>
                <td className="px-6 py-4 text-right font-semibold text-eco-green-600">
                  {entry.points.toLocaleString()} pts
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Leaderboard;