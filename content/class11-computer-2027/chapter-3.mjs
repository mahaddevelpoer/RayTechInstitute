import {t,a,q} from './authoring.mjs';
export default {
 number:3,
 topics:[
 t('3.1','Computational problems and clear specifications',[41,42],`A computational problem describes an input, the processing needed and the required output. Before selecting an algorithm, state the allowed input and the condition that makes an answer correct. For example, "find the smallest integer in this non-empty list" has a clearer success condition than "find an interesting number".

The book distinguishes several problem types. A decision problem asks for a yes/no result, such as whether an integer is even. A search problem asks for an item satisfying a condition. A counting problem asks how many items satisfy a condition. An optimisation problem asks for the best result under stated constraints, such as a shortest suitable route.

A well-defined problem has clear goals, inputs, processes and outputs. An ill-defined problem leaves important requirements or success criteria unclear. Clarifying the goal before writing code prevents the program from solving a different problem correctly. Breaking a larger task into smaller parts makes its requirements and solution easier to follow.`),
 t('3.2','Generate-and-test',[43],`Generate-and-test constructs a candidate, checks it against the required conditions and tries another candidate if the test fails. For a simple number puzzle, generate possible values and check each against the puzzle's rules. A candidate is not a solution merely because it was generated.

The basic steps are to define the possible candidates, produce one candidate, evaluate it with the test, accept a successful candidate or continue, and stop when a solution is found or the relevant candidates are exhausted. The test must express the actual requirements.

An exhaustive method may examine a very large search space. The order of candidates and suitable problem knowledge can reduce unnecessary attempts, but rejecting a candidate without a sound reason can lose a valid answer. Distinguish a failed candidate from proof that no solution exists: one unsuccessful attempt is not an exhaustive search.`),
 t('3.3.1-3.3.2','Solvability and practical resource requirements',[44,45],`A solvable problem has an algorithm that produces a correct answer for the required inputs. A problem can be unsolvable in the general algorithmic sense when no algorithm can guarantee an answer for every case. Solvability is different from whether one particular learner has found a solution.

For a solvable problem, the next question is whether the required time and memory are practical as input size grows. The book calls manageable polynomial-time work tractable and contrasts it with rapid resource growth in intractable problems. Small examples may still be easy even where a general large instance is impractical.

The route-planning example searches for a tour visiting the required cities and returning to its start. Trying every possible tour quickly becomes impractical as the number of cities grows. The retained point is the relationship between input size and resource requirements. The formal complexity-class classification in section 3.3.3 is excluded and is not taught or tested in this guide.

Only that section is excluded; section 3.3.1, section 3.3.2 and the retained exercise comparing tractable and intractable problems still need preparation. The separately deleted textbook long question 1 is not reproduced as a solved exercise.`),
 t('3.4','Time complexity, space complexity and Big O',[47,48],`Time complexity describes how an algorithm's running work grows with input size. Space complexity describes growth in its memory requirements. Big O provides an asymptotic upper-bound description rather than an exact number of seconds on every machine.

| Growth | Meaning in a suitable example |
| --- | --- |
| O(1) | A fixed amount of work independent of the list length |
| O(log n) | Repeatedly halving a search interval |
| O(n) | Examining items one at a time in a linear scan |
| O(n squared) | Work growing with pairs of items or two n-sized nested iterations |

Compare algorithms for the same problem and state the relevant assumptions. The time to find one item in a list depends on the search method, the list's organisation and the case being considered. A smaller growth rate is useful for large inputs, but it does not by itself specify every practical cost.

Memory also matters. Copying a list or keeping a large collection of pending work consumes space. A complete comparison should mention input size, the required order or representation of the data, and whether the stated time is a worst-case or other bound. Do not confuse time complexity with the number of bytes used.`),
 t('3.5','Design techniques',[48,49,50],`Divide-and-conquer splits a problem into smaller parts, solves the parts and combines their results. The book illustrates the split-and-combine idea with merge sort. A greedy method selects a locally attractive choice at each step. It is appropriate only where the problem's properties justify those choices.

The book's coin example helps explain a greedy choice, but that choice is not universally optimal for every denomination set. For denominations 4, 3 and 1 and a target of 6, taking 4 first gives three coins, whereas 3 + 3 needs two. This original check illustrates the book's warning about greedy methods.

Dynamic programming stores solutions to overlapping subproblems so that repeated work can be avoided. The Fibonacci example reuses previously computed values. It is especially useful where subproblems overlap and their solutions can contribute to an optimal larger solution.

Backtracking extends a partial solution and returns to an earlier choice when that path fails. A maze or constrained puzzle can be explored this way. Distinguish the strategies: divide-and-conquer combines solved parts, greedy commits to a local choice, dynamic programming reuses stored results, and backtracking revisits choices.`),
 t('3.6.1','Sorting: bubble sort and selection sort',[50,51],`Sorting arranges items in an order, such as ascending numerical order. Bubble sort compares adjacent items and swaps those in the wrong order. After a complete left-to-right ascending pass, the largest remaining item has moved to the end of the active part. Repeat passes until the required ordering is obtained.

Trace [5, 3, 8, 4, 2]. After the first ordinary pass it becomes [3, 5, 4, 2, 8]. Further passes produce [2, 3, 4, 5, 8]. The intermediate states explain the algorithm; writing only the final sorted list does not show the method.

Selection sort finds the smallest item in the unsorted region and exchanges it with the region's first item. It then moves the boundary forward. For [29, 10, 14, 37, 13], the first selection produces [10, 29, 14, 37, 13].

Both simple methods have quadratic worst-case running time. The checked bubble-sort example below uses a swapped flag and can stop after a pass with no swaps; that optimisation does not remove its quadratic worst case. Sorting and searching are different operations.`),
 t('3.6.2','Linear and binary search',[51,52],`Linear search compares the target with successive items until it finds a match or reaches the end. It can be used on an unsorted list and has O(n) worst-case time. A target absent from a list may require checking every item.

Binary search requires a sorted sequence and an appropriate comparison order. Compare the target with the middle item, keep the left half if it is smaller, or the right half if it is larger, and repeat. Halving the remaining interval gives logarithmic worst-case time for the usual indexed-list setting.

For [1, 3, 5, 7, 9, 11, 13] and target 11, compare with 7 first, then keep the right part and find 11. If the data are unsorted, the direction chosen from a midpoint comparison is not reliable. Account for any sorting work needed before deciding that binary search is the better complete approach.

The textbook's exercise MCQ 5 asks for a search algorithm but lists sorting algorithms. That item is flagged below rather than accepting a sorting algorithm as a valid search method.`),
 t('3.6.3','Breadth-first and depth-first traversal',[52,53],`A graph has vertices connected by edges. Breadth-first search explores the starting vertex's neighbours before moving to further levels. It uses a queue, which removes the earliest waiting item first. Depth-first search follows a branch before returning to try another branch; a stack or the call stack supports that order.

Record which vertices have already been discovered so that cycles do not cause repeated exploration. For adjacency-list representations, visiting the vertices and their edges gives O(V + E) time, where V is the number of vertices and E is the number of edges.

BFS can find a shortest path by number of edges in an unweighted graph. That statement needs the unweighted condition; a few edges with large weights need not be the cheapest route. DFS is useful when following a path and returning from a dead end, as in a maze search.

The order of neighbours determines the exact traversal order. Queue/stack behaviour explains the difference between the methods. Memory requirements depend on the graph's shape and implementation; neither method is universally more memory-efficient for every graph. The checked example below states the neighbour order explicitly.`)
 ],
 short:[
 a(1,'Compare well-defined and ill-defined computational problems.','A well-defined problem specifies its allowed inputs, required output and success conditions clearly. An ill-defined problem leaves important goals or constraints unclear. "Find the minimum in a non-empty integer list" is precise; "choose a nice result" needs further clarification. Defining the problem helps ensure that an algorithm solves the intended task.',[41,42]),
 a(2,'Outline generate-and-test.','Define the possible candidates, generate a candidate, test it against the conditions and accept it if successful. Otherwise generate another candidate. Continue until an answer is found or the relevant search space is exhausted. One failed candidate is not proof that every possible candidate will fail.',[43]),
 a(3,'Compare tractable and intractable problems.','In the book\'s retained comparison, tractable problems have algorithms with manageable polynomial resource growth, while intractable problems require work that grows too rapidly to be practical for large inputs. Solvability and tractability are different questions: a procedure may exist even though trying it on a large input is impractical.',[44,45]),
 a(4,'What is the central idea of a greedy algorithm?','Choose the locally best-looking option at each step and proceed from that choice. A coin-selection method that repeatedly takes the largest usable coin illustrates the idea. Such a local choice is not guaranteed to yield the best overall result for every problem, so its suitability must be justified.',[49]),
 a(5,'What are the advantages of dynamic programming?','It stores results of overlapping subproblems and reuses them instead of repeating the same computation. In the Fibonacci example, previously computed terms are reused to obtain later terms. The method is especially useful where overlapping subproblems and suitable optimal substructure are present.',[49]),
 a(6,'Compare the advantages of BFS and DFS.','BFS explores by levels and can find a shortest path by edge count in an unweighted graph. DFS follows a branch deeply and then backtracks, which is useful for path exploration such as a maze. State the graph representation and neighbour order when showing a traversal; do not claim one is universally more memory-efficient.',[52,53]),
 a(7,'Why break a problem into smaller components?','Smaller components have clearer responsibilities and are easier to reason about separately. Their results can then contribute to the complete task. For example, a report-producing program can separate data input, calculation and formatting rather than mixing every action in one long procedure.',[41,42,48,49]),
 a(8,'Which factors are used to evaluate algorithm performance?','Consider how running work and memory usage grow with input size. State assumptions such as whether the input is already sorted and which case is being discussed. Time complexity describes work growth, while space complexity describes memory growth. Correctness for the specified problem remains necessary before comparing efficiency.',[47,48])
 ],
 long:[
 a(2,'Explain search problems and compare linear and binary search.',`A search problem asks for an item satisfying a specified condition. To search for a learner\'s ID, define the data collection, the target ID and the result required when the ID is absent. Searching is different from sorting: sorting changes the organisation of items, whereas searching locates or establishes the absence of an item.

Linear search compares successive items with the target. It works with sorted or unsorted data. If the target is absent or is the final item, it may examine the whole list, giving O(n) worst-case time.

Binary search compares the target with a middle item in a sorted indexed sequence. It keeps only the half that can still contain the target and repeats. With each step halving the interval, its worst-case search time is O(log n). It cannot safely use that decision rule on arbitrary unsorted data.

For a small unsorted list, a direct linear scan may be the simplest choice. For repeated searches of a large already sorted list, binary search is attractive. If sorting is necessary first, include its cost when comparing the complete approaches. Use a trace to show comparisons and the shrinking search interval.`,[51,52]),
 a(3,'Explain optimisation problems with examples.',`An optimisation problem asks for the best result according to a stated objective while satisfying constraints. State what is being minimised or maximised and what makes a candidate feasible. A route-planning problem might minimise distance while requiring every listed destination to be visited.

Different candidates can satisfy the constraints but have different objective values. Finding a feasible route is therefore not automatically the same as finding the shortest feasible route. A programme must compare the appropriate values or use a justified method for choosing among candidates.

The book\'s tour example returns to the starting point after visiting the required cities. Exhaustively comparing every tour becomes impractical as the number of cities grows. This illustrates why efficiency matters even where candidate solutions can be generated.

The chosen design technique depends on the problem. A greedy approach makes local choices and needs suitable problem properties; dynamic programming can reuse overlapping subproblem results; backtracking revisits unsuccessful choices. Explain the input, constraints, objective and method rather than claiming that one technique solves every optimisation problem. Formal complexity classes from excluded section 3.3.3 are not needed in this answer.`,[42,44,45,49,50]),
 a(4,'Explain bubble sort and compare it with selection sort.',`For ascending bubble sort, compare adjacent items and swap them when the left value is larger. Continue to the end of the active region, then repeat for the remaining unsorted part. For [5, 3, 8, 4, 2], the first pass gives [3, 5, 4, 2, 8]. The 8 is now in its final position. Subsequent passes lead to [2, 3, 4, 5, 8].

Selection sort follows a different selection rule: find the minimum in the unsorted region, exchange it with the first unsorted position, and move the boundary. It does not perform the same series of adjacent comparisons and swaps as bubble sort.

Both elementary methods have O(n squared) worst-case time. An implementation of bubble sort may stop early after a pass with no swaps. Describe that optimisation separately from the general worst-case bound.

For a complete written answer, show at least one pass, describe the stopping condition and distinguish the methods\' operations. A final sorted list alone cannot show whether bubble sort or selection sort was used. A checked implementation and trace follow in the practice section.`,[50,51]),
 a(5,'Compare time and space complexity and explain their effect on algorithm choice.',`Time complexity describes the growth of running work with the input size. Space complexity describes the growth of memory requirements. Big O expresses an asymptotic bound, so it should not be read as an exact stopwatch time or a fixed byte count for every implementation.

A linear scan can require work proportional to n items. Binary search halves an already sorted indexed interval and takes logarithmic worst-case search time. Repeated comparisons of pairs can lead to quadratic work. State the input assumptions before comparing these bounds.

Memory constraints can also affect the choice. An approach that copies many intermediate collections may need more space than a method that updates an existing structure. Graph searches retain pending vertices and discovery information, so representation and graph shape matter.

Choose an algorithm that is correct for the task, then compare time, space and relevant setup work. If a list must first be sorted, include that preparation in the overall comparison. The fastest asymptotic search method is not automatically the simplest or most suitable complete solution for every small input.`,[47,48,51,52,53])
 ],
 exerciseMcqs:[
 q(1,'What makes a computational problem well-defined?','Clear goals, input, processing and output',['Ambiguous success criteria','Unspecified input and output','No way to identify a correct result'],'A precise specification allows a proposed result to be checked.'),
 q(6,'When is dynamic programming especially useful?','When subproblems overlap and their results can be reused',['When no subproblem is repeated','When every local choice is automatically optimal','When storing any result is forbidden'],'Stored subproblem results avoid redundant calculation.'),
 q(7,'Which sorting method compares and swaps adjacent out-of-order items?','Bubble sort',['Selection sort','Binary search','Linear search'],'Bubble sort moves larger items along through adjacent swaps.'),
 q(8,'What is the usual DFS time bound with adjacency lists?','O(V + E)',['O(1) for every graph','O(V) regardless of edges','O(log V) for every graph'],'Each vertex and relevant edge is processed a bounded number of times.'),
 q(9,'What does time complexity describe?','How running work grows with input size',['Only the memory used','Only the screen refresh rate','A fixed number of seconds on every machine'],'The input-size relationship is central, rather than a machine-specific exact time.'),
 q(10,'Which listed sorting algorithm has an O(n log n) time bound?','Merge sort',['Bubble sort','Insertion sort in its worst case','Selection sort'],'The divide-and-combine approach illustrated by merge sort has this bound.')
 ],
 exerciseIssues:[{number:5,question:'The printed exercise asks for a search algorithm but gives Bubble Sort, Merge Sort, Selection Sort and Quick Sort as its choices.',answer:'All four options name sorting algorithms. There is no valid search algorithm among the printed choices. Use linear versus binary search for a search comparison; do not memorise a sorting algorithm as a search method.',pages:[54]}],
 programs:[
 {id:'bubble-sort',title:'Trace one pass and the completed sort',code:'def bubble_sort(values):\n    data = values[:]\n    for end in range(len(data) - 1, 0, -1):\n        swapped = False\n        for i in range(end):\n            if data[i] > data[i + 1]:\n                data[i], data[i + 1] = data[i + 1], data[i]\n                swapped = True\n        if not swapped:\n            break\n    return data\n\nprint(bubble_sort([5, 3, 8, 4, 2]))\nprint(bubble_sort([]))\nprint(bubble_sort([2, 2, 1]))\n',stdout:'[2, 3, 4, 5, 8]\n[]\n[1, 2, 2]\n',pages:[50,51]},
 {id:'linear-binary-search',title:'Compare two searches, including an absent target',code:'def linear_search(data, target):\n    for i in range(len(data)):\n        if data[i] == target:\n            return i\n    return -1\n\ndef binary_search(data, target):\n    left, right = 0, len(data) - 1\n    while left <= right:\n        middle = (left + right) // 2\n        if data[middle] == target:\n            return middle\n        if target < data[middle]:\n            right = middle - 1\n        else:\n            left = middle + 1\n    return -1\n\nvalues = [1, 3, 5, 7, 9, 11, 13]\nprint(linear_search(values, 11), binary_search(values, 11))\nprint(linear_search(values, 2), binary_search(values, 2))\nprint(binary_search([], 1))\n',stdout:'5 5\n-1 -1\n-1\n',pages:[51,52]},
 {id:'bfs-dfs',title:'Check the effect of queue and stack order',code:'graph = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}\n\ndef bfs(start):\n    pending = [start]\n    seen = {start}\n    order = []\n    while pending:\n        node = pending.pop(0)\n        order.append(node)\n        for neighbour in graph[node]:\n            if neighbour not in seen:\n                seen.add(neighbour)\n                pending.append(neighbour)\n    return order\n\ndef dfs(start):\n    pending = [start]\n    seen = set()\n    order = []\n    while pending:\n        node = pending.pop()\n        if node in seen:\n            continue\n        seen.add(node)\n        order.append(node)\n        pending.extend(reversed(graph[node]))\n    return order\n\nprint(bfs("A"))\nprint(dfs("A"))\n',stdout:"['A', 'B', 'C', 'D']\n['A', 'B', 'D', 'C']\n",pages:[52,53],note:'The Python list queue is used for a readable trace. pop(0) shifts elements, so this demonstration is not an implementation proof of the adjacency-list O(V+E) bound; a suitable constant-time queue operation is needed for that implementation bound.'}
 ]
};
