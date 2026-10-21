## PHP and the environment running it

PHP is a programming language commonly used on web servers. In a normal web application, a server runs the PHP program and sends its output to a browser. The browser does not run the server's PHP source merely because someone included it in an HTML file.

Our practice editor uses a PHP interpreter compiled to WebAssembly, running in your browser. This lets you practise language features without renting a server. It does not create a public PHP backend, connect to a production database or reproduce every web-server feature. Later lessons distinguish portable language examples from examples that require a separate server environment. Never put production credentials into a practice program.

## Example 1: produce plain text

```php
<?php
echo "Welcome to PHP\n";
echo "Run one example at a time.\n";
```

Expected output:

```text
Welcome to PHP
Run one example at a time.
```

`<?php` starts PHP code. `echo` writes output, and each semicolon ends a statement. The double-quoted `\n` escape produces a newline in this text output. In a file containing only PHP, leaving out the closing PHP tag is an established way to avoid accidentally emitting trailing material outside the program.

The output panel here displays text. In a web application, the context consuming output matters: an HTML response interprets markup and normally collapses ordinary whitespace. A newline in text output is not a universal substitute for an HTML element.

## Example 2: calculate before printing

```php
<?php
echo 8 + 4;
echo "\n";
echo 8 * 4;
echo "\n";
```

Expected output:

```text
12
32
```

Arithmetic expressions produce values before `echo` writes them. The plus sign performs addition here, and the asterisk performs multiplication. The numbers are not quoted strings. Later lessons explain types, numeric conversion and operator precedence; for now, use deliberate simple expressions so the result is unambiguous.

Predict the result after changing only the first expression to `(8 + 4) * 2`. Parentheses make that grouping explicit. It should print 24 on the first output line while the second calculation remains unchanged.

## Example 3: named values make calculations readable

```php
<?php
$price = 120;
$quantity = 3;
$total = $price * $quantity;

echo "Total: ";
echo $total;
echo "\n";
```

Expected output:

```text
Total: 360
```

PHP variable names begin with `$`. The assignment operator associates a value with the variable. Read this example as a sequence: establish a price, establish a quantity, calculate their product, then write the label and result. Variables make it possible to change an input value without hunting for unrelated repeated numbers.

Variable names are case-sensitive. `$price` and `$Price` do not identify the same variable. Use descriptive consistent names, and initialise each variable before reading it. A misspelled name can produce a diagnostic even when a similar-looking name was assigned earlier.

## Debugging and boundaries

Start by checking the opening tag, matching quotes, variable spelling and semicolons. A parser error near a later line can originate from an earlier missing quote or semicolon. Change one fault at a time and run the program again. Do not hide diagnostic messages to make a broken example appear successful.

This lesson needs no file reads, database connection or network request. Keeping the first programs self-contained makes their behaviour reproducible in the browser interpreter and on a suitably configured PHP installation.

## Independent exercise

Declare a notebook price and a notebook quantity. Calculate a total and print a readable label followed by the total and a newline. Choose your own sensible positive values. Explain which lines set input values and which line calculates the result.

```hint
Every reference to a PHP variable needs its dollar sign. Keep the arithmetic separate from the output statements so you can inspect each step.
```

```solution
With $notebookPrice = 75; and $notebookQuantity = 4;, assigning their product to $notebookTotal and echoing that value produces 300. Add an explicit text label and a newline using separate echo statements.
```
