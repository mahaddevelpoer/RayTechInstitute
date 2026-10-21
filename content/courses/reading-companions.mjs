// Original teaching notes, keyed to real lessons. No remote authoring call and
// no generic paragraph repeated to inflate a lesson's length.
export const readingCompanions = {
 'authored-html-001': {
  opening: `Imagine opening a school notice on your phone. The date is buried in one enormous paragraph, the heading looks like ordinary text, and "read more" takes you nowhere. The information exists, but the page does not help you use it. Your first HTML page solves that problem before a single colour or animation is added.

Our small project is a study profile someone can actually navigate. A visitor should immediately know whose page it is, find the current study goals, and jump to a second section. As you work, ask a practical question: if all the styling disappeared, would the order and meaning still be clear? That is the kind of job HTML does.

You do not need to memorise a catalogue of tags today. You need a dependable mental picture: a document contains elements, elements describe meaning, and nesting describes which content belongs together. By the end, you should be able to explain your source to another student instead of only saying that the preview looks right.`,
  reasoning: `### Read a page as a visitor, then as its author

Start with the visitor's questions. "What page am I on?" needs a meaningful main heading. "What can I find here?" needs short introductory text and sensible section headings. "Where are the goals?" needs a destination and a link that points to it. Each question suggests a piece of document structure. This is a more useful starting point than choosing tags because their default font sizes happen to look attractive.

Now switch to the author's view. The head describes the document to the browser and other tools. The body contains the document's visible content. A title in the head does not replace a heading in the body: open the browser tab and the page itself and notice that they serve different places. They can describe the same subject without being the same element.

Indentation is your drawing of the structure. Follow one opening tag to its closing tag, then check what lies between them. If a paragraph belongs inside a section, the paragraph closes before that section closes. A browser may repair a mistake and still display something plausible. A plausible preview is therefore useful evidence, but not proof that you wrote the structure you intended.

### Give your link a real destination

Treat a fragment link as a small contract. The href contains a # followed by an identifier. Somewhere in the same document, one element carries exactly that identifier as its id. The spelling must agree, and the identifier should be unique in the document. Writing a destination label in visible text does not create that connection by itself.

Try renaming only the target id and use the link again. Then restore the match. You have deliberately created a small failure, observed its effect, and repaired its cause. That experiment teaches more than copying a finished link without testing it.`,
  challenge: `Build the study profile without copying the complete example. Write the document skeleton first and verify that the main heading appears. Add the introduction next. Add two sections, each with an h2, then connect a link to the second section. Check each addition before moving on.

Now review your page for a real reader. Can someone identify the subject without reading every paragraph? Does each section heading describe what follows? Does the link text explain its destination without saying only "click here"? These questions are part of writing HTML, not a decoration step to postpone until CSS.

For an extra check, change the visible heading but leave the title unchanged. Find both in the browser. Then deliberately use the same id twice and explain why that makes the intended destination ambiguous. Restore one unique target before finishing. You do not need JavaScript to perform either investigation.`,
  bridge: `You now have something worth styling: a document with a clear purpose. CSS will change its presentation, but it should not have to rescue an unclear reading order. Keep this page as a reference and explain which improvements belong to structure and which belong to appearance.`,
 },
 'authored-css-001': {
  opening: `The words on a revision sheet can be correct and still be exhausting to read. A line runs across the whole screen, the button has almost no space around its label, and the heading disappears into the paragraph below it. CSS lets you improve those experiences without rewriting the information.

In this lesson, you are the person making a study page comfortable to use. We will work on readable text, a recognisable heading and a button with room to breathe. The goal is not to collect random properties. It is to make a change, predict the effect, and explain why the browser applied it.

Keep the preview and the rule in view together. When you change a value, name the element that should change and the visible difference you expect. If nothing happens, you have a concrete prediction to investigate rather than a vague feeling that CSS is broken.`,
  reasoning: `### Think of each rule as a precise instruction

Read a CSS rule in two parts. The selector answers "which elements?" The declarations answer "which aspects of their appearance?" In a paragraph rule, colour and line-height are different decisions applied to the same selected elements. Changing the colour does not change which paragraphs the selector matches.

There is a useful debugging order here. First check that you are editing CSS rather than pasting a complete HTML document into this language's editor. Next check the selector spelling. Then check the braces, colon, property name, value and semicolon. Finally consider whether another applicable rule wins. Work from the smallest explanation rather than replacing the entire stylesheet immediately.

### Readability is something you can test

A paragraph can have a sensible font size and still feel crowded when the lines sit too close together. A comfortable line-height gives the eye room to travel from the end of one line to the start of the next. A maximum width limits the length of each line on a large display without demanding that a small display become wider.

Resize the preview rather than assuming the layout is good because it looks acceptable at one width. A fixed width and a maximum width are not the same promise. A fixed width can insist on space the device does not have; a maximum width is a ceiling. Keep the page usable when the available space is below that ceiling.

### Space has an inside and an outside

Picture a button as content surrounded by padding and a border. Padding belongs inside that border. Margin belongs outside it. If the label feels squeezed against the border, increasing outside space will not create the missing internal room. State the problem before choosing the property.

Use a visible border while experimenting. Increase padding and watch the clickable shape grow around the label. Then change margin and watch the relationship to neighbouring content instead. You are learning to recognise the effect, not just remember a definition.`,
  challenge: `Style the revision sheet in four passes. First make the body text readable against its background. Next distinguish the h1. Then adjust paragraph size, line-height and maximum width. Finally improve the button's padding and border. After each pass, say what became easier for the reader.

Make one controlled mistake: remove the unit from a nonzero font-size value. Observe which declaration stops taking effect and restore valid syntax. Do not change the selector at the same time, because that would make it harder to identify the cause.

Repeat the spacing experiment with a narrower preview. Your explanation should distinguish readable contrast, internal spacing and line length rather than describing everything as "making it look nice." Those distinctions will help you debug much larger stylesheets later.`,
  bridge: `A styled page can now communicate more clearly. The next challenge is to keep that reasoning when several rules apply at once. Before adding more properties, practise identifying the selector, the property and the winning value in a small rule you can explain.`,
 },
 'authored-javascript-001': {
  opening: `Suppose a study app tells you that three sessions of twenty minutes equal "320" minutes. The program ran. It printed a result. Yet the result is not the calculation you intended. That is a valuable first programming puzzle: running successfully and answering the right question are different things.

JavaScript will let us store the inputs, perform a calculation and inspect the result. We will begin in the output panel rather than immediately building buttons or fetching data. Keeping the program small makes its decisions visible. You can point to the exact instruction that produced an unexpected value.

Before running each example, write down what you expect to see, including whether the result is text or a number. A surprising output is not a failed lesson. It is an opportunity to replace a guess with a mental model you can use again.`,
  reasoning: `### Separate the value from the way it is displayed

A value can be a number or a string containing digits. Those values may look similar when printed, but their behaviour in an expression can differ. Look at the literal syntax and the operator together. Quotation marks are a decision about the kind of value, not a decoration around a number.

When a result surprises you, locate the expression that produced it before changing the display statement. If an expression joined text, making the output label prettier will not turn that earlier result into numeric arithmetic. Trace the inputs, then the operation, then the display.

### Names help you explain a calculation

Imagine explaining your program to a classmate who has not seen it. A name such as minutesPerSession gives them a clue about the value's role. A name such as x may be valid, but forces them to reconstruct the meaning from every use. Clear names reduce the amount of detective work a reader must do.

Keep inputs and a calculated result separate in the first program. This gives you checkpoints: confirm the inputs, predict the multiplication, then inspect the total. Combining everything into a single long expression is not automatically more advanced. Often it simply makes the first incorrect assumption harder to find.

### Reassignment is not automatic recalculation

An assignment runs when execution reaches it. A calculated total records the value produced at that point. Changing an input later does not ask the earlier expression to execute again. To obtain a new total, the program needs another calculation.

This explains a common puzzle in the examples: two names that were related during one calculation do not become permanently linked spreadsheet cells. Read the instructions in order and keep a small paper record of the current values. You will use this same habit when programs eventually contain conditions, functions and user events.`,
  challenge: `Plan three study sessions with a numeric duration per session. Name both inputs, calculate a separate total and print a clear label with the result. Before running, predict the exact total yourself. Then change only one input and recalculate.

For the next experiment, put a new assignment to an input after the total has already been calculated. Predict the old total and the new input separately. Run once, then add the recalculation and compare the outputs. Explain which instruction changes the result, not merely which number changed on the screen.

Finish by changing one numeric input into a quoted string and examining the expression carefully. Do not rely on an accidental coercion as your explanation. State what kinds of values your program is supposed to accept and why those kinds fit the calculation.`,
  bridge: `You have begun the most reusable programming habit: predicting a result, observing it, and explaining the first point where the two disagree. Keep that habit as the language grows. More syntax is useful only when you can still reason about what your program does.`,
 },
 'authored-php-001': {
  opening: `A small stationery shop needs a total for four notebooks. You can calculate it in your head today, but the price or quantity may change tomorrow. Your first PHP program will make the inputs explicit, calculate their product and print a result someone can understand.

There is one important boundary to get clear first. On a typical production website, PHP runs on a server. In this practice workspace, an isolated interpreter runs in your browser so you can learn the language without renting a server. A successful exercise does not secretly create a hosted application or a database.

That limitation is useful for this first lesson. We can concentrate on variables, assignment, multiplication and output. You will have a complete small calculation to explain before adding networking, forms or persistence.`,
  reasoning: `### Follow the journey from input to printed result

Begin with two decisions: what is the price of one notebook, and how many notebooks are being bought? Store those as separate variables. The multiplication then expresses a relationship between named values rather than unexplained numbers copied into several places.

The dollar sign is part of PHP's variable syntax. Keep the same spelling and letter case every time you refer to a variable. A variable that has not been initialised is not an invitation to guess what PHP might substitute. Assign the intended value before the instruction that needs it.

Now distinguish calculation from output. Assigning a total does not itself print the total. An echo statement produces output. This separation is useful: you can inspect where a wrong value was calculated without blaming the instruction that merely displayed it.

### Punctuation has a job

The opening PHP tag identifies PHP code in the source used here. Semicolons terminate the simple statements in this lesson. Matching quotation marks identify a string. These symbols are easy to overlook when your eyes focus only on variable names and prices, so give punctuation its own review pass.

If you encounter a parse error, start with the indicated area and inspect the preceding statement too. A missing terminator can make the next line look suspicious even though the earlier line caused the problem. Repair one cause and run again rather than adding punctuation randomly until the message changes.

### Text output is not an HTML layout

The output panel shows the text your program emits. A newline character in a double-quoted string separates lines in that text. A browser rendering an HTML document treats whitespace differently, which is a separate concern. Do not use a successful text exercise to infer that every display environment handles newlines in the same way.

Choose a label that tells someone what the number measures. Printing 300 is a calculation result; printing a label followed by 300 makes it easier for a reader to recognise the total. Good output communicates the result rather than merely proving that echo executed.`,
  challenge: `Build the notebook total from a blank editor. Initialise a price and quantity, calculate a separate total, and print a descriptive label followed by that total and a newline. Predict the result before running. Then change the quantity and verify the new multiplication without editing the label by hand.

Next, place an input change after the total assignment. Does the earlier total update on its own? Explain the execution order, then perform the calculation again where the new result is needed. This is the same practical distinction between stored results and continuing spreadsheet formulas that appears in other languages.

Review your program as if another student will maintain it. Can they identify the two inputs? Is every variable initialised before use? Are all the simple statements terminated? Can they change the quantity without hunting through a printed string for a hard-coded answer?`,
  bridge: `The result is small but complete: named inputs, a calculation, and understandable output. That separation will remain useful when input eventually comes from a form or a file. Learn the language's behaviour here without confusing the practice interpreter with a production hosting service.`,
 },
 'authored-python-001': {
  opening: `You plan to study for five days, thirty minutes a day. That sounds simple until someone changes the plan to six days and the displayed total still says 150. Has Python forgotten how to multiply? No. The program is doing exactly what its instructions say, and this lesson will show you how to see it.

We will build a tiny study-time calculator and keep each decision visible. You will name the inputs, calculate a result and print it. Then you will change the plan and investigate why an earlier result does not update automatically. This is a better foundation than memorising a page of syntax without knowing when an instruction runs.

Keep a prediction beside the editor. Before each run, decide which values exist and what each print call should display. When the result surprises you, stop at that point. Finding the reason is the learning, not an interruption to it.`,
  reasoning: `### Build a picture of the program's state

Think of a name as a way for the program to refer to a value. When study_days receives 5, a later expression can use that name instead of repeating the literal. The name helps a reader understand the purpose of the number, but Python still follows the actual instructions rather than interpreting what the name sounds like.

Read an assignment from the right-hand side first. Work out the expression's value using the names available at that moment. Then connect the name on the left to that result. If an input name has not been assigned yet, there is no earlier value for that expression to read. Moving the input assignments above the calculation fixes the execution order; renaming the output label does not.

### Why an old total can be correct and outdated

After calculating five times thirty, total_minutes refers to 150. Changing study_days to 6 later changes that name's value. It does not travel backwards and rerun the multiplication. The old result is correct for the calculation that actually happened, even though it is no longer the result you want for the new plan.

You can repair this deliberately: calculate total_minutes again after changing the input. Compare the output before and after that second assignment. Name the instruction responsible for the difference. This distinction will help you understand functions, loops and events later, because those tools also execute instructions in an order.

### Ask the value the right kind of question

A string containing digits and a number can print similar characters. However, quotation marks change the value you give the program. Joining two strings is not the same operation as adding two numbers. To understand an output, inspect the source values and the operator rather than deciding from the appearance of the output alone.

Do not try to memorise every type in the language today. Start with a narrower skill: recognise the quoted strings and unquoted numbers in these examples, predict the operation, and explain whether the result is calculated or assembled as text. The next lesson will make type inspection and conversion explicit.`,
  challenge: `Build the study planner in checkpoints. First print a heading. Next assign the two numeric inputs. Calculate their product in a third name, then print that result. For five days of thirty minutes, the result should be 150, but explain the multiplication instead of treating 150 as a magic expected answer.

Try zero study days, then six study days. Predict each result before you change the source. Return to the original plan, calculate its total, and only then change study_days. Print the stored total, recalculate, and print again. Write one sentence explaining why those last two outputs differ.

Finally, create a mistake you can recognise: change the capitalisation of one variable reference. Observe the name error, restore the matching spelling, and run again. You now have a concrete debugging example: the printed label was not the problem, and Python did not guess that two differently spelled names meant the same thing.`,
  bridge: `You can now explain a program as a sequence rather than a mysterious result. Next, we will investigate why a value that looks like 12 might still behave like text. Keep your study calculator: it gives type conversion a real purpose instead of presenting it as another isolated command.`,
 },
};

export function companionSections(id) {
 const note=readingCompanions[id];
 if(!note)return null;
 return {opening:`## Start with a real question\n\n${note.opening}`,reasoning:`## Slow down at the important part\n\n${note.reasoning}`,practice:`## Build it, change it, explain it\n\n${note.challenge}\n\n## What this makes possible\n\n${note.bridge}`};
}
