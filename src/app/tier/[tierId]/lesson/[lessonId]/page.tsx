import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import LiveCodeRunner from '@/components/LiveCodeRunner';

export default async function LessonPage({ 
  params 
}: { 
  params: Promise<{ tierId: string; moduleId: string; lessonId: string; }> 
}) {
  // CRITICAL FIX: In Next.js 15+, params is a Promise and MUST be awaited.
  const { tierId, moduleId, lessonId } = await params;

  // 1. Force the URL parameters to match the 2-digit folder/file structure (e.g. 1 -> 01)
  const paddedTier = String(tierId).padStart(2, '0');
  const paddedModule = String(moduleId).padStart(2, '0');
  const paddedLesson = String(lessonId).padStart(2, '0');

  // 2. Locate the MDX file
  let filePath = path.join(
    process.cwd(), 
    'src', 
    'curriculum', 
    `tier-${paddedTier}`, 
    `module-${paddedModule}`, 
    `lesson-${paddedLesson}.mdx`
  );

  // Fallback: If it's a boss fight and named boss-XX.mdx instead of lesson-XX.mdx
  if (!fs.existsSync(filePath)) {
    const bossPath = path.join(
      process.cwd(), 
      'src', 
      'curriculum', 
      `tier-${paddedTier}`, 
      `module-${paddedModule}`, 
      `boss-${paddedLesson}.mdx`
    );
    if (fs.existsSync(bossPath)) {
      filePath = bossPath;
    }
  }

  let source;
  try {
    source = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    // Error feedback loop
    let folderContents = "Folder does not exist";
    try {
      const dirPath = path.join(process.cwd(), 'src', 'curriculum', `tier-${paddedTier}`, `module-${paddedModule}`);
      folderContents = fs.readdirSync(dirPath).join(", ");
    } catch(e) {}

    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0c] p-8">
        <div className="border border-accent-red bg-accent-red/10 p-6 rounded-sm shadow-plate max-w-2xl w-full">
          <div className="text-accent-red font-mono font-bold tracking-widest text-sm mb-4">CRITICAL ERROR: FILE NOT FOUND</div>
          <div className="text-text-primary font-mono text-xs mb-2">The engine attempted to load:</div>
          <div className="text-accent-yellow font-mono text-[10px] bg-[#020203] p-2 border border-border-dim mb-4">{filePath}</div>
          <div className="text-text-primary font-mono text-xs mb-2">Files currently found in that directory:</div>
          <div className="text-phosphor font-mono text-[10px] bg-[#020203] p-2 border border-border-dim">{folderContents}</div>
        </div>
      </div>
    );
  }

  // 3. Parse the Frontmatter and Content
  const { content, data: frontmatter } = matter(source);

  // 4. The Compatibility Mapper (Handles 3-Task vs 1-Task legacy files)
  const tasks = frontmatter.task1Code 
    ? [
        { code: frontmatter.task1Code, logic: frontmatter.task1Logic, type: "task_1" },
        { code: frontmatter.task2Code, logic: frontmatter.task2Logic, type: "task_2" },
        { code: frontmatter.task3Code, logic: frontmatter.task3Logic, type: "task_3" }
      ]
    : [
        { code: frontmatter.startingCode, logic: frontmatter.validationLogic, type: "task_3" }
      ];

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-text-primary overflow-hidden">
      {/* THEORY PANE (Left) */}
      <div className="w-1/2 h-full overflow-y-auto custom-scrollbar border-r border-border-dim">
        <div className="p-8 max-w-3xl mx-auto prose prose-invert prose-pre:bg-[#020203] prose-pre:border prose-pre:border-border-dim prose-headings:font-mono prose-a:text-accent-blue">
          <header className="mb-8 border-b border-border-dim pb-4">
            <div className="text-[10px] font-mono tracking-widest text-accent-blue uppercase mb-2">
              Tier {frontmatter.tierId} // Module {frontmatter.moduleId} // Lesson {frontmatter.lessonId}
            </div>
            <h1 className="text-2xl font-sans tracking-tight m-0">{frontmatter.title}</h1>
          </header>
          
          <MDXRemote source={content} />
        </div>
      </div>

      {/* EXECUTION PANE (Right) */}
      <div className="w-1/2 h-full bg-base p-4 flex flex-col">
        <LiveCodeRunner
          lessonId={frontmatter.lessonId}
          tasks={tasks}
          mode={frontmatter.mode || "terminal"}
          dbSeed={frontmatter.dbSeed || ""}
          syntaxHint={frontmatter.syntaxHint}
        />
      </div>
    </div>
  );
}
