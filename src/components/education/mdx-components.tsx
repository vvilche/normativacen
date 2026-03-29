import Link from "next/link";
import { ReactNode } from "react";

interface QuizCTAProps {
  quizId: string;
  label?: string;
  description?: string;
}

const QuizCTA = ({ quizId, label = "Resolver quiz", description }: QuizCTAProps) => (
  <div className="quiz-cta">
    <div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Evaluación</p>
      <h4 className="text-lg font-black text-white">{label}</h4>
      {description && <p className="text-sm text-white/70">{description}</p>}
    </div>
    <button type="button" data-quiz-id={quizId} className="btn-primary w-full md:w-auto">
      Quiz {quizId}
    </button>
  </div>
);

interface CalloutProps {
  title: string;
  tone?: "info" | "warn" | "success";
  children: ReactNode;
}

const toneStyles: Record<Required<CalloutProps>["tone"], string> = {
  info: "border-white/20 bg-white/5",
  warn: "border-amber-200/40 bg-amber-200/10 text-amber-100",
  success: "border-emerald-200/40 bg-emerald-200/10 text-emerald-100",
};

const Callout = ({ title, tone = "info", children }: CalloutProps) => (
  <div className={`course-callout ${toneStyles[tone]}`}>
    <p className="text-[10px] uppercase tracking-[0.3em]">{title}</p>
    <div className="text-sm opacity-80">{children}</div>
  </div>
);

const ResourceLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className="resource-link" target="_blank">
    {children}
  </Link>
);

const KeyMetric = ({ label, value }: { label: string; value: string }) => (
  <div className="key-metric">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const Checklist = ({ children }: { children: ReactNode }) => (
  <ul className="course-checklist">{children}</ul>
);

const ChecklistItem = ({ children }: { children: ReactNode }) => (
  <li>
    <span>•</span>
    <p>{children}</p>
  </li>
);

export const mdxComponents = {
  QuizCTA,
  Callout,
  ResourceLink,
  KeyMetric,
  Checklist,
  ChecklistItem,
  h2: (props: React.ComponentPropsWithoutRef<"h2">) => (
    <h2 className="course-heading" {...props} />
  ),
  h3: (props: React.ComponentPropsWithoutRef<"h3">) => (
    <h3 className="course-subheading" {...props} />
  ),
  p: (props: React.ComponentPropsWithoutRef<"p">) => <p className="course-paragraph" {...props} />,
  ul: (props: React.ComponentPropsWithoutRef<"ul">) => <ul className="course-list" {...props} />,
  ol: (props: React.ComponentPropsWithoutRef<"ol">) => <ol className="course-list-ordered" {...props} />,
  li: (props: React.ComponentPropsWithoutRef<"li">) => <li className="course-list-item" {...props} />,
};
