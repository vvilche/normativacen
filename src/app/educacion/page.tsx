import Link from "next/link";
import { getAllCoursesMeta } from "@/lib/courses";
import { getAllQuizzes } from "@/lib/quizzes";

export const metadata = {
  title: "Educación NormativaCEN",
  description: "Mini cursos operativos y guías rápidas para equipos de cumplimiento.",
};

export default async function EducationPage() {
  const [courses, quizzes] = await Promise.all([getAllCoursesMeta(), getAllQuizzes()]);

  return (
    <div className="education-shell">
      <section className="education-hero">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Centro educativo</p>
          <h1 className="text-4xl font-extrabold tracking-tight">Microlecciones operativas</h1>
          <p className="text-lg text-white/70 max-w-2xl">
            Refuerza fundamentos NTSyCS, SITR y ciber OT con cursos de menos de 10 minutos conectados al dashboard y al mini LRS.
          </p>
        </div>
        <div className="education-stats">
          <div>
            <span>Cursos publicados</span>
            <strong>{courses.length}</strong>
          </div>
          <div>
            <span>Modalidades</span>
            <strong>Guía · Operativo</strong>
          </div>
        </div>
      </section>

      <section className="course-grid">
        {courses.map((course) => (
          <Link key={course.slug} href={`/educacion/${course.slug}`} className="course-card" data-mode={course.mode}>
            <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.3em] text-white/60">
              <span>{course.level}</span>
              <span>{course.duration}</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{course.title}</h2>
            <p className="text-sm text-white/70 flex-1">{course.summary}</p>
            <div className="flex flex-wrap gap-2">
              {course.tags?.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-white/60">
              Quiz {course.quizId}
            </div>
          </Link>
        ))}
      </section>

      {quizzes.length > 0 && (
        <section className="quiz-index">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Evaluaciones</p>
              <h2 className="text-2xl font-bold text-white">Quizzes disponibles</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizzes.map((quiz) => (
              <Link key={quiz.id} href={`/educacion/quizzes/${quiz.id}`} className="quiz-card">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">{quiz.id}</span>
                  <span className="text-white/60 text-xs">{quiz.estimatedTime}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-2">{quiz.title}</h3>
                <p className="text-sm text-white/70">{quiz.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
