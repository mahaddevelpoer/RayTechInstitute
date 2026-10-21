## A program is a sequence of instructions

Python lets you express calculations and other operations as readable instructions. The interpreter reads and executes a program according to the language's rules. Small programs are useful because you can predict each instruction's effect and compare that prediction with the actual result.

The practice editor runs Python through Pyodide inside an isolated browser runtime. These examples need only the bundled interpreter. They do not need package installation, external network access or persistent files. Later lessons will explain the standard library and distinguish portable language exercises from programs needing additional services.

## Example 1: print strings

```python
print("Learning Python")
print("Predict before you run")
```

Expected output:

```text
Learning Python
Predict before you run
```

The quoted text is a string. `print` receives the value inside its parentheses and writes it to the output panel. In this example each call ends its output with a newline, so the messages occupy separate lines. The quotes identify the string in source code but are not part of the printed message.

You can use either matching single quotes or matching double quotes for these simple strings. Start and finish a string deliberately; an unmatched quote causes a syntax error. Copying a sentence from a word processor can introduce typographic quotation marks that are not the ordinary source-code delimiters shown here.

## Example 2: numbers and strings are different values

```python
print(10 + 5)
print("10" + "5")
print(10 * 5)
```

Expected output:

```text
15
105
50
```

The first line adds numbers. The second joins strings; adding quote marks changes the kind of value the program is working with. The third line multiplies numbers using `*`. Python evaluates the expression before passing its result to `print`.

Do not guess a value's type merely from the characters displayed in output. A printed string containing digits can look like a printed number. Later lessons use explicit type inspection and conversion to make that distinction visible. For now, read the source and identify which values have string delimiters.

## Example 3: calculate with named values

```python
price = 90
quantity = 4
total = price * quantity

print(total)
```

Expected output:

```text
360
```

The equals sign is assignment: it binds the name on the left to the value calculated on the right. It does not ask whether two things are equal. The first two lines establish inputs, the third calculates a result, and the final line displays that result.

Names are case-sensitive. `quantity` and `Quantity` are different names. Choose clear names and use them consistently. Python does not require a dollar sign or a `const` keyword for these assignments. We will investigate names, changing values and object behaviour in more depth in subsequent lessons.

## Reason about execution order

If you change `quantity` to 5 before the `total` assignment, the product becomes 450. If you add `quantity = 5` after the `total` assignment, printing the existing `total` still gives 360: the earlier calculation is not a spreadsheet formula that automatically recalculates whenever another name changes.

To calculate using the new quantity, execute the multiplication assignment again. Predict this behaviour, edit one example and verify it. Understanding execution order is more valuable than memorising the sample numbers.

## Mistakes and independent practice

Check matching parentheses and quotes when a syntax error occurs. Check spelling and execution order when a name is not defined. Do not indent every line randomly: indentation has a structural role in Python, which we will study with conditional statements and loops. The top-level statements in this lesson start at the left margin.

Write a program that names a number of study days and a number of minutes per day, calculates total minutes and prints both a label and the result. Use only assignments, multiplication, strings and `print`.

```hint
Calculate total_minutes = study_days * minutes_per_day after assigning both input names.
```

```solution
For study_days = 5 and minutes_per_day = 30, the multiplication gives 150. A separate print("Planned study minutes") call can label the number printed by print(total_minutes).
```
