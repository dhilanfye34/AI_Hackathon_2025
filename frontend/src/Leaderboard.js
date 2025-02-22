import React, { useState, useEffect } from "react";
import { getLeaderboard } from "@/api"; // import from your api.js
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LeaderBoard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getLeaderboard();
        // data is an array of objects: [{ username: "Alice", points: 10 }, ...]
        setLeaderboardData(data);
      } catch (err) {
        setError(`Error fetching leaderboard: ${err.message}`);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-green-800">
              Top Recyclers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="text-red-600 mb-4">{error}</div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-green-200">
                    <th className="py-4 px-6 text-left">Rank</th>
                    <th className="py-4 px-6 text-left">Username</th>
                    <th className="py-4 px-6 text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((user, idx) => (
                    <tr key={user.username} className="border-b border-green-100 hover:bg-green-50">
                      <td className="py-4 px-6">
                        {idx === 0
                          ? "🥇"
                          : idx === 1
                          ? "🥈"
                          : idx === 2
                          ? "🥉"
                          : idx + 1}
                      </td>
                      <td className="py-4 px-6">{user.username}</td>
                      <td className="py-4 px-6 text-right">{user.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderBoard;
