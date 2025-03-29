import { create } from 'zustand';

interface QuizState {
  currentQuestion: number;
  score: number;
  timeLeft: number;
  isQuizActive: boolean;
  correctAnswers: number;
  setCurrentQuestion: (question: number) => void;
  setScore: (score: number) => void;
  setTimeLeft: (time: number) => void;
  setQuizActive: (active: boolean) => void;
  setCorrectAnswers: (correct: number) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  currentQuestion: 0,
  score: 0,
  timeLeft: 300, // 5 minutes in seconds
  isQuizActive: false,
  correctAnswers: 0,
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setScore: (score) => set({ score }),
  setTimeLeft: (time) => set({ timeLeft: time }),
  setQuizActive: (active) => set({ isQuizActive: active }),
  setCorrectAnswers: (correct) => set({ correctAnswers: correct }),
  resetQuiz: () => set({
    currentQuestion: 0,
    score: 0,
    timeLeft: 300,
    isQuizActive: false,
    correctAnswers: 0,
  }),
}));