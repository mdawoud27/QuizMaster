import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { useQuizStore } from "../store/quiz";
import { formatTime, calculateScore } from "../lib/utils";

const SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
  },
  {
    id: 3,
    question: "Who painted the Mona Lisa?",
    options: [
      "Vincent van Gogh",
      "Leonardo da Vinci",
      "Pablo Picasso",
      "Michelangelo",
    ],
    correctAnswer: "Leonardo da Vinci",
  },
  {
    id: 4,
    question: "What is the largest ocean on Earth?",
    options: [
      "Atlantic Ocean",
      "Indian Ocean",
      "Arctic Ocean",
      "Pacific Ocean",
    ],
    correctAnswer: "Pacific Ocean",
  },
  {
    id: 5,
    question: "Which element has the chemical symbol 'Au'?",
    options: ["Silver", "Gold", "Copper", "Aluminum"],
    correctAnswer: "Gold",
  },
  {
    id: 6,
    question: "In which year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    correctAnswer: "1945",
  },
  {
    id: 7,
    question: "What is the capital of Japan?",
    options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
    correctAnswer: "Tokyo",
  },
  {
    id: 8,
    question: "Who wrote 'Romeo and Juliet'?",
    options: [
      "Charles Dickens",
      "William Shakespeare",
      "Jane Austen",
      "Mark Twain",
    ],
    correctAnswer: "William Shakespeare",
  },
  {
    id: 9,
    question: "What is the fastest land animal?",
    options: ["Lion", "Cheetah", "Gazelle", "Leopard"],
    correctAnswer: "Cheetah",
  },
  {
    id: 10,
    question: "Which country is home to the Great Barrier Reef?",
    options: ["Brazil", "Indonesia", "Australia", "Thailand"],
    correctAnswer: "Australia",
  },
];

const Quiz = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    resetQuiz();
    setQuizActive(true);

    const timer = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      finishQuiz();
    }
  }, [timeLeft]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === SAMPLE_QUESTIONS[currentQuestion].correctAnswer) {
      setCorrectAnswers(correctAnswers + 1);
    }

    if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setQuizActive(false);
    setShowResult(true);
  };

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
            Correct Answers: {correctAnswers} out of {SAMPLE_QUESTIONS.length}
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
                resetQuiz();
                setShowResult(false);
                setQuizActive(true);
              }}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Try Again
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
            Question {currentQuestion + 1}/{SAMPLE_QUESTIONS.length}
          </div>
          <div className="flex items-center space-x-2 text-lg">
            <Clock className="h-5 w-5 text-indigo-600" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {SAMPLE_QUESTIONS[currentQuestion].question}
          </h2>
          <div className="space-y-3">
            {SAMPLE_QUESTIONS[currentQuestion].options.map((option) => (
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
            {currentQuestion === SAMPLE_QUESTIONS.length - 1
              ? "Finish"
              : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
