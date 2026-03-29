import Link from "next/link";
import { getAllCoursesMeta } from "@/lib/courses";
import { getAllQuizzes } from "@/lib/quizzes";

export const metadata = {
  title: "Educación NormativaCEN",
  description: "Mini cursos operativos y guías rápidas para equipos de cumplimiento.",
};

export default async function EducationPage() {
  const [courses, quizzes] = await Promise.all([getAllCoursesMeta(), getAllQuizzes()]);
  const totalDuration = courses.reduce((acc, course) => {
    const minutes = parseInt(course.duration, 10);
    return acc + (Number.isNaN(minutes) ? 0 : minutes);
  }, 0);

  const levels = [
    {
      key: "fundamentos",
      label: "Fundamentos",
      description: "Onboarding para entender NTSyCS, SITR y EDAC antes de una auditoría.",
    },
    {
      key: "operacion",
      label: "Operación",
      description: "Playbooks para incidentes en vivo, redundancia y respuesta SITR.",
    },
    {
      key: "especializacion",
      label: "Especialización",
      description: "Cursos avanzados de ciberseguridad OT y BESS (próximamente).",
    },
  ] as const;

  const coursesByLevel = levels.map((level) => ({
    ...level,
    courses: courses.filter((course) => course.level === level.key),
  }));

  const flowSteps = [
    {
      title: "Explora",
      detail: "Elige un curso según tu brecha y descarga los recursos.",
    },
    {
      title: "Practica",
      detail: "Vuelve al dashboard, ejecuta el módulo y responde el quiz.",
    },
    {
      title: "Registra",
      detail: "Presiona “Registrar quiz xAPI” para guardar la evidencia en el LRS.",
    },
  ];

  return (
    <div className="education-shell">
      <section className="education-hero">
        <div className="hero-col">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Centro educativo</p>
          <h1 className="text-4xl font-extrabold tracking-tight">Aprende, ejecuta y registra</h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Microlecciones de menos de 10 minutos alineadas con la matriz NormativaCEN. Todo el material vive aquí; los quizzes y badges se registran desde el dashboard.
          </p>
          <div className="hero-actions">
            <Link href="/" className="btn-primary">
              Ir al dashboard
            </Link>
            <Link href="/documentacion" className="btn-secondary">
              Revisar dossiers
            </Link>
          </div>
        </div>
        <div className="hero-col stats">
          <div>
            <span>Cursos publicados</span>
            <strong>{courses.length}</strong>
          </div>
          <div>
            <span>Tiempo total</span>
            <strong>{totalDuration}+ min</strong>
          </div>
          <div>
            <span>Quizzes activos</span>
            <strong>{quizzes.length}</strong>
          </div>
          <div>
            <span>Modo vigente</span>
            <strong>Guía · Operativo</strong>
          </div>
        </div>
      </section>

      <section className="education-flow">
        {flowSteps.map((step, index) => (
          <div key={step.title} className="flow-step">
            <div className="flow-index">0{index + 1}</div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">{step.title}</p>
              <p className="text-sm text-white/80">{step.detail}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="levels-grid">
        {coursesByLevel.map((level) => (
          <div key={level.key} className="level-card">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">{level.label}</p>
              <h3 className="text-2xl font-bold text-white">{level.description}</h3>
            </div>
            <div className="level-courses">
              {level.courses.length > 0 ? (
                level.courses.map((course) => (
                  <Link key={course.slug} href={`/educacion/${course.slug}`} className="level-course-card">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/60">
                      <span>{course.duration}</span>
                      <span>Quiz {course.quizId}</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">{course.title}</h4>
                    <p className="text-sm text-white/70">{course.summary}</p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-white/60">Contenido en producción.</p>
              )}
            </div>
          </div>
        ))}
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
