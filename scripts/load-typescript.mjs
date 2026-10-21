import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

// Test the same dependency graph shipped to browser and Edge, without executing
// Deno entry points or requiring a separate duplicated JavaScript implementation.
export async function moduleUrl(file) {
  const absolute = path.resolve(file);
  let code = ts.transpileModule(await fs.readFile(absolute, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  for (const match of [...code.matchAll(/from\s+['"](\.[^'"]+)['"]/g)]) {
    const relative = match[1].endsWith('.ts') ? match[1] : `${match[1]}.ts`;
    const url = await moduleUrl(path.resolve(path.dirname(absolute), relative));
    code = code.replace(match[0], `from '${url}'`);
  }
  return `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
}
export const loadTypescript = async file => import(await moduleUrl(file));
