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
        <h2 className="course-heading">Cómo tomar este quiz</h2>
        <ol className="quiz-steps">
          <li>
            Ingresa al dashboard, abre el panel “Centro educativo” y selecciona el módulo asociado.
          </li>
          <li>
            Presiona “Registrar quiz xAPI” una vez que hayas respondido todas las preguntas. El statement se enviará con el ID <strong>{quiz.id}</strong> y quedará en el mini LRS (Mongo).
          </li>
          <li>
            Si necesitas repetirlo, vuelve al mismo módulo y ejecuta nuevamente el quiz; el badge se actualiza automáticamente cuando todos los módulos del modo estén en “Completado”.
          </li>
        </ol>
        <p className="course-paragraph">
          Recuerda que el contenido y los recursos de apoyo viven en la vista de cursos. Usa esta página solo como referencia rápida del identificador y las instrucciones de registro.
        </p>
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
