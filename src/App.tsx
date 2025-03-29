import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "./lib/supabase";
import { useAuthStore } from "./store/auth";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Leaderboard from "./pages/Leaderboard";
import Navbar from "./components/Navbar";
import QuestionManagement from "./pages/QuestionManagement";

const queryClient = new QueryClient();

function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    // Set up auth listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/admin/questions" element={<QuestionManagement />} />
            </Routes>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
