import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function calculateScore(timeLeft: number, correctAnswers: number): number {
  const baseScore = correctAnswers * 100;
  const timeBonus = Math.floor(timeLeft * 0.5);
  return baseScore + timeBonus;
}