import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useQuizStore } from "../store/quiz";
import { formatTime, calculateScore } from "../lib/utils";
import { CategorySelect } from "../components/CategorySelect";
import { useAuthStore } from "../store/auth";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const Quiz = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const {
    currentQuestion,
    timeLeft,
    isQuizActive,
    correctAnswers,
    setCurrentQuestion,
    setTimeLeft,
    setQuizActive,
    setCorrectAnswers,
    resetQuiz,
  } = useQuizStore();

  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState(false);

  const { data: questions, isLoading: isLoadingQuestions } = useQuery({
    queryKey: ["questions", selectedCategory?.id],
    queryFn: async () => {
      if (!selectedCategory) return null;
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("category_id", selectedCategory.id)
        .limit(10);
      if (error) throw error;
      return data as Question[];
    },
    enabled: !!selectedCategory,
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isQuizActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft <= 0 && isQuizActive) {
      finishQuiz();
    }
  }, [timeLeft, isQuizActive]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    resetQuiz();
    setQuizActive(true);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = async () => {
    if (!questions) return;

    if (selectedAnswer === questions[currentQuestion].correct_answer) {
      setCorrectAnswers(correctAnswers + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    } else {
      await finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (!selectedCategory || !user) return;

    const finalScore = calculateScore(timeLeft, correctAnswers);

    // Save score to database
    await supabase.from("user_scores").insert({
      user_id: user.id,
      category_id: selectedCategory.id,
      score: finalScore,
      time_taken: 300 - timeLeft,
      correct_answers: correctAnswers,
    });

    setQuizActive(false);
    setShowResult(true);
  };

  if (!selectedCategory) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Select a Category
        </h2>
        <CategorySelect onSelect={handleCategorySelect} />
      </div>
    );
  }

  if (isLoadingQuestions) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl">Loading questions...</div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center">
        <p className="text-xl text-gray-600">
          No questions available for this category.
        </p>
        <button
          onClick={() => setSelectedCategory(null)}
          className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Choose Another Category
        </button>
      </div>
    );
  }

  if (showResult) {
    const finalScore = calculateScore(timeLeft, correctAnswers);
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-6">Quiz Complete!</h2>
        <div className="space-y-4">
          <p className="text-xl text-center">
            Your Score:{" "}
            <span className="font-bold text-indigo-600">{finalScore}</span>
          </p>
          <p className="text-lg text-center">
            Category:{" "}
            <span className="font-medium">{selectedCategory.name}</span>
          </p>
          <p className="text-lg text-center">
            Correct Answers: {correctAnswers} out of {questions.length}
          </p>
          <p className="text-lg text-center">
            Time Remaining: {formatTime(timeLeft)}
          </p>
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => navigate("/leaderboard")}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View Leaderboard
            </button>
            <button
              onClick={() => {
                setSelectedCategory(null);
                resetQuiz();
                setShowResult(false);
              }}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Try Another Category
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="text-lg font-semibold">
            Question {currentQuestion + 1}/{questions.length}
          </div>
          <div className="flex items-center space-x-2 text-lg">
            <Clock className="h-5 w-5 text-indigo-600" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {questions[currentQuestion].question}
          </h2>
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                className={`w-full p-4 text-left rounded-lg transition-colors ${
                  selectedAnswer === option
                    ? "bg-indigo-100 border-2 border-indigo-600"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
            className={`px-6 py-2 rounded-lg text-white transition-colors ${
              selectedAnswer
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
