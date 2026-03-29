import path from "node:path";
import { promises as fs } from "node:fs";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/education/mdx-components";
import { ReactElement } from "react";

const COURSES_DIR = path.join(process.cwd(), "src", "content", "courses");

export type CourseLevel = "fundamentos" | "operacion" | "especializacion";
export type CourseMode = "guide" | "expert";

export interface CourseMeta {
  title: string;
  slug: string;
  summary: string;
  duration: string;
  quizId: string;
  mode: CourseMode;
  level: CourseLevel;
  publishDate: string;
  heroHighlight: string;
  tags?: string[];
  resources?: { title: string; href: string }[];
}

export interface CourseContent {
  meta: CourseMeta;
  content: ReactElement;
}

async function readCourseFile(slug: string): Promise<string | null> {
  const filePath = path.join(COURSES_DIR, `${slug}.mdx`);
  try {
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}

export async function getAllCourseSlugs(): Promise<string[]> {
  const entries = await fs.readdir(COURSES_DIR);
  return entries.filter((entry) => entry.endsWith(".mdx")).map((entry) => entry.replace(/\.mdx$/, ""));
}

export async function getAllCoursesMeta(): Promise<CourseMeta[]> {
  const slugs = await getAllCourseSlugs();
  const metas = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await readCourseFile(slug);
      if (!raw) return null;
      const { data } = matter(raw);
      return data as CourseMeta;
    })
  );
  return metas
    .filter((meta): meta is CourseMeta => Boolean(meta))
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

export async function getCourseBySlug(slug: string): Promise<CourseContent | null> {
  const source = await readCourseFile(slug);
  if (!source) return null;

  const { content, frontmatter } = await compileMDX<CourseMeta>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
    components: mdxComponents,
  });

  return { meta: frontmatter, content };
}
