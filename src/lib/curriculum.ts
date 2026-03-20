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
  syntaxHint?: string;
}

export interface Lesson extends LessonFrontmatter {
  content: string;
}

export interface TierSummary {
  id: number;
  title: string;
  description: string;
  lessonCount: number;
}

// Hardcoded Tier metadata (since folders don't have frontmatter)
const TIER_METADATA: Record<number, { title: string, description: string }> = {
  1: { title: "Code Literacy", description: "Read code like a sentence. Trace exactly what happens — not guess, but know." },
  2: { title: "JavaScript Deeply", description: "Closures, the event loop, async/await — the mental models behind code you write every day." },
  3: { title: "React — The Mental Model", description: "Why React re-renders, how hooks really work, stale closures — own the framework you already use." },
  4: { title: "The Web Platform", description: "HTTP, CORS, auth, caching — the invisible layer most self-taught devs never fully understand." },
  5: { title: "Databases & Backend", description: "SQL, schema design, indexes, transactions — formalize what you have been doing intuitively." },
  6: { title: "CS Essentials", description: "Data structures, Big-O intuition, trade-offs — practical reasoning, not textbook theory." },
  7: { title: "System Design", description: "Load balancing, caching, scaling — formal language for architecture decisions you already make." },
};

export function getLesson(tierId: number, moduleId: number, lessonId: number): Lesson | null {
  const tierFolder = `tier-${String(tierId).padStart(2, '0')}`;
  const moduleFolder = `module-${String(moduleId).padStart(2, '0')}`;
  const lessonFile = `lesson-${String(lessonId).padStart(2, '0')}.mdx`;

  const fullPath = path.join(CURRICULUM_DIR, tierFolder, moduleFolder, lessonFile);

  try {
    if (!fs.existsSync(fullPath)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return { ...(data as LessonFrontmatter), content };
  } catch (error) {
    return null;
  }
}

export function getAllLessonsForTier(tierId: number): LessonFrontmatter[] {
  const tierFolder = `tier-${String(tierId).padStart(2, '0')}`;
  const tierPath = path.join(CURRICULUM_DIR, tierFolder);
  
  if (!fs.existsSync(tierPath)) return [];

  const lessons: LessonFrontmatter[] = [];
  const modules = fs.readdirSync(tierPath).filter(file => fs.statSync(path.join(tierPath, file)).isDirectory());

  for (const mod of modules) {
    const modPath = path.join(tierPath, mod);
    const files = fs.readdirSync(modPath).filter(file => file.endsWith('.mdx'));
    
    for (const file of files) {
      const fileContents = fs.readFileSync(path.join(modPath, file), 'utf8');
      const { data } = matter(fileContents);
      lessons.push(data as LessonFrontmatter);
    }
  }

  return lessons.sort((a, b) => a.moduleId === b.moduleId ? a.lessonId - b.lessonId : a.moduleId - b.moduleId);
}

export function getAllTiers(): TierSummary[] {
  if (!fs.existsSync(CURRICULUM_DIR)) return [];

  const tierFolders = fs.readdirSync(CURRICULUM_DIR).filter(file => file.startsWith('tier-'));
  
  return tierFolders.map(folder => {
    const tierId = parseInt(folder.replace('tier-', ''), 10);
    const lessons = getAllLessonsForTier(tierId);
    return {
      id: tierId,
      title: TIER_METADATA[tierId]?.title || `Tier ${tierId}`,
      description: TIER_METADATA[tierId]?.description || "",
      lessonCount: lessons.length
    };
  }).sort((a, b) => a.id - b.id);
}
