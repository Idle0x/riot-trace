import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CURRICULUM_DIR = path.join(process.cwd(), 'src', 'curriculum');

export function getAllLessonsForTier(tierId: string | number) {
  const pTier = String(tierId).padStart(2, '0');
  const tierDir = path.join(CURRICULUM_DIR, `tier-${pTier}`);
  
  if (!fs.existsSync(tierDir)) return [];

  const lessons: any[] = [];
  const modules = fs.readdirSync(tierDir).filter(f => f.startsWith('module-'));

  for (const mod of modules) {
    const modDir = path.join(tierDir, mod);
    const mId = parseInt(mod.split('-')[1]);
    const files = fs.readdirSync(modDir).filter(f => f.endsWith('.mdx'));

    for (const file of files) {
      const source = fs.readFileSync(path.join(modDir, file), 'utf8');
      const { data } = matter(source);
      // We attach the moduleId manually so the TierPage links know where to go
      lessons.push({ ...data, moduleId: mId });
    }
  }

  return lessons.sort((a, b) => Number(a.lessonId) - Number(b.lessonId));
}

export function getAllTiers() {
  const base = [
    { id: 1, title: "Code Literacy", subtitle: "The Syntax Decoder" },
    { id: 2, title: "JavaScript Deeply", subtitle: "The Logic Engine" },
    { id: 3, title: "React — The Mental Model", subtitle: "State & Glass" },
    { id: 4, title: "The Web Platform", subtitle: "Network & Transport" },
    { id: 5, title: "Databases & Backend", subtitle: "Data Persistence" },
    { id: 6, title: "CS Essentials", subtitle: "Algorithms & Optimization" },
    { id: 7, title: "System Design", subtitle: "Architecture" }
  ];
  return base.map(t => ({ ...t, lessonCount: getAllLessonsForTier(t.id).length }));
}
