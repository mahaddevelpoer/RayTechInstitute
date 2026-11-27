import {t,a,q,practice as p} from './authoring.mjs';
export default {
 number:6,
 topics:[
 t('6.1','Emerging technologies in context',[86,87,88],`An emerging technology is a developing or newly adopted tool, system or method that can change how people work. The chapter introduces artificial intelligence, cloud computing, the Internet of Things, augmented and virtual reality, 5G, quantum computing and biotechnology as examples.

AI systems can support tasks such as recognising speech or finding patterns. IoT connects physical devices so that they can exchange data; a connected thermostat illustrates the idea. AR adds digital information to a view of the physical environment, while VR creates an immersive simulated environment. The chapter introduces qubits in its brief quantum-computing overview and living organisms in its biotechnology example.

An introductory example is not a guarantee that a technology performs every task better than an existing method. Explain the application and the need it addresses. The detailed material excluded by the ALP is not brought back through this overview or its practice questions.`),
 t('6.2.1','Cloud resources, virtualisation and demand',[88,89],`Cloud computing provides access to resources such as processing, storage and applications over a network. The book emphasises convenient access, quick provisioning and releasing resources when they are no longer needed. Using a remote resource does not mean that no physical computer is involved; the location and management responsibility change.

Virtualisation allows a physical machine to support separate virtual environments. Scalability means increasing capacity to meet a larger need. Elasticity is adjusting capacity up or down with changing demand, often automatically. On-demand access means requesting resources when needed without the long setup process of acquiring a physical system first.

For a school portal with busy admission periods, additional capacity can handle a surge and be reduced after the surge ends. These concepts are related but different: convenient access does not itself describe automatic resizing, and adding permanent capacity is not the same as adjusting to each changing load.`),
 t('6.2.2','IaaS, PaaS and SaaS',[89],`Cloud service models describe what is supplied and what the user manages.

| Model | Provided service | Main user focus |
| --- | --- | --- |
| IaaS | Computing infrastructure such as virtual machines, storage and networking | Manage the required operating system and applications |
| PaaS | A development and deployment platform | Build and deploy application code |
| SaaS | A ready-to-use hosted application | Use and configure the application within the supplied features |

The book gives rented virtual servers as an IaaS example, Google App Engine as a PaaS example and hosted productivity applications as SaaS examples. These names illustrate categories; the notes do not recommend buying a service or claim that every product from a provider belongs to only one category.

Compare the responsibility boundary, rather than merely memorising three abbreviations. PaaS reduces platform-management work for an application developer; SaaS gives an end user an already provided application. The provider still operates underlying resources.`),
 t('6.2.3-6.2.4','Deployment models',[90,99],`A public cloud makes provider-managed services available to multiple customers. A private cloud is used exclusively by one organisation. A hybrid arrangement combines public and private environments. A multi-cloud arrangement uses services from multiple providers.

The retained exercise also names a community cloud: organisations with shared concerns use a shared cloud arrangement. Distinguish this from a private environment used by one organisation and from a broadly available public service.

| Arrangement | Distinguishing feature |
| --- | --- |
| Public | Provider services available to multiple customers |
| Private | Exclusive organisational use |
| Hybrid | Combination of public and private environments |
| Multi-cloud | More than one provider |
| Community | Shared concerns of a defined group of organisations |

Choose a model according to control, integration, data needs, resources and cost. Exclusive use does not by itself prove perfect security; appropriate configuration and access controls still matter. Likewise, a public service is not automatically unsuitable for every sensitive workload. The textbook's short comparison should be read with its separate security and responsibility discussion.`),
 t('6.3','Cloud applications and responsibilities',[90,91,92],`The chapter describes storage and backup, web hosting and content delivery, and AI-related processing as cloud applications. Remote storage can support sharing and access from different locations. Hosting supplies resources for delivering an application or website. A content delivery network can cache content closer to users.

Cloud use also requires managing access, security, resources and costs. The book mentions encryption, strong authentication and reviewing security policies. A provider's controls do not remove the user's responsibility to protect accounts or configure access appropriately.

Monitor resource usage so that unused capacity and unnecessary spending can be identified. Adjusting capacity is helpful only if it matches actual requirements. Organisations must also consider the applicable data and regulatory requirements for their activity; this chapter's overview is not a substitute for a current jurisdiction-specific legal assessment.

Section 6.3.2.4 remains included on page 92 before the excluded section 6.4 begins. The practice here concerns the retained cloud concepts and does not teach the deleted distributed-ledger topics.`),
 t('6.6.1','Edge computing and serverless architecture',[97,98],`Edge computing places processing closer to the source of data. This can reduce the delay caused by sending every reading to a distant central system. The book's autonomous-vehicle example processes sensor information locally to support a prompt response. Other examples involve monitoring and industrial devices needing timely decisions.

A serverless architecture lets a developer run application work without provisioning and managing the underlying servers directly. The provider supplies and allocates the computing resources. Serverless does not mean that execution happens without a server; it changes the developer's management responsibility.

Potential advantages include concentrating on application code, allocating resources according to demand and usage-based charging. Actual costs depend on the workload and service, so neither the architecture nor the word cloud promises free operation.

The ALP explicitly removes the textbook's long question 4 while retaining the section and short questions about serverless architecture. This guide includes the retained theory and short answers but does not reproduce that deleted long exercise. The printed short-question numbers have gaps; the original numbers are preserved below.`)
 ],
 short:[
 a(3,'What is edge computing and how does it help data processing?','It processes data nearer its source instead of sending every operation to a distant central system. Reducing that travel can reduce latency and support timely responses. In the book\'s vehicle example, locally processing sensor readings helps the system respond to changing road conditions.',[98]),
 a(4,'Describe serverless architecture.','It allows developers to run application work without directly provisioning and managing the underlying servers. A provider allocates and operates the resources. The name does not mean there are no servers; it identifies the management responsibility and allocation model.',[98]),
 a(6,'What advantages can serverless architectures offer developers?','They reduce direct server-management work and let developers focus on application code. Resource allocation can follow demand and charging may follow actual usage. These are potential benefits rather than a guarantee that every workload is cheaper or free.',[98,100]),
 a(8,'How can edge computing help an autonomous vehicle?','Processing sensor and camera data locally can reduce the delay of communicating with a distant data centre for every immediate decision. The book uses this as an example of placing processing close to its data source to support timely responses.',[98]),
 a(9,'Differentiate elasticity and on-demand access.','Elasticity adjusts capacity up or down as demand changes. On-demand access lets a user request computing resources when needed without a lengthy acquisition process. A service can provide quick access without that phrase alone describing automatic scaling.',[88,89])
 ],
 long:[
 a(1,'Define and compare cloud deployment models.',`Cloud deployment models describe how cloud resources are made available and used. Public services are supplied by a provider to multiple customers. A private cloud is reserved for one organisation, whether hosted internally or managed externally. A hybrid arrangement combines public and private environments, while multi-cloud uses several providers.

Compare the intended control, sharing, integration, data requirements and resources. A bank might reserve an environment for particular organisational needs while using a public service for another suitable activity. Such an example describes a design choice; exclusive use does not itself guarantee secure configuration.

Hybrid and multi-cloud are not synonyms. Hybrid describes the combination of public and private environments; multi-cloud describes the use of more than one provider. A community cloud, named in the retained exercise, is shared by organisations with common concerns.

The choice depends on the actual requirements rather than the claim that one model is always best. Consider responsibility for access control, continuity, monitoring and spending alongside the deployment arrangement.`,[90,91,92,99]),
 a(2,'Classify and compare cloud service models.',`IaaS provides infrastructure such as computing instances, storage and networking. The customer is responsible for the required operating system and applications within that supplied environment. A rented virtual server is a useful illustration.

PaaS provides a platform for developing and deploying applications. Developers focus on their code and the application's operation rather than building and managing every underlying platform layer. The textbook names Google App Engine as an example.

SaaS provides an already hosted application for end users. A hosted productivity application illustrates this category: the user works with its available features while the provider manages the supplied application service.

Use a responsibility comparison in the answer. Infrastructure, an application platform and a finished application are different service levels. A provider may offer several kinds of product, so the brand name alone is not a complete classification. These categories explain the service boundary rather than promising particular prices or a universally superior choice.`,[89]),
 a(3,'Explain edge computing and its benefits.',`Edge computing moves some processing near the place where data are produced. A vehicle, monitoring device or industrial sensor may need a response before a remote round trip is suitable. Processing the relevant data locally can reduce latency and limit the need to send every raw reading to a distant centre.

The textbook's vehicle example uses local processing of sensor and camera information to support prompt decisions. Similar reasoning applies where the usefulness of a result depends on how quickly it can be acted on.

Explain the mechanism as well as the benefit: a shorter communication path can reduce travel delay. This does not mean that edge and cloud systems cannot be used together. A system may make an immediate local decision and use a central service for other tasks.

Choose the design according to the application and its data requirements. The relevant retained concepts are proximity to the source, reduced latency and timely processing. Avoid presenting every emerging technology as automatically better for every task.`,[98]),
 a(5,'Describe cloud deployment models with examples.',`A public-cloud example uses a provider's generally offered resources, such as a rented service for hosting a website. A private-cloud example reserves a cloud environment for one organisation's work. The organisation's exclusivity and required controls distinguish the arrangement.

A hybrid design combines a private environment with suitable public services. A multi-cloud design uses services from more than one provider for the organisation's needs. A community arrangement serves a defined set of organisations sharing concerns, as stated in the retained exercise.

For each example, identify which characteristic makes it fit the model. Do not simply list product names without describing the arrangement. More than one provider establishes multi-cloud, while combining public and private establishes hybrid.

Include the practical responsibilities: control access, monitor usage, protect important data and consider applicable requirements. The same workload should be evaluated against its actual needs; a category name alone is not proof of security or a promise of a fixed cost.`,[90,91,92,99])
 ],
 exerciseMcqs:[
 q(1,'What is the main benefit highlighted for edge computing?','Reduced latency',['A guarantee of no security work','A requirement to send every operation to a distant server','Automatic correctness of every decision'],'Processing nearer a source can reduce communication delay.'),
 q(2,'Which cloud arrangement serves organisations with common concerns?','Community cloud',['A single-organisation private cloud only','A personal list of local files','An unrelated offline application'],'The retained exercise identifies the shared-concern arrangement as community cloud.'),
 q(4,'Which arrangement combines public and private cloud environments?','Hybrid cloud',['Public-only cloud','Private-only cloud','A single offline device'],'Hybrid refers to combining the two environments.'),
 q(6,'Which service model provides an application development platform?','PaaS',['IaaS only','SaaS for an end user only','A local keyboard driver'],'PaaS focuses on the platform for building and deploying applications.'),
 q(7,'Which architecture lets developers run code without directly managing servers?','Serverless architecture',['A personally managed physical server','A requirement for manual hardware installation for each request','A disconnected storage device'],'The provider manages and allocates the underlying resources.'),
 q(9,'Which benefit does the exercise associate with serverless architecture?','Potential cost savings through suitable resource use',['Constant manual server management','A requirement for more owned hardware','Manual scaling for every request'],'The benefit is workload-dependent; usage-based service does not guarantee free operation.')
 ],
 practice:[
 ...p('6.1',[86,87,88],[
 ['What makes a technology emerging in the chapter\'s sense?','It is developing or newly adopted with potential new uses',['It must be the oldest tool available','It cannot affect working practices','It is guaranteed to replace every existing method'],'The chapter introduces developing tools and methods rather than a universal replacement rule.'],
 ['Which example illustrates the Internet of Things?','A connected thermostat exchanging readings',['A paper-only attendance list','A calculator with no connection in the stated example','A handwritten chart alone'],'IoT connects physical devices that exchange data.'],
 ['How does AR differ from the VR example?','AR overlays digital elements on a physical view; VR creates an immersive simulated environment',['AR and VR are both only spreadsheet formulas','VR means a remote storage folder','AR always removes the physical view completely'],'The distinction concerns the represented environment.'],
 ['Which field in the overview uses living organisms to develop products or solutions?','Biotechnology',['A queue operation','A source-code repository','A display-only chart axis'],'The book connects biotechnology with organisms, crops and medicines.']]),
 ...p('6.2.1',[88,89],[
 ['What does virtualisation allow in the book\'s example?','Separate virtual environments on a physical machine',['A machine to work without any underlying resources','A list to become automatically sorted','A file to become a survey'],'The physical system supports multiple virtual environments.'],
 ['Which term describes adjusting capacity up and down with changing demand?','Elasticity',['Only a fixed file format','A requirement to keep maximum capacity forever','A chart title'],'Elasticity follows changing resource needs.'],
 ['What does on-demand access emphasise?','Obtaining resources when needed without a long setup delay',['Automatic elimination of all costs','Removal of every server','A guarantee of infinite capacity'],'Convenient provisioning is different from a claim of unlimited resources.'],
 ['Which term describes increasing capacity to handle a larger workload?','Scalability',['A median','A copyright notice','A stack pop'],'Scalability concerns the ability to increase resources or capacity.'],
 ['Which statement correctly separates on-demand access and elasticity?','Quick access and adjustment to changing load are related but distinct',['Both mean there are no physical computers','Neither concerns resource availability','Both guarantee a fixed charge of zero'],'The book gives separate definitions for these concepts.']]),
 ...p('6.2.2',[89],[
 ['Which service model supplies infrastructure such as virtual machines?','IaaS',['SaaS as an end-user application only','A spreadsheet median','A printed questionnaire'],'IaaS provides the infrastructure level.'],
 ['Which model is most directly aimed at deploying an application on a supplied platform?','PaaS',['A paper-only record','A queue waiting line','Only a finished end-user application'],'PaaS supplies the application platform.'],
 ['A ready-to-use hosted productivity application illustrates which model?','SaaS',['Only a personally managed bare server','A sorting technique','A data-collection experiment'],'SaaS provides software for end users.'],
 ['In an IaaS example, which responsibility remains with the user?','Managing the required operating system and applications',['Manufacturing the provider\'s physical servers','Writing every cloud product offered','Removing all need for access control'],'The supplied infrastructure and the customer-managed software are distinct.'],
 ['Does a provider name alone establish one service model for all its products?','No; classify the particular service supplied',['Yes, every provider offers exactly one kind','Yes, the logo determines the responsibility boundary','Only if its name has three letters'],'The same provider can offer services at several levels.']]),
 ...p('6.2.3-6.2.4',[90,99],[
 ['Which deployment model is reserved for one organisation?','Private cloud',['A generally offered public service by definition','An unrelated customer queue','Every multi-provider arrangement'],'Exclusive organisational use identifies the private model.'],
 ['Which arrangement combines public and private environments?','Hybrid cloud',['Private-only cloud','Public-only cloud','A local single file'],'The combination is the defining feature.'],
 ['What establishes a multi-cloud arrangement?','Using more than one cloud provider',['Only using two variables','Always having exactly one private machine','Removing every network connection'],'Multi-cloud concerns the number of providers.'],
 ['What distinguishes the retained exercise\'s community-cloud example?','A group of organisations shares common concerns',['Only one individual can ever use it','It cannot involve managed computing resources','It is defined by sorting data into ascending order'],'The community shares a concern or purpose.'],
 ['Does exclusive private-cloud use alone guarantee perfect security?','No, suitable configuration and controls still matter',['Yes, every misconfiguration becomes harmless','Yes, no account protection is needed','Only if monitoring is disabled'],'The chapter separately identifies security responsibilities.']]),
 ...p('6.3',[90,91,92],[
 ['What does cloud storage provide in the chapter\'s example?','Remote storage and access to files',['A guarantee that every file is public','An automatic replacement for all access controls','Only an offline notebook'],'The files are stored on remote resources and can be accessed under the service\'s permissions.'],
 ['How can a CDN help deliver website content?','Cache suitable content closer to users',['Delete every origin copy','Turn every request into a survey','Remove the need to identify the requested file'],'The book describes caching near end users.'],
 ['Which action helps protect a cloud account?','Strong authentication and appropriate access settings',['Sharing its password widely','Ignoring permissions','Publishing every private token'],'The chapter identifies user-side security responsibilities.'],
 ['Why monitor cloud resource usage?','To identify unnecessary capacity and control spending',['To prove every workload is free','To prevent all legitimate users from connecting','To replace the application requirements'],'Usage monitoring supports resource and cost management.'],
 ['Which statement best reflects the chapter\'s security discussion?','The provider and user have responsibilities',['Only the provider ever needs to act','Only the user operates all physical infrastructure','No data can ever be lost in a cloud service'],'Provider controls do not remove customer configuration and account duties.']]),
 ...p('6.6.1',[97,98],[
 ['Where does edge computing place relevant processing?','Near the data source',['Necessarily in the most distant centre','Only on a printed sheet','Always in a different country'],'Proximity can reduce a communication round trip.'],
 ['Which need best suits the book\'s edge-computing example?','A prompt response to a local sensor reading',['A requirement to delay every response','Only printing an unused file name','A task with no data source at all'],'The vehicle example needs timely local processing.'],
 ['Does serverless mean there are no servers?','No, the provider manages underlying resources',['Yes, computing occurs without any resources','Yes, all processing is handwritten','Only if the application has a short name'],'The management boundary changes, not the existence of computing hardware.'],
 ['What can a developer focus on in the serverless model?','Application code rather than direct server provisioning',['Manufacturing a new server for each request','Replacing every network cable','Ignoring the application\'s purpose'],'The provider handles the underlying allocation and operation.'],
 ['Does usage-based charging guarantee zero cost?','No',['Yes, for every workload','Yes, if the word cloud is used','Only when monitoring is disabled'],'Actual cost depends on usage and service terms.'],
 ['Can edge and central cloud processing be combined in one system?','Yes, different tasks can be placed appropriately',['No, selecting one forbids any other computing','Only if the system stores no data','Only if every result is a chart'],'Immediate local responses and other central work can serve different needs.']])
 ]
};
