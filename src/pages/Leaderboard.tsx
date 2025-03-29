import React from 'react';
import { Trophy, Medal } from 'lucide-react';

const SAMPLE_LEADERBOARD = [
  { id: 1, name: "Alex", score: 950, time: "4:23" },
  { id: 2, name: "Sarah", score: 920, time: "4:15" },
  { id: 3, name: "John", score: 890, time: "3:59" },
  // Add more entries
];

const Leaderboard = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Global Leaderboard</h1>
        <p className="text-gray-600">Top quiz masters worldwide</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Top 3 Players */}
            {SAMPLE_LEADERBOARD.slice(0, 3).map((player, index) => (
              <div
                key={player.id}
                className={`bg-gradient-to-br ${
                  index === 0
                    ? 'from-yellow-100 to-yellow-200'
                    : index === 1
                    ? 'from-gray-100 to-gray-200'
                    : 'from-orange-100 to-orange-200'
                } p-6 rounded-lg text-center`}
              >
                <div className="flex justify-center mb-3">
                  <Medal
                    className={`h-12 w-12 ${
                      index === 0
                        ? 'text-yellow-600'
                        : index === 1
                        ? 'text-gray-600'
                        : 'text-orange-600'
                    }`}
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{player.name}</h3>
                <p className="text-2xl font-bold text-indigo-600 mb-1">
                  {player.score}
                </p>
                <p className="text-gray-600">Time: {player.time}</p>
              </div>
            ))}
          </div>

          {/* Full Leaderboard */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {SAMPLE_LEADERBOARD.map((player, index) => (
                  <tr key={player.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {player.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{player.score}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {player.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;