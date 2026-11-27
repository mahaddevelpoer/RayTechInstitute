export const workedProject=`## A small attendance-system project

This original worked example applies retained Chapter 1 sections 1.1-1.4 and 1.6, printed textbook pages 1-9 and 13-17. It is an additional learning activity, not an official past-paper question. Section 1.5 diagrams and UML are excluded from this 2027 preparation guide.

### What problem does the project solve?

A teacher needs a consistent record of student attendance for each lesson. The proposed system records the class, date, student and attendance status, then produces a class summary. Begin by interviewing the teacher and checking the existing register. Agree the scope before writing code: entering attendance and producing a summary are included; fees, payroll and biometric attendance are outside this small project.

### Requirements and feasibility

Functional requirements describe what the system does: show the relevant student list, save a status for each student on a date and calculate a summary. Non-functional requirements describe qualities: authorised access, readable screens, acceptable response time and reliable storage. A requirement such as "easy" should be refined into an observable acceptance criterion agreed with the teacher.

Check technical feasibility against available devices and skills. Economic feasibility compares the expected benefit with development, equipment, training and maintenance costs. Operational feasibility asks whether the teacher can use the proposed workflow. Schedule feasibility asks whether the agreed scope can be delivered in the available time. Record assumptions rather than claiming success before the checks.

### Planning and risk

Break the work into requirements, screen and data design, implementation, testing, deployment and maintenance. Assign responsibilities and a realistic completion estimate. Keep a risk list: inaccurate student lists, power failure, accidental duplicate records and unauthorised access. For each risk, record its likely effect, a mitigation and the person responsible. A smaller initial scope and early feedback can reduce delivery uncertainty.

### Design and implementation

Describe the data in words or a simple table: a student identifier, lesson date and attendance status are required. Decide which authorised role can enter or correct a record. Do not use a student's name as the only unique identifier. Design the interface before implementation so the teacher can select the class and date clearly. Implement small pieces and keep their responsibilities distinct. This retained design explanation does not introduce the excluded UML section.

### Testing and acceptance

Testing remains part of the retained Chapter 1 SDLC, although the separate Chapter 2 testing section is excluded. Compare actual behaviour with agreed requirements. Use a normal record, a missing status, a duplicate student/date entry and an unauthorised correction attempt as acceptance examples. Check that a class of five students with three present and two absent produces the expected totals. Record the input, expected result, observed result and corrective action. Do not claim a test passed without actually performing it.

### Deployment and maintenance

Introduce the system to a small authorised trial group, explain the workflow and provide a way to report problems. Confirm that required records can be recovered before relying on the new system. Maintenance includes correcting defects, adapting to a changed class list and improving an agreed feature. A change request should be checked for its effect on time and cost before it is accepted.

### Choosing a development approach

A stable, well-understood specification can support a sequential Waterfall plan. When the teacher needs to review and refine the interface frequently, short Agile iterations can deliver a small useful increment and collect feedback. Scrum gives a more specific framework for organising work into sprints. The choice depends on the project's needs; one approach does not guarantee a successful result.

### A retained design-pattern example

An Observer-style relationship can notify a report view when an attendance summary changes. A Factory-style creation point can choose a suitable report output without scattering selection logic throughout the project. These are conceptual examples of the retained design-pattern section, not a requirement to implement the excluded Python object-oriented lesson. Explain the recurring design problem before naming a pattern.

### Self-check

1. Give two functional requirements and two measurable quality requirements.
2. Identify one risk and one practical mitigation.
3. Explain why testing is retained in this SDLC guide.
4. Explain how a short iteration could collect useful teacher feedback.

Suggested answers: entering a status and producing a summary are functions; agreed response time and controlled access are quality requirements. Duplicate records are a risk that a student/date uniqueness check can reduce. Chapter 1 testing is retained by the supplied ALP. A small working attendance-entry screen can be reviewed before the team builds the complete reporting workflow.
`;
