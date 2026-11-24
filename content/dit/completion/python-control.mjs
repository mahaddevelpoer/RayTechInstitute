import {q,t,lab,pythonSource} from './authoring.mjs';
const flow=['Python control-flow reference','https://docs.python.org/3/tutorial/controlflow.html'];
export default [
{key:'python-7',subject:'Introduction to Programming',slug:'dit-python',module:7,chapter:7,title:'Loops',pages:'29',sources:[pythonSource,flow],topics:[
t('7.1','for loops and range',`A Python for loop obtains items from an iterable and executes its body for each item. It is not restricted to integer counters: it can visit names in a list or characters in a string. The loop variable is assigned each successive item.

range(start, stop, step) describes a sequence of integers with an excluded stop. range(1, 11) supplies 1 through 10. A negative step can count down, and a zero step is invalid. If no items are supplied, the body does not run. An empty list is therefore an important test for an item-processing loop.

~~~python
total = 0
for number in range(1, 6):
    total += number
print(total)
assert total == 15
~~~

The accumulator starts at zero and is updated for each item. Use a dry-run table to show 0, 1, 3, 6, 10 and 15. Do not accidentally place the initialisation inside the loop, which would reset the accumulated work on every iteration.`,[
q('What does a for loop iterate over?','Items supplied by an iterable',['Only physical memory addresses','Only positive integers in every case','Only a single print statement'],'Python for loops work with lists, strings, ranges and other iterables.'),
q('Which range supplies 1 through 10?','range(1, 11)',['range(1, 10)','range(10, 1)','range(0, 10) as values 1 through 10'],'The stop value is excluded.'),
q('What happens when a for loop receives an empty list?','Its body runs zero times',['Its body always runs once','It automatically inserts zero','It must always raise an exception'],'No input items means no body iteration.'),
q('Where should a running-sum accumulator normally be initialised?','Before the loop',['Reset to zero inside every iteration','Only after the result is printed','Inside every unrelated comment'],'Initialisation before traversal allows partial results to accumulate.'),
q('Which range counts down from 3 to 1?','range(3, 0, -1)',['range(3, 0, 1)','range(1, 3, -1)','range(3, 1) as an increasing range'],'The negative step and excluded zero give 3, 2 and 1.'),
q('Can the range step be zero?','No',['Yes, it means an automatic infinite list','Yes, it always becomes 1','Only when the start is zero'],'A zero range step is invalid.')]),
t('7.2','while loops, progress and termination',`A while loop tests its condition before each iteration. If the condition is initially false, the body is skipped. The body must eventually make the condition false or deliberately exit when a finite computation is intended. A loop whose control state never changes can continue indefinitely.

~~~python
number = 1
total = 0
while number <= 5:
    total += number
    number += 1
print(total)
assert (total, number) == (15, 6)
~~~

The update number += 1 provides progress toward the stopping condition. Trace the condition as well as the body. A for loop is often convenient for a known iterable, while a while loop is useful when repetition is described by a changing condition. Neither is automatically correct without the appropriate bounds and update.

For factorial, start the product at 1, not 0. Multiply by each integer from 1 through n. The factorial of zero is 1, so a zero-iteration product loop should retain that initial value. Define how negative or noninteger input is handled instead of attempting an endless countdown.`,[
q('When does while test its condition?','Before each iteration',['Only after the entire program finishes','Exactly once after ten iterations','Never if a counter exists'],'A pre-test loop can execute zero times.'),
q('What can happen if the loop condition stays true and no exit occurs?','The loop may not terminate',['The runtime always invents a correct final value','The body automatically runs only once','The condition becomes false because a comment says so'],'A finite algorithm needs an appropriate progress or exit mechanism.'),
q('What is a suitable initial product for a factorial loop?','1',['0','-1 for every input','The number of monitor pixels'],'Starting with zero would make every multiplied result zero.'),
q('What is 0 factorial?','1',['0','Undefined for the stated nonnegative-integer factorial','10'],'The empty-product case has value 1.'),
q('Which is a useful factorial input rule?','Accept nonnegative integers and reject unsuitable values',['Accept every text string as zero','Require only negative integers','Never define a stopping condition'],'The domain determines the meaningful calculation and termination.')]),
t('7.3','break, continue and nested loops',`break exits the nearest enclosing loop. continue skips the rest of the current iteration and proceeds to the next iteration, including the next condition test for a while loop. They do not have the same effect.

~~~python
selected = []
for number in range(1, 8):
    if number == 3:
        continue
    if number == 6:
        break
    selected.append(number)
print(selected)
assert selected == [1, 2, 4, 5]
~~~

The 3 is skipped, and encountering 6 ends this loop. A break inside an inner loop does not automatically terminate every enclosing loop. In while loops, ensure that continue cannot skip the only update needed for progress.

Do not change a list\'s length casually while iterating over its positions; consider a new result list or a suitable copy. For an exam trace, record the current item, each tested condition and whether execution appends, continues or breaks.`,[
q('What does break exit?','The nearest enclosing loop',['Every function and every program automatically','Only a comment','Only the current print call without affecting the loop'],'break affects the nearest loop containing it.'),
q('What does continue do?','Skip the remaining current-iteration work and continue loop iteration',['Always terminate the whole loop','Restart the whole Python interpreter','Set every counter to zero'],'continue advances to the next loop cycle rather than ending the loop.'),
q('Why can continue be dangerous in a poorly designed while loop?','It may skip the only progress update',['It always deletes the condition','It automatically changes every number to text','It always ends the outermost loop'],'Skipping a necessary update can keep the condition true indefinitely.'),
q('Does break in an inner loop automatically end an outer loop?','No',['Yes, it always exits every level','Only when the variable is named i','Only if both loops use ranges'],'The nearest enclosing loop is the target.'),
q('What is appended before breaking at 6 and skipping 3 in the example?','[1, 2, 4, 5]',['[1, 2, 3, 4, 5, 6]','[3, 6]','[1, 2, 4, 5, 7]'],'The iteration for 3 continues without append; encountering 6 ends traversal.')]),
t('7.4','Loop tests and worked patterns',`Three recurring patterns are counting, accumulating and searching. A counter records how many items satisfy a condition. An accumulator combines values, such as a total or product. A search tests candidates and may stop when the target is found.

Test a loop with no items, one item and several items where meaningful. Check inclusive/exclusive endpoints and whether duplicates should remain. For a sum from 1 through n, independently compare a small case such as n=5 with 15. For a multiplication table, define the intended multiplier interval, such as 1 through 10.

Keep iteration and output requirements distinct. Printing a running total inside the loop shows several partial totals; printing once afterward shows the final total. Both can be useful, but only one may match the task. Write the expected output before accepting the program as complete.`,[
q('What does an accumulator maintain?','A result combined across iterations',['Only the source file name','Only the final loop keyword','A permanent CPU frequency'],'Sums and products are common accumulator uses.'),
q('Where should print be placed to display one final total?','After the accumulation loop',['Inside the loop before every update','Before initialising any data','Only in a comment'],'A single output after traversal shows the final accumulated result.'),
q('What is the sum from 1 through 5?','15',['10','5','25'],'1 + 2 + 3 + 4 + 5 equals 15.'),
q('Why test zero/one/several iterations?','They exercise initialisation, boundaries and repeated updates',['Every loop always executes ten times','Only long inputs can reveal errors','One successful output proves every case'],'Different traversal sizes expose different errors.')])
],short:[['What does a for loop do?','It visits items from an iterable and executes its suite for each supplied item.'],['What does while do?','It repeatedly executes a suite while its tested condition remains truthy, checking before each iteration.'],['Compare break and continue.','break exits the nearest loop; continue skips the rest of the current iteration and proceeds with the next loop cycle.'],['What is an off-by-one error?','An incorrect boundary that includes or excludes one unintended iteration, such as using range(1,10) when 1 through 10 are required.'],['Why initialise factorial to one?','One is the multiplicative identity, and retaining it when n=0 gives the correct empty-product result.'],['Why distinguish partial and final output?','Printing inside an accumulation loop shows intermediate values; printing afterward shows the completed result.']],long:[['Compare for and while for the first ten natural numbers.','A for solution can iterate over range(1,11), using the excluded stop to include 10. A while solution starts a counter at 1, tests counter <= 10 and increments after each output. Both must produce the same intended sequence. The for loop expresses traversal of a known range, while the while loop exposes condition and progress explicitly. A missing update in while can prevent termination; an incorrect range stop can omit the last value.'],['Design factorial with two loop forms.','Accept a nonnegative integer. Initialise a product to one. The for form multiplies by each value in range(1,n+1). The while form starts at one, multiplies while the counter is at most n and increments each time. For n=0 neither body is required and the product remains one. Compare n=5 with 120, test zero and reject negatives. The two implementations should agree, but an independent expected result is still needed rather than only comparing two potentially mistaken programs.'],['Explain a search with early exit.','Visit candidates in a defined order and compare each with the target. On a match, record the result and use break if only the first occurrence is needed. A continue can skip unsuitable candidates without ending the search. Define what happens when no match exists and whether repeated matches matter. Trace the loop variable, conditions and result state. For nested loops, explain explicitly that break affects only the nearest loop unless additional control is designed.']],labs:[
lab('py-10','Print the first ten natural numbers with both loops',['Implement range(1,11).','Implement a while loop from 1 through 10 with a progress update.','Compare the two lists before printing.'],'Both versions produce 1 through 10.',{practicals:[10],code:'by_for = []\nfor n in range(1, 11):\n    by_for.append(n)\nby_while = []\nn = 1\nwhile n <= 10:\n    by_while.append(n)\n    n += 1\nprint(by_for)\nprint(by_while)\nassert by_for == by_while',stdout:'[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n'}),
lab('py-11','Calculate factorial with for and while',['Accept a nonnegative integer.','Initialise both products to one and use inclusive bounds.','Compare 0 with 1 and 5 with 120.'],'Both valid implementations agree with the independent expected value.',{practicals:[11],code:'n = int(input())\nif n < 0:\n    print("Invalid integer")\nelse:\n    first = 1\n    for value in range(1, n + 1):\n        first *= value\n    second = 1\n    value = 1\n    while value <= n:\n        second *= value\n        value += 1\n    print(first, second)',tests:[{stdin:'5\n',stdout:'120 120\n'},{stdin:'0\n',stdout:'1 1\n'},{stdin:'-1\n',stdout:'Invalid integer\n'}]}),
lab('py-12','Sum 1 through n with two loop forms',['Accept a nonnegative integer.','Accumulate from 1 through n using for and while.','Check n=5 against 15 and n=0 against 0.'],'Both versions show the same checked sum.',{practicals:[12],code:'n = int(input())\nif n < 0:\n    print("Invalid integer")\nelse:\n    total_for = 0\n    for value in range(1, n + 1):\n        total_for += value\n    total_while = 0\n    value = 1\n    while value <= n:\n        total_while += value\n        value += 1\n    print(total_for, total_while)',tests:[{stdin:'5\n',stdout:'15 15\n'},{stdin:'0\n',stdout:'0 0\n'},{stdin:'-2\n',stdout:'Invalid integer\n'}]}),
lab('py-13','Generate a multiplication table',['Read the integer and define multipliers 1 through 10.','Build the table using each loop form and compare the rows.','Print one checked table.'],'Input 5 yields products from 5 to 50.',{practicals:[13],code:'number = int(input())\nrows_for = []\nfor multiplier in range(1, 11):\n    rows_for.append(f"{number} x {multiplier} = {number * multiplier}")\nrows_while = []\nmultiplier = 1\nwhile multiplier <= 10:\n    rows_while.append(f"{number} x {multiplier} = {number * multiplier}")\n    multiplier += 1\nassert rows_for == rows_while\nprint("\\n".join(rows_for))',stdin:'5\n',stdout:'5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50\n'})]
},
{key:'python-8',subject:'Introduction to Programming',slug:'dit-python',module:8,chapter:8,title:'Functions',pages:'29',sources:[pythonSource,flow],topics:[
t('8.1','Defining, calling and returning values',`A function groups a reusable operation with a name, parameters and a body. def introduces a definition; the body runs when the function is called, not merely because the definition is encountered. Parameters are the names used by the function definition; arguments are the supplied values or expressions in a call.

return ends that function call and passes a value back to its caller. An ordinary function that reaches its end without an explicit return value returns None. Multiple values written in one return expression can be packaged into a tuple and unpacked by the caller.

~~~python
def add(first, second):
    return first + second

result = add(9, 4)
print(result)
assert result == 13
~~~

Use a function whose inputs and result have a clear purpose. Calling a function by name without parentheses usually refers to the function object rather than executing the call.`,[
q('What introduces an ordinary function definition?','def',['function as the required Python keyword','define_only','A required spreadsheet formula'],'def defines the function body and parameters.'),
q('When does a defined function body normally run?','When the function is called',['Every time a comment is read','Only when its file is printed','Never if it has parameters'],'Definition and invocation are separate operations.'),
q('What is a parameter?','A name in the function definition for supplied input',['Only the final printed result','A physical keyboard key','A file extension'],'Arguments supply values for parameters during a call.'),
q('What does return do?','End the call and provide a result to its caller',['Always print the result to the screen','Restart the whole program','Create a new loop automatically'],'Returning and printing serve different purposes.'),
q('What does a function return when it ends without an explicit returned value?','None',['Always zero','Always an empty string','The first argument automatically'],'None is the ordinary implicit return value.')]),
t('8.2','print versus return',`print sends a representation to an output stream, commonly the console. return provides a value to the calling code. A function that only prints a total cannot be used as though it returned that numeric total unless it also returns it.

~~~python
def total(first, second):
    return first + second

answer = total(6, 7)
print(answer * 2)
assert answer == 13

def display_total(first, second):
    print(first + second)

returned = display_total(6, 7)
assert returned is None
~~~

The output is 26 followed by 13. The assertion explains why the console showing 13 does not mean display_total returned the integer 13. A useful design often separates computation from display so that calculations can be reused and tested.`,[
q('Which operation supplies a computed value to a caller?','return',['print alone in every function','A comment containing the value','Renaming the function'],'The caller receives the return value.'),
q('Does a printed number automatically become the function return value?','No',['Yes, every print is an implicit return','Only if the number is positive','Only if the function has two arguments'],'Output and return channels are distinct.'),
q('Why separate computation from display?','The result can be reused and tested without depending only on console text',['It makes every algorithm correct automatically','It prevents functions from accepting inputs','It removes the need for a caller'],'A returned result supports composition and direct checks.'),
q('Can a function both print and return?','Yes, if it explicitly does both',['No, the language forbids both','Only if it has no parameters','Only once in an entire file'],'The operations are distinct and can coexist when the design calls for them.')]),
t('8.3','Variable scope and shared data',`Scope determines where a name can be resolved. A name assigned inside a function is normally local to that function unless explicitly declared otherwise. A global name belongs to the module context. A function can read an appropriate outer/global name, but assigning a local name with the same spelling is a different operation from changing the global binding.

For ordinary beginner exercises, pass required values as arguments and return results. This makes dependencies visible and avoids unnecessary global mutation. A local name in one call is not automatically available by the same name in the caller.

~~~python
rate = 2
def double(value):
    result = value * 2
    return result

answer = double(5)
print(answer, rate)
assert (answer, rate) == (10, 2)
~~~

Mutability is a separate issue: passing a list can allow the function to mutate that same list object. Passing an object does not automatically deep-copy it. State whether the function is intended to change an input collection.`,[
q('Where is a name assigned inside a function normally local?','That function scope',['Every computer on the network','Every unrelated Python program','Only the source filename'],'Ordinary assignments in a function create local bindings unless declared otherwise.'),
q('Which design makes dependencies clear for a small calculation?','Pass inputs and return the result',['Use many unrelated changing globals','Hide the input in a comment','Depend only on a previous console message'],'Explicit inputs and results make behaviour easier to understand and test.'),
q('Does passing a list automatically deep-copy it?','No',['Yes, every function argument is recursively copied','Only when the parameter is named values','Only when print is used'],'The function can receive a reference to the same list object.'),
q('Is mutating a passed list the same as rebinding a global name?','No, object mutation and name binding are different concepts',['Yes, every mutation requires a global declaration','Yes, all scopes are identical','No, because lists cannot be passed'],'Scope of a name and mutability of an object must be distinguished.')]),
t('8.4','Default arguments and variable argument lists',`A default supplies a value when an argument is omitted. Defaults are evaluated when the function definition executes, not freshly each time the function is called. Immutable defaults such as a string or number are straightforward for introductory cases.

Avoid an unintended shared mutable default such as an accumulating list. A common pattern uses None as the default and creates a fresh list inside the function when needed. The purpose is to avoid one call\'s temporary data unexpectedly appearing in a later call.

~~~python
def greet(name="Learner"):
    return "Hello, " + name

def collect(*values):
    return list(values)

print(greet())
print(collect(1, "A", 3))
assert greet("Ali") == "Hello, Ali"
~~~

*values collects positional arguments into a tuple, which can be converted to a list for the syllabus exercise. Keyword arguments can make calls clearer, but arguments must still match the function\'s signature.`,[
q('When is a default argument value evaluated?','When the function definition executes',['Freshly on every call in all cases','Only when the source file is deleted','Only when print is called'],'Mutable defaults can therefore unintentionally be shared across calls.'),
q('Which is a suitable default for a simple greeting name?','An immutable string such as "Learner"',['A publicly posted password','A required physical device','An undefined name assumed to exist'],'An immutable string default is appropriate to this example.'),
q('Why can a list default be surprising?','The same default list object can be reused across calls',['Python always rejects all lists as arguments','Lists become tuples automatically','A list can never be mutated'],'Mutating that default can retain state between calls.'),
q('What does *values collect in the example function?','Positional arguments into a tuple',['Every file on the disk','Only global variables','Only keyword names without values'],'A starred positional parameter accepts a variable number of positional arguments.'),
q('How can a function provide two computed results in one return?','Return a tuple-like pair and unpack it in the caller',['Use two sequential return statements that both execute','Only print the two results and assume a numeric return','Rename the function twice'],'A return expression can package multiple values.'),
q('What is a useful test for a default-argument function?','Call it once with the argument omitted and once with an explicit argument',['Only inspect its font','Never call it','Assume one call proves all cases'],'Both default and supplied-argument paths need checking.'),
q('Which factorial function result is correct for n=5?','120',['25','15','0'],'5 factorial is 5 × 4 × 3 × 2 × 1.')])
],short:[['Differentiate parameter and argument.','A parameter is a name in the definition; an argument is a value/expression supplied in a call.'],['Differentiate print and return.','print emits output; return provides a value to calling code and ends the call.'],['What is a local variable?','A name whose binding belongs to the function scope in the ordinary case.'],['Why pass inputs rather than rely on many globals?','Explicit arguments make requirements and dependencies clearer and reduce unintended shared-state effects.'],['Why avoid an accumulating mutable default?','The default object is created at definition time and can be reused, so one call can affect later calls.'],['How can multiple results be returned?','Package them into a tuple or another structure and have the caller unpack or access that structure.']],long:[['Design reusable arithmetic functions.','Define the accepted input values as parameters and return the calculation rather than depending only on printing it. The caller can display the result, use it in another expression or compare it with an expected value. Use separate tests for ordinary and boundary inputs, and document any rejected domain. For multiple outputs, return a defined structure such as a pair. Clear signatures and return meanings make the function easier to reuse than one relying on hidden globals or a particular console format.'],['Explain scope with a function call.','The caller supplies arguments and the function binds its parameters in the call context. Ordinary assigned names inside the body are local, while module-level bindings belong to the module scope. Returning a value communicates a result without making every local name global. Passing a mutable list can still allow mutation of the same object; scope and object identity are different concerns. State whether an input should be changed, and use a copy when the intended outer collection should remain independent.'],['Explain default and variable arguments.','A default lets a caller omit an argument, but its expression is evaluated when the definition executes. Mutable defaults can retain unexpected state between calls, so create a fresh temporary collection inside the function when appropriate. A starred positional parameter collects a variable number of supplied positional arguments into a tuple. The syllabus list-returning exercise can turn that tuple into a list. Test omitted defaults, explicit values and the empty variable-argument case where the signature permits it.']],labs:[
lab('py-21','Return the sum of two arguments',['Define a function with two parameters.','Return their sum and display the caller result.'],'Inputs 9 and 4 produce 13.',{practicals:[21],code:'def add(first, second):\n    return first + second\n\nprint(add(9, 4))\nassert add(-2, 2) == 0',stdout:'13\n'}),
lab('py-22','Return supplied values as a list',['Accept a variable number of positional values.','Return a new list of those values and test the empty case.'],'The sample yields [1, \'A\', 3].',{practicals:[22],code:'def collect(*values):\n    return list(values)\n\nprint(collect(1, "A", 3))\nassert collect() == []',stdout:"[1, 'A', 3]\n"}),
lab('py-23','Return multiple computed values',['Return a sum and difference as a pair.','Unpack the returned result into two caller names.'],'The sample outputs 13 and 5.',{practicals:[23],code:'def calculate(first, second):\n    return first + second, first - second\n\nsum_value, difference = calculate(9, 4)\nprint(sum_value, difference)',stdout:'13 5\n'}),
lab('py-24','Write a factorial function',['Accept a nonnegative integer under the exercise rule.','Return the loop product and reject a negative value.','Check zero and five independently.'],'factorial(0) is 1 and factorial(5) is 120.',{practicals:[24],code:'def factorial(n):\n    if not isinstance(n, int) or isinstance(n, bool) or n < 0:\n        raise ValueError("Use a nonnegative integer")\n    product = 1\n    for value in range(1, n + 1):\n        product *= value\n    return product\n\nprint(factorial(0), factorial(5))\nassert factorial(1) == 1\ntry:\n    factorial(-1)\nexcept ValueError:\n    pass\nelse:\n    raise AssertionError("Negative value was accepted")',stdout:'1 120\n'})]
}
];
