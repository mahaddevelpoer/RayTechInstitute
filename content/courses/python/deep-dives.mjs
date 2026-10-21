// Topic-specific reading, not interchangeable motivational filler.
export const pythonDeepDives = {
 'types-and-explicit-conversion': {
  opening:`Your planner receives the characters "7" and "25". You know they describe seven days and twenty-five minutes, but the program has received text. How does it know that you intend multiplication rather than a label? It does not guess your intention. You must choose the values the calculation needs.

That is why conversion is worth learning before a larger input form. We can keep the input hard-coded and still investigate the exact boundary between text and numbers. By the end, a strange output such as repeated digits should become something you can explain, not a reason to try conversions at random.`,
  inspection:`Follow days_text through the second example without changing it. Before int runs, the name refers to a string. The conversion constructs an integer value, which is assigned to another name. Neither the original text nor its name is edited by that conversion. This explains why the program can later demonstrate string repetition using the original input.

Now change the input to "07" and predict the numeric result and the original text separately. A number represents the quantity seven; the source text also contains a leading zero. Converting to an integer keeps the quantity, not that formatting decision. This distinction matters for identifiers such as roll numbers, where the characters may be the information you need to preserve.

Do not turn a roll number into an integer simply because it contains digits. Decide what operations the value should support. A duration will be multiplied; a roll number might instead be displayed or compared as an identifier. The appropriate type follows the job.`,
  trap:`Conversion is not validation of the whole problem. int("-3") successfully produces an integer, but negative study days can still be invalid for your planner. Conversely, int("2.9") fails rather than silently truncating the decimal string. int(2.9) accepts a floating-point value and truncates it. Inspect the input type before assuming those two requests are equivalent.`,
  transfer:`Explain where your planner stops treating the inputs as text. Then test an ordinary value, a leading zero and text that is not an integer. You have found both a conversion boundary and a reason to learn error handling later.`,
 },
 'strings-indexing-and-slicing': {
  opening:`A student types a subject with spaces on either side, and your screen needs a short label. It is tempting to keep cutting characters until the output looks right. But a label of a different length will expose that guess. Indexing, slicing and string methods give you precise tools for precise jobs.

We will use a short word first so that every position can be checked by hand. Then the same reasoning will explain why cleaning text produces a new value and why a six-character prefix stops at index six without including that position.`,
  inspection:`Draw Python on paper and put an index under each character, beginning with zero. Mark the positions included by [1:4]. There are three selected positions: one, two and three. The stop value describes where selection ends, not the last position included. This convention lets adjacent slices meet at a boundary without sharing a character.

Next compare the original label and the cleaned label in the third example. The method result must be assigned if you want a name to refer to it. Calling strip without keeping its result does not remove spaces from the original string. The example's final check is there to reveal that original state deliberately.

Try an empty string before using a last-character index in your own solution. A slice of an empty string can be empty, while asking for its last character has no valid position to return. Decide which operation expresses your intention instead of treating both as interchangeable ways to get some text.`,
  trap:`Do not confuse stripping surrounding whitespace with removing every space. Internal spaces in a person's name or a subject title can be meaningful. Likewise, a visible symbol can contain multiple Unicode code points. Our short ASCII examples explain the indexing model; they do not promise that arbitrary human text can be edited safely by counting visible shapes.`,
  transfer:`Clean a label, keep the original, and predict a prefix and suffix before running. Then repeat with a shorter label. Explain which operations tolerate a boundary beyond the available text and which need a real character at that position.`,
 },
 'operators-and-comparisons': {
  opening:`You have 137 minutes and want complete twenty-five-minute study sessions. Dividing produces a number, but the planner needs two answers: how many complete sessions fit, and how many minutes remain. Choosing the right operator begins with choosing the question.

The same habit helps with a score of exactly 80. Does that pass? A single symbol can move the boundary and change the answer. This lesson turns those symbols into decisions you can describe and test.`,
  inspection:`For a positive total, check the grouping calculation by reconstructing the original amount: complete groups multiplied by the session length, plus the remainder. If the reconstructed amount differs, your reasoning or your operands need review. The quotient and remainder belong to the same divisor; mixing different session lengths makes the interpretation meaningless.

In the arithmetic example, annotate which operation executes first. Multiplication binds more tightly than addition, but parentheses can express the grouping you intend. Do not add parentheses as decoration after observing a wrong answer. Write down the intended calculation in words, then make the expression represent it.

Now read each comparison as a question. score >= 80 includes the passing boundary; score == 100 asks a different question. Neither comparison changes score. To investigate a threshold, test one value just below, the boundary itself, and one just above. Those three cases reveal more than several randomly chosen high scores.`,
  trap:`Two familiar-looking symbols can do entirely different jobs. A single equals sign assigns. Two equals signs compare. A caret is not exponentiation in Python. With negative values, floor division does not mean truncation towards zero either, so keep the positive grouping example's interpretation within its stated domain.`,
  transfer:`Explain the units of every intermediate result: sessions, minutes or a boolean answer. A program becomes easier to check when the names and your explanation agree about what each value measures.`,
 },
 'conditions-and-indentation': {
  opening:`A student with a score of 95 receives a lower grade than expected. Every comparison in the program is individually sensible. The mistake is their order: the program accepted an earlier, weaker condition and never reached the stronger one.

We will make the decision path visible. Rather than memorising if, elif and else as three keywords, follow the questions the program asks and identify the first answer that selects a branch.`,
  inspection:`Trace a chain from its first condition. If that condition is true, mark its suite as the chosen work and cross out the later branches for this run. If it is false, move to the next test. There is one selected branch in a single if/elif/else chain, not a promise to run every true-looking branch.

Compare that with two separate if statements. Each introduces its own decision. The second does not inherit the instruction to skip merely because the first ran. Choose between the two structures by stating whether the outcomes are mutually exclusive or independent.

Indentation draws the suites. Follow the left edge of the statements rather than trusting their English wording. A print dedented to the outer level is outside the branch even if its message sounds like it belongs inside. Add a final progress message after the chain and predict whether it appears for both a passing and a failing score.`,
  trap:`Checking a passing threshold is not the same as validating the score. A value above the maximum possible score can satisfy a high-grade condition while still being invalid input. Establish the valid domain, then test the relevant boundaries. Avoid mixing tabs and spaces while you experiment with suites.`,
  transfer:`Choose three neighbouring scores around each important boundary. For every run, name the selected branch and one branch that must not execute. That explanation is stronger than saying that the printed grade looks reasonable.`,
 },
 'loops-and-range': {
  opening:`Your planner needs a line for each study day. Copying a print statement seven times works until the plan changes to ten days. A loop expresses the repetition once, but it also forces a useful question: which values should the loop visit?

The first challenge is not speed. It is being able to predict the first value, the last value and the number of iterations without running the program.`,
  inspection:`Treat range as a specification of values rather than a command to print. A for loop consumes those values one at a time. For a positive step, the stop boundary is excluded. Trace a tiny range by writing its values explicitly, then compare that list with the loop's output.

An accumulator has a different role from the current loop item. The item tells you what is being processed now; the accumulator remembers the combined result so far. Record its initial value, the update made on each iteration and its value after the loop. Moving the initial assignment into the loop would reset that history every time.

Try the smallest possible workload, including no iterations. An empty range should not need an invented first item. A correctly initialised total can still have a meaningful value after an empty loop. This is why the initial state deserves as much attention as the repeated statement.`,
  trap:`The final expression in range is not automatically an included day number. Check the actual sequence before labelling a report "Day 1" through "Day 7." Also distinguish a loop that should repeat a known number of times from a condition-controlled loop that needs its state to change towards termination.`,
  transfer:`Change one boundary, predict the new count and explain the difference. Then explain the accumulator in an ordinary run and an empty run. You are practising the same state tracing used for a single assignment, now repeated deliberately.`,
 },
 'lists-and-mutation': {
  opening:`Two parts of your program refer to the same study list. One appends a subject, and the other unexpectedly sees it too. There is no secret synchronisation service. Both names can refer to the very same mutable object.

This lesson asks you to track the collection as well as its names. That extra distinction explains why assigning a list to another name is not the same operation as copying its contents.`,
  inspection:`Draw one box for the list and an arrow from its name. When another name is assigned that list, draw another arrow to the same box. A mutation changes the box's contents, so both names still lead to the changed collection. Rebinding one name to a different list moves that arrow instead.

Now compare replacing an item with appending one. Replacing writes a value at an existing position. Appending grows the collection by adding a new final item. Predict both the contents and the length after each operation. An output that happens to contain the right words is not enough if their positions are wrong.

A shallow copy creates a new outer list, which is useful for independent changes to that outer collection. It does not recursively duplicate every nested object. Keep this lesson's simple examples in view before assuming a one-line copy makes an entire nested structure independent.`,
  trap:`Many mutating list methods, including append, return None rather than the updated list. Assigning their return value back to the list name can therefore lose that name's reference to the collection. Separate the mutation from any later statement that displays the list.`,
  transfer:`Predict a change through an alias, then repeat using an independent outer copy. Explain which object changed and which names still refer to it. That explanation is the foundation for safely sharing data between functions later.`,
 },
 'tuples-and-unpacking': {
  opening:`A study session has a subject and a duration. Passing those two related values together is useful, but reading record[0] and record[1] everywhere makes the purpose easy to forget. Unpacking lets the receiving names tell the story.

The important skill is not replacing square brackets with parentheses. It is recognising a fixed collection of positions and matching those positions to meaningful names.`,
  inspection:`Read the tuple's positions in the order they are supplied. Then read the names on the receiving side in that same order. Unpacking does not match an English-looking value to an English-looking variable name; it assigns by position. Swapping the receiving names changes what they refer to, even if the new result makes little sense for your planner.

Check how many values are supplied and how many targets are expected. Ordinary unpacking needs those counts to agree. Use a small mismatch deliberately and inspect the failure rather than adding arbitrary placeholder values until it runs. The failure is protecting a structural assumption in your code.

A one-item tuple needs its comma. Parentheses are also used for grouping expressions, so punctuation changes the meaning in this case. Finally, remember the boundary of immutability: a tuple's positions cannot be reassigned, but a mutable object stored inside one can still change its own contents.`,
  trap:`A tuple is not automatically a deeply frozen record, and position-based records do not become self-describing simply because their variable names are clear once. When the fields become numerous or optional, named fields may express the structure more safely.`,
  transfer:`Use a two-field session, unpack it and print a meaningful sentence. Then predict what a reversed tuple would do without changing your receiving names. Explain whether the output is wrong because of syntax or because the data order broke your agreement.`,
 },
 'dictionaries-and-key-lookup': {
  opening:`A session record is easier to understand when it says subject and minutes rather than requiring you to remember what position zero means. A dictionary connects a key to a value, but it also introduces a new question: what should happen when the key is absent?

We will distinguish a required field from an optional field. That decision belongs to your data model, not to whichever lookup happens to avoid an error.`,
  inspection:`Follow a lookup in two steps: identify the exact key, then inspect the associated value. A familiar-looking label with different spelling or capitalisation is a different key. Adding a missing key and replacing an existing key are both assignments, but they produce different changes to the collection's membership.

Square-bracket lookup expresses the expectation that a key exists. get can supply a default for a missing key, which is useful when absence is a legitimate case. However, choosing a default of zero can hide a broken duration record if minutes was actually required. Decide whether absence should be tolerated before selecting the lookup form.

When iterating through a dictionary, be explicit about whether you need keys, values or key-value pairs. A dictionary is not a list with descriptive-looking indices. Explain what your loop receives on each iteration, then choose the expression that provides it.`,
  trap:`A default is not a general repair for malformed data. If a missing required duration silently becomes zero, your final total can look plausible while omitting real work. Keep the distinction between an optional display label and a required calculation input.`,
  transfer:`Design one valid session and one record missing its required field. Explain which should calculate successfully and which should be rejected. A predictable failure can be more correct than a reassuring but inaccurate total.`,
 },
 'sets-and-membership': {
  opening:`Several study sessions mention Python, but your report needs the number of distinct subjects rather than the number of sessions. Removing duplicates now has a clear purpose. A set answers membership and uniqueness questions without pretending to preserve the original list's positions.

Before changing the collection type, state what information you are willing to lose. That is the central decision in this lesson.`,
  inspection:`Take a short list with a repeated subject and predict its length. Then predict the number of unique values after constructing a set. Those are two different measurements, so neither collection is automatically better. The right choice depends on whether repeated sessions matter to the problem.

Membership asks whether a value is present. It does not ask where that value is located or how many times it appeared in the original data. A set does not give duplicates separate entries that can later be recovered from the set alone.

When you need reproducible display output, sort suitable comparable set elements before printing the resulting sequence. That formatting choice is separate from the membership operation. It makes the demonstration deterministic without claiming that the set has acquired a stable positional order.`,
  trap:`An empty pair of braces creates a dictionary, not an empty set. Use set() for the empty set in these exercises. Do not index a set as if it were a list, and do not write an expected-output test that depends on an arbitrary set display order.`,
  transfer:`Report both total sessions and distinct subjects for the same source data. Explain why the two counts differ and which collection should remain available if you later need to calculate every session's duration.`,
 },
 'functions-and-return-values': {
  opening:`Your total calculator works, and now two parts of a program need the same calculation. Copying the code would create two places to fix later. A function lets you name the operation and ask for its result, but a printed message is not necessarily that result.

The puzzle to keep in mind is simple: a function can visibly print 150 while its caller receives None. We will separate those two channels carefully.`,
  inspection:`At a call, work out the argument values first. Follow them into the function's parameters, execute the function body, and identify the value that return sends back. Then continue the caller's expression with that returned value. Drawing this path prevents a common mistake: treating the function definition itself as if it had already performed the calculation.

Printing is an observable action. Returning supplies a value to the caller. A reusable total function can return a number so another caller can add it, compare it or format it. If it only prints, the caller cannot use the displayed characters as though they were the numeric return value.

Look at every possible path through a function. A path that reaches the end without an explicit return produces None. A conditional return in one branch does not automatically supply the same kind of value on every other branch. Choose an input for each path and predict what the caller receives.`,
  trap:`Returning ends that function call. Statements after an unconditional return on the same execution path do not run. A display statement before the return can still run, but mixing calculation and presentation makes reuse and testing harder unless the function's purpose genuinely includes both.`,
  transfer:`Call the same total function with two input pairs and store the two results under different names. Demonstrate that you can inspect or combine the results without editing the function. Explain why this is different from copying its printed output.`,
 },
 'parameters-defaults-and-scope': {
  opening:`A helper usually plans thirty minutes per session, but some students prefer twenty. A default can make the common request simple while preserving an explicit override. That convenience becomes a bug if the default unexpectedly remembers changes from an earlier call.

We will examine where argument values come from, where names are visible, and when default values are created. These details explain behaviour that otherwise feels inconsistent.`,
  inspection:`At each call, identify which parameter receives an explicit argument and which uses its default. A positional argument is matched by position; a keyword argument names the parameter. Read the function's signature before inferring meaning from the call's English-looking values.

Local assignment creates or rebinds a name in the function's local scope unless another explicit language rule applies. A local name with the same spelling as an outer name does not automatically update that outer binding. Trace the local and outer names separately, then observe the outer value after the function returns.

Defaults are evaluated when the function definition executes, not newly for every call. A mutable default can therefore be shared across calls. The common None-sentinel pattern creates a fresh collection inside the function when no collection was supplied. Explain the lifetime of the object rather than memorising that None is somehow always a better default.`,
  trap:`Do not use a mutable default as hidden storage unless that shared state is intentionally part of the design. Also avoid assuming that assigning to a local variable changes the caller's variable. Mutating a shared object and rebinding a local name are different operations.`,
  transfer:`Predict two consecutive calls, not just the first successful one. Then compare an omitted optional argument with an explicitly supplied argument. Explain which values are shared and which are newly created for each call.`,
 },
 'comprehensions': {
  opening:`You have a list of session durations and need another list with each duration doubled. A loop can build it correctly. A comprehension can express the same transformation compactly, but only if you can still explain where every output value came from.

The aim is not to make the code as short as possible. It is to make a small collection transformation easy to read and check.`,
  inspection:`Read a list comprehension in a deliberate order: locate the source collection, identify the loop variable, inspect any filter, and finally inspect the expression that constructs each output item. This reading order follows the work even though the output expression is written first.

Distinguish transforming from filtering. Doubling each duration preserves the number of source entries. Keeping only durations above a threshold can reduce the count. A comprehension that does both should let you explain why each source entry was included or excluded before discussing its transformed value.

Compare the comprehension with an ordinary loop that appends values to a new list. If you cannot write or explain that loop, the short expression may be hiding a gap in understanding. Test an empty source collection too: constructing an empty result should be a normal outcome, not a special surprise.`,
  trap:`Nested comprehensions, side effects and several conditions can become difficult to follow. Shorter source is not proof of clearer source. Use an ordinary loop when named intermediate steps, early exits or explicit error handling make the operation easier to understand.`,
  transfer:`Explain one included input, one excluded input and the empty-input case for your filtered example. Then state whether the original collection changes. A newly constructed list is not an instruction to mutate the source.`,
 },
 'exceptions-and-recovery': {
  opening:`A user enters "tomorrow" where the planner expects a number. The program should not pretend that this means zero, and it should not need to abandon every other valid part of the task. An exception lets a failed operation report that it could not deliver its promised result.

The real design question is what the surrounding program can honestly do next: request corrected input, skip a permitted optional operation, or stop with a clear explanation.`,
  inspection:`Trace the try suite until the first failing operation. Statements later in that same suite are skipped when the exception transfers control to a matching handler. The handler is not a request to finish the interrupted operation by guessing a result.

Keep the protected region small enough to identify what can fail. If you put parsing, calculation and unrelated display work into one large try block, an overly broad handler can hide a programming mistake as an input problem. Catch the exception type you expect and keep unrelated defects visible.

Conversion and domain validation remain separate questions. Valid integer syntax can still describe a negative duration your application rejects. A function can deliberately raise a suitable exception when a required rule is broken, allowing its caller to choose an appropriate recovery rather than embedding an unexplained fallback.`,
  trap:`Catching every exception and continuing with a convenient value can produce a wrong report without any obvious failure. Recovery should preserve the program's meaning, not merely remove an error message. A finally suite is for required cleanup; it is not evidence that the operation succeeded.`,
  transfer:`Demonstrate one valid input, invalid numeric text and a parsed value outside the allowed domain. Explain which operation rejects each invalid case and what the caller is allowed to do after that rejection.`,
 },
 'modules-and-imports': {
  opening:`You need a square root in your program. Writing an approximate replacement before checking the standard library would create unnecessary work and new opportunities for errors. Importing a module lets you use an existing implementation while keeping its origin visible.

However, importing a name does not mean that every package mentioned on the internet is already installed or available in this browser runtime. We will keep those boundaries explicit.`,
  inspection:`With import math, the name math refers to the module, and math.sqrt identifies a function through that namespace. The dotted form helps a reader see where the function came from. A from-import brings a chosen name directly into the current namespace, which is convenient but makes naming conflicts worth considering.

Importing and calling are different actions. Making the function available does not perform your particular calculation. Trace the argument supplied by your call and inspect its result separately from the import statement.

Modules are also an organisation tool for your own code, but examples split across real files need an environment that can locate those files. This browser course does not promise arbitrary package installation, unrestricted network access or permanent filesystem storage. Use the supported built-in modules for these exercises and distinguish language knowledge from deployment capabilities.`,
  trap:`Naming your own local file math.py can shadow the standard-library module in environments that search that location first. Wildcard imports can also make a name's origin difficult to trace. Prefer an explicit import you can explain when debugging an unfamiliar program.`,
  transfer:`For each imported name in the worked examples, state its origin and the operation your code actually calls. Then explain whether a proposed third-party import needs an additional dependency rather than assuming the import statement will install it.`,
 },
 'standard-library-tools': {
  opening:`A revision report may need an average duration, an exact money calculation and a calendar date. Those are different jobs. Treating each as ordinary arithmetic on whatever values happen to be available can create subtle mistakes.

The standard library gives you specialised tools. The useful skill is understanding the contract of the tool you choose, not memorising its import line.`,
  inspection:`For an average, inspect both the values and the number of entries. An empty collection does not have an ordinary arithmetic mean to report. Decide how your application should represent that case before assuming every report can always print a useful average.

For exact decimal quantities, pay attention to the construction of Decimal values. Creating a Decimal from suitable text preserves the intended decimal representation. Starting with a binary floating-point approximation and converting it afterwards does not travel backwards and remove the earlier approximation.

For dates, distinguish a calendar date from a duration and from a formatted label. A date tool understands calendar rules that simple arithmetic on a day number does not. Work through a boundary such as moving beyond the end of a month before trusting your own string-based approach.`,
  trap:`A specialised type does not make every use correct. Read its input requirements and think about boundary cases. Exact arithmetic cannot repair an incorrect formula, and a well-formatted date string is not proof that the underlying date calculation was valid.`,
  transfer:`Explain why each worked example uses its chosen library rather than just ordinary strings or floats. For each one, propose a boundary case that would reveal whether you understand the tool's actual behaviour.`,
 },
 'json-and-bounded-files': {
  opening:`Your planner needs to share session data with another program. A Python dictionary is useful while Python is running, but another application needs an agreed text representation. JSON provides that interchange format; it is not a promise that the received data is valid for your planner.

We will separate three events that are often confused: parsing text, validating its meaning, and saving data somewhere that will outlive the current exercise.`,
  inspection:`After json.loads returns, inspect the resulting Python value. A syntactically valid JSON value might be a list, a number or an object, not necessarily the record your code expects. Parsing success therefore does not establish that subject and minutes fields exist or satisfy your rules.

When serialising, identify which values can be represented by the chosen interchange format. JSON objects use string keys, and values such as arbitrary class instances do not automatically acquire a safe, meaningful JSON representation. Keep your example records small and explicit.

A file-like object can demonstrate reading and writing within a bounded exercise. That is different from saving a user's progress permanently across devices. In this course's browser runtime, printing JSON text and reading an in-memory stream are useful language exercises without requiring access to a real user's files or an external database.`,
  trap:`Do not use eval to read JSON. Treat received text as data, and handle parsing failures honestly. Also do not report "saved permanently" because a temporary in-memory write succeeded; persistence is a separate capability with its own storage rules.`,
  transfer:`Parse one valid session, then validate its required fields. Try valid JSON with the wrong structure and explain why it must still be rejected. Finally, describe exactly where your exercise's data exists after the program ends.`,
 },
 'classes-and-instances': {
  opening:`Two students have different study goals. A class can describe the shared kind of thing while each instance keeps its own relevant state. If changing one student's goal unexpectedly changes the other, you need to investigate where that state actually lives.

Begin with the small examples before building a hierarchy of classes. You should be able to explain every instance, attribute and method call you create.`,
  inspection:`The class definition describes behaviour; constructing an instance creates a particular object. Follow the initial values into that object's attributes. self is the parameter through which a method works with the instance supplied by the call, not a magical request to find any object with a similar name.

Create two instances and track their attributes separately. An assignment to one instance's duration should not be confused with changing a shared class-level mutable collection. Keeping a small table for the two objects makes the distinction visible.

Methods are still functions with inputs, effects and return values. A method that prints a message does not necessarily return that message. A method that mutates an attribute should make that effect understandable in its purpose and in the code that calls it. The reasoning habits from the functions lesson still apply.`,
  trap:`Do not choose a class just because classes sound more advanced. A pure calculation may be clearer as a function, and a simple data record may be enough without a complex hierarchy. Use an object when grouping the state and related behaviour clarifies the problem.`,
  transfer:`Create two study objects, change one and inspect both. Explain which object each method receives and what the caller gets back. Then describe whether a plain function would express part of the same task more simply.`,
 },
 'tests-and-debugging': {
  opening:`A program prints the answer you expected once. Should you trust it with every student's plan? A single successful run answers only a narrow question. Testing makes those questions explicit and repeatable, while debugging investigates why a particular expectation failed.

The goal is not to make a green message appear at any cost. It is to keep useful evidence that the program follows its stated rules.`,
  inspection:`Choose an expectation from the problem, not from whatever the current implementation happens to return. For a study total, calculate one small result independently. Then add a zero-day case and a required rejection. These cases exercise different parts of the contract rather than repeating the same happy path with larger numbers.

An expected-failure check must also fail if no exception is raised. Merely placing invalid input inside try and printing a message in except does not prove anything when the except branch never runs. The example's else branch makes the absence of the required rejection observable.

When a check fails, shrink the input until the first wrong step is easy to inspect. Compare predicted and actual state at that step. Repair the cause, rerun the failed check and keep it as a regression case. Changing a correct expectation to match a bug removes the evidence you needed.`,
  trap:`Python can disable assert statements under optimisation. Use them as demonstrated for learning checks, not as the only protection for untrusted production input. Also ensure your tests call the real function whose behaviour matters instead of repeating its formula in another place.`,
  transfer:`Introduce one deliberate off-by-one error and identify the check that catches it. Fix the implementation without weakening that check. Explain one behaviour your tests cover and one behaviour you have not yet tested.`,
 },
 'revision-planner-project': {
  opening:`You have learned separate tools; now make them cooperate in one useful program. The revision planner should answer a student's practical questions: what have I planned, what have I completed, and can I trust the totals?

Do not begin by adding a login screen or a polished interface. Begin with a tiny session list and calculations you can verify by hand. A small, honest tool is more useful than a large interface built on uncertain numbers.`,
  inspection:`Start by writing the record contract in plain language. A session needs a nonempty subject, an exact nonnegative integer duration and a boolean completion flag. Validate required keys before reading them. Remember that True is an instance of int in Python, which is why the exact integer requirement deserves an intentional check.

Next separate validation, calculation and formatting. A planned-minutes function should return a number. A completed-minutes function should count duration only for completed sessions, not merely count completed records. A formatting function should describe already-checked results rather than silently repair bad data.

Build one checkpoint at a time. Validate one session. Total two sessions. Apply completion filtering. Handle an empty list. Only then add JSON interchange and a readable report. At each stage, compare a small input with a result you calculated independently.

An empty plan should produce meaningful zero totals without inventing a session. An invalid duration should be rejected without producing a reassuring but inaccurate report. A mixed plan should distinguish planned minutes, completed minutes and the number of sessions. Those are different measures even when a particular example makes two numbers happen to coincide.`,
  trap:`A successful JSON parse does not validate a session, and a report containing the word "completed" does not prove the completion filter was applied. Keep the data contract and the calculation checks visible. Do not promise permanent storage from this isolated browser exercise.`,
  transfer:`Prepare a short demonstration with an empty plan, a mixed plan, an all-complete plan and invalid records. Explain which earlier lesson justifies each design decision. If you cannot explain a line, simplify it before adding another feature.`,
 },
};
