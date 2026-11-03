import fs from 'node:fs';
import ts from 'typescript';
const config=ts.readConfigFile('tsconfig.json',ts.sys.readFile);
if(config.error)throw new Error('Project TypeScript configuration is required');
const projectOptions=ts.parseJsonConfigFileContent(config.config,ts.sys,'.').options;

const files = [
  'src/app/admin/classes/page.tsx',
  'src/app/classes/page.tsx',
  'src/app/classes/[classSlug]/page.tsx',
  'src/components/educational/ClassesClientView.tsx',
  'src/components/educational/AcademicDirectory.tsx',
  'src/components/educational/MCQClientView.tsx',
  'src/components/educational/NotesClientView.tsx',
  'src/data/educationalStore.ts',
  'src/types/educational.ts',
  'src/utils/academic-structure.ts',
  'supabase/functions/_shared/academic-structure.ts',
  'supabase/functions/_shared/content-mutations.ts',
];
const syntax = files.flatMap(file => ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  fileName: file, reportDiagnostics: true,
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.Preserve },
}).diagnostics || []);
const program = ts.createProgram([
  'supabase/functions/_shared/academic-structure.ts',
  'src/utils/academic-structure.ts',
  'src/types/educational.ts',
], {
  target: projectOptions.target ?? ts.ScriptTarget.ES5, lib: projectOptions.lib, downlevelIteration: projectOptions.downlevelIteration, module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  strict: true, noEmit: true, skipLibCheck: true, types: [], allowImportingTsExtensions: true,
});
const edgeProgram=ts.createProgram(['supabase/functions/_shared/content-mutations.ts'],{
  target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,
  strict:true,noEmit:true,skipLibCheck:true,types:[],allowImportingTsExtensions:true,
});
const errors = [...syntax, ...ts.getPreEmitDiagnostics(program), ...ts.getPreEmitDiagnostics(edgeProgram)].filter(d => d.category === ts.DiagnosticCategory.Error);
if (errors.length) {
  console.error(ts.formatDiagnosticsWithColorAndContext(errors, {
    getCurrentDirectory: () => process.cwd(), getCanonicalFileName: f => f, getNewLine: () => '\n',
  }));
  process.exitCode = 1;
} else console.log(`Syntax checks passed for ${files.length} changed TS/TSX files; shared academic and mutation semantic checks passed. Full application typecheck is separate.`);
