import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/courses";

export const dynamic = "force-dynamic";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const { meta, content } = course;
  const publishDate = new Date(meta.publishDate).toLocaleDateString("es-CL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="course-shell" data-mode={meta.mode}>
      <section className="course-hero">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <span className="hero-pill">{meta.level}</span>
            <span className="hero-pill">{meta.duration}</span>
            <span className="hero-pill">Quiz {meta.quizId}</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">{meta.title}</h1>
          <p className="text-lg text-white/80 max-w-3xl">{meta.heroHighlight}</p>
        </div>
        <div className="course-hero-side">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Publicado</p>
          <span className="text-lg font-bold text-white">{publishDate}</span>
          <p className="text-sm text-white/60">{meta.summary}</p>
        </div>
      </section>

      <div className="course-layout">
        <article className="course-body">{content}</article>
        <aside className="course-sidebar">
          <div className="sidebar-card">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Quiz</p>
            <h4 className="text-xl font-bold text-white">{meta.quizId}</h4>
            <p className="text-sm text-white/70">Reporta tu progreso desde el dashboard para obtener el badge correspondiente.</p>
          </div>
          {meta.resources && meta.resources.length > 0 && (
            <div className="sidebar-card">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Recursos</p>
              <ul className="space-y-2">
                {meta.resources.map((resource) => (
                  <li key={resource.href}>
                    <a href={resource.href} className="resource-link" target="_blank">
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
