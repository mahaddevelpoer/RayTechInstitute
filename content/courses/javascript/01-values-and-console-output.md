## JavaScript turns instructions into behaviour

JavaScript is a programming language used to calculate values, make decisions and respond to events. In a browser project, HTML supplies structure, CSS supplies presentation and JavaScript supplies programmable behaviour. The language can also run in other environments, so do not assume that every JavaScript program has a web page to manipulate.

This first lesson uses console mode. The practice runtime is isolated from the main website and prints output from `console.log`. It is not an unrestricted browser tab. Do not use external packages, network requests, `alert`, `prompt` or browser storage here. A later lesson introduces the separate Interactive DOM preview and its supported interfaces.

## Example 1: print an exact message

```javascript
console.log("Ready to practise");
console.log("Read, predict, run, compare");
```

Expected output:

```text
Ready to practise
Read, predict, run, compare
```

The quoted text is a string value. Its quote characters delimit the value; they do not appear in this output. Parentheses contain the value passed to `console.log`, and the dot accesses `log` on `console`. Each call writes its message to the output panel. Here, the semicolon marks the end of an instruction. JavaScript can insert some semicolons automatically, but explicit consistent punctuation is useful while learning.

## Example 2: compare numbers with numeric-looking text

```javascript
console.log(12 + 3);
console.log("12" + "3");
console.log(12 * 3);
```

Expected output:

```text
15
123
36
```

The first expression adds two numbers. The second joins two strings; quotation marks change the kind of value, even though the characters look numeric. The multiplication operator is an asterisk. Expressions are evaluated before their results are printed. Be precise about value types rather than relying on what a value looks like on screen. Later lessons cover conversion and the additional behaviours of operators in detail.

## Example 3: give values useful names

```javascript
const price = 150;
const quantity = 2;
const total = price * quantity;

console.log(total);
```

Expected output:

```text
300
```

`const` declares a binding with a name. The equals sign supplies its initial value; it is not an equality comparison. Read the instructions from top to bottom: `price` receives 150, `quantity` receives 2, and `total` receives the calculated product. Printing a name reads the value associated with it.

Use meaningful names such as `quantity`, not an unrelated label chosen only to shorten typing. JavaScript distinguishes uppercase and lowercase letters, so `Price` and `price` are different names. A `const` binding cannot be reassigned. Future lessons compare `const` with `let` and explain what this rule does and does not imply for objects.

## Errors provide clues

An unmatched quote or missing closing parenthesis can produce a syntax error before the intended output appears. Reading a name that has not been declared produces a different kind of error. Neither means that you should replace the whole program. Read the message, inspect the indicated area and compare the source against the intended instruction.

Try changing `quantity` to 4 in Example 3. Predict 600 before running it. Then change only the final call to `console.log(price)`. Predict 150: declaring `total` does not change the original price. This small experiment separates calculating a new value from changing an existing one.

## Independent exercise

Write a program that declares a ticket price and a ticket count, calculates a total and prints it. Add a separate printed heading describing the calculation. Use only numbers, strings, `const`, multiplication and `console.log`; do not introduce input boxes or DOM operations yet.

```hint
Start with two constant declarations. Give the product its own name before printing it, so each step has a clear purpose.
```

```solution
For example, const ticketPrice = 200; const ticketCount = 3; const ticketTotal = ticketPrice * ticketCount; followed by console.log("Ticket total"); and console.log(ticketTotal); prints a heading and then 600. Different sensible names and values are valid.
```
