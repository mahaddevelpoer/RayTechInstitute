import {t,a,q} from './authoring.mjs';
export default {
 number:2,
 topics:[
 t('2.1','Programming and the Python environment',[20,21],`Programming expresses a procedure as instructions that a computer can execute. The book's basic sequence is to write the code, translate or interpret it, execute it and observe its output. Python is presented as a readable language used in areas such as web development, data analysis and artificial intelligence.

A development environment supplies the tools needed to enter and run a program. A Python installation and an IDE are different things: the language runtime executes the code, while an IDE organises development work. The book's Windows installation advice is to make Python available on PATH so that a terminal can find it. A browser environment can also provide a place to practise simple Python programs without a local installation.

Begin with a small program and a known expected result. Use ordinary straight quotation marks in executable code. A screenshot, OCR extract or formatted textbook page can contain typographic quotation marks that should not be copied into a program unchanged.`),
 t('2.2','Syntax, names, types and input/output',[21,22,23],`Python uses indentation to group the statements belonging to a control structure or function. A comment beginning with # explains the source and is not executed as a program statement. Triple-quoted text is a string literal; use # for an unambiguous explanatory comment in these examples.

A variable name refers to a value and can later be assigned another value. Names are case-sensitive. In the naming rules taught here, begin with a letter or underscore, then use letters, digits or underscores. A name cannot be a reserved keyword. student_mark is suitable; 1mark and student-mark are not single valid variable names.

| Type | Meaning | Example |
| --- | --- | --- |
| int | Whole number | 17 |
| float | Floating-point number | 19.5 |
| str | Text | "Ali" |
| bool | Truth value | True |

input() returns text entered by the user. Convert a suitable numeric string with int() or float() before doing numeric calculations. print() displays an output. For example, the text "5" is not the same value as the integer 5. Code examples that request numbers assume the learner supplies a valid numeric value; this retained section does not add the excluded exception-handling lesson.`),
 t('2.3','Operators, expressions and precedence',[23,24,25,26],`An expression combines values, names and operators to produce a result. Arithmetic operators include +, -, *, /, //, % and **. Division / produces a division result; // is floor division; % gives the remainder; ** raises a value to a power. Assignment = binds a name to a value, while equality comparison == asks whether two values are equal.

Comparisons include <, >, <=, >=, == and !=. For the Boolean examples in this chapter, and requires both conditions to be true, or requires at least one to be true, and not reverses a truth value. Compound assignment, such as total += 2, updates the existing value using the indicated arithmetic operation.

Parentheses make the intended grouping explicit. Powers are evaluated before multiplication/division and addition/subtraction in the ordinary positive-number examples here. Multiplication and division are evaluated before addition and subtraction. Thus 3 + 2 * 4 is 11, while (3 + 2) * 4 is 20. An exponent such as 2 ** 3 is 8; the multiplication sign * does not mean exponentiation.

Trace assignments in sequence rather than treating every line as an independent expression. If a starts at 10 and a += 5 is followed by a *= 2, the final value is 30. Some printed running-output comments in the supplied book are inconsistent with their preceding assignments. The executable examples in this guide use independently checked results.`),
 t('2.4','Decisions and loops',[26,27,28],`An if statement executes its block when its condition is true. if-else chooses between two blocks. if-elif-else checks alternatives in order and executes the first matching branch, or the final else branch if none match. A colon introduces the block and indentation identifies its statements.

A conditional expression selects a value: value_if_true if condition else value_if_false. For example, a label can be selected as "Even" if number % 2 == 0 else "Odd". This expression is useful for a small value selection; a longer multi-step branch is clearer as a normal if-else statement.

A while loop repeats while its condition remains true. Its state must change so that the intended stopping condition can eventually be reached. A for loop visits the elements of a sequence, such as the names in a list. In the retained loop examples, range(2, 11, 2) supplies 2, 4, 6, 8 and 10; the stop value is excluded.

The ALP removes the numbered textbook exercise MCQ 6 and short question 5 about range(). It does not delete section 2.4 or the book's retained loop activities. This guide does not include those deleted exercise questions, but loop programs still use the syntax required by retained activities.`),
 t('2.5','Functions, modules, libraries and packages',[28,29,30,31],`Define a function with def, give it a suitable name and indent its body. A parameter is a name in the function definition; an argument is a value supplied in a call. return sends a result back to the caller. Displaying a value with print() and returning a value are different jobs.

A default parameter supplies a value when the caller omits that argument. A greeting function can use "Student" by default and use a supplied name when one is given. Defining the function does not automatically call it.

A module groups related Python code. import makes a module available by its name, and from ... import ... can select a required item. The book illustrates standard modules including random, datetime and statistics. Use the qualified name of a function where appropriate; importing a module does not rename every one of its contents into the current namespace.

A package organises related modules. The book's e-commerce example places product, customer and order modules together. A folder organisation and reusable functions make a larger project easier to understand. These retained functions and modules do not require the excluded object-oriented-programming section.`),
 t('2.6','Lists, tuples, indexing and slicing',[31,32,33,34],`A list is an ordered collection written with square brackets. Elements are accessed by index, starting at 0. A list is mutable: an item can be replaced and items can be added or removed. append() adds at the end, remove() removes the first matching value, sort() orders the list and reverse() reverses its current order.

A tuple is also ordered but does not support changing an item by indexed assignment. A tuple can be accessed by index and its length can be found with len(). Distinguish the two operations: changing a list item is permitted, while trying the corresponding tuple-item assignment is not.

For a sequence, a slice start:stop:step selects a range of positions and excludes the stop position. Negative indices count from the end; -1 is the last element. Concatenating two lists with + produces a combined list. The original lists and the new list should not be confused.

For [10, 20, 30, 40, 50], index 2 selects 30, the slice [1:4] selects [20, 30, 40], and [-2:] selects [40, 50]. Predict the positions before evaluating the expression. Inserting an item at a given list position is also used in the supplied model paper; it is not the same as replacing the existing item.`),
 t('2.7','Modular organisation and the main entry point',[34,35],`Modular programming separates a larger program into smaller reusable pieces. A function can have one clear responsibility; a module can group related functions. This reduces duplication, supports independent work and makes a change easier to locate.

The book shows a main function and a check for whether a script is being run directly. The familiar guard if __name__ == "__main__": calls the starting function in that situation. Keeping the starting action separate from reusable functions makes the program's intended entry point easier to recognise.

For an attendance project, one module can hold attendance operations and another can format a report. A main script calls the needed functions. This describes the retained modular-programming concept, without adding the excluded class/object, advanced-file-operation or Python testing sections. Section 2.7 continues onto printed page 35 before the excluded section 2.8 begins.`)
 ],
 short:[
 a(1,'What is the purpose of comments in Python?','Comments explain the purpose or reasoning of source code for a reader. A single-line comment begins with # and is ignored as executable code. A useful comment explains intent or a non-obvious step instead of merely repeating the statement. Ordinary quoted text is a string, so # is the clear choice for an explanatory comment.',[21]),
 a(2,'Differentiate integers and floats, with an example.','An integer represents a whole number, such as count = 12. A float represents a floating-point number, such as price = 12.5. A suitable string entered with input() can be converted with int() or float() depending on the intended calculation. The string "12" is not itself the integer 12.',[22,23]),
 a(3,'Explain operator precedence with an example.','Precedence determines which operator is applied first when an expression contains several operators. Multiplication precedes addition in 3 + 2 * 4, so the result is 11. Parentheses change the grouping: (3 + 2) * 4 gives 20. State both the order and result in a complete answer.',[25,26]),
 a(4,'Compare a short-hand conditional expression with a normal if-else.','A conditional expression selects a value in one expression, for example label = "Even" if n % 2 == 0 else "Odd". A normal if-else has indented statement blocks and is more suitable when a branch performs several actions. Both make a selection from a condition, but their syntax and typical use differ.',[26,27]),
 a(6,'How do default parameters work?','A default value is written in the function definition and is used when the caller does not provide that argument. In def greet(name="Student"): ..., greet() uses Student, while greet("Ali") uses Ali. The supplied argument replaces the default for that call; defining a default does not automatically call the function.',[29]),
 a(7,'Why is modular programming useful?','It divides a larger program into smaller pieces with clear responsibilities. Related functions can be kept together in a module, reused by several callers and maintained without repeating their implementation. Separate attendance and report modules, for example, let a developer change report formatting without rewriting attendance entry.',[30,31,34,35])
 ],
 long:[
 a('1(b,d)','Evaluate the retained parts of textbook long question 1.',`Only parts (b) and (d) are retained by the supplied ALP. For (b), evaluate (25 + 3 * 4 ** 2 - 6) / (2 ** 3 + 1) - 7. The numerator is 25 + 48 - 6 = 67 and the denominator is 8 + 1 = 9. The exact mathematical result is 4/9; ordinary Python floating-point evaluation prints approximately 0.44444444444444464.

For (d), evaluate 45 / (2 ** 2 + 3 * 4) + 8 * (7 - 3). The denominator is 4 + 12 = 16. The remaining product is 8 * 4 = 32, so the result is 45/16 + 32 = 34.8125. The excluded parts (a) and (c) are not included in the practice set.`,[40]),
 a('2-3','Translate the printed mathematical-expression exercise carefully.',`The supplied page prints an instruction numbered 2 followed by material numbered 3(a) and 3(b). It also places 6 - 2 x 3 on a separate line below 5 x (3 + 2 squared). The layout does not clearly show whether the two lines are independent expressions or an intended fraction.

The individually readable translations are 5 * (3 + 2 ** 2), giving 35, and 6 - 2 * 3, giving 0. If the intended expression is the quotient of those two lines, its denominator is zero, so it has no defined numeric result and Python cannot evaluate it as a valid division. Do not silently invent a different denominator. Ask a teacher to confirm the intended printing if this item is assigned.

Part (b), 7 + 2 squared, translates unambiguously as 7 + 2 ** 2 and evaluates to 11. The guide preserves this source-layout uncertainty rather than presenting an invented correction as a textbook answer.`,[40]),
 a(4,'Explain variables in Python.',`A variable name refers to a value that a program can use. Assign a value with = and choose a meaningful valid name, such as student_mark = 75. A later assignment can associate that name with another value. Python is case-sensitive, so student_mark and Student_Mark are different names.

The retained naming rules begin a name with a letter or underscore and allow letters, digits and underscores thereafter. A reserved keyword cannot be used as a variable name. Common values introduced in the chapter include integers, floats, strings and Boolean values.

Input requires attention to type. input() returns a string, so a numeric calculation typically needs an appropriate conversion. print() displays a value. Keep assignment separate from comparison: mark = 75 assigns a value, while mark == 75 tests equality. A complete answer should include a naming rule, an assignment, a data-type example and the distinction between input text and numeric data.`,[21,22,23,24]),
 a(5,'Classify a number as positive, negative or zero.','Read a valid numeric input as a float. Test whether it is greater than zero; if not, test whether it is less than zero; otherwise report zero. The ordered if-elif-else branches make the three ordinary numeric cases mutually exclusive. See the checked program and test cases below.',[27,40]),
 a(6,'Print and count the odd numbers from 1 to 100 with a while loop.','Start the candidate at 1 and the count at 0. While the candidate is at most 100, print it, increment the count and add 2 to the candidate. The final printed odd number is 99 and the count is 50. State the initial value, stopping condition and update so that the loop trace is clear. See the checked program below.',[28,40])
 ],
 exerciseMcqs:[
 q(1,'Which installation setting lets the terminal find an installed Python command?','Add Python to PATH',['Install an IDE without a runtime','Remove all environment paths','Rename the source to an image'],'This is the Windows setup advice in the supplied book.'),
 q(2,'Which name follows the variable naming rules taught in the chapter?','variable1',['1variable','variable-name','variable name'],'A digit may follow an initial letter, while a leading digit, space or hyphen does not form the demonstrated identifier.'),
 q(3,'What content does print("Age:", 25) display?','Age: 25',['25 only','Age only','The variable name age'],'print() displays the supplied label and value; its normal separator places a space between them.'),
 q(4,'Which operator raises a number to a power in Python?','**',['*','//','/'],'For example, 2 ** 3 evaluates to 8.'),
 q(5,'Which statement directly visits each element of a supplied list?','for',['do-while','repeat-until','A variable assignment alone'],'The retained for-loop section illustrates iteration over a sequence.'),
 q(7,'Which keyword begins a function definition?','def',['define','function','func'],'Use def followed by a name, parameter list and colon.'),
 q(8,'For temperature = 25, humidity = 60 and wind_speed = 15, which full message does the printed conditional expression select?','Warm and breezy',['Hot and humid','Cool and dry','Moderate'],'The first condition temperature > 30 is false. The next condition temperature == 25 and wind_speed > 10 is true. The textbook option abbreviates this message as Warm; this practice option states the actual full output.'),
 q(9,'Which operator concatenates two Python lists?','+',['combine()','concat()','merge()'],'The + operator creates a list containing the elements of the two operands in order.')
 ],
 programs:[
 {id:'operators',title:'Trace arithmetic and assignment',code:'a = 10\nb = 3\nprint(a + b, a - b, a * b)\nprint(a // b, a % b, a ** b)\na += 5\na *= 2\nprint(a)\n',stdout:'13 7 30\n3 1 1000\n30\n',pages:[23,24]},
 {id:'default-parameter',title:'Use a default parameter and a return value',code:'def greet(name="Student"):\n    return "Hello, " + name + "!"\n\nprint(greet())\nprint(greet("Ali"))\n',stdout:'Hello, Student!\nHello, Ali!\n',pages:[29]},
 {id:'lists-and-slices',title:'Change a list and select positions',code:'values = [10, 20, 30, 40, 50]\nprint(values[2])\nprint(values[1:4])\nprint(values[-2:])\nvalues.insert(1, 15)\nprint(values)\n',stdout:'30\n[20, 30, 40]\n[40, 50]\n[10, 15, 20, 30, 40, 50]\n',pages:[31,32,33,34]},
 {id:'expression-parts',title:'Check retained expression parts',code:'print((25 + 3 * 4 ** 2 - 6) / (2 ** 3 + 1) - 7)\nprint(45 / (2 ** 2 + 3 * 4) + 8 * (7 - 3))\nprint(7 + 2 ** 2)\n',stdout:'0.44444444444444464\n34.8125\n11\n',pages:[40]},
 {id:'positive-negative-zero',title:'Solve retained long question 5',code:'number = float(input())\nif number > 0:\n    print("Positive")\nelif number < 0:\n    print("Negative")\nelse:\n    print("Zero")\n',cases:[{stdin:'4.5\n',stdout:'Positive\n'},{stdin:'-2\n',stdout:'Negative\n'},{stdin:'0\n',stdout:'Zero\n'}],pages:[27,40]},
 {id:'odd-numbers',title:'Solve retained long question 6 and model-paper Q5',code:'number = 1\ncount = 0\nwhile number <= 100:\n    print(number)\n    count += 1\n    number += 2\nprint("Count:", count)\n',stdout:Array.from({length:50},(_,i)=>2*i+1).join('\n')+'\nCount: 50\n',pages:[28,40]},
 {id:'modular-main',title:'Use a function and a clear entry point',code:'def total(a, b):\n    return a + b\n\ndef main():\n    print(total(12, 8))\n\nif __name__ == "__main__":\n    main()\n',stdout:'20\n',pages:[29,34,35]}
 ]
};
