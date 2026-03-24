import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CURRICULUM_DIR = path.join(process.cwd(), 'src', 'curriculum');

// 1. Return the strict 7-Tier Master Architecture
export function getAllTiers() {
  return [
    { id: 1, title: "Code Literacy", subtitle: "The Syntax Decoder" },
    { id: 2, title: "JavaScript Deeply", subtitle: "The Logic Engine" },
    { id: 3, title: "React — The Mental Model", subtitle: "State & Glass" },
    { id: 4, title: "The Web Platform", subtitle: "Network & Transport" },
    { id: 5, title: "Databases & Backend", subtitle: "Data Persistence" },
    { id: 6, title: "CS Essentials", subtitle: "Algorithms & Optimization" },
    { id: 7, title: "System Design", subtitle: "Architecture" }
  ];
}

// 2. Dynamically crawl the MDX folders to find all lessons for a specific tier
export function getAllLessonsForTier(tierId: string | number) {
  // Pad tierId to match folder structure (e.g., '1' -> '01')
  const formattedTierId = String(tierId).padStart(2, '0');
  const tierDir = path.join(CURRICULUM_DIR, `tier-${formattedTierId}`);
  
  if (!fs.existsSync(tierDir)) return [];

  const lessons: any[] = [];
  
  // Find all module folders inside the tier
  const modules = fs.readdirSync(tierDir).filter(f => f.startsWith('module-'));

  for (const mod of modules) {
    const modDir = path.join(tierDir, mod);
    const files = fs.readdirSync(modDir).filter(f => f.endsWith('.mdx'));

    for (const file of files) {
      const filePath = path.join(modDir, file);
      const source = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(source);
      
      lessons.push(data);
    }
  }

  // Sort by lessonId so the UI always renders the exact sequential progression
  return lessons.sort((a, b) => Number(a.lessonId) - Number(b.lessonId));
}
