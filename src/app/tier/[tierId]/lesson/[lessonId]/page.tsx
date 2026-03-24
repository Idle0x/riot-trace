import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import LiveCodeRunner from '@/components/LiveCodeRunner';

export default async function LessonPage({ params }: { params: { tierId: string, moduleId: string, lessonId: string } }) {
  // 1. Locate and read the MDX file
  const filePath = path.join(
    process.cwd(), 
    'src', 
    'curriculum', 
    `tier-${params.tierId}`, 
    `module-${params.moduleId}`, 
    `lesson-${params.lessonId}.mdx`
  );

  let source;
  try {
    source = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    return <div className="p-8 text-accent-red font-mono">ERROR: LESSON FILE NOT FOUND.</div>;
  }

  // 2. Parse the Frontmatter and Content
  const { content, data: frontmatter } = matter(source);

  // 3. The Compatibility Mapper
  // If it's a new file, it loads all 3 tasks.
  // If it's an old file (only has startingCode), it creates a 1-task array defaulting to Synthesis (+40 XP).
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
