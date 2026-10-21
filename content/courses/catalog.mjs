import fs from 'node:fs/promises';
import { understandMdx } from './understand.mjs';

// Original repository-authored lessons. No remote authoring service is called.
const q = (question, options, answer, explanation) => ({ question, options: options.map((text, index) => ({ id: String.fromCharCode(97 + index), text })), correctOptionId: String.fromCharCode(97 + answer), explanation });
const tracks = [
  {
    id: 'html', file: '01-your-first-web-page.md', slug: 'your-first-web-page', title: 'Your First HTML Web Page',
    summary: 'Build a complete HTML document, organise headings and paragraphs, and connect a local link to its section.',
    objectives: ['Separate document metadata from visible content', 'Build nested elements and a local section link'],
    starterCode: '<!doctype html>\n<html lang="en">\n<head><meta charset="utf-8"><title>Study page</title></head>\n<body>\n  <main>\n    <h1>My study page</h1>\n  </main>\n</body>\n</html>',
    concepts: ['HTML document structure', 'headings and paragraphs', 'local links and identifiers'],
    instructions: 'Build a complete English-language HTML study profile. Include a meaningful document title, one main heading, an introductory paragraph, two sections with h2 headings, and a local link to the second section. Use explicit closing tags and readable nesting. Do not add scripts, external resources or styling yet.',
    questions: [
      q('Which element contains the main visible content of an HTML document?', ['head', 'body', 'title', 'meta'], 1, 'The body contains page content. The head contains document metadata.'),
      q('Which source explicitly closes a paragraph correctly?', ['<p>Hello<p>', '<p>Hello</p>', '</p>Hello<p>', '<paragraph>Hello</paragraph>'], 1, 'The closing tag for a p element is </p>.'),
      q('What is the role of the title element in a normal browser tab?', ['It automatically inserts a visible h1', 'It sets document-title metadata', 'It changes paragraph colour', 'It creates a link'], 1, 'The title supplies metadata such as the tab title, not a visible body heading.'),
      q('Which destination matches an element with id="goals" in this document?', ['href="goals"', 'href="#goals"', 'href=".goals"', 'href="@goals"'], 1, 'A fragment identifier begins with # and matches the target element ID.'),
      q('Which element best introduces a main section below the page h1?', ['meta', 'h2', 'title', 'head'], 1, 'An h2 introduces a section beneath the main h1 in the document outline.'),
      q('What does lang="en" identify?', ['The document language', 'A JavaScript variable', 'The page colour', 'The hosting provider'], 0, 'The lang attribute identifies the content language for browsers and assistive technology.'),
      q('Which example has explicit, correctly nested tags?', ['<p><strong>Study</strong></p>', '<p><strong>Study</p></strong>', '<p><strong>Study</p>', '</strong><p>Study</p>'], 0, 'The inner strong element closes before the outer paragraph closes.'),
      q('A browser displays a page even though its source contains mistakes. What follows?', ['The source must be valid', 'The browser may have recovered from the mistakes', 'Closing tags are never useful', 'The document cannot contain metadata'], 1, 'Browsers recover from many errors. Inspect source structure as well as the visible result.'),
    ],
  },
  {
    id: 'css', file: '01-how-css-rules-work.md', slug: 'how-css-rules-work', title: 'How CSS Rules Style a Page',
    summary: 'Read selectors and declarations, style the supplied sample page, and debug colour, text and spacing rules.',
    objectives: ['Explain selectors, properties and values', 'Style readable text and a visible button without external assets'],
    starterCode: 'body {\n  background-color: white;\n  color: #1e293b;\n}\n\nh1 {\n  color: #0f766e;\n}',
    concepts: ['element selectors', 'CSS declarations', 'text styling', 'padding and borders'],
    instructions: 'Style the existing practice sample page as a revision sheet. Write separate body, h1, p and button rules. Give the heading a readable colour, make paragraph text at least 18px with comfortable line-height and a maximum line length, and give the button internal padding plus a visible border. Use only local fonts and CSS declarations; do not paste an HTML document into this CSS editor.',
    questions: [
      q('In p { color: navy; }, which part is the selector?', ['p', 'color', 'navy', ';'], 0, 'The selector p chooses paragraph elements.'),
      q('Which pair correctly separates a property from its value?', ['color = navy', 'color: navy', 'color -> navy', 'color, navy'], 1, 'A CSS declaration uses a colon between its property and value.'),
      q('What does padding add to a button?', ['Space inside its border', 'Only space outside its border', 'A database record', 'A new HTML heading'], 0, 'Padding lies between content and border.'),
      q('Which is the intended valid font-size declaration?', ['font-size: 18;', 'font-size: 18px;', 'font-size = 18px;', 'font-size 18px;'], 1, 'A nonzero length here needs a supported unit such as px and declaration syntax uses a colon.'),
      q('Why use max-width on paragraph text?', ['To cap line length without demanding that a narrow viewport become wider', 'To force every viewport to 60 pixels', 'To load a font', 'To select all buttons'], 0, 'A maximum width is an upper bound, helpful for readable line lengths.'),
      q('What should be entered in this lesson’s CSS practice editor?', ['A complete HTML document', 'CSS rules for the supplied page', 'A database password', 'A PHP server configuration'], 1, 'The CSS runtime already supplies sample HTML and accepts stylesheet rules.'),
      q('What does font-family: Arial, sans-serif provide?', ['A font fallback list', 'An automatic paid font download', 'Two new paragraphs', 'A CSS selector'], 0, 'The browser tries the listed font choices; this rule does not request an external font.'),
      q('What is a useful first debugging step for an apparently ineffective rule?', ['Change every rule at once', 'Check that its selector matches an existing element', 'Remove all semicolons', 'Replace CSS with JavaScript'], 1, 'A valid declaration cannot style the intended element if the selector does not match it.'),
    ],
  },
  {
    id: 'javascript', file: '01-values-and-console-output.md', slug: 'values-and-console-output', title: 'JavaScript Values and Console Output',
    summary: 'Print exact messages, distinguish numbers from strings, and calculate with clearly named constant values.',
    objectives: ['Predict console output for strings and arithmetic', 'Calculate a total using named constant values'],
    starterCode: 'const ticketPrice = 200;\nconst ticketCount = 3;\n// Calculate and print the total below.\n',
    concepts: ['strings and numbers', 'const declarations', 'multiplication', 'console.log'],
    instructions: 'In console mode, declare a ticketPrice and ticketCount with const. Calculate ticketTotal using multiplication, then print a descriptive heading and the total using separate console.log calls. Choose positive numeric input values. Do not use DOM operations, external services, loops or input dialogs in this introductory exercise.',
    questions: [
      q('What does console.log(12 + 3) print?', ['123', '15', '12 + 3', '36'], 1, 'Both operands are numbers, so + adds them before the result is printed.'),
      q('What does console.log("12" + "3") print?', ['15', '123', '36', 'An HTML paragraph'], 1, 'Both operands are strings, so + joins them.'),
      q('Which operator multiplies two numbers?', ['*', 'x', ':', '#'], 0, 'The asterisk is the multiplication operator.'),
      q('Which instruction declares a named constant?', ['constant price: 20', 'const price = 20;', '$price = 20;', 'price := 20'], 1, 'JavaScript uses const followed by a binding name and an initialiser.'),
      q('Are price and Price the same JavaScript name?', ['Always', 'No, letter case matters', 'Only inside console.log', 'Only when both are numbers'], 1, 'JavaScript names are case-sensitive.'),
      q('What does const total = 150 * 2; console.log(total); print?', ['150', '2', '300', 'total'], 2, 'The expression evaluates to 300, which is assigned to total and then printed.'),
      q('Which output method is supported for these console-mode examples?', ['alert("Hi")', 'prompt("Hi")', 'console.log("Hi")', 'A production network request'], 2, 'This lesson uses console.log in the isolated console runtime.'),
      q('Does calculating total automatically change the original price binding?', ['Yes, all input bindings change', 'No, the expression calculates a separate result', 'Only on mobile', 'Only for multiplication'], 1, 'Reading price in an expression does not assign a new value to price.'),
    ],
  },
  {
    id: 'php', file: '01-first-php-program.md', slug: 'first-php-program', title: 'Your First PHP Program',
    summary: 'Understand browser practice versus a PHP server, print exact text, and calculate a total with named variables.',
    objectives: ['Use PHP tags and echo statements correctly', 'Calculate and print a total with initialised variables'],
    starterCode: '<?php\n$notebookPrice = 75;\n$notebookQuantity = 4;\n// Calculate and print the total below.\n',
    concepts: ['PHP variables', 'assignment', 'multiplication', 'echo statements'],
    instructions: 'Declare a notebook price and a notebook quantity, calculate their product in a named variable, and print a descriptive label followed by the total and a newline. Use the PHP opening tag, initialise variables before reading them, and end statements with semicolons. Do not use files, databases, external services or browser-side HTML controls.',
    questions: [
      q('Which opening tag starts the PHP code used in this course?', ['<php>', '<?php', '<script php>', '<!php>'], 1, 'The standard PHP opening tag is <?php.'),
      q('Which prefix identifies the variable price in PHP?', ['#price', '$price', '@price', '.price'], 1, 'PHP variable names begin with a dollar sign.'),
      q('What does echo 8 + 4; output?', ['84', '12', '8 + 4', '32'], 1, 'The numeric expression evaluates to 12 before echo outputs it.'),
      q('Which statement explicitly ends with the required punctuation?', ['echo "Hi":', 'echo "Hi";', 'echo "Hi",', 'echo "Hi".'], 1, 'A semicolon ends this echo statement.'),
      q('What does a double-quoted \\n represent in the text output examples?', ['The letter n only', 'A newline', 'An HTML heading', 'A new variable'], 1, 'Within a double-quoted PHP string, \\n represents a newline character.'),
      q('Does this browser interpreter create a public production PHP backend?', ['Yes, automatically', 'No, it is an isolated language-practice runtime', 'Only when echo is used', 'Only with four variables'], 1, 'The browser interpreter is not a hosted PHP application server.'),
      q('For $price = 120; $quantity = 3;, what is $price * $quantity?', ['123', '40', '360', '1203'], 2, 'Multiplying 120 by 3 gives 360.'),
      q('Are $price and $Price the same variable?', ['Yes', 'No, PHP variable names are case-sensitive', 'Only when echoed', 'Only in a browser'], 1, 'The different letter case creates distinct variable names.'),
    ],
  },
  {
    id: 'python', file: '01-values-names-and-output.md', slug: 'values-names-and-output', title: 'Python Values, Names and Output',
    summary: 'Predict printed output, distinguish numeric and string values, and explain assignment and execution order.',
    objectives: ['Predict output from simple expressions', 'Calculate a named result in the correct execution order'],
    starterCode: 'study_days = 5\nminutes_per_day = 30\n# Calculate and print the total below.\n',
    concepts: ['Python assignment', 'strings and numbers', 'multiplication', 'print calls'],
    instructions: 'Assign a study_days value and a minutes_per_day value, calculate total_minutes, and print a descriptive heading followed by the result. Use numbers for the calculation and print calls for output. Avoid lists, loops, functions, input calls and external services in this first exercise. Explain why the inputs must be assigned before their product is calculated.',
    questions: [
      q('What does print(10 + 5) output?', ['105', '15', '50', '10 + 5'], 1, 'The operands are numbers, so the expression adds them.'),
      q('What does print("10" + "5") output?', ['15', '50', '105', '5'], 2, 'The + operator concatenates these two strings.'),
      q('Which instruction assigns 5 to a Python name?', ['const days = 5;', '$days = 5;', 'days = 5', 'days:==5'], 2, 'A simple Python assignment uses a name, equals sign and expression.'),
      q('What does the equals sign do in total = price * quantity?', ['It checks whether two values are equal', 'It assigns the calculated product to total', 'It prints total', 'It starts a comment'], 1, 'The right-hand expression is evaluated and its value is bound to the name on the left.'),
      q('Are quantity and Quantity the same name?', ['Yes', 'No, Python names are case-sensitive', 'Only in print calls', 'Only when both contain strings'], 1, 'Letter case matters in Python names.'),
      q('What is printed after quantity = 4; total = 90 * quantity; quantity = 5; print(total)?', ['450', '360', '5', '90'], 1, 'Changing quantity afterwards does not recalculate the previously assigned total.'),
      q('What normally follows each simple print call in these examples?', ['A newline in the output', 'A new variable', 'A browser popup', 'A network request'], 0, 'The default print behaviour ends each call with a newline.'),
      q('Which environment runs the practice Python examples here?', ['An unrestricted production server', 'An isolated Pyodide browser runtime', 'A spreadsheet formula engine', 'The HTML parser'], 1, 'The browser loads a Python interpreter through Pyodide for isolated practice.'),
    ],
  },
];

export async function authoredFoundationTopics({ interactive = true, guided = true, experiment = true } = {}) {
  return Promise.all(tracks.map(async track => ({
    id: `authored-${track.id}-001`, languageId: track.id, slug: track.slug, title: track.title, summary: track.summary,
    order: 1, version: 1, state: 'draft', objectives: track.objectives, prerequisiteIds: [], videoIds: [],
    content: (await fs.readFile(new URL(`./${track.id}/${track.file.replace(/\.md$/, interactive ? '.mdx' : '.md')}`, import.meta.url), 'utf8')) + (interactive && guided ? understandMdx(track.id, { experiment }) : ''), starterCode: track.starterCode,
    questions: track.questions.map((question, index) => ({ id: `q${index + 1}`, ...question })), questionsPerAttempt: 4,
    assignment: { instructions: track.instructions, hints: ['Review the three worked examples before changing your own program.', 'Run a small version first and compare its output with your prediction.'],
      requiredConcepts: track.concepts, allowedConcepts: track.concepts, prohibitedConcepts: [], starterCode: track.starterCode,
      rubric: [{ id: 'requirements', description: 'Meet the stated task requirements using the taught concepts.', points: 40 }, { id: 'behaviour', description: 'Produce the required output or visible page behaviour.', points: 35 }, { id: 'clarity', description: 'Use readable structure, meaningful names and a clear explanation.', points: 25 }] },
  })));
}
