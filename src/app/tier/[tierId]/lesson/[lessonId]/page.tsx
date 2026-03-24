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
  // Await params to get the moduleId from the URL
  const { tierId, moduleId, lessonId } = await params;

  const paddedTier = String(tierId).padStart(2, '0');
  const paddedModule = String(moduleId).padStart(2, '0');
  const paddedLesson = String(lessonId).padStart(2, '0');

  const filePath = path.join(
    process.cwd(), 
    'src', 
    'curriculum', 
    `tier-${paddedTier}`, 
    `module-${paddedModule}`, 
    `lesson-${paddedLesson}.mdx`
  );

  let source;
  try {
    source = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
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
          <div className="text-text-primary font-mono text-xs mb-2">Files found in: tier-{paddedTier}/module-{paddedModule}</div>
          <div className="text-phosphor font-mono text-[10px] bg-[#020203] p-2 border border-border-dim">{folderContents}</div>
        </div>
      </div>
    );
  }

  const { content, data: frontmatter } = matter(source);

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
      <div className="w-1/2 h-full overflow-y-auto custom-scrollbar border-r border-border-dim">
        <div className="p-8 max-w-3xl mx-auto prose prose-invert prose-pre:bg-[#020203] prose-pre:border prose-pre:border-border-dim prose-headings:font-mono prose-a:text-accent-blue">
          <header className="mb-8 border-b border-border-dim pb-4">
            <div className="text-[10px] font-mono tracking-widest text-accent-blue uppercase mb-2">
              Tier {frontmatter.tierId} // Module {frontmatter.moduleId} // Lesson {frontmatter.lessonId}
            </div>
            <h1 className="text-2xl font-sans font-bold tracking-tight m-0">{frontmatter.title}</h1>
          </header>
          <MDXRemote source={content} />
        </div>
      </div>

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
