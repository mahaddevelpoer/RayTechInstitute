/** Authored syntax guidance, not execution or a claim about runtime values. */
export function explainCodeLine(language: string, input: string) {
 const line=input.trim();if(!line||line.length>2000)return null;
 let summary='Read this statement together with the surrounding code. Its runtime result depends on the values and execution path; a single line does not establish that result.';
 if(/^(#|\/\/|\/\*|\*|<!--)/.test(line))summary='This is a comment. It explains the source for a reader rather than performing the calculation described by the surrounding program.';
 else if(/^(return\b)/.test(line))summary='This return statement ends the current function call and sends its expression value back to the caller. Returning a value is different from printing it.';
 else if(/^(print\s*\(|console\.(log|info|warn|error)\s*\(|echo\b)/.test(line))summary='This output statement evaluates the supplied expressions and displays their values. Displaying a value does not automatically update any previously calculated result.';
 else if(/^(if\b|elif\b|else\b|switch\b)/.test(line))summary='This line belongs to a conditional decision. Follow the condition and the surrounding branch structure to determine which instructions execute; test the boundary values too.';
 else if(/^(for\b|while\b)/.test(line))summary='This line controls repetition. Trace the current item or condition, the state changed by each iteration, and the condition that ends the loop.';
 else if(/^(def\b|(?:async\s+)?function\b)/.test(line))summary='This defines a function. The body performs work when the function is called, not merely because the definition appears in the source. Follow arguments into parameters and inspect the return value.';
 else if(/^(import\b|from\b)/.test(line))summary='This import makes names from a module available. Importing a function is different from calling it, and importing does not automatically install a missing third-party package.';
 else if(/^class\b/.test(line))summary='This defines a class, describing related state and behaviour. A particular instance has its own identity; check whether attributes belong to the instance or are shared by the class.';
 else if(/^(try\b|except\b|catch\b|finally\b|raise\b|throw\b)/.test(line))summary='This line participates in error handling. Identify the operation that can fail, the expected failure type, and whether execution should recover or stop. Hiding an error is not the same as fixing it.';
 else if(language==='html'||/^<[!\w\/]/.test(line))summary='This HTML line describes document structure. Identify the element, its attributes and its nesting. Metadata, visible content and links have different roles; a plausible preview alone does not prove correct structure.';
 else if(language==='css')summary='This CSS line belongs to a selector or declaration. Identify the selected elements, the property and its value. The cascade and valid units determine whether the intended style takes effect.';
 else if(/^(?:const\s+|let\s+|var\s+)?\$?[A-Za-z_]\w*\s*=(?!=)/.test(line))summary='This assignment evaluates the expression on the right, then binds or updates the name on the left. Changing an input later does not automatically recalculate a result stored by an earlier assignment.';
 else if(/^[}\])]+[;,]?$/.test(line))summary='This closes a surrounding group or block. Read the matching opening delimiter and the indentation to understand which instructions belong together.';
 const excerpt=line.length>100?`${line.slice(0,100)} [excerpt]`:line;
 const narration=`Selected ${language} code: ${excerpt}. ${summary}`.slice(0,420);
 return {line,summary,narration};
}
