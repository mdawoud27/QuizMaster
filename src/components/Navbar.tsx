import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Brain, Trophy, Home, UserCircle, Settings } from "lucide-react";
import { useAuthStore } from "../store/auth";
import { AuthModal } from "./AuthModal";
import { supabase } from "../lib/supabase";

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (data && !error) {
        setIsAdmin(true);
      }
    };

    checkIfAdmin();
  }, [user]);

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">QuizMaster</span>
          </Link>
          <div className="flex items-center space-x-4">
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

            {isAdmin && (
              <Link
                to="/admin/questions"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span>Manage Questions</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-2">
                <UserCircle className="h-6 w-6 text-indigo-600" />
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
