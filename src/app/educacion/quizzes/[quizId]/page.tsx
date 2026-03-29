import { notFound } from "next/navigation";
import Link from "next/link";
import { getQuizById } from "@/lib/quizzes";

interface QuizPageProps {
  params: Promise<{ quizId: string }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { quizId } = await params;
  const quiz = await getQuizById(quizId);
  if (!quiz) notFound();

  return (
    <div className="quiz-shell">
      <section className="quiz-hero">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Quiz operativo</p>
          <h1 className="text-4xl font-extrabold tracking-tight">{quiz.title}</h1>
          <p className="text-white/70 text-lg max-w-3xl">{quiz.description}</p>
        </div>
        <div className="quiz-meta">
          <div>
            <span>Identificador</span>
            <strong>{quiz.id}</strong>
          </div>
          <div>
            <span>Tiempo estimado</span>
            <strong>{quiz.estimatedTime}</strong>
          </div>
          <div>
            <span>LRS Object</span>
            <strong className="text-xs break-all">{quiz.lrsObjectId}</strong>
          </div>
        </div>
      </section>

      <section className="quiz-body">
        <ol className="quiz-steps">
          <li>
            Abre el dashboard en modo guía y ejecuta la consulta relacionada con este quiz.
          </li>
          <li>
            Completa las preguntas en menos de {quiz.estimatedTime} para registrar progreso.
          </li>
          <li>
            El botón “Registrar quiz xAPI” en el panel educativo enviará el statement con el ID {quiz.id}.
          </li>
        </ol>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn-secondary">
            Ir al dashboard
          </Link>
          <Link href="/educacion" className="btn-primary">
            Volver a cursos
          </Link>
        </div>
      </section>
    </div>
  );
}
