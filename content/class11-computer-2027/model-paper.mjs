import {chapters} from './index.mjs';
const short=(chapter,number)=>chapters[chapter-1].short.find(item=>item.number===number).answer;
const long=(chapter,number)=>chapters[chapter-1].long.find(item=>item.number===number);
export const modelPaper={
 title:'PECTAA Grade 11 Computer Science and Entrepreneurship Model Paper 2027',
 sourcePdfPages:[47,48,49,50,51],
 mcqs:[
 ['i','Which design pattern ensures a specified object or resource is created once?',['Factory','Singleton','Observer','Strategy'],1,'Singleton is the single-instance pattern described in section 1.6.1.1.',[14]],
 ['ii','Which software-development framework uses short cycles or sprints?',['Waterfall model','Lean software development','Egale Methodology (as printed)','Scrum'],3,'Scrum is the specific framework option. The supplied model prints a misspelled alternative; this transcription flags it rather than silently changing the options.',[7,18]],
 ['iii','What is the main concern of non-functional requirements?',['System usability and performance','Business rules','Data input and validation','Core application logic'],0,'These are quality attributes rather than particular system operations.',[3,4]],
 ['iv','Which Python operator performs exponentiation?',['**','##','//','/'],0,'The ** operator raises a value to a power.',[23,25]],
 ['v','What is the usual DFS time bound in a graph represented by adjacency lists?',['O(n log n)','O(V)','O(V + E)','O(n)'],2,'The traversal processes vertices and their adjacency-list edges. V is the vertex count and E the edge count.',[52,53]],
 ['vi','Which operation removes an item from the top of a stack?',['Push','Pop','Peek','Add'],1,'Pop removes the top item; peek only observes it.',[58,59]],
 ['vii','What is the square of the standard deviation?',['Mean','Variance','Median','Range'],1,'Standard deviation is the square root of the corresponding variance.',[68,69,70]],
 ['viii','What is a line graph particularly useful for?',['Comparing categories','Showing trends over time','Displaying proportions','Visualising frequency distributions'],1,'The ordered time scale makes changes across time visible.',[80]],
 ['ix','Which deployment arrangement combines public and private clouds?',['Public cloud','Hybrid cloud','Community cloud','Multi-cloud'],1,'Hybrid is the combination of public and private environments.',[90]],
 ['x','Which harmful software secretly monitors activity?',['Spam','Cookies','Spyware','Pharming'],2,'Spyware is the covert-monitoring software category.',[104]],
 ['xi','Which threat redirects a person to a fake website?',['Phishing','Spam','Spyware','Pharming'],3,'Pharming describes redirection to a counterfeit destination.',[104,105]],
 ['xii','Which Boolean operator expresses exclusion?',['OR','AND','NOT','NEITHER'],2,'Boolean NOT excludes a condition. Actual search-interface syntax can vary.',[122]],
 ['xiii','Which option is not itself one of the named intellectual-property categories?',['Copyright','Trademark','Patent','Physical properties'],3,'The textbook distinguishes physical property from the named IP categories.',[119,120,123]],
 ['xiv','Which technique is commonly used in Design Thinking?',['SWOT analysis','Brainstorming','Learning manufacturing (as printed)','Data mining'],1,'Brainstorming helps generate possible solutions during ideation.',[126,139]],
 ['xv','What goal of entrepreneurship is emphasised?',['Create new technologies','Manage finances','Solve problems and create value','Compete with large corporations'],2,'The book emphasises useful solutions and value.',[125,139]]
 ],
 shortGroups:[
 {number:2,attempt:6,questions:[
 ['i','Differentiate functional and non-functional requirements.',short(1,1),[3,4]],
 ['ii','Why is testing important in the SDLC?',short(1,2),[4,5]],
 ['iii','Describe the Factory pattern with an example.',short(1,7),[13,14]],
 ['iv','Explain the role of sprints in Agile.','A sprint is a short planned development cycle that delivers a useful working increment. The team checks that increment, obtains feedback and uses it to guide a following cycle. The book describes short iterations under Agile; Scrum is the specific sprint-framework option in the objective paper.',[7,18]],
 ['v','Differentiate integer and float data types.',short(2,2),[22,23]],
 ['vi','How do default parameters work?',short(2,6),[29]],
 ['vii','Write the syntax of a simple Python if-else.','Use a condition followed by a colon and an indented true block; else has its own colon and indented alternative block. A valid complete example is:\n\n~~~python\nnumber = 4\nif number > 0:\n    print("Positive")\nelse:\n    print("Not positive")\n~~~\n\nThe output for this example is Positive.',[26,27]],
 ['viii','What is the purpose of a trademark?',short(8,4),[120]],
 ['ix','Why evaluate online-source reliability?',short(8,2),[116,117,118]]
 ]},
 {number:3,attempt:6,questions:[
 ['i','Summarise the idea of greedy algorithms.',short(3,4),[49]],
 ['ii','Differentiate well-defined and ill-defined problems.',short(3,1),[41,42]],
 ['iii','Outline generate-and-test.',short(3,2),[43]],
 ['iv','What is edge computing?',short(6,3),[98]],
 ['v','Differentiate elasticity and on-demand access.',short(6,9),[88,89]],
 ['vi','Describe serverless architecture.',short(6,4),[98]],
 ['vii','What is PaaS? Give an example.','Platform as a Service supplies an environment for developing and deploying applications while the provider manages the underlying platform resources. The developer focuses on application code. The textbook names Google App Engine as an example.',[89]],
 ['viii','Why should users understand Terms of Use?',short(7,1),[101,102,103]],
 ['ix','Differentiate phishing and pharming.',short(7,2),[104,105,106]]
 ]},
 {number:4,attempt:6,questions:[
 ['i','How does insert() work on a Python list?',short(4,1),[57]],
 ['ii','Differentiate enqueue and dequeue.',short(4,4),[59,60]],
 ['iii','Explain the roles of root and leaf nodes in a tree.','The root is the designated starting or top node of a rooted hierarchy. A leaf has no children and ends a branch. They identify different positions and relationships within the tree, rather than different numeric values stored in a list.',[60,61]],
 ['iv','Describe two types of data visualisation.',short(5,3),[79,80,81]],
 ['v','Define probability with an example.','Probability describes the likelihood of an event. For equally likely finite outcomes, divide the favourable count by the total count. A fair coin has one heads outcome among two equally likely outcomes, so P(heads) = 1/2.',[70]],
 ['vi','Find the median of 40, 50, 60, 70, 80 and 90.','There are six ordered values, so the middle positions contain 60 and 70. Median = (60 + 70) / 2 = 65. Averaging the two middle values is the required method for an even-sized dataset.',[68]],
 ['vii','Define entrepreneurship.',short(9,1),[125,139]],
 ['viii','What is the main focus of Design Thinking?',short(9,2),[126]],
 ['ix','Explain the importance of a business pitch.',short(9,5),[131,132]]
 ]}
 ],
 longQuestions:[
 {...long(2,6),number:5,question:'Write a Python while-loop program to print the odd numbers from 1 to 100 and their count.',programId:'odd-numbers',chapter:2},
 {...long(3,5),number:6,question:'Compare time and space complexity and explain their effect on algorithm choice.',chapter:3},
 {...long(4,5),number:7,question:'Define a graph and compare directed and undirected graphs.',chapter:4},
 {...long(5,4),number:8,question:'Explain data-collection methods.',chapter:5},
 {...long(7,1),number:9,question:'Explain common Terms of Use clauses and how they protect the provider and user.',chapter:7}
 ]
};
