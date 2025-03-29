import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Trophy, Clock } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to QuizMaster
        </h1>
        <p className="text-xl text-gray-600">
          Test your knowledge and compete with others!
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-12 w-12 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">
            Challenging Questions
          </h3>
          <p className="text-gray-600 text-center">
            Test your knowledge across various topics
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-12 w-12 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">
            Time-Based Scoring
          </h3>
          <p className="text-gray-600 text-center">
            Answer quickly to earn bonus points
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-12 w-12 text-indigo-600" />
          </div>
          <h3 className="text-xl font-semibold text-center mb-2">
            Global Leaderboard
          </h3>
          <p className="text-gray-600 text-center">
            Compete with players worldwide
          </p>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => navigate('/quiz')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default Home;