import {q,t,lab,pythonSource} from './authoring.mjs';
const types=['Python built-in types','https://docs.python.org/3/library/stdtypes.html'];
export default [
{key:'python-4',subject:'Introduction to Programming',slug:'dit-python',module:4,chapter:4,title:'Strings',pages:'28',sources:[pythonSource,types],topics:[
t('4.1','String values, characters and immutability',`A string is a sequence of Unicode characters represented by str. Quotes delimit a string literal in source code; they are not necessarily part of the stored value. Single or double quotes can be used, with appropriate escaping when the same quote is needed inside the literal. An empty string has length zero.

Indexing starts at zero. In "Python", index 0 is P and index -1 is n. A slice selects a sequence of positions using start, stop and an optional step; the stop is excluded. Out-of-range indexing raises an error, while a slice can be clipped to the available range.

Strings are immutable: an operation such as upper or replace returns a new string instead of editing one character in the original string object. Reassign the result when you need to keep it. The len function counts string elements, which should not be confused with the number of bytes used in an encoding or every visually combined symbol in complex text.

~~~python
word = "Python"
print(word[0], word[-1], word[1:4])
print(len(word), len(""))
assert word[1:4] == "yth"
~~~

The first line is P n yth and the second is 6 0.`,[
q('What is the Python type of an ordinary text string?','str',['int','float','A network adapter'],'str represents Unicode text strings.'),
q('What is "Python"[0]?','P',['y','n','An empty string'],'The first position has index zero.'),
q('What is "Python"[-1]?','n',['P','y','A minus sign'],'A negative index counts back from the end.'),
q('What is "Python"[1:4]?','yth',['ytho','Pyt','thon'],'The start is included and the stop index is excluded.'),
q('Are Python strings mutable?','No, ordinary string objects are immutable',['Yes, every character can be assigned in place','Only when the string is uppercase','Only when it has spaces'],'String transformations produce new strings rather than mutating a character in place.'),
q('What is len("")?','0',['1','-1','An automatic space'],'The empty string contains zero elements.')]),
t('4.2','Combining and repeating strings',`The + operator concatenates compatible strings, while multiplying a string by an integer repeats it. "ab" + "cd" is "abcd" and "ha" * 3 is "hahaha". Concatenation is not the same as numeric addition: "2" + "3" is "23". Convert suitable numeric text when the task requires arithmetic.

Build readable output using an f-string or an appropriate join operation. If names are stored in a list, ", ".join(names) creates a separated string from string elements. It does not insert separators automatically when using +. String repetition with a negative or zero count produces an empty string in these ordinary examples.

~~~python
first, second = "Ray", "Tech"
print(first + second)
print("ha" * 3)
print("2" + "3", int("2") + int("3"))
assert ", ".join(["Ali", "Ayesha"]) == "Ali, Ayesha"
~~~

The outputs are RayTech, hahaha, and 23 5 on separate lines.`,[
q('What is "2" + "3"?','23 as a string',['The integer 5','The float 6.0','A guaranteed syntax error'],'+ concatenates these two strings.'),
q('What is "ha" * 3?','hahaha',['ha3','hahahaha','3ha'],'The string is repeated three times.'),
q('Which operation combines a list of string names with commas?','", ".join(names)',['names / ","','type(names) as a separator','names ** 2'],'join inserts the chosen separator between string elements.'),
q('Which result requires explicit numeric interpretation of "2" and "3"?','The numeric sum 5',['The text "23"','The text "2" itself','The length of "3"'],'Numeric conversion changes how suitable text is interpreted.')]),
t('4.3','Built-in functions and string methods',`len(text) is a built-in function call; it is not text.len(). Methods are called through the string, such as text.lower(), text.upper(), text.strip(), text.replace(old, new), text.startswith(prefix) and text.endswith(suffix). The syllabus\'s spelling 'startwith' should be read as startswith in real Python code.

capitalize returns a copy with its initial character capitalised and the remaining characters lowercased according to the method\'s rules. lower and upper return transformed copies. strip removes matching leading/trailing characters, or whitespace by default; it does not remove every internal space. replace returns a copy with occurrences replaced. startswith and endswith return Boolean results.

String comparisons and simple searches are case-sensitive unless a deliberate normalisation is applied. For the syllabus\'s English-name exercise, lower or casefold can support case-insensitive comparison. count counts non-overlapping occurrences; find returns an index or -1 when the requested substring is absent. State whether a task requires substring matching or complete-word matching.

~~~python
raw = "  Python Class  "
cleaned = raw.strip()
print(cleaned.lower())
print(cleaned.startswith("Python"), cleaned.endswith("Class"))
print(cleaned.replace("Class", "Lab"))
assert raw.startswith("  ")
assert cleaned == "Python Class"
~~~

The original raw string remains unchanged. The output is python class, then True True, then Python Lab.`,[
q('Which is the correct way to get a string length?','len(text)',['text.len()','length.text()','text.size as a required Python string function'],'len is a built-in function used with a string argument.'),
q('Which method spelling checks a prefix?','startswith',['startwith','prefixis','starts_with_only'],'The real Python method is startswith.'),
q('What does strip() remove by default?','Leading and trailing whitespace',['Every internal space regardless of position','Only the final character','All punctuation anywhere'],'Default strip acts at the ends of the string.'),
q('What does "Hello".lower() return?','hello',['HELLO','Hello unchanged as the returned value','The integer 5'],'lower returns a lowercase copy for this text.'),
q('Does replace edit the original string object in place?','No, it returns a new string',['Yes, strings are mutable character arrays','Only if the result is not assigned','Only when both words have the same length'],'Strings are immutable; retain the returned result if needed.'),
q('What does find return when the substring is absent?','-1',['0 in every case','The whole original string','A new empty list'],'find uses -1 to indicate no matching position.'),
q('Are ordinary string searches automatically case-insensitive?','No',['Yes, case never matters in Python','Only when a string has three letters','Only after printing the string'],'Normalise explicitly when the requirement calls for case-insensitive matching.'),
q('What does startswith return?','A Boolean result',['Always a new list','A printer queue','A changed original string'],'The method tests a prefix condition.'),
q('Does count count overlapping occurrences by default?','No, it counts non-overlapping occurrences',['Yes, every possible overlap is always counted','It only counts spaces','It returns a byte address'],'Tasks requiring overlapping matches need a different explicit procedure.'),
q('Why distinguish character count from encoded byte count?','Unicode text can use multiple bytes per character in an encoding',['Every character always occupies exactly one byte in every encoding','Bytes and characters are always identical concepts','len always counts physical disk sectors'],'Text length and encoded storage length are different measures.')])
],short:[['What makes a string immutable?','Its existing character sequence is not changed in place by ordinary string transformations; methods such as replace return a new string.'],['How do index and slice differ?','An index selects one position and can raise IndexError if absent. A slice selects a range, excludes its stop and can be clipped to available positions.'],['How do concatenation and numeric addition differ?','"2" + "3" joins text to form "23". int("2") + int("3") performs numeric addition and produces 5.'],['Why is len not written as text.len()?','len is a built-in function accepting the value as an argument, while lower and startswith are methods accessed on the string.'],['What does strip leave unchanged?','It does not remove ordinary internal spaces merely because they occur between words, and the original immutable string object is not edited in place.'],['How should case-insensitive matching be implemented?','Deliberately apply a suitable normalisation, such as casefold or lower for the stated English exercise, and define whether matching means a substring or a complete word.']],long:[['Explain a text-cleaning workflow.','Retain the raw input when it is useful for tracing, remove only the leading/trailing whitespace required by the task, apply appropriate case normalisation for comparison and use explicit prefix, suffix or substring checks. Save returned transformed values because strings are immutable. Distinguish display formatting from the stored source. Test ordinary text, an empty string, surrounding whitespace and mixed case. Do not assume that len measures encoded byte size or that strip removes all internal spaces.'],['Explain the character-classification exercise.','Inspect each character of the given sample and count letters using isalpha and digits using isdigit. Count remaining characters according to the exercise definition; the supplied example has no spaces, so its remaining characters are symbols. For general text, decide separately how whitespace should be reported. The sample P@#yn26at^&i5ve contains eight letters, three digits and four other characters. Verify that the category counts add to the sample length. Unicode-aware classification is broader than only ASCII English letters and digits.'],['Explain substring search and token splitting.','For a case-insensitive English-name search, normalise both the text and target consistently. count gives the number of non-overlapping substring occurrences, while find can locate positions and returns -1 if absent. A complete-word search has additional boundary requirements, so do not silently claim substring counting proves a whole-word match. For hyphen-separated text, split("-") returns a list of substrings. Repeated separators may produce empty pieces, which should be retained or filtered according to the actual requirement.']],labs:[
lab('py-04','Count letters, digits and other characters',['Use the supplied mixed-character sample.','Count alphabetic and digit characters; classify the remaining characters under the stated exercise rule.','Check that all counts add up to the string length.'],'8 letters, 3 digits and 4 other characters.',{practicals:[4],code:'text = "P@#yn26at^&i5ve"\nletters = sum(ch.isalpha() for ch in text)\ndigits = sum(ch.isdigit() for ch in text)\nother = len(text) - letters - digits\nprint(letters, digits, other)\nassert letters + digits + other == len(text)',stdout:'8 3 4\n'}),
lab('py-05','Find a name without case sensitivity',['Normalise the sample and search term for the English-name task.','Report the count of non-overlapping substring matches.','Compare with the two visible occurrences in the sample.'],'The count of Baqir is 2.',{practicals:[5],code:'text = "Baqir is student of python programming class. Baqir belongs to district peshawar"\nprint(text.casefold().count("baqir".casefold()))',stdout:'2\n'}),
lab('py-06','Split hyphen-separated text',['Store the supplied phrase as a quoted string.','Split on the hyphen character and print each piece on its own line.','Explain that the resulting pieces are strings.'],'Five lines: Bareera, is, a, data, scientist.',{practicals:[6],code:'text = "Bareera-is-a-data-scientist"\nfor part in text.split("-"):\n    print(part)',stdout:'Bareera\nis\na\ndata\nscientist\n'})]
},
{key:'python-5',subject:'Introduction to Programming',slug:'dit-python',module:5,chapter:5,title:'Lists',pages:'28',sources:[pythonSource,['Python data structures','https://docs.python.org/3/tutorial/datastructures.html']],topics:[
t('5.1-5.2','Lists and forward/backward access',`A list is an ordered mutable collection. It can contain repeated values and, when a task requires it, objects of different types. Ordering means that positions have a defined sequence; it does not mean that the list is automatically sorted.

Index zero selects the first item and -1 the last. An out-of-range index raises IndexError. The length is obtained using len. Use an empty-list check before assuming that a first or last item exists. A nested list is itself one item at its containing position; a shallow copy does not recursively duplicate every nested object.

~~~python
names = ["Ali", "Shayan", "Baqir", "Bareera"]
print(names[0], names[-1], len(names))
assert names[2] == "Baqir"
~~~

The output is Ali Bareera 4. Trace positions rather than treating a value such as 20 as necessarily the twentieth position.`,[
q('Which statement describes a list?','An ordered mutable collection',['A permanently immutable text string','A collection that must always be sorted','A container that forbids repeated values'],'Lists preserve order and support mutation.'),
q('Which index selects the first list item?','0',['1','-1 in every case','The list length'],'Python sequence indexing begins at zero.'),
q('Which index selects the last item of a nonempty list?','-1',['0 in every case','len(items) as a valid last index','-len(items)-1'],'Negative indexing can address positions from the end.'),
q('Can a list contain repeated values?','Yes',['No, duplicates are automatically removed','Only if every item is a string','Only if the list is sorted'],'A list is not a set and does not enforce uniqueness.'),
q('Does ordered mean automatically sorted?','No',['Yes, every append sorts the list','Yes, strings are always alphabetised','No, because list positions are random'],'Order is the preserved sequence of positions, not an automatic sorting rule.')]),
t('5.3','Changing, adding, removing and copying',`Assignment to an existing position changes that list item. append adds one object at the end; extend adds items from an iterable; insert adds before a specified position. remove(value) removes the first equal value and raises ValueError if absent. pop removes and returns an item at a position, defaulting to the end. del can delete a position or slice.

Do not assign the result of append back to the list: append mutates the list and returns None. The same general caution applies to several mutating methods. Assignment such as alias = items makes another reference to the same list; items.copy() makes a new outer list. With nested objects, that copy remains shallow.

~~~python
items = ["Mango", "Apple"]
alias = items
copy_items = items.copy()
items.append("Banana")
items[0] = "Melon"
print(items)
print(copy_items)
assert alias is items
assert copy_items == ["Mango", "Apple"]
~~~

The original/alias now show Melon, Apple and Banana; the shallow outer copy retains the earlier two string items.`,[
q('What does append(x) do?','Add x as one object at the end',['Replace every item with x','Sort the list automatically','Return a new list as its normal result'],'append mutates the existing list by adding one item.'),
q('What does a = items.append(5) normally bind to a?','None',['The updated list automatically','The integer length automatically','A guaranteed copy of items'],'append returns None even though it mutates items.'),
q('What does remove(value) remove?','The first equal item',['Every equal item always','Only the final item regardless of value','An item at a numeric index rather than by value'],'remove searches by value and removes the first match.'),
q('What does pop() return for a nonempty list by default?','The removed last item',['Always None','The entire original list unchanged','A printer page'],'pop removes and returns an item.'),
q('Does alias = items create an independent outer list?','No, both names refer to the same list',['Yes, every assignment recursively copies all objects','Only if items is empty','Only if the name is uppercase'],'Assignment creates another binding to the existing object.'),
q('Is list.copy a recursive deep copy of all nested data?','No, it is a shallow copy',['Yes, it always duplicates every nested object','Only when the list has digits','Only when printed'],'Nested objects can still be shared by a shallow copy.')]),
t('5.4','Slicing and reversing',`A slice uses start:stop:step, with the stop excluded. items[1:3] selects positions 1 and 2. items[::-1] creates a reversed outer list for an ordinary list. In contrast, items.reverse() reverses the existing list in place and normally returns None.

Slicing is useful for selecting a portion without writing several index operations. Explain the distinction between changing the original list and creating another list. If other names refer to the same list, an in-place mutation is visible through them; a newly sliced list is a separate outer object.

~~~python
values = [2, 4, 6, 6, 10]
reversed_values = values[::-1]
print(values[1:3])
print(reversed_values)
assert values == [2, 4, 6, 6, 10]
~~~

The outputs are [4, 6] and [10, 6, 6, 4, 2]. Duplicates remain present.`,[
q('Which positions are selected by items[1:3]?','Positions 1 and 2',['Positions 1, 2 and 3','Only position 3','Every position except 1 and 2'],'The slice stop is excluded.'),
q('Which expression makes a reversed outer list without reversing the original in place?','items[::-1]',['items.reverse() as a returned new list','items = None','items[0]'],'The reverse-step slice creates another list.'),
q('What does items.reverse() normally return?','None',['A new reversed list automatically','Always the first item','A Boolean true result'],'reverse mutates the existing list in place.'),
q('Does reversing a list remove duplicates?','No',['Yes, it converts the list to a set','Only if every value is numeric','Only when the list has five items'],'Reversal changes order, not multiplicity.')]),
t('5.5','Membership, search, replacement and filtering',`The in and not in operators test membership. For a list, membership checks whether an equal item is present; it does not return its position. index(value) returns the first matching index and raises ValueError when absent. Check membership or handle the exception when absence is an accepted case.

For the syllabus replacement task, locate the first 20 and assign 200 at that position. State whether the requirement means the first or every occurrence; the supplied example contains one. For a names task, startswith("B") is a case-sensitive prefix test on each string, not a list method.

~~~python
values = [22, 12, 20, 77]
if 20 in values:
    values[values.index(20)] = 200
names = ["Ali", "Baqir", "Bareera"]
selected = [name for name in names if name.startswith("B")]
print(values)
print(selected)
assert selected == ["Baqir", "Bareera"]
~~~

For introductory work, an explicit loop and append can implement the same filter. Avoid removing items from a list while walking its changing positions unless the behaviour is deliberately designed.`,[
q('What does value in items return?','A membership truth result',['The index in every case','The entire list as a copy','The number of all occurrences'],'Membership and index lookup are different operations.'),
q('What does index(value) return when a matching item exists?','The first matching index',['Every matching value','The number of installed apps','A sorted replacement list'],'index identifies the first equal item position.'),
q('How can a missing target be handled before index is called?','Check target in items',['Assume every target exists','Use the target value as its guaranteed index','Delete every other value'],'A membership check can guard an expected absence.'),
q('Which test selects a string beginning with uppercase B?','name.startswith("B")',['names.startwith("B")','name == "B" for every longer name','name.endswith("B")'],'startswith checks the required prefix.'),
q('Why avoid casually removing list items during forward iteration?','Changing positions can skip items or invalidate the intended traversal',['Removal always changes every item into a string','Lists cannot be changed','Iteration always makes a deep copy automatically'],'Mutation can alter the sequence being traversed.')])
],short:[['What does list ordering mean?','Items have a preserved positional sequence; ordering does not require automatic numerical or alphabetical sorting.'],['Compare append and extend.','append adds its argument as one item. extend adds the individual items yielded by an iterable.'],['Compare remove and pop.','remove searches by value and removes the first match. pop uses a position and returns the removed item.'],['Compare assignment and copying.','A second assignment can reference the same list. copy or slicing can create a new outer list, but nested objects remain shared in a shallow copy.'],['Compare reverse and a reverse slice.','reverse mutates the existing list and returns None. A reverse slice creates a separate outer list.'],['What should a replacement algorithm specify?','Whether to change the first match or all matches, what to do when absent and how the result will be checked.']],long:[['Explain a list replacement program.','Store the provided values in an ordered list. Check whether 20 is present before using index, then replace the first matching position with 200. The supplied example has one match, so this satisfies the stated sample. An all-occurrences requirement needs a deliberately different loop. Test the given list, an absent target and repeated targets under the chosen rule. Do not use the value 20 as if it were necessarily a valid list index.'],['Explain independent list copying and its limit.','A new binding such as second = first refers to the same mutable list, so changes are visible through both names. first.copy() or first[:] creates another outer list. For a list of immutable strings, appending or replacing an outer item in one list does not mutate the outer copy. A nested mutable object can still be shared, because the copy is shallow. The correct copy method depends on the required depth and object relationships.'],['Design a names-filter exercise.','Define whether the prefix comparison is case-sensitive. For the supplied uppercase-B requirement, inspect each name with startswith("B") and append matching names to a new list, preserving their original order. The provided sample returns Baqir and Bareera. Test an empty source, no matches and multiple matches. Keep the source list unchanged so the result and selection rule can be inspected independently. A list comprehension is a concise alternative after the explicit-loop logic is understood.']],labs:[
lab('py-14','Display a list in reverse order',['Use a reverse slice so the original list remains available for comparison.','Print the reversed result.'],'The output is [30, 20, 10].',{practicals:[14],code:'values = [10, 20, 30]\nprint(values[::-1])\nassert values == [10, 20, 30]',stdout:'[30, 20, 10]\n'}),
lab('py-15','Read and display five fruit names',['Read five lines of input into a list.','Display each stored name using a for loop.'],'The five entered names appear in their entered order.',{practicals:[15],code:'fruits = []\nfor _ in range(5):\n    fruits.append(input().strip())\nfor fruit in fruits:\n    print(fruit)',stdin:'Mango\nApple\nBanana\nMelon\nGrapes\n',stdout:'Mango\nApple\nBanana\nMelon\nGrapes\n'}),
lab('py-16','Square every item',['Create a new list of squared values.','Retain both occurrences of the repeated value 6.'],'[4, 16, 36, 36, 100].',{practicals:[16],code:'numbers = [2, 4, 6, 6, 10]\nsquared = [number ** 2 for number in numbers]\nprint(squared)',stdout:'[4, 16, 36, 36, 100]\n'}),
lab('py-17','Copy fruit values to updatedList',['Append each source item to a new outer list.','Check equality of values and distinct outer identity.'],'The copied fruit list has the same values in order.',{practicals:[17],code:'fruits = ["Mango", "Apple", "Banana", "Melon", "Grapes"]\nupdatedList = []\nfor fruit in fruits:\n    updatedList.append(fruit)\nprint(updatedList)\nassert updatedList == fruits and updatedList is not fruits',stdout:"['Mango', 'Apple', 'Banana', 'Melon', 'Grapes']\n"}),
lab('py-18','Replace the supplied value 20',['Check membership before looking up the first index.','Replace that item with 200.'],'Only the matching item changes.',{practicals:[18],code:'values = [22, 12, 25, 667, 988, 387, 20, 188, 77]\nif 20 in values:\n    values[values.index(20)] = 200\nprint(values)',stdout:'[22, 12, 25, 667, 988, 387, 200, 188, 77]\n'}),
lab('py-19','Check a requested name',['Read one string and test exact, case-sensitive membership in the given list.','Test a present and an absent name.'],'The program reports Present or Absent.',{practicals:[19],code:'names = ["Pakistan", "Shayan", "Baqir", "GCMS"]\nrequested = input().strip()\nprint("Present" if requested in names else "Absent")',tests:[{stdin:'Baqir\n',stdout:'Present\n'},{stdin:'baqir\n',stdout:'Absent\n'},{stdin:'Ali\n',stdout:'Absent\n'}]}),
lab('py-20','Find names beginning with B',['Test each name with the stated case-sensitive prefix.','Build and print a separate matching list.'],'Baqir and Bareera are selected.',{practicals:[20],code:'names = ["Ali", "Shayan", "Baqir", "Bareera", "Zulfiqar"]\nselected = []\nfor name in names:\n    if name.startswith("B"):\n        selected.append(name)\nprint(selected)',stdout:"['Baqir', 'Bareera']\n"})]
},
{key:'python-6',subject:'Introduction to Programming',slug:'dit-python',module:6,chapter:6,title:'Conditional Statements',pages:'28',sources:[pythonSource,['Python control flow','https://docs.python.org/3/tutorial/controlflow.html']],topics:[
t('6.1','if conditions and truth testing',`An if statement executes its suite when the condition is truthy. The header ends with a colon and the body is indented. A comparison such as number % 2 == 0 can test divisibility by two; = would be assignment rather than equality comparison.

False, None, numeric zero and empty built-in containers are common falsy values. Nonempty strings, including "False" and "0", are truthy. Convert and validate data according to the task rather than relying on an English-looking string to behave like a Boolean.

~~~python
number = 8
if number % 2 == 0:
    print("Even")
assert number % 2 == 0
~~~

The sample prints Even. An if without else simply skips its body when the condition is false; it does not automatically invent an alternative output.`,[
q('When is an if body executed?','When its condition is truthy',['Only when its condition is false','Before the condition is evaluated','Exactly twice regardless of data'],'The condition controls whether the suite runs.'),
q('Which punctuation ends a normal if header?','A colon',['A required semicolon','An unmatched closing quote','A comma instead of the colon'],'The colon introduces the suite.'),
q('Which test identifies an even integer n?','n % 2 == 0',['n / 2 == 0 for every even value','n = 2 as a comparison','n % 2 == 2'],'An even integer has remainder zero on division by two.'),
q('Which value is falsy?','An empty list',['The nonempty string "False"','The nonempty string "0"','The integer 5'],'Empty built-in containers are falsy.'),
q('What happens to an if body when its condition is false and no else exists?','It is skipped',['It automatically runs anyway','It is repeated forever','Python always prints False'],'No alternative suite is implied.')]),
t('6.2','else and two-way decisions',`else provides the alternative suite for an if statement. Exactly one of the two suites is selected in a normal two-way decision. Place else at the same indentation level as its matching if. Nested decisions need careful indentation to show which conditions belong together.

For an integer parity exercise, a zero remainder gives Even and the alternative gives Odd. Negative integers and zero should be included in tests: zero is even because 0 % 2 is 0. For divisibility by seven, test n % 7 == 0 rather than comparing only whether n is the single number seven.

~~~python
number = -14
if number % 7 == 0:
    print("Divisible by 7")
else:
    print("Not divisible by 7")
assert number % 7 == 0
~~~

Choose the relevant numeric conversion before the condition and separate unsuitable text from a valid number that fails the divisibility test.`,[
q('What does else provide?','An alternative suite when the if condition is false',['Another mandatory true condition','A loop counter automatically','A replacement for indentation'],'else selects the alternative path of the decision.'),
q('Is zero even?','Yes, its remainder on division by two is zero',['No, only positive values can be even','No, zero always has remainder one','Yes, because it is a string'],'Parity applies to integer zero as well.'),
q('Which test identifies integers divisible by seven?','n % 7 == 0',['n == 7 only','n / 7 == 7 only','n % 7 == 7'],'The remainder must be zero for any divisible integer.'),
q('How should else align?','With its matching if',['Always at column zero regardless of nesting','With the final character of print','Inside every quoted string'],'Indentation identifies the associated statement structure.'),
q('How many paths are selected in an ordinary if/else decision?','One of the two suites',['Both suites always','Neither suite is ever possible','An unlimited random number'],'The condition chooses the if or the else suite.')]),
t('6.3','elif, interval coverage and validation',`An if/elif/else chain tests alternatives in order and executes the first matching suite, or the final else if none match. Several separate if statements can all run, so they are not interchangeable with one mutually exclusive classification chain.

The syllabus\'s grading exercise accepts integer scores 1 through 100, with 1-50 Average, 51-70 Good and 71-100 Excellent. Check the overall accepted range first. Then comparisons such as score <= 50 and score <= 70 can work because reaching the second category already implies that the earlier category did not match.

Input conversion and range validation are different. int("abc") fails conversion; 101 converts successfully but is outside the exercise range. A checked implementation should produce an understandable invalid-input result for both cases instead of assigning an invented grade.

~~~python
score = 71
if not 1 <= score <= 100:
    grade = "Invalid score"
elif score <= 50:
    grade = "Average"
elif score <= 70:
    grade = "Good"
else:
    grade = "Excellent"
print(grade)
assert grade == "Excellent"
~~~

Use a boundary table containing 1, 50, 51, 70, 71 and 100, plus 0 and 101. These labels are the exercise\'s rules, not an assertion of an official board grading policy.`,[
q('How does an if/elif chain choose a matching suite?','It uses the first true condition in order',['It executes every true branch regardless of order','It always chooses the final else','It sorts conditions alphabetically'],'The order of alternatives matters.'),
q('What is the exercise grade for 50?','Average',['Good','Excellent','Invalid score'],'The exercise assigns 1 through 50 to Average.'),
q('What is the exercise grade for 51?','Good',['Average','Excellent','Invalid score'],'Good covers 51 through 70 in this exercise.'),
q('What is the exercise grade for 70?','Good',['Average','Excellent','Invalid score'],'The upper inclusive limit of Good is 70.'),
q('What is the exercise grade for 71?','Excellent',['Good','Average','Invalid score'],'Excellent begins at 71 under the stated rules.'),
q('How should 101 be handled under the stated score range?','Reject it as invalid',['Grade it Excellent automatically','Grade it Average','Convert it to 1 without telling the user'],'A valid integer can still be outside the accepted interval.'),
q('How is "abc" different from 101 for an integer score input?','The first fails numeric conversion; the second fails the range rule',['Both are automatically valid grades','Both always convert to zero','There is no difference in validation stages'],'Conversion and domain validation are different checks.'),
q('Why might separate if statements be wrong for one exclusive grade?','More than one independent condition can run',['Python forbids more than one if in a file','All conditions become false automatically','Indentation stops every comparison'],'Use a chain when exactly one classification should be selected.'),
q('Why test 0 and 1?','They check just outside and at the accepted lower boundary',['They always have the same validity','Only zero can be a score','A lower bound is irrelevant'],'Boundary tests reveal missing or incorrect range checks.'),
q('Are these exercise grade labels an authenticated PBTE grading policy?','No, they are the stated practice-program rules',['Yes, every example defines official board policy','Yes, because the code uses Python','No, because labels cannot be printed'],'An exercise specification is not evidence of an external official policy.')])
],short:[['Explain an if statement.','It evaluates a condition and executes an indented suite when that condition is truthy. A false condition skips that suite or selects an associated alternative.'],['What does else do?','It supplies the alternative suite when the if condition is false.'],['What does elif do?','It introduces another condition in an ordered decision chain; the first matching suite is selected.'],['Why distinguish conversion and range checks?','A nonnumeric string can fail conversion, while a valid converted number can still violate the accepted domain.'],['Why can zero be even?','Its remainder when divided by two is zero, which satisfies the integer parity definition.'],['What is an interval boundary test?','A check at or immediately adjacent to a limit, such as 50/51 or 70/71 in the grading exercise.']],long:[['Design a validated grading program.','Read the score and attempt integer conversion. Report unsuitable text as invalid input. For a converted value, reject anything outside 1 through 100. Use an ordered if/elif/else chain for 1-50 Average, 51-70 Good and 71-100 Excellent. Compare the implementation with a table of six valid category endpoints plus 0 and 101. Explain that the labels implement a practice specification rather than proving an external board grading policy.'],['Explain parity and divisibility programs.','Obtain an integer under the input rule. For parity, n % 2 == 0 selects Even; otherwise select Odd. For divisibility by seven, test n % 7 == 0. These rules cover more than the single numbers 2 or 7 and apply to negative integers and zero as appropriate. Test positive, negative and zero cases, and separately handle text that cannot be converted. Equality comparisons use ==, not assignment.'],['Compare an exclusive decision chain with independent conditions.','An if/elif/else chain stops after selecting its first matching alternative, which suits one grade per score. Independent if statements are each evaluated and can produce multiple outputs for overlapping conditions. Sometimes that is intended, such as separately reporting both eligibility and a warning, but it is wrong for an exclusive classification unless explicitly designed. State the requirement and choose the structure that matches it.']],labs:[
lab('py-07','Classify an integer as even or odd',['Convert the input to an integer or report invalid input.','Test the remainder on division by two.','Include zero and a negative case.'],'The correct parity label is printed.',{practicals:[7],code:'try:\n    number = int(input())\nexcept ValueError:\n    print("Invalid integer")\nelse:\n    print("Even" if number % 2 == 0 else "Odd")',tests:[{stdin:'8\n',stdout:'Even\n'},{stdin:'-3\n',stdout:'Odd\n'},{stdin:'0\n',stdout:'Even\n'},{stdin:'abc\n',stdout:'Invalid integer\n'}]}),
lab('py-08','Test divisibility by seven',['Read a valid integer.','Use its remainder to select the appropriate message.'],'Multiples of seven are identified, including -14 and 0.',{practicals:[8],code:'try:\n    number = int(input())\nexcept ValueError:\n    print("Invalid integer")\nelse:\n    print("Divisible by 7" if number % 7 == 0 else "Not divisible by 7")',tests:[{stdin:'-14\n',stdout:'Divisible by 7\n'},{stdin:'0\n',stdout:'Divisible by 7\n'},{stdin:'15\n',stdout:'Not divisible by 7\n'}]}),
lab('py-09','Classify the exercise score',['Reject noninteger text and values outside 1-100.','Implement the stated three exclusive intervals.','Check both sides of every category boundary.'],'The supplied practice-grade rules hold for all boundary cases.',{practicals:[9],code:'try:\n    score = int(input())\nexcept ValueError:\n    print("Invalid score")\nelse:\n    if not 1 <= score <= 100:\n        print("Invalid score")\n    elif score <= 50:\n        print("Average")\n    elif score <= 70:\n        print("Good")\n    else:\n        print("Excellent")',tests:[{stdin:'1\n',stdout:'Average\n'},{stdin:'50\n',stdout:'Average\n'},{stdin:'51\n',stdout:'Good\n'},{stdin:'70\n',stdout:'Good\n'},{stdin:'71\n',stdout:'Excellent\n'},{stdin:'100\n',stdout:'Excellent\n'},{stdin:'0\n',stdout:'Invalid score\n'},{stdin:'101\n',stdout:'Invalid score\n'},{stdin:'abc\n',stdout:'Invalid score\n'}]})]
}
];
