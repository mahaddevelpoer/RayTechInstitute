import { buildLearningSnapshot } from './learning-snapshot.mjs';

/** Synthetic QA content only. Never write this catalog to the application checkout. */
export function learningPageFixture() {
  const tracks = [['html', 'HTML', '<h1>Hello</h1>'], ['css', 'CSS', 'h1 { color: navy; }'], ['javascript', 'JavaScript', 'console.log("Hello");'], ['php', 'PHP', '<?php echo "Hello";'], ['python', 'Python', 'print("Hello")']];
  const languages = tracks.map(([id, title]) => ({ id, slug: id, title, runtime: id, state: 'published', description: `Practice ${title} through this synthetic local verification course. This is test content, not a published lesson.` }));
  const courses = [{ id: 'web-development', slug: 'web-development', title: 'Web Development', description: 'Local QA course containing separate HTML, CSS, JavaScript and PHP tracks.', language_ids: ['html', 'css', 'javascript', 'php'], state: 'published' }, { id: 'python-course', slug: 'python-course', title: 'Python Programming', description: 'Local QA Python course.', language_ids: ['python'], state: 'published' }];
  const topics = tracks.flatMap(([language, title, code]) => [1, 2].map(position => ({
    id: `${language}-topic-${position}`, language_id: language, slug: `practice-${position}`, title: `${title} Practice ${position}`,
    summary: position === 1 ? 'Assign values.' : 'Learn the topic with a clear worked example, practice the code in your browser, and check your understanding before starting the assignment. '.repeat(3).trim(),
    position, version: position, objectives: [`Apply ${title} concept ${position}`], prerequisite_ids: position === 2 ? [`${language}-topic-1`] : [],
    content: `# ${title} worked example ${position}\n\nLOCAL_QA_LESSON_${language}_${position}\n\nRead the example, predict the output and run the code.\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n## Check your understanding\n\nExplain the result before you change the example.`,
    starter_code: code, video_ids: [], state: 'published', questions_per_attempt: 2,
    questions: Array.from({ length: 4 }, (_, i) => ({ id: `${language}-${position}-q${i}`, question: `Which step should you use for example ${i + 1}?`, options: [{ id: 'a', text: 'Read the example first' }, { id: 'b', text: 'Skip the instructions' }], correctOptionId: 'a', explanation: 'Read the worked example before making a change.' })),
    assignment: { instructions: 'Modify the worked example using only the concepts covered in this topic.', hints: ['Begin with the provided example.'], allowedConcepts: ['worked examples'], requiredConcepts: ['worked examples'], prohibitedConcepts: ['uncovered concepts'], starterCode: code, rubric: [{ id: 'concepts', description: 'Use the topic concepts correctly', points: 100 }] },
    pending_draft: { content: 'PRIVATE_DRAFT_MUST_NOT_EXPORT' },
  })));
  topics.push({ ...topics[0], id: 'draft-only-topic', slug: 'draft-only-topic', state: 'draft', content: 'PRIVATE_TOPIC_MUST_NOT_EXPORT' });
  return buildLearningSnapshot({ languages, courses, topics });
}
