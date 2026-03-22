import fs from "fs";
import path from "path";
import matter from "gray-matter";

// 1. THE CORE FRONTMATTER INTERFACE
export interface LessonFrontmatter {
  tierId: number;
  moduleId: number;
  lessonId: number;
  title: string;
  xpReward: number;
  scenario: string;
  startingCode: string;
  validationLogic: string;
  syntaxHint?: string;
  
  // THE NEW UPGRADES
  mode?: "terminal" | "dom" | "sql"; 
  dbSeed?: string; 
}

// 2. THE LESSON PAYLOAD INTERFACE
export interface Lesson {
  frontmatter: LessonFrontmatter;
  content: string;
}

// 3. UTILITY: FETCH A SPECIFIC LESSON
// This ensures that when your page.tsx asks for a lesson, it correctly extracts the new 'mode' and 'dbSeed' properties.
export function getLesson(tierId: string, moduleId: string, lessonId: string): Lesson | null {
  try {
    const filePath = path.join(
      process.cwd(),
      "src",
      "curriculum",
      `tier-${tierId.padStart(2, "0")}`,
      `module-${moduleId.padStart(2, "0")}`,
      `lesson-${lessonId.padStart(2, "0")}.mdx`
    );

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      frontmatter: data as LessonFrontmatter,
      content,
    };
  } catch (error) {
    console.error("Error reading lesson file:", error);
    return null;
  }
}
