import {t,a,q,practice as p} from './authoring.mjs';
export default {
 number:4,
 topics:[
 t('4.1.1','Lists and their operations',[56,57,58],`A list keeps elements in an ordered sequence and allows access by position. In Python, square brackets create a list and the first position has index 0. A Python list can grow or shrink as items are inserted or removed. Ordered does not mean automatically sorted: [8, 2, 5] preserves that order until the program changes it.

append(item) adds at the end. insert(index, item) adds at a selected position and shifts later items. remove(value) removes the first matching value. pop(index) removes and returns the item at a position; without a supplied index, pop() removes the last item. The in operator tests membership.

If tasks is ["Read", "Write"], tasks.insert(1, "Revise") changes it to ["Read", "Revise", "Write"]. Insertion is different from tasks[1] = "Revise", which replaces the existing element and does not increase the length. Some displayed output in the printed insertion example omits the inserted item; the checked example here shows the actual operation.

Two names may refer to the same list. If second = first, changing the list through second is visible through first too. This is not an independent copy. A separate list of the simple values can be created with slicing when independent changes are needed. Lists support general data collections and can also implement the stack and queue concepts introduced next.`),
 t('4.1.2','Stacks: last in, first out',[58,59],`A stack adds and removes items at its top. Push adds an item at that end; pop removes the item most recently pushed there. The rule is Last-In, First-Out, abbreviated LIFO. A stack of books illustrates why the latest book placed on top is the first one removed.

For pushes A, B, C, the top is C. One pop returns C and leaves A, B. Another pop returns B. A peek observes the top without removing it, while pop changes the stack. A Python list can demonstrate the concept by using append() to push and pop() without an index to remove the last item.

An empty stack has no top item to remove. In a simple implementation, check whether it contains an item before popping. A stack is not automatically sorted by its values: its removal order follows the insertion history at the top.`),
 t('4.1.3','Queues: first in, first out',[59,60],`A queue adds items at its rear and removes them at its front. Enqueue means adding an item; dequeue means removing the earliest waiting item. The rule is First-In, First-Out, or FIFO. A line of customers illustrates the order: the first customer to join is the first to be served.

If A and B are enqueued, a dequeue returns A and leaves B waiting. Enqueuing C then leaves the waiting order B, C. A peek checks the front without serving that item. An empty queue has no waiting item to dequeue.

The book demonstrates Python's Queue class with put() for adding and get() for removing. The checked program below keeps the calls consistent with that interface. The data-structure operation is called enqueue even though this library's method is named put. Do not confuse the concept with a particular method spelling.`),
 t('4.1.4','Trees and hierarchy',[60,61,62],`A rooted tree represents a hierarchy. Its starting node is the root. Connections are edges, and a node with no children is a leaf. Parent-child relationships distinguish this structure from a simple linear list. Family relationships, folder structures, organisational charts and decision processes are examples in the book.

Tree height describes the longest root-to-leaf path. In these notes and the retained exercise, count edges on that path. A tree with a root, a child and a grandchild has height 2; counting its 3 nodes would use a different convention. State the convention when drawing an example.

In a tree there is one path between each pair of nodes and no cycle. A balanced tree keeps its branches reasonably similar in height according to the balancing rule being used. It does not require every possible node position to be filled.

Pre-order processes a parent before its descendants. Post-order processes descendants before the parent. The book relates these orders to copying a folder structure and handling children before their containing folder. Here they are tracing examples only; no deletion command or operation on a learner's real files is required.`),
 t('4.1.5','Graphs, direction and weights',[62,63,64],`A graph consists of vertices, also called nodes, joined by edges. The vertices might represent cities or people, and edges might represent routes or relationships. A general graph need not have the single-root hierarchy used in a rooted tree and may contain cycles or several paths between vertices.

In an undirected graph, an edge joins its two endpoints without an arrow direction. In a directed graph, an edge goes from one specified endpoint to another; the reverse edge does not automatically exist. A weighted graph assigns a value such as distance, time or cost to an edge. Direction and weight are independent properties, so a graph can be both directed and weighted.

For a simple undirected graph, the degree of a vertex is the number of edges incident on it. If A is joined to B, C and D, A has degree 3. A vertex's degree is different from the weight of any one edge. A route with fewer edges need not have a lower total weight.

A tree is a special graph, but a general graph need not satisfy the tree's no-cycle and unique-path properties. A list suits a sequence, a queue suits first-come service, a stack suits last-added removal and a graph suits a network of relationships. Choose the structure from the required operations and relationships.`)
 ],
 short:[
 a(1,'How does list insert() work? Give an example.','insert(index, value) adds an item before the selected position, increasing the list length and shifting later elements. For tasks = ["Read", "Write"], tasks.insert(1, "Revise") gives ["Read", "Revise", "Write"]. This differs from assigning to tasks[1], which replaces the current item.',[57]),
 a(2,'What issue arises when two variables reference one list?','Both names refer to the same mutable object, so a change through either name is visible through the other. If first = [1, 2] and second = first, second.append(3) also makes first show [1, 2, 3]. An assignment of another name is not an independent copy. Use a suitable copy when separate changes are intended.',[57,58,66]),
 a(3,'Define a stack and explain LIFO.','A stack adds and removes elements at the top. Its Last-In, First-Out rule means the most recently pushed item is popped first. If A is pushed and then B, the next pop returns B. A stack of books is a simple real-world illustration.',[58,59]),
 a(4,'Differentiate enqueue and dequeue.','Enqueue adds an item at the rear of a queue. Dequeue removes the item at the front. A queue follows First-In, First-Out order. If A and B join in that order, the next dequeue returns A, not B.',[59,60]),
 a(5,'Name the two basic stack operations.','Push adds an item at the top; pop removes the item at the top. In the list implementation illustrated here, append() performs the push and pop() removes the latest item. Checking the top without removal is a different operation, commonly called peek.',[58,59]),
 a(6,'What is the difference between enqueue() and dequeue()?','These names describe the queue concepts of adding at the rear and removing from the front. The book\'s Python Queue example implements them with put() and get(). This exercise repeats the contrast in short question 4; the FIFO order remains the same.',[59,60,66])
 ],
 long:[
 a(1,'Explain the dynamic-size property of Python lists.',`A Python list is an ordered, indexed collection whose length can change during the program. A to-do list, for example, can begin with two tasks, accept a new task and shrink when a task is removed. The programmer does not need to decide the final list length before adding these items.

append() adds an item at the end, insert() adds at a selected position and removal operations reduce the length. Indexed assignment changes an existing element without necessarily changing the length. Explain those operations separately; dynamic size is not a promise that every item is automatically sorted or that every operation takes the same time.

Use the checked list example below to trace insertion, removal and membership. State the list before and after each operation. If two names refer to the same list, changes affect that shared list. When independent copies are intended, choose a suitable copying operation rather than merely assigning another name.

Dynamic lists suit collections such as tasks, records and names where the number of elements changes. A more specialised order requirement, such as first-come service, may be better expressed through the queue abstraction.`,[56,57,58]),
 a(2,'Explain stack operations using an example and Python.',`A stack follows LIFO: the latest item added at the top is the first removed. Place Book A on a stack, then Book B. The next removal takes Book B, leaving Book A. The order follows position at the top rather than alphabetic or numeric sorting.

Push adds an element at the top; pop removes and returns the top element. A peek observes that item without removing it. Before a pop on a possibly empty stack, check whether an item is available.

In the checked Python example, a list represents the stack. append() performs each push and pop() without an index performs the top removal. Trace the contents after each call and distinguish the returned value from the remaining collection. A stack's removal rule is different from a queue, which serves the earliest enqueued item.`,[58,59]),
 a(3,'Implement queue insertion and deletion.','A queue serves the oldest waiting item first. Use the book\'s Queue interface: put() adds at the rear and get() removes from the front. The checked program below enqueues Ali and Sara, removes Ali, then enqueues Hina. The remaining service order is Sara followed by Hina. Check for an empty queue when no waiting item can be assumed.',[59,60]),
 a(4,'Define a tree and explain its properties.',`A rooted tree is a hierarchical arrangement of nodes and edges with a designated root. A node can have children; a node with no children is a leaf. A family tree or folder hierarchy illustrates the relationship between the parent and its descendants.

A tree has no cycle and a unique path between any pair of nodes. Its height is the length of a longest root-to-leaf path. Count edges for the convention used in this guide: a three-node chain has height two. The number of nodes and the number of edges on a path are different quantities.

Balanced trees maintain suitably similar branch heights, depending on the balance rule. A pre-order traversal processes the parent before its descendants, while a post-order traversal processes descendants before their parent. These orders are useful for reasoning about hierarchical tasks.

A general graph need not have a root or a unique path and can contain cycles. Explain the special tree properties instead of treating every network diagram as a tree. A labelled original diagram accompanies this guide.`,[60,61,62]),
 a(5,'Define a graph and compare directed and undirected graphs.',`A graph is a collection of vertices connected by edges. Vertices represent the objects being related and edges represent their connections. Cities and routes or people and friendships are examples. A general graph can have multiple paths and cycles and does not require a single hierarchical root.

In a directed graph, an edge from A to B specifies a direction. A reverse edge from B to A must be given separately if that connection exists. In an undirected graph, the edge connects the two endpoints without a one-way arrow, representing a two-way relationship in the model.

An edge can also have a weight such as distance, time or cost. Weight and direction describe different properties; a directed graph can also be weighted. For a simple undirected graph, the degree of a vertex is its number of incident edges, not a distance value.

Use a labelled example to show the distinction. A one-way road A to B suits a directed edge, while a mutual friendship can be represented by an undirected edge. Choose a graph rather than a linear list when the task concerns a network of relationships.`,[62,63,64])
 ],
 exerciseMcqs:[
 q(1,'Which list method adds one item at the end?','append()',['insert() without a position','remove()','pop()'],'append() adds to the end of a Python list.'),
 q(2,'What does in test when used with a list?','Whether a value is present',['Whether the list is sorted','The number of elements','The final item\'s index'],'The expression value in items checks membership.'),
 q(3,'Which operation removes the top stack item?','Pop',['Push','Peek','Enqueue'],'Pop removes; a peek observes without removing.'),
 q(4,'Which queue operation adds an item?','Enqueue',['Dequeue','Pop from the front without adding','Removal'],'The item joins the rear of the queue.'),
 q(5,'Using the exercise\'s edge-count convention, what is tree height?','The number of edges on a longest root-to-leaf path',['The total number of nodes','The number of root children only','The weight of every edge added together'],'State the edge-count convention to avoid confusing nodes with edges.'),
 q(6,'Which task most directly calls for a general graph of relationships?','Representing social-network connections',['Keeping a simple to-do sequence','Serving a customer queue','Removing the top book from a stack'],'A network of people and their relationships is naturally described by vertices and edges.')
 ],
 practice:[
 ...p('4.1.1',[56,57,58],[
 ['After items = [4, 7], items.append(9) leaves which list?','[4, 7, 9]',['[9, 4, 7]','[4, 9]','[4, 7]'],'Appending preserves the earlier items and places the new value at the end.'],
 ['What distinguishes insertion from replacement in a list?','Insertion adds a position; replacement changes an existing item',['Both always remove the first item','Replacement always increases length','Insertion sorts every item'],'insert() shifts later items rather than replacing the selected item.'],
 ['Which action removes the first matching list value?','remove(value)',['append(value)','The in test','len(items)'],'remove() selects by value; it is different from removing by index.'],
 ['If b = a for a list a, what does b initially refer to?','The same list object',['An automatically independent deep copy','A tuple of its indexes','An alphabetically sorted copy'],'A second assignment of the reference does not copy the mutable list.'],
 ['Does an ordered Python list have to be numerically sorted?','No; order means its sequence of positions is retained',['Yes; every append sorts it','Yes; values cannot be rearranged','No; it has no positions at all'],'Sequence order and sorted order are different properties.']]),
 ...p('4.1.2',[58,59],[
 ['Push A, then B, then C. Which item is popped first?','C',['A','B','All three simultaneously'],'The most recent push is at the top.'],
 ['Which rule describes a stack?','Last-In, First-Out',['First-In, First-Out','Smallest value first','Alphabetical order first'],'LIFO follows the top-end insertion history.'],
 ['Which Python list operation demonstrates a stack push?','append(item)',['remove(item)','pop(0)','clear()'],'The list end is used as the stack top in this demonstration.'],
 ['What is the difference between peek and pop?','Peek observes the top; pop removes it',['Both always add an item','Peek removes the bottom','Pop can only inspect without changing'],'Observation and removal are distinct operations.'],
 ['What should a simple stack implementation check before removing a possibly absent top?','Whether the stack is empty',['Whether the values are alphabetical','Whether every value is numeric','Whether a new item can be inserted at the bottom'],'An empty stack has no top item to return.'],
 ['After pushing 2 and 5, then popping once, which value remains?','2',['5','Both are removed','Neither was ever inserted'],'The latest value 5 is removed first.']]),
 ...p('4.1.3',[59,60],[
 ['Which queue item is served next?','The item that has waited at the front longest',['The last item just added','The largest numeric item','A randomly selected item'],'FIFO serves the earliest waiting item.'],
 ['Where is a newly enqueued item placed?','At the rear',['Ahead of every existing item','At the stack top by a LIFO rule','In automatic numerical order'],'Enqueue joins the waiting line at its rear.'],
 ['Which Queue method in the book adds an item?','put()',['get()','pop()','remove()'],'The library method put implements the demonstrated enqueue.'],
 ['Enqueue Ali and Sara, dequeue once, then enqueue Hina. Who is next?','Sara',['Ali','Hina','No one, because every item was removed'],'After Ali is served, Sara is the oldest waiting item.'],
 ['Which real situation most directly illustrates FIFO?','A first-come customer-service line',['A pile of plates removed from its top','Sorting marks highest first','Replacing a value by index'],'The service order matches arrival order.']]),
 ...p('4.1.4',[60,61,62],[
 ['What is a leaf in a rooted tree?','A node without children',['Every node with a parent','The edge joining two nodes','A node that must have two children'],'Leaf status concerns the absence of child nodes.'],
 ['Which node is designated as the start of a rooted hierarchy?','Root',['Any edge weight','Every leaf at once','The final list index'],'The root is the reference point of the rooted tree.'],
 ['How many edges are on the root-to-leaf path in a three-node chain?','2',['1','3','4'],'Three consecutive nodes are joined by two edges.'],
 ['Which property distinguishes a tree from a general cyclic graph?','A tree has no cycle and a unique path between node pairs',['A tree must contain a cycle','Every graph has exactly one root','A tree has no edges'],'The unique-path, no-cycle structure is central.'],
 ['Which traversal visits a parent before its descendants?','Pre-order',['Post-order','Descending numerical sort','A rear-only queue insertion'],'Pre-order processes the parent first.'],
 ['Which representation suits folders and subfolders?','A rooted tree',['Only a stack with no links','A single number','A queue ordered only by arrival'],'The parent-child hierarchy matches a rooted tree.']]),
 ...p('4.1.5',[62,63,64],[
 ['A graph\'s vertices normally represent what?','The objects being connected',['Only the connection costs','The drawing\'s background colour','The insertion index of a list only'],'Edges connect the represented objects.'],
 ['What follows from a directed edge A to B alone?','A to B is given; B to A is not automatically given',['Both directions must exist','There are no vertices','The graph cannot have weights'],'Direction makes the orientation meaningful.'],
 ['Which property represents a road\'s distance in a graph?','An edge weight',['The colour of a vertex','A queue\'s rear position','A list\'s append method'],'Weights can represent distance, time or other costs.'],
 ['Can one graph be both directed and weighted?','Yes; direction and weight are independent properties',['No; weights remove every arrow','No; a weight is always a root','Only if it contains no edges'],'A one-way route can also have a distance.'],
 ['In a simple undirected graph, A joins B, C and D. What is A\'s degree?','3',['1','2','4'],'Three edges are incident on A.'],
 ['Which relationship suits an undirected edge?','A mutual connection between two vertices',['A one-way-only permission','A required root-to-leaf hierarchy','A task\'s numerical list position'],'The undirected connection has no arrow orientation.'],
 ['Must a general graph have exactly one root?','No',['Yes, by definition','Yes, and every vertex must be a leaf','Only if all its weights are equal'],'A general graph need not be a rooted hierarchy.'],
 ['Does the fewest-edge route always have the smallest total weight?','No, edge weights can differ',['Yes, even if one edge has a very large cost','Yes, because weights are ignored by definition','Only if the graph has no vertices'],'A path\'s edge count and its total weight measure different things.']])
 ],
 programs:[
 {id:'list-operations',title:'Trace insertion, removal and shared references',code:'tasks = ["Read", "Write"]\ntasks.insert(1, "Revise")\nprint(tasks)\nprint(tasks.pop(0))\nprint("Revise" in tasks)\nother = tasks\nother.append("Submit")\nprint(tasks)\n',stdout:"['Read', 'Revise', 'Write']\nRead\nTrue\n['Revise', 'Write', 'Submit']\n",pages:[57,58]},
 {id:'stack',title:'Push and pop a book stack',code:'stack = []\nstack.append("Book A")\nstack.append("Book B")\nprint(stack[-1])\nprint(stack.pop())\nprint(stack)\nif stack:\n    print(stack.pop())\nprint("Empty:", not stack)\n',stdout:"Book B\nBook B\n['Book A']\nBook A\nEmpty: True\n",pages:[58,59]},
 {id:'queue',title:'Solve the retained queue-program exercise',code:'from queue import Queue\n\nwaiting = Queue()\nwaiting.put("Ali")\nwaiting.put("Sara")\nprint(waiting.get())\nwaiting.put("Hina")\nwhile not waiting.empty():\n    print(waiting.get())\nprint("Empty:", waiting.empty())\n',stdout:'Ali\nSara\nHina\nEmpty: True\n',pages:[59,60]}
 ]
};
