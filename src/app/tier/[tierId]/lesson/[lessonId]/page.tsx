import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import LiveCodeRunner from '@/components/LiveCodeRunner';

export default async function LessonPage({ 
  params 
}: { 
  params: Promise<{ tierId: string; lessonId: string; }> 
}) {
  // 1. Await params (Required for Next.js 16)
  const { tierId, lessonId } = await params;

  // 2. Format IDs for file system (1 -> 01)
  const pTier = String(tierId).padStart(2, '0');
  const pLesson = String(lessonId).padStart(2, '0');

  // 3. Find the file by scanning the modules in this tier
  const tierPath = path.join(process.cwd(), 'src', 'curriculum', `tier-${pTier}`);
  
  if (!fs.existsSync(tierPath)) {
    return <div className="p-8 text-accent-red font-mono">ERROR: TIER FOLDER NOT FOUND</div>;
  }

  const modules = fs.readdirSync(tierPath).filter(f => f.startsWith('module-'));
  let filePath = "";

  for (const mod of modules) {
    const potentialPath = path.join(tierPath, mod, `lesson-${pLesson}.mdx`);
    if (fs.existsSync(potentialPath)) {
      filePath = potentialPath;
      break;
    }
  }

  // 4. Handle 404
  if (!filePath) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0c] p-8">
        <div className="border border-accent-red bg-accent-red/10 p-6 rounded-sm shadow-plate max-w-2xl w-full">
          <div className="text-accent-red font-mono font-bold tracking-widest text-sm mb-4">CRITICAL ERROR: LESSON NOT FOUND</div>
          <div className="text-text-primary font-mono text-xs mb-2">The engine searched all modules in tier-{pTier} for:</div>
          <div className="text-accent-yellow font-mono text-[10px] bg-[#020203] p-2 border border-border-dim mb-4">lesson-{pLesson}.mdx</div>
        </div>
      </div>
    );
  }

  // 5. Parse and Render
  const source = fs.readFileSync(filePath, 'utf8');
  const { content, data: frontmatter } = matter(source);

  const tasks = [
    { code: frontmatter.task1Code, logic: frontmatter.task1Logic, type: "task_1" },
    { code: frontmatter.task2Code, logic: frontmatter.task2Logic, type: "task_2" },
    { code: frontmatter.task3Code, logic: frontmatter.task3Logic, type: "task_3" }
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0c] text-text-primary overflow-hidden">
      <div className="w-1/2 h-full overflow-y-auto p-8 border-r border-border-dim custom-scrollbar">
        <header className="mb-8 border-b border-border-dim pb-4">
          <div className="text-[10px] font-mono tracking-widest text-accent-blue uppercase mb-2">
            Archive_Segment: T{pTier} // L{pLesson}
          </div>
          <h1 className="text-2xl font-sans font-bold tracking-tight m-0">{frontmatter.title}</h1>
        </header>
        <div className="prose prose-invert max-w-none">
          <MDXRemote source={content} />
        </div>
      </div>

      <div className="w-1/2 h-full bg-base p-4">
        <LiveCodeRunner
          lessonId={frontmatter.lessonId}
          tasks={tasks}
          mode={frontmatter.mode || "terminal"}
          syntaxHint={frontmatter.syntaxHint}
        />
      </div>
    </div>
  );
}
