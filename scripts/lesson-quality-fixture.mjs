// Synthetic teaching text for validation tests only; never publish it.
export function lessonFixture(words = 2100) {
  return `## Understand the concept\n${'explanation '.repeat(words)}\n## Worked examples\n\n\`\`\`python\nprint(1)\n\`\`\`\nExpected output: 1.\n\n\`\`\`python\nprint(2)\n\`\`\`\nExpected output: 2.\n\n\`\`\`python\nprint(3)\n\`\`\`\nExpected output: 3.\n## Common mistakes\nCheck the value.\n## Practice and recap\nPredict the result before running the example.\n`;
}
