import { pythonCoreUnits } from './core-units.mjs';
import { pythonDeepDives } from './deep-dives.mjs';
const attr = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const prose = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('{', '&#123;').replaceAll('}', '&#125;');
const component = (name, properties) => `<${name} ${Object.entries(properties).map(([key, value]) => `${key}="${attr(typeof value === 'string' ? value : JSON.stringify(value))}"`).join(' ')} />`;
export const outputOptions = output => [output, 'No output is printed.', 'An exception stops the program.', `${output}\nNone`];

export function authoredPythonTopics({ enriched = true } = {}) {
  return pythonCoreUnits.map(unit => {
    const questions = unit.examples.map((example, index) => ({ id: `q${index + 1}`, question: `What is the exact printed output?\n\n${example.code}`, options: outputOptions(example.output).map((text, option) => ({ id: `o${option}`, text })), correctOptionId: 'o0', explanation: example.explanation }));
    questions.push({ id: 'q4', question: `Which statement correctly describes this lesson's main rule?`, options: [unit.rule, 'Printing a value always changes the original input.', 'Every Python operation changes every earlier calculated result.', 'A successful run proves that all possible inputs are valid.'].map((text, index) => ({ id: `o${index}`, text })), correctOptionId: 'o0', explanation: unit.rule });
    const stages = unit.examples.map(example => ({ title: example.title, explanation: example.explanation, code: example.code, hint: unit.hint, success: `The expected output is ${example.output}. ${example.explanation}`, slots: [
      { label: 'Exact printed output', options: outputOptions(example.output), answer: 0 },
      { label: 'Reasoning check', options: ['This run proves every possible input is valid.', example.explanation, 'The program prints source code without executing its instructions.'], answer: 1 },
    ] }));
    let content = [
      '## Understand the idea', prose(unit.explanation),
      ...unit.examples.flatMap((example, index) => [`## Example ${index + 1}: ${prose(example.title)}`, `\`\`\`python\n${example.code}\n\`\`\``, `Expected output:\n\n\`\`\`text\n${example.output}\n\`\`\``, prose(example.explanation)]),
      '## Check the reasoning', prose(unit.rule), 'A matching screenshot or output is one check, not proof that a program is correct for all inputs. Change one input, predict the new result and run again. If the result differs, find the first instruction where your prediction stops matching the program state. Keep that small case as a regression check when you fix the cause.',
      '## Independent practice', prose(unit.task), '### Practice hint', prose(unit.hint),
      component('PredictOutput', { title: `Predict: ${unit.examples[0].title}`, code: unit.examples[0].code, options: outputOptions(unit.examples[0].output), answer: '0', explanation: unit.examples[0].explanation }),
      component('CodeTrace', { title: 'Compare the worked programs', steps: unit.examples.map(example => ({ line: example.code, explanation: example.explanation, values: `Expected output:\n${example.output}` })) }),
      component('TryExample', { title: 'Experiment with the first program', code: unit.examples[0].code, task: `${unit.task} Start by changing one input in this smaller example. Loading it does not execute it.` }),
      component('Understand', { title: `Understand: ${unit.title}`, stages }),
    ].join('\n\n') + '\n';
    if(enriched){
      const note=pythonDeepDives[unit.slug];if(!note)throw Error(`Missing authored teaching notes: ${unit.slug}`);
      const prediction=content.match(/^<PredictOutput .*?\/>$/m)?.[0];
      if(prediction){content=content.replace(prediction,'');content=content.replace('Expected output:',`${prediction}\n\nExpected output:`);}
      content=content.replace('## Check the reasoning',`## Think through the important decisions\n\n${prose(note.inspection)}\n\n## Check the reasoning`);
      content=content.replace('## Independent practice',`## The mistake worth understanding\n\n${prose(note.trap)}\n\n## Independent practice`);
      content=`## A problem you can recognise\n\n${prose(note.opening)}\n\n${content}\n## Try a different case\n\n${prose(note.transfer)}\n`;
    }
    return {
      id: `authored-python-${String(unit.order).padStart(3, '0')}`, languageId: 'python', slug: unit.slug, title: unit.title,
      summary: unit.rule, order: unit.order, version: 1, state: 'draft', objectives: [`Explain and apply: ${unit.title}`, 'Predict exact worked-example outputs and complete the independent practice'], prerequisiteIds: [], videoIds: [], content,
      starterCode: unit.examples[0].code, questions, questionsPerAttempt: 3,
      assignment: { instructions: unit.task, hints: [unit.hint, 'Use only the concepts introduced in this and earlier Python lessons. Explain each decision.'], requiredConcepts: [unit.title], allowedConcepts: ['Earlier Python core concepts', unit.title], prohibitedConcepts: [], starterCode: '# Build the independent practice solution here.\n', rubric: [
        { id: 'behaviour', description: 'Meet the stated task and produce the required behaviour.', points: 40 },
        { id: 'reasoning', description: 'Explain the taught concept and predict changes rather than copying output.', points: 35 },
        { id: 'checks', description: 'Use readable names and demonstrate normal and boundary checks.', points: 25 },
      ] },
    };
  });
}
