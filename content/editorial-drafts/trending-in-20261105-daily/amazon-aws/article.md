Amazon Web Services, usually shortened to AWS, provides cloud computing services. It is different from the shopping website a customer uses to order a book. Understanding that distinction helps students follow technology news without confusing a retail transaction, a cloud workload and a quotation for Amazon shares.

This guide was reviewed on 5 November 2026. It follows a fictional school photo archive to explain compute, object storage, permissions, traffic and recovery. It does not require creating an AWS account, activating billing or uploading real photographs. All calculations are classroom examples, not current prices or promises about a particular service.

## What is cloud computing in practical terms?

Cloud computing lets an organisation obtain computing capabilities as services rather than operating every underlying physical resource itself. The useful question is which capability a project needs. Running an application, saving objects and deciding who may read a file are connected tasks, but they are not an identical service.

For our fictional archive, visitors see approved pictures from a school science exhibition. Teachers upload new pictures for review. An administrator publishes selected images, while rejected submissions remain private. This small scenario already contains public content, private content, different users and a publishing process. It therefore needs more planning than simply finding somewhere to put files.

Draw four boxes labelled visitor, application, approved files and review queue. Add arrows showing the permitted movement of information. An arrow from every visitor directly into the private review queue would be a warning sign. The drawing helps students reason about access before choosing any vendor's implementation.

## What does an EC2 instance do?

Amazon describes an EC2 instance as a virtual server. It supplies computing capacity on which software can run. The selected instance type determines a balance of resources, and the person operating the workload still makes important choices about software, configuration and access. A server is not an automatic application designer.

In the archive exercise, an application might validate submissions and prepare approved image sizes. That describes computational work. A virtual server is one possible place to run it, but explaining the job does not establish that this is the best or cheapest architecture. Other service models may suit different requirements.

Consider a student who installs an application but forgets to restrict its editing endpoint. The problem is not solved merely by saying the application runs in a cloud. Public access to an administrative action is an application-design concern. The same reasoning applies whether the underlying computer is local or remotely provided.

## What is S3 object storage?

Amazon S3 is an object storage service. An object includes stored data and associated information, and objects are organised within buckets. An object key identifies an object in that structure. This differs from thinking of the service as an ordinary desktop folder with exactly the same behaviour as a local disk.

For the archive, an approved photograph might have a key such as exhibition/approved/model-bridge.webp. That is a fictional identifier, not a live endpoint. An application's catalogue could separately record the photograph's title, caption, creator and publication state. The photograph and the catalogue record serve related but different purposes.

Do not put private information in a public object name. Even when a link looks difficult to guess, naming is not a substitute for permission checks. A clear design specifies who may read, create, replace and delete each category of object. Obscurity can disappear as soon as someone shares a link.

## Why are public images and private uploads separate?

A published exhibition photograph is intended for visitors. An unreviewed submission may include content that should never become public. Combining both without a reliable publication boundary can expose the review queue. A safe learning model marks an item public only after a deliberate approval step has completed.

Use coloured index cards for a classroom simulation. Grey cards represent submissions, green cards represent approved content and red cards represent rejected items. Ask one student to act as a visitor and another as a teacher. If the visitor can inspect every grey card, the model's permissions do not match the stated requirement.

The exercise is about information flow, not about publishing real children's photographs. Consent, institutional policy and appropriate handling of personal information require separate consideration. For practice, use invented illustrations or approved public-domain images and fictional names. A convenient storage tool does not decide whether a school has permission to publish a picture.

## What does shared responsibility cover?

AWS describes security responsibilities divided between the provider and its customers. The boundary depends on the service. Operating physical infrastructure differs from configuring an application's access rules, protecting account credentials or deciding which data belongs in a public bucket. These activities need explicit owners.

For the archive, assign responsibility for approving photographs, removing departed teachers' accounts, checking logs and restoring accidentally deleted records. Then ask which tasks remain if a managed service takes over more infrastructure work. Content approval and correct user access do not disappear simply because fewer operating-system settings are visible.

An account credential should never be included in a public browser bundle or a downloadable lesson file. Students should learn the distinction between a public address and a credential that authorises changes. Publishing a secret and later hiding the page does not reliably recover its confidentiality; exposed credentials need appropriate replacement.

## How do storage and downloads differ?

Storage measures information retained, while data transfer measures information moved. A single file can be downloaded repeatedly without its stored size increasing. This distinction explains why a website containing relatively few images can still deliver a large quantity of data when many people view those images.

Suppose the fictional archive contains one hundred images, each one megabyte. Ignoring metadata and other files, the stored image collection is one hundred megabytes. If one visitor downloads all one hundred images, the image transfer is another one hundred megabytes. Ten complete uncached visits would transfer one thousand megabytes under the same assumptions.

Those numbers are not AWS prices or a complete traffic estimate. Real delivery can involve caching, different image sizes, partial visits and protocol overhead. The calculation teaches the relationship between file size, visits and delivery. Current service pricing must be applied separately, using the quantities that the selected service actually charges for.

## Can smaller images make a meaningful difference?

Image optimisation can reduce the amount transferred when it preserves the needed visual quality at a smaller size. The appropriate dimensions depend on how the image is displayed. Sending a very large original for a small thumbnail can waste data, although the actual saving should be measured using the resulting files.

Use a fictional comparison: a card displays an image at three hundred pixels wide, but the original is several thousand pixels wide. Make a suitable derivative, inspect text and details, and compare its actual byte size. Do not assume that a file extension alone guarantees either good quality or a specific compression ratio.

Keep original rights and attribution information with the archive record. Compression does not remove a licence requirement. A technically efficient file can still be inappropriate to publish if permission is missing. Performance, accessibility and legitimate reuse are separate checks that all belong in a professional publishing process.

## What is a request, and why count it?

A request is an interaction with a service, such as asking for an object. Counting requests helps explain activity patterns, but it is not identical to counting visitors. One visitor can trigger many requests, and different application designs can produce different request counts for the same visible page.

Imagine a fictional page with a document and twelve separately loaded images. An uncached visit may involve more than one request. If the visitor reloads repeatedly, the browser's caching behaviour affects what reaches the server. A request estimate therefore needs a description of the page and its caching assumptions.

For a practical offline exercise, list the files a page needs and mark which are shared across several pages. This makes repeated resources visible. Students can then discuss how reuse, caching and image sizing influence delivery without running a traffic experiment against a real service or creating an unexpected bill.

## Is deleting a file the same as recovering from a mistake?

Deletion and recovery are different operations. An archive needs a plan for accidental replacement, unwanted publication and legitimate removal. S3 offers features that can support lifecycle and version-management designs, but enabling a named feature does not by itself prove that the whole application's recovery requirements have been met.

Use three paper states: a correct caption, an accidentally replaced caption and a restored caption. Ask which earlier information must remain available to produce the restoration. Also ask what should happen when an authorised owner deliberately removes an image. Recovery retention and removal obligations can create different requirements that must be reconciled carefully.

A recovery plan should include a test. It is more informative to restore one fictional item successfully than to rely on an untested statement that backups exist. Record what was restored, which version was used and what information would have been lost under the exercise's assumptions.

## How can a student practise safely?

Start with a local folder, a small metadata file and invented image names. Build a page that reads only records marked published. Then test whether a draft record appears accidentally. This teaches the archive's core publishing rule before any cloud-specific configuration is introduced.

If a teacher later authorises online practice, review current account terms, spending controls and cleanup procedures first. Do not assume that an old tutorial's free allowance applies today. Avoid uploading real private records, and never share account tokens in a classroom chat. Learning should not depend on giving everyone unrestricted control of a production account.

Our [programming courses](/courses/) and [study resources](/classes/) provide a starting place for learning the application concepts. The goal is to understand what should happen when a user submits, reviews and reads content. Choosing a cloud service comes after those behaviours are clear.

## How does this relate to Amazon share-price searches?

AWS is relevant to understanding Amazon's business, but cloud-product knowledge cannot replace a current financial quote. A price observation requires an exchange, currency and timestamp. Revenue, operating results and share prices are different quantities with different reporting periods. They should not be combined into a single unsupported claim about performance.

Use Amazon's investor materials for published business disclosures. If comparing periods, read the reporting definitions and dates before calculating a change. An original classroom worksheet can separate a product description, a historical business figure and a hypothetical market-price example. That separation keeps an educational article from implying investment advice or real-time market coverage.

## Quick questions for checking understanding

Is an S3 object automatically an application database row? No. An application may connect object storage with structured records, but the roles differ. Explain which part stores the photograph and which part records its publication state, caption and creator in the fictional archive.

Can a visitor count alone predict cloud costs? No. File sizes, requests, caching, service choices and charging rules matter. Show the assumptions in any estimate and keep hypothetical prices out of a real invoice discussion. An honest range is more useful than a precise number built from missing inputs.

Does a working public page prove private submissions are protected? No. Test the private path separately using authorised fictional data. A successful visitor experience checks only one part of the system. Correct publishing boundaries, permissions and recovery behaviour require their own evidence.

## Trace one image through the complete archive

Choose an invented image named bridge-model and write down each state: submitted, reviewed, approved, published and later corrected. For each transition, name the authorised person and the information that changes. A corrected caption may require updating a catalogue record without replacing the image itself. A replacement image may need both operations.

Then ask what happens if publication stops halfway through. The public page should not claim that an image exists before the approved asset is available. Write a recovery action for that fictional failure and check that it does not expose rejected submissions. This small exercise connects storage with application behaviour, showing why a list of cloud products is not a complete publishing design.

## Sources

- [AWS: EC2 concepts](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html)
- [AWS: what Amazon S3 is](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)
- [AWS: shared responsibility model](https://aws.amazon.com/compliance/shared-responsibility-model/)
- [Amazon investor relations](https://ir.aboutamazon.com/)
