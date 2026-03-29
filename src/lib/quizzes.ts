import path from "node:path";
import { promises as fs } from "node:fs";

const QUIZZES_FILE = path.join(process.cwd(), "public", "education", "quizzes.json");

export interface QuizMeta {
  id: string;
  title: string;
  description: string;
  lrsObjectId: string;
  estimatedTime: string;
}

async function readQuizzes(): Promise<QuizMeta[]> {
  const file = await fs.readFile(QUIZZES_FILE, "utf8");
  return JSON.parse(file) as QuizMeta[];
}

export async function getQuizById(id: string): Promise<QuizMeta | null> {
  const quizzes = await readQuizzes();
  return quizzes.find((quiz) => quiz.id === id) ?? null;
}

export async function getAllQuizzes(): Promise<QuizMeta[]> {
  return readQuizzes();
}
