Microsoft Azure is a cloud platform, not a synonym for Windows, a subscription to an office application, or a single machine somewhere on the internet. The most useful starting question is what work a service performs and which responsibilities remain with the person using it. That approach makes product names easier to understand and prevents expensive misunderstandings.

This educational guide was reviewed on 5 November 2026. It explains cloud concepts through a fictional school project, rather than supplying a live Microsoft share price or a recommendation to purchase services. All quantities in the classroom examples are invented. Current availability, prices and contractual commitments must be checked for the particular service and region.

## What does Azure actually provide?

Think of an application as several connected jobs. Something presents the page, something executes instructions, something stores files, and something decides who may access private information. A cloud platform provides services that can perform these jobs without requiring the application owner to purchase and maintain every underlying physical machine.

The word cloud describes a way of providing and consuming computing resources. It does not mean that physical hardware has disappeared. Servers, networks, buildings and power supplies still exist. What changes is the interface through which customers obtain resources and the division of operational responsibilities between the provider and the customer.

Draw a fictional school library application on paper. Label the browser, application logic, catalogue records, book-cover images and administrator account. These are different concerns, even if a small demonstration initially places several of them together. Naming the concerns first is more useful than choosing the longest list of products.

## How do IaaS, PaaS and SaaS differ?

Infrastructure as a service gives the customer substantial control over computing infrastructure exposed as a service. A virtual machine is a familiar example. Platform as a service manages more of the underlying environment while customers deploy their applications. Software as a service provides an application that people use and configure.

Microsoft's shared-responsibility documentation places Azure Virtual Machines, Azure App Service and Microsoft 365 in these different categories. The categories are a starting framework, not a complete security specification. A real application may combine several models, and the documentation for each selected service determines which settings the customer must operate.

For the library exercise, make three columns: manage a virtual server, deploy application code, and use a finished library application. Under each column, list who updates the operating system, who decides which teachers are administrators, and who chooses which records become public. The final two questions remain important even when more infrastructure is managed.

## Is a virtual machine a whole physical computer?

A virtual machine presents computing resources through a software-defined environment. It can run an operating system and applications, but it should not be imagined as a promise that a particular physical box belongs exclusively to the customer. The exact isolation, resources and service terms depend on the chosen offering.

In a classroom analogy, a building can contain several separately controlled rooms. The analogy helps explain separate environments, but it is incomplete: computing isolation is implemented through technical controls, not classroom walls. Avoid taking the metaphor so literally that it becomes a security guarantee or a description of actual Azure infrastructure.

An application running on a virtual machine still needs configuration. A database password placed in a public page remains exposed regardless of where the machine runs. A service may provide strong infrastructure capabilities while the application's own permission rules remain incorrect. Infrastructure location alone cannot establish application safety.

## Why separate files, records and secrets?

A book-cover photograph is a file. A catalogue entry linking a title to its author is a structured record. A credential that permits administrative changes is a secret. Treating all three as interchangeable content makes permissions harder to reason about and increases the chance that private material will be delivered publicly.

For our fictional library, public images may be readable by visitors, while borrowing history should have restricted access. Administrative credentials should not be included in the browser's downloadable application bundle. The useful distinction is who needs each piece of information, not whether a developer considers the filename difficult to guess.

Create a small access table with visitors, students and librarians as rows. Add cover images, personal borrowing history and catalogue editing as columns. Mark each permitted action explicitly. A blank or uncertain cell is a design question to resolve, rather than an invitation to grant everyone administrative access temporarily.

## What does shared responsibility mean?

Shared responsibility means the provider and customer have different operational duties. Microsoft describes responsibilities that change across service models and responsibilities customers retain, including their information, identities and access decisions. Buying a managed service does not transfer every decision about the application to the cloud provider.

Consider two separate mistakes. A physical server needs maintenance, and a librarian accidentally makes a private report public. Those problems involve different layers. A provider's work on infrastructure does not automatically correct the report's access setting. Understanding the layers helps identify the right control instead of assuming that cloud hosting solves everything.

For the library exercise, assign an owner to account recovery, content approval, application updates and restoring accidentally deleted records. A named owner is more useful than the word secure written beside a diagram. Ownership should also survive staff changes; one person's departure should not make the whole system unmanageable.

## How can usage create a bill?

Cloud services can measure different activities separately. Computing time, stored data, requests and data transfer are examples of quantities an application owner may need to examine. The applicable charging rules depend on the service. A low storage quantity does not prove that the total bill must also be low.

Imagine a fictional exercise with a two-megabyte image requested five thousand times. Ignoring caching, compression and protocol overhead, multiplying gives ten thousand megabytes of transferred image data. This is an arithmetic model, not an Azure invoice. It shows why storing one image and repeatedly delivering that image are different measurements.

Now suppose a browser reuses a cached copy for some visits. Requests reaching the origin may decrease, but the actual result depends on cache behaviour and expiry. A sensible estimate states its assumptions instead of presenting a visitor count as an exact bill. Check current pricing before converting any quantity into money.

## Does scaling automatically fix a slow application?

Scaling changes the resources or number of workers available to a system. It can help when the limiting factor is addressed, but it does not guarantee that every application becomes fast. A slow database query, an unnecessarily large image and a client-side script can each require a different response.

Use an invented queue: one worker completes five requests per second while eight arrive per second. Under those simplified constant conditions, the waiting queue grows. Adding an independent worker could help if the work can be shared. It will not necessarily help if both workers wait on the same overloaded dependency.

Measure the stage that takes time before changing infrastructure. For the school library, ask whether the browser waits for an image, an application response or a database operation. That evidence guides the next investigation. A colourful infrastructure dashboard is useful only when its measurements answer a specific performance question.

## Are backups and replication the same thing?

Replication concerns maintaining copies across a defined arrangement. A backup supports recovery according to its retention and restoration design. Multiple copies can all reflect an accidental deletion if that deletion is propagated. Therefore, counting copies alone does not establish that yesterday's correct records can be recovered.

For a paper exercise, write a correct catalogue on Monday and accidentally replace it on Tuesday. Ask which copy a replication process would contain after synchronisation. Then ask whether a separately retained Monday version exists and whether anyone has tested restoring it. These questions reveal the difference between availability and historical recovery.

A recovery plan also needs an acceptable amount of lost work and an acceptable restoration delay. Those are planning decisions, not figures this guide can choose for every institution. Keep the exercise fictional until an authorised owner has defined the real application's requirements and approved a suitable implementation.

## How should a student learn without creating unnecessary costs?

Begin with diagrams, documentation and local examples. A conceptual lesson does not require opening paid resources. When a course does use an online service, review eligibility, resource limits and billing behaviour before creating anything. An offer described as free may have conditions that differ across accounts or change over time.

Use invented records rather than real student identities while learning. Write down what will be created, how success will be measured and how resources will be removed afterwards. Do not paste access keys into shared notes, screenshots or public repositories. A tutorial's convenience does not justify exposing an actual account.

For the library project, a local list of five fictional books can demonstrate filtering and permissions without a production deployment. Students can explore broader [programming courses](/courses/) before deciding which part truly needs a hosted service. This keeps the learning objective separate from the number of products activated.

## How does Azure relate to Microsoft share-price searches?

Azure is part of understanding Microsoft's business, but a technical explanation is not a live financial quotation. A share price needs its exchange, currency, timestamp and trading-session context. A product announcement or an application's success cannot be converted directly into a guaranteed movement in a company's share price.

When researching the company, separate official business disclosures from market observations and personal interpretations. A revenue figure has a reporting period; a stock quote represents a different measurement. Microsoft's investor information is the starting place for published company reports, while any quote should be checked through a suitable current market source.

An original classroom task is to label five statements as technical fact, company disclosure, market observation, forecast or opinion. The labels expose where evidence is missing. They also prevent an attractive cloud-computing lesson from being mistaken for a personalised investment recommendation or a promise about future financial returns.

## Questions worth answering before the next lesson

Can a finished online application still have incorrect user permissions? Yes. Management of underlying infrastructure and correct access decisions are different responsibilities. Explain the difference using a public book cover and private borrowing history, rather than answering only with the name of a service model.

Does deleting a virtual machine necessarily remove every related resource? Do not assume so. Storage and other services can have separate lifecycles. In a real account, follow the product documentation and an authorised cleanup checklist. For the classroom model, show the dependencies explicitly and identify which items would remain.

Is a small demonstration enough to prove production readiness? No. It can demonstrate a concept while leaving recovery, accessibility, cost, security and operational questions unanswered. A useful next step is a short design review: describe the data, permissions, likely workload and recovery plan in ordinary language another learner can understand.

## A final design-review exercise

Imagine that the library's public catalogue must remain readable when a teacher is editing tomorrow's additions. Start by identifying two states: approved public records and unfinished changes. Now ask what a visitor should receive during editing. The answer should be the last approved version, not a partially completed record simply because it exists in storage.

Next, invent a failure: the teacher saves an incorrect author name. Decide whether the application can restore the earlier record and whether its public page will update consistently afterwards. This exposes a connection between publishing, recovery and cached content. None of those concerns is answered merely by choosing a virtual machine or managed platform.

Finally, ask a second learner to review the diagram without hearing its author's explanation. Can they identify who edits, who approves, where private information stays and what happens after an error? If not, improve the diagram and its labels. A design that can be explained clearly is easier to implement and review. This exercise requires no cloud account and creates no infrastructure charges, yet it develops several of the habits needed for responsible cloud application work.

## Sources

- [Microsoft Learn: shared responsibility in the cloud](https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility)
- [Microsoft Learn: shared responsibility for reliability](https://learn.microsoft.com/en-us/azure/reliability/concept-shared-responsibility)
- [NIST: definition of cloud computing](https://www.nist.gov/publications/nist-definition-cloud-computing?pub_id=909616)
- [Microsoft investor relations](https://www.microsoft.com/en-us/Investor/)
