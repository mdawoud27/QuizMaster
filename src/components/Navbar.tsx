import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Trophy, Home } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">QuizMaster</span>
          </Link>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/quiz"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <Brain className="h-5 w-5" />
              <span>Quiz</span>
            </Link>
            <Link
              to="/leaderboard"
              className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <Trophy className="h-5 w-5" />
              <span>Leaderboard</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;