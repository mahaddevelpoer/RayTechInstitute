// Reviewed teaching data: no runtime scripts, imports or generated expressions.
export const reviewedInteractions = {
  html: {
    title: 'Read the document, then test your prediction',
    explanation: 'A browser does not infer a page section from the words in a link. It follows the address in href. A fragment beginning with # identifies a location in the current document. Compare that address against the target id character by character. This is different from naming a class for CSS. When a link appears to do nothing, a very short page might already show the target, or the target identifier might not exist. Check the structure before deciding that links are broken.',
    prediction: { title: 'Where does this link point?', code: '<a href="#goals">Read my goals</a>\n<section id="goals"><h2>Study goals</h2></section>', options: ['The section whose id is goals', 'A class named goals', 'An external website automatically', 'Every heading on the page'], answer: 0, explanation: 'The #goals fragment matches id="goals" in this document. The visible link label does not determine its destination.' },
    trace: { title: 'Follow a small document from the outside in', steps: [
      { line: '<body>', explanation: 'The body contains the visible document content. The head and title are separate metadata.', values: 'Visible content begins inside body.' },
      { line: '<main>', explanation: 'The main element groups the principal content. It is nested inside body.', values: 'body → main' },
      { line: '<h1>Study plan</h1>', explanation: 'The main heading names the page topic. Its closing tag ends the heading, not the surrounding main element.', values: 'body → main → h1: Study plan' },
      { line: '<p>Read, practise, review.</p>', explanation: 'This paragraph is a sibling of h1 inside main, not part of the heading text.', values: 'main contains two elements: h1, then p.' },
    ] },
    practice: { title: 'Build a link with a target you can inspect', code: '<main>\n  <h1>My learning plan</h1>\n  <p><a href="#practice">Go to practice</a></p>\n  <section id="practice">\n    <h2>Practice</h2>\n    <p>Write one goal here.</p>\n  </section>\n</main>', task: 'Open this example in Practice. Change the target from practice to revision in both necessary places. Run it, inspect the preview and explain why changing only one place breaks the intended match.' },
  },
  css: {
    title: 'Separate a matching rule from an inherited value',
    explanation: 'Inheritance and direct styling can produce similar pictures, but they are different explanations. A paragraph can inherit a body text colour while a heading gets its colour directly from a heading rule. Do not memorise the screenshot: trace the selector and property responsible for each element. In the example below, changing the heading colour does not edit the body rule. A useful experiment changes one property at a time, predicts which elements should respond, and compares that prediction with the actual preview.',
    prediction: { title: 'Which colour belongs to each element?', code: 'body { color: navy; }\nh1 { color: teal; }', options: ['The heading is teal; the paragraph inherits navy', 'Both become teal because h1 comes later', 'The heading becomes navy and the paragraph teal', 'Neither rule can affect text'], answer: 0, explanation: 'The h1 rule directly sets the heading colour. The paragraph has no direct colour declaration here, so it inherits the body colour.' },
    trace: { title: 'Inspect the button box one declaration at a time', steps: [
      { line: 'button { ... }', explanation: 'First identify the matching element in the supplied sample page.', values: 'Target: the sample button' },
      { line: 'padding: 12px 18px;', explanation: 'The first value adds internal space above and below the text; the second adds internal space on its left and right.', values: 'Vertical padding: 12px; horizontal padding: 18px' },
      { line: 'border: 2px solid teal;', explanation: 'The border surrounds the content and padding. Its width is not the same thing as padding.', values: 'Visible border: 2px, solid, teal' },
      { line: 'background-color: white;', explanation: 'The button background is white. Choose readable text colour separately; a background declaration does not set text colour.', values: 'Background: white; text colour is a separate property.' },
    ] },
    practice: { title: 'Prove which elements your rule changes', code: 'body { color: navy; background-color: white; }\nh1 { color: teal; }\np { font-size: 18px; line-height: 1.6; max-width: 60ch; }\nbutton { padding: 12px 18px; border: 2px solid teal; }', task: 'Change only the heading colour, then run. Next change only the body text colour. Explain which change affects the paragraph. Finally increase button padding and describe the difference between its content, padding and border.' },
  },
  javascript: {
    title: 'Trace a value before trusting its appearance',
    explanation: 'A console displays characters, but the program operates on values with types. The same digits can be a number in one expression and a string in another. Read the quotation marks in the source before predicting what + will do. Named results are also values, not live spreadsheet formulas. The program calculates the expression at the moment that instruction executes. Reading an input binding to calculate a new total does not change that input binding. Keep those ideas separate when debugging an unexpected result.',
    prediction: { title: 'Will both calls print the same thing?', code: 'console.log(100 + 20);\nconsole.log("100" + "20");', options: ['First 120, then 10020', '120 on both lines', '10020 on both lines', 'First 10020, then 120'], answer: 0, explanation: 'The first expression adds numbers. The second concatenates strings. Quotation marks determine the value kind in this example.' },
    trace: { title: 'Follow a ticket total', steps: [
      { line: 'const price = 90;', explanation: 'Create the price binding with a numeric value. There is no calculation of a total yet.', values: 'price = 90' },
      { line: 'const quantity = 4;', explanation: 'Create a separate quantity binding. The original price remains unchanged.', values: 'price = 90; quantity = 4' },
      { line: 'const total = price * quantity;', explanation: 'Read both input values and multiply them. Store the resulting number in a new binding.', values: 'price = 90; quantity = 4; total = 360' },
      { line: 'console.log(total);', explanation: 'Read total and write its value to the output panel. Printing is not an assignment to price or quantity.', values: 'Output: 360' },
    ] },
    practice: { title: 'Change inputs without changing the calculation', code: 'const price = 90;\nconst quantity = 4;\nconst total = price * quantity;\nconsole.log("Ticket total");\nconsole.log(total);', task: 'Predict the two output lines, then run. Change the quantity declaration to 5 and run again. Explain why the multiplication line can stay unchanged. Keep this in console mode; no DOM or external service is needed.' },
  },
  php: {
    title: 'Connect a PHP statement to its output',
    explanation: 'The interpreter runs the PHP instructions, and echo writes the output they produce. The browser practice runtime is an interpreter, not a public web server. That distinction matters when reading examples elsewhere: a form, session or database example can depend on server configuration that this isolated exercise does not supply. Here the inputs are explicit variables, so you can reproduce each calculation without hidden environment state. Follow the dollar signs, statement boundaries and output calls rather than guessing from the final text.',
    prediction: { title: 'What number will echo write?', code: '<?php\n$price = 75;\n$quantity = 4;\necho $price * $quantity;', options: ['300', '754', '79', 'The variable name itself'], answer: 0, explanation: 'Both variables contain numbers. Their product is 300, which echo writes as output.' },
    trace: { title: 'Follow the notebook calculation', steps: [
      { line: '$price = 120;', explanation: 'Initialise the variable before reading it. The dollar sign belongs to each variable reference.', values: '$price = 120' },
      { line: '$quantity = 3;', explanation: 'Initialise the other input. These are two separate assignments.', values: '$price = 120; $quantity = 3' },
      { line: '$total = $price * $quantity;', explanation: 'Calculate the product and assign the result. This step does not print anything.', values: '$total = 360; output is still empty.' },
      { line: 'echo $total;', explanation: 'Read the calculated value and write it to the output panel.', values: 'Output: 360' },
    ] },
    practice: { title: 'Keep calculation and output separate', code: '<?php\n$price = 120;\n$quantity = 3;\n$total = $price * $quantity;\necho "Notebook total: ";\necho $total;\necho "\\n";', task: 'Run this self-contained example. Change the quantity to 2 and predict the new output before running again. Explain the difference between assigning total and echoing total. Do not add a database connection or file access.' },
  },
  python: {
    title: 'A named result is not an automatically updating formula',
    explanation: 'Execution order is one of the most useful mental models for a beginner. Python evaluates an assignment when it reaches that instruction. A total calculated earlier does not automatically update just because a different input name receives a new value afterwards. That behaviour is different from a spreadsheet cell that contains a continuing formula. You must execute the calculation again when you need a new result. Trace this distinction carefully before introducing loops or functions, because those later tools still rely on the same execution model.',
    prediction: { title: 'Does changing quantity recalculate total?', code: 'quantity = 4\ntotal = 90 * quantity\nquantity = 5\nprint(total)', options: ['360', '450', '5', '90'], answer: 0, explanation: 'total was assigned the value 360 before quantity changed. The final print reads that existing total; it does not rerun the multiplication.' },
    trace: { title: 'Inspect the names after each instruction', steps: [
      { line: 'quantity = 4', explanation: 'Bind quantity to the first numeric input value.', values: 'quantity = 4; total has not been assigned.' },
      { line: 'total = 90 * quantity', explanation: 'Evaluate the multiplication now, using quantity equal to 4.', values: 'quantity = 4; total = 360' },
      { line: 'quantity = 5', explanation: 'Rebind quantity. This instruction does not assign anything to total.', values: 'quantity = 5; total = 360' },
      { line: 'print(total)', explanation: 'Read the current value of total and display it.', values: 'Output: 360' },
    ] },
    practice: { title: 'Recalculate deliberately', code: 'quantity = 4\ntotal = 90 * quantity\nquantity = 5\nprint(total)\ntotal = 90 * quantity\nprint(total)', task: 'Predict both output lines, then run. Explain which instruction makes the second total different. Change the numeric inputs and repeat the reasoning. Use assignments and print only, not lists, loops or input calls.' },
  },
};
