import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CURRICULUM_DIR = path.join(process.cwd(), 'src', 'curriculum');

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface Tier {
  id: number;
  title: string;
  subtitle: string;
  lessonCount: number;
}

export interface LessonFrontmatter {
  tierId: number;
  moduleId: number;
  lessonId: number;
  title: string;
  mode: 'terminal' | 'sql' | 'canvas' | 'diagram';
  xpReward: number;
  syntaxHint?: string;
  task1Code?: string;
  task1Logic?: string;
  task2Code?: string;
  task2Logic?: string;
  task3Code?: string;
  task3Logic?: string;
  startingCode?: string;
  validationLogic?: string;
}

export interface BossFrontmatter {
  tierId: number;
  moduleId: number;
  type: 'boss';
  title: string;
  mode: 'terminal' | 'sql' | 'canvas' | 'diagram';
  xpReward: number;
  startingCode: string;
  validationLogic: string;
}

export interface CapstoneFrontmatter {
  tierId: number;
  type: 'capstone';
  title: string;
  mode: 'terminal' | 'sql' | 'canvas' | 'diagram';
  xpReward: number;
  startingCode: string;
  validationLogic: string;
}

// ─── LESSONS ──────────────────────────────────────────────────────────────────

/**
 * Returns all lessons for a given tier, sorted by lessonId ascending.
 * Reads from src/curriculum/tier-XX/module-XX/*.md(x) files.
 * Skips boss.md(x) automatically.
 */
export function getAllLessonsForTier(tierId: string | number) {
  const pTier = String(tierId).padStart(2, '0');
  const tierDir = path.join(CURRICULUM_DIR, `tier-${pTier}`);
  if (!fs.existsSync(tierDir)) return [];

  const lessons: (LessonFrontmatter & { moduleId: number })[] = [];
  const modules = fs
    .readdirSync(tierDir)
    .filter(f => f.startsWith('module-'));

  for (const mod of modules) {
    const modDir = path.join(tierDir, mod);
    if (!fs.statSync(modDir).isDirectory()) continue;

    const mId = parseInt(mod.split('-')[1]);

    // Accept both .md and .mdx, but skip boss files so they don't render as standard lessons
    const files = fs
      .readdirSync(modDir)
      .filter(f => 
        (f.endsWith('.md') || f.endsWith('.mdx')) && 
        !f.startsWith('boss')
      );

    for (const file of files) {
      const source = fs.readFileSync(path.join(modDir, file), 'utf8');
      const { data } = matter(source);
      lessons.push({ ...(data as LessonFrontmatter), moduleId: mId });
    }
  }

  return lessons.sort((a, b) => Number(a.lessonId) - Number(b.lessonId));
}

/**
 * Returns a single lesson by tier and lesson ID.
 * Searches all module subdirectories within the tier.
 */
export function getLessonByTierAndId(tierId: string, lessonId: string) {
  const pTier = String(tierId).padStart(2, '0');
  const pLesson = String(lessonId).padStart(2, '0');
  const tierDir = path.join(CURRICULUM_DIR, `tier-${pTier}`);

  if (!fs.existsSync(tierDir)) return null;

  const modules = fs
    .readdirSync(tierDir)
    .filter(f => f.startsWith('module-'));

  for (const mod of modules) {
    const modDir = path.join(tierDir, mod);
    if (!fs.statSync(modDir).isDirectory()) continue;

    // Try .md first, then .mdx for backwards compatibility
    const mdPath = path.join(modDir, `lesson-${pLesson}.md`);
    const mdxPath = path.join(modDir, `lesson-${pLesson}.mdx`);
    const filePath = fs.existsSync(mdPath) ? mdPath : fs.existsSync(mdxPath) ? mdxPath : null;

    if (filePath) {
      const source = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(source);
      return { frontmatter: data as LessonFrontmatter, content };
    }
  }

  return null;
}

// ─── BOSS FIGHTS ──────────────────────────────────────────────────────────────

/**
 * Returns the boss fight for a given tier and module.
 * Expected file path: src/curriculum/tier-XX/module-XX/boss.md(x)
 */
export function getModuleBoss(tierId: string | number, moduleId: number) {
  const pTier = String(tierId).padStart(2, '0');
  const pMod = String(moduleId).padStart(2, '0');

  const mdPath = path.join(CURRICULUM_DIR, `tier-${pTier}`, `module-${pMod}`, 'boss.md');
  const mdxPath = path.join(CURRICULUM_DIR, `tier-${pTier}`, `module-${pMod}`, 'boss.mdx');
  const filePath = fs.existsSync(mdPath) ? mdPath : fs.existsSync(mdxPath) ? mdxPath : null;

  if (!filePath) return null;

  const source = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(source);
  return { frontmatter: data as BossFrontmatter, content };
}

/**
 * Checks whether a boss fight file exists for a given tier and module.
 */
export function hasBossFight(tierId: string | number, moduleId: number): boolean {
  const pTier = String(tierId).padStart(2, '0');
  const pMod = String(moduleId).padStart(2, '0');
  const base = path.join(CURRICULUM_DIR, `tier-${pTier}`, `module-${pMod}`);
  
  if (!fs.existsSync(base)) return false;
  return fs.existsSync(path.join(base, 'boss.md')) || fs.existsSync(path.join(base, 'boss.mdx'));
}

// ─── CAPSTONES ────────────────────────────────────────────────────────────────

/**
 * Returns the capstone for a given tier.
 * Expected file path: src/curriculum/tier-XX/capstone.md(x)
 */
export function getTierCapstone(tierId: string | number) {
  const pTier = String(tierId).padStart(2, '0');

  const mdPath = path.join(CURRICULUM_DIR, `tier-${pTier}`, 'capstone.md');
  const mdxPath = path.join(CURRICULUM_DIR, `tier-${pTier}`, 'capstone.mdx');
  const filePath = fs.existsSync(mdPath) ? mdPath : fs.existsSync(mdxPath) ? mdxPath : null;

  if (!filePath) return null;

  const source = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(source);
  return { frontmatter: data as CapstoneFrontmatter, content };
}

/**
 * Checks whether a capstone file exists for a given tier.
 */
export function hasTierCapstone(tierId: string | number): boolean {
  const pTier = String(tierId).padStart(2, '0');
  const base = path.join(CURRICULUM_DIR, `tier-${pTier}`);
  
  if (!fs.existsSync(base)) return false;
  return fs.existsSync(path.join(base, 'capstone.md')) || fs.existsSync(path.join(base, 'capstone.mdx'));
}

// ─── TIERS ────────────────────────────────────────────────────────────────────

/**
 * Returns all tier metadata including live lesson counts.
 */
export function getAllTiers(): Tier[] {
  const baseTiers = [
    { id: 1, title: 'Code Literacy',              subtitle: 'The Syntax Decoder'         },
    { id: 2, title: 'JavaScript Deeply',          subtitle: 'The Logic Engine'           },
    { id: 3, title: 'React — The Mental Model',   subtitle: 'State & Glass'              },
    { id: 4, title: 'The Web Platform',           subtitle: 'Network & Transport'        },
    { id: 5, title: 'Databases & Backend',        subtitle: 'Data Persistence'           },
    { id: 6, title: 'CS Essentials',              subtitle: 'Algorithms & Optimization'  },
    { id: 7, title: 'System Design',              subtitle: 'Architecture'               },
  ];

  return baseTiers.map(tier => ({
    ...tier,
    lessonCount: getAllLessonsForTier(tier.id).length,
  }));
}

// ─── MODULE STRUCTURE ─────────────────────────────────────────────────────────

/**
 * Returns a list of all module IDs that have at least one lesson for a given tier.
 */
export function getModuleIdsForTier(tierId: string | number): number[] {
  const lessons = getAllLessonsForTier(tierId);
  const ids = Array.from(new Set(lessons.map(l => l.moduleId)));
  return ids.sort((a, b) => a - b);
}
