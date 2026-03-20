import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CURRICULUM_DIR = path.join(process.cwd(), 'src/curriculum');

export interface LessonFrontmatter {
  tierId: number;
  moduleId: number;
  lessonId: number;
  title: string;
  xpReward: number;
  scenario: string;
  startingCode: string;
  validationLogic: string;
}

export interface Lesson extends LessonFrontmatter {
  content: string;
}

// Fetch a specific lesson based on the routing parameters
export function getLesson(tierId: number, moduleId: number, lessonId: number): Lesson | null {
  // e.g., src/curriculum/tier-01/module-01/lesson-01.mdx
  const tierFolder = `tier-${String(tierId).padStart(2, '0')}`;
  const moduleFolder = `module-${String(moduleId).padStart(2, '0')}`;
  const lessonFile = `lesson-${String(lessonId).padStart(2, '0')}.mdx`;

  const fullPath = path.join(CURRICULUM_DIR, tierFolder, moduleFolder, lessonFile);

  try {
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // gray-matter separates the metadata block from the markdown content
    const { data, content } = matter(fileContents);

    return {
      ...(data as LessonFrontmatter),
      content,
    };
  } catch (error) {
    console.error("Error reading lesson file:", error);
    return null;
  }
}
