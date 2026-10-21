import { createProcessor } from '@mdx-js/mdx';
import { createHash } from 'node:crypto';

/** Parse a reviewed MDX subset into data. Never compile/evaluate JavaScript. */
export function parseReviewedMdx(source) {
  if (typeof source !== 'string' || source.length > 100000) throw new Error('Reviewed lesson exceeds its content limit.');
  const tree = createProcessor({ format: 'mdx' }).parse(source);
  const components = new Set(['PredictOutput', 'CodeTrace', 'TryExample', 'Understand']);
  const text = (value, limit = 20000) => typeof value === 'string' && value.trim() && value.length <= limit;
  const blocks = []; let from = 0;
  function walk(node, topLevel = false) {
    if (['mdxjsEsm', 'mdxFlowExpression', 'mdxTextExpression', 'mdxJsxTextElement'].includes(node.type)) throw new Error('Imports, expressions and inline JSX are not permitted in reviewed lesson content.');
    if (node.type === 'mdxJsxFlowElement') {
      if (!topLevel || !components.has(node.name) || node.children.length) throw new Error('Use only supported self-closing top-level lesson components.');
      for (const attribute of node.attributes) if (attribute.type !== 'mdxJsxAttribute' || typeof attribute.value !== 'string' || /^on/i.test(attribute.name)) throw new Error('Only literal component attributes are allowed.');
      return;
    }
    for (const child of node.children || []) walk(child, node.type === 'root');
  }
  walk(tree);
  for (const node of tree.children) {
    if (node.type !== 'mdxJsxFlowElement') continue;
    const markdown = source.slice(from, node.position.start.offset).trim();
    if (markdown) blocks.push({ type: 'markdown', content: markdown });
    const props = Object.create(null);
    for (const attribute of node.attributes) {
      if (Object.hasOwn(props, attribute.name)) throw new Error('Duplicate component attribute.');
      props[attribute.name] = attribute.value;
    }
    const keys = node.name === 'Understand' ? ['title', 'stages'] : node.name === 'PredictOutput' ? ['title', 'code', 'options', 'answer', 'explanation'] : node.name === 'CodeTrace' ? ['title', 'steps'] : ['title', 'code', 'task'];
    if (Object.keys(props).some(key => !keys.includes(key) && !(node.name === 'Understand' && key === 'experiment')) || keys.some(key => !Object.hasOwn(props, key))) throw new Error('Invalid lesson component properties.');
    if (!text(props.title, 240)) throw new Error('A descriptive activity title is required.');
    if (node.name === 'Understand') {
      if (props.experiment !== undefined && props.experiment !== 'python-bindings') throw new Error('Unsupported reviewed experiment.');
      const stages = JSON.parse(props.stages);
      const exact = (value, allowed) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === allowed.length && allowed.every(key => Object.hasOwn(value, key));
      if (!Array.isArray(stages) || stages.length < 2 || stages.length > 12 || stages.some(stage =>
        !exact(stage, ['title', 'explanation', 'code', 'hint', 'success', 'slots']) ||
        !['title', 'explanation', 'code', 'hint', 'success'].every(key => text(stage[key], key === 'title' ? 240 : 4000)) ||
        !Array.isArray(stage.slots) || !stage.slots.length || stage.slots.length > 6 ||
        new Set(stage.slots.map(slot => slot?.label)).size !== stage.slots.length ||
        stage.slots.some(slot => !exact(slot, ['label', 'options', 'answer']) || !text(slot.label, 240) || !Array.isArray(slot.options) || slot.options.length < 2 || slot.options.length > 8 || slot.options.some(option => !text(option, 500)) || new Set(slot.options.map(option => option.trim())).size !== slot.options.length || !Number.isSafeInteger(slot.answer) || slot.answer < 0 || slot.answer >= slot.options.length)
      )) throw new Error('Invalid guided understanding activity.');
      blocks.push({ type: node.name, title: props.title, stages, ...(props.experiment ? { experiment: props.experiment } : {}) });
    } else if (node.name === 'PredictOutput') {
      const options = JSON.parse(props.options); const answer = Number(props.answer);
      if (!text(props.code) || !text(props.explanation) || !/^\d+$/.test(props.answer) || !Array.isArray(options) || options.length < 2 || options.length > 6 || options.some(o => !text(o, 2000)) || new Set(options).size !== options.length || !Number.isInteger(answer) || answer < 0 || answer >= options.length) throw new Error('Invalid prediction activity.');
      blocks.push({ type: node.name, title: props.title, code: props.code, options, answer, explanation: props.explanation });
    } else if (node.name === 'CodeTrace') {
      const steps = JSON.parse(props.steps);
      if (!Array.isArray(steps) || !steps.length || steps.length > 30 || steps.some(step => !step || Object.keys(step).some(key => !['line', 'explanation', 'values'].includes(key)) || !text(step.line) || !text(step.explanation) || !text(step.values))) throw new Error('Invalid trace activity.');
      blocks.push({ type: node.name, title: props.title, steps });
    } else {
      if (!text(props.code) || !text(props.task)) throw new Error('Invalid practice activity.');
      blocks.push({ type: node.name, ...props });
    }
    from = node.position.end.offset;
  }
  const markdown = source.slice(from).trim(); if (markdown) blocks.push({ type: 'markdown', content: markdown });
  return blocks;
}

export function reviewedLessonCatalog(authored, published) {
  const reviewed = {};
  for (const source of authored) {
    const live = published.find(t => t.state === 'published' && t.id === source.id && t.languageId === source.languageId && t.content === source.content);
    if (!live) continue;
    reviewed[live.id] = { hash: createHash('sha256').update(live.content).digest('hex'), blocks: parseReviewedMdx(source.content) };
  }
  return reviewed;
}
