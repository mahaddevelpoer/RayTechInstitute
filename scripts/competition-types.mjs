import ts from 'typescript';
import path from 'node:path';
const stub=path.resolve('artifacts/competition-deno-types.d.ts');
const host=ts.createCompilerHost({});
const originalRead=host.readFile,originalExists=host.fileExists;
host.fileExists=file=>path.resolve(file)===stub||originalExists(file);
host.readFile=file=>path.resolve(file)===stub?'declare const Deno:{env:{get(name:string):string|undefined};serve(handler:(request:Request)=>Promise<Response>):void};':originalRead(file);
const program=ts.createProgram(['supabase/functions/competition-notifications/index.ts','supabase/functions/competition/index.ts','workers/competition-proxy.ts',stub],{
 noEmit:true,strict:true,skipLibCheck:true,allowImportingTsExtensions:true,
 target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,
 lib:['lib.es2022.d.ts','lib.dom.d.ts'],types:[],
},host);
const diagnostics=ts.getPreEmitDiagnostics(program);
if(diagnostics.length){console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCanonicalFileName:file=>file,getCurrentDirectory:()=>process.cwd(),getNewLine:()=> '\n'}));process.exitCode=1;}else console.log('PASS: competition Edge and Worker strict TypeScript checks.');
