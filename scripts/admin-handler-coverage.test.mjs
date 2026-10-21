import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
test('legacy admin save/delete handlers consistently catch errors and guard duplicate submissions', async () => {
  let count = 0;
  for (const page of ['classes', 'subjects', 'past-papers', 'gazettes', 'mcqs', 'notes', 'videos']) {
    const source = await fs.readFile(`src/app/admin/${page}/page.tsx`, 'utf8');
    const parsed = ts.createSourceFile('page.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX); let perPage = 0;
    function visit(node) {
      if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && /^handle(Save|Delete)/.test(node.name.text)) {
        assert.ok(ts.isCallExpression(node.initializer), `${page}/${node.name.text}: guarded handler`);
        assert.equal(node.initializer.expression.getText(parsed), 'adminOperation');
        assert.equal(node.initializer.arguments[0].text, `${page}:${node.name.text}`); perPage++; count++;
      }
      ts.forEachChild(node, visit);
    }
    visit(parsed); assert.ok(perPage >= 2, `${page}: save and delete covered`);
  }
  assert.ok(count >= 14);
});
