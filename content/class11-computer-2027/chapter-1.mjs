import {t,a,q} from './authoring.mjs';
export default {
 number:1,
 topics:[
 t('1.1','Software development',[1],`Software development turns a user's need into working software. Coding is part of the process, alongside understanding the need, planning, checking the result and maintaining it after release. A school attendance application is software because its instructions record and process attendance; the computer on which it runs is hardware.

A good answer identifies a purpose, an activity and a result. For example, a library needs to track loans; developers write and test the borrowing functions; users receive an application that records who has each book. Development is a continuing process because requirements and faults can change after the first release.`),
 t('1.2','SDLC, requirements and a reusable framework',[2,3,4,5],`The Software Development Life Cycle organises development from the first idea to deployment and maintenance. Its purpose is to produce suitable, reliable software within planned time and cost. A development framework provides reusable components and conventions so that common functions do not have to be built again for every project.

| Stage | Main work | Evidence in a library project |
| --- | --- | --- |
| Requirements | Interview users, observe work and review documents | List of borrowing and librarian requirements |
| Design | Decide the structure, interface and component responsibilities | Screen plan and component responsibilities |
| Coding | Implement the design as program instructions | Borrowing and return functions |
| Testing | Compare behaviour with requirements | Recorded normal and boundary test results |
| Deployment | Install, configure and check in the real setting | Application available to its intended users |
| Maintenance | Correct faults and respond to changing needs | An update that fixes a loan-date problem |

Functional requirements describe what the system must do, such as registering a learner or returning a borrowed book. Non-functional requirements describe qualities or constraints, such as usability, response time, reliability or controlled access. A feature and a quality target should be stated separately. "Search for a book" is a function; "return search results within the agreed response time" is a performance requirement.

Testing includes checking functions, performance and compatibility. Deployment includes installation and configuration, followed by checks in the intended environment. Maintenance follows release and may involve both fixes and changes. Completing coding alone does not prove that the software meets its requirements.`),
 t('1.3','Waterfall and Agile development',[5,6,7],`A software process model gives a team a way to organise the SDLC. The textbook presents Waterfall as a sequence of phases and Agile as short, repeatable development cycles with feedback. Waterfall is easy to understand and plan when requirements are clear and stable. A late change can be expensive because earlier design and implementation decisions may need revision.

Agile delivers small working increments and adapts the next cycle to feedback. In a school app, a team might deliver attendance first, review it with teachers, and add reporting in a later cycle. Flexibility needs continuing stakeholder participation and coordination; it does not remove planning, documentation or testing.

Continuous integration means merging changes regularly into a shared code base and checking them together. Test-driven development starts with a test for intended behaviour before the implementation. Pair programming involves two developers working together, with one entering code and the other reviewing it. These are practices described under Agile in the book; they are not interchangeable names for the entire SDLC.

The book and model paper use the word sprint. A sprint is a short planned development cycle. Where both Agile and Scrum appear as options in the exercise's sprint question, Scrum is the specific framework choice; Agile is the broader approach. Newly authored practice questions distinguish the two to avoid ambiguous options.`),
 t('1.4','Planning, costs, risk and quality',[8,9],`Comprehensive planning identifies the project scope, tasks, people, resources and delivery approach. A timeline assigns an expected duration and order to the work. Tasks that depend on earlier work should be planned in that order, and progress should be checked during execution.

The book's cost factors include the development team, technology stack, project duration, risk management, quality assurance and operational costs. An estimate is a reasoned prediction, not a promise that the project cannot change. For a small school app, list development work, testing, deployment and continuing operation rather than counting only the time spent typing code.

Risk management starts by identifying possible problems. Assess their likelihood and effect, prioritise them, choose a response and keep monitoring them. An unavailable stakeholder can delay feedback; a response might be an agreed review schedule and a nominated substitute. A backup of project work addresses the risk of losing progress. A risk response should match the identified problem.

Quality assurance uses planned processes and standards to improve how software is developed. Testing checks the product's actual behaviour. During execution, compare completed work with the plan, monitor quality and revise an estimate when evidence changes. Section 1.4 remains included even though the next section begins on the same printed page.`),
 t('1.6','Design patterns',[13,14],`A design pattern describes a reusable way of addressing a recurring software-design problem. It is a design idea, rather than a complete application or a guarantee that every project needs the same structure.

| Pattern | Main idea | Original study example |
| --- | --- | --- |
| Singleton | Use one shared instance of a specified resource | A shared application settings manager |
| Factory | Centralise how the required kind of object is created | A notification creator that selects an email or SMS sender |
| Observer | Notify interested dependants when a source changes | An attendance update notifying subscribed reports |
| Strategy | Select an interchangeable method for a task | Choosing a suitable sorting or payment strategy |

The Factory pattern lets a caller request the needed type without repeating creation details in every caller. Observer separates the source of an event from its interested listeners. Strategy separates a choice of behaviour from the code using that behaviour. Shared pattern names help developers communicate and can improve reuse and maintainability.

This retained section starts near the end of printed page 13. The exclusion of section 1.5 is not a reason to omit the design-pattern content that follows it.`),
 t('1.7','Debugging and testing',[15,16],`A bug is a fault that causes an incorrect or unexpected result. Debugging identifies the cause and corrects it. A debugger can step through execution and inspect values. Temporary print statements and code review can also help locate a fault.

Testing compares behaviour with an expected result. Unit testing checks an individual component. Integration testing checks the interaction between components. System testing checks the complete application. Acceptance testing checks suitability for the intended user, often with user participation. For a library application, a loan-date function can be unit tested, borrowing and inventory can be integration tested, and a librarian can check an end-to-end borrowing task during acceptance testing.

Finding a fault is not the same as fixing it. After a correction, run the relevant check again. Do not claim that a few successful examples prove the absence of every possible fault. This theory remains in Chapter 1; the ALP exclusion of Python section 2.10 does not delete Chapter 1 section 1.7.`),
 t('1.8','Editors, translators, IDEs and repositories',[16,17],`A language editor helps write and change program text. A translator makes source instructions executable in the required environment. At the textbook's comparison level, a compiler translates a whole program, while an interpreter processes source during execution. A debugger helps investigate faults and inspect program state.

An Integrated Development Environment combines development tools through one interface. The book gives Visual Studio and PyCharm as examples, while code editors include Notepad++ and VS Code. An IDE is not the programming language itself.

An online computing platform is accessed through a network; an offline development environment is installed locally. A source-code repository stores project history and supports sharing changes. The book gives GitHub and Bitbucket as examples. A repository and a text editor serve different purposes: saving text in an editor alone does not provide the repository's change history and collaboration features.

For a written answer, explain the purpose before giving an example. Naming a product without explaining whether it edits, translates, investigates or stores code is incomplete.`)
 ],
 short:[
 a(1,'Differentiate functional and non-functional requirements.','Functional requirements specify operations the system must provide, such as registering a user or recording a loan. Non-functional requirements specify qualities or constraints, such as response time, usability, reliability or access control. The first describes what is done; the second describes the required standard or condition under which it is done.',[3,4]),
 a(2,'Why is the testing phase important? Give two reasons.','Testing compares the implemented software with its requirements. First, it exposes faults before the software is relied on by users. Second, it checks whether features and quality requirements, including performance or compatibility, are met. A correct-looking interface alone is insufficient evidence that the underlying functions work.',[4,5]),
 a(3,'Explain continuous integration and its importance in Agile development.','Continuous integration brings developers\' changes into a shared code base regularly and checks them together. It helps the team discover incompatible changes early, rather than waiting until many separate pieces are finished. For example, a changed borrowing function is checked with the inventory component when it is merged.',[7]),
 a(4,'Explain the main steps and importance of project risk management.','Identify possible problems, assess their likelihood and effect, prioritise them, plan a response and monitor them during execution. For example, limited access to a client may delay requirement confirmation, so agree a review schedule early. Risk planning makes uncertainty visible and provides a response before the problem disrupts the project.',[8,9]),
 a(7,'Describe the Factory pattern and compare it with direct object creation.','A Factory centralises the creation of the appropriate type of object. A caller requests a notification sender, for example, and the factory supplies the selected sender type. With repeated direct creation, every caller may need to know and repeat those creation details. Centralising the decision improves consistency and makes a change easier to manage.',[13,14])
 ],
 long:[
 a(2,'How would you manage a simple mobile-app project using Agile?',`Begin with the users and their needs. For a school attendance app, interview teachers and list the core functions: select a class, record attendance and view a report. Add quality requirements such as readable screens and controlled access. Prioritise the requirements so that the first delivery solves a useful, limited problem.

Plan a short cycle around a small working increment. In the first cycle, implement class selection and basic attendance entry. Assign tasks, estimate the work and agree how the increment will be checked. Developers integrate changes regularly and test both individual functions and their interaction.

Show the working increment to teachers and collect specific feedback. If the class-selection process is confusing, revise it in the next cycle rather than expanding an unsuitable design. Plan the next increment, such as a summary report, from the updated priorities. Continue to monitor cost, time, quality and identified risks.

Before release, check the complete application and obtain user acceptance. Deploy it in the intended setting and maintain it after release. Agile supports revision and frequent feedback; it does not mean starting without requirements or releasing untested code. The answer should connect planning, a working increment, feedback and a following cycle.`,[5,6,7,8,9]),
 a(5,'Explain the importance of software-development tools, with examples.',`Software-development tools support the work of creating, checking and maintaining a program. A language editor provides a place to enter and revise source code; the book's examples include Notepad++ and VS Code. Features that help navigate and edit code improve the practical writing process, but an editor alone is not proof that the program is correct.

A translator makes the source usable by the execution environment. At the book's comparison level, a compiler translates a complete program, while an interpreter processes instructions during execution. The book associates GCC with compiled C/C++ work and Python with an interpreter. Distinguish a translator from an editor: writing text and executing its meaning are different jobs.

A debugger helps inspect a failing program. It can pause or step through execution and show values so that the cause of an error can be located. GDB and the Visual Studio debugger are examples given in the book. Investigating a wrong total by inspecting the values used in its calculation is more useful than changing unrelated lines at random.

An IDE, such as PyCharm or Visual Studio, brings development tools together. Online and offline platforms provide different locations for development work. A source repository, such as GitHub or Bitbucket, stores changes and supports collaboration. Explain how the tools work together: edit the source, translate or run it, investigate faults, check the corrected behaviour and record the change in the project history.`,[15,16,17])
 ],
 exerciseMcqs:[
 q(1,'What is the main purpose of the SDLC?','Deliver suitable high-quality software within planned time and cost',['Manufacture hardware only','Choose website colours only','Replace all user requirements'],'The book connects software quality, customer needs, time and cost.'),
 q(2,'Which requirement category includes a system performance target?','Non-functional',['Functional only','A hardware part number','A variable name'],'Performance is a quality or constraint rather than a specific user operation.'),
 q(3,'What does a development framework provide?','Reusable components and a structured foundation',['A guarantee of no defects','Only a hardware inventory','A replacement for all application code'],'A framework provides common structure while developers implement the application-specific requirements.'),
 q(4,'Which specific Agile framework organises work in sprints?','Scrum',['Waterfall','A language editor','A source-code file'],'This wording separates the specific sprint framework from the broader Agile approach used in the printed exercise.'),
 q(5,'What should comprehensive planning establish first?','The scope and required tasks',['Only the screen colour','An arbitrarily large team','A reason to ignore risks'],'Planning begins with understanding the work and how it will be completed.'),
 q(6,'Which option is not one of the textbook\'s listed main cost-estimation factors?','The number of meetings held',['Development-team cost','Technology-stack requirements','Project duration'],'This is the exercise\'s distinction between its listed factors. In a real estimate, time spent in meetings can still contribute to labour cost.')
 ]
};
