Microsoft restored Outlook, Teams, Copilot and the rest of Microsoft 365 on Saturday 14 November 2026 after a global outage that began on Thursday 12 November and lasted roughly a day and a half. The company said the cause was a technical fault introduced during an earlier network capacity upgrade, not a cyberattack and not an AI system.

## What happened and when

The first signs appeared shortly after 16:00 UTC on Thursday 12 November. Microsoft's incident record for Exchange Online, the service that runs Outlook email for businesses, schools and governments, later gave the start time as 16:17 UTC. Public reports began climbing around 17:25 GMT, and Microsoft confirmed that users in the Americas could not reach their mailboxes at about 17:54 UTC.

Within minutes, the company said users in any region could be affected. Two incident IDs were opened: EX1550543 for Exchange Online and MO1550821 for the wider Microsoft 365 suite. IT administrators across the world recognised those codes quickly, because they appeared in the admin centre alongside the status updates.

The outage did not end when the first fix was applied. Microsoft spent Thursday night and most of Friday trying to stabilise its servers. By Friday afternoon it reported broader improvements in North America, sustained improvements across much of Europe and encouraging recovery signals in Asia Pacific. It then spent Friday night clearing a backlog of delayed email before marking the incidents resolved.

Microsoft's final status updates were posted around 04:15 UTC on Saturday 14 November. The Verge reported that the company said on X at around 1 a.m. ET on Saturday that it had finished restoring service to all customers. For most users in Pakistan, the practical effect was a working day on Friday that started with unreliable email and a weekend that began with normal service slowly returning.

## Which services were affected

Outlook and Exchange Online were hit hardest. Users could not reach mailboxes through Outlook on the web, the desktop app, mobile mail apps or connected applications. Messages that did get through were often delayed by hours.

The problem spread because many Microsoft 365 features depend on the same email and calendar system. In Teams, calls, meetings and chats mostly kept working, but scheduling, viewing and editing meetings could fail. Copilot Chat might not load or answer, and Copilot could not reach work email, calendars or files. SharePoint files stayed accessible, although sharing with people outside an organisation could fail.

Microsoft also added Planner, To Do, Intune, Purview, Defender for Office 365 and Power BI to its list of affected services as the day went on. That list matters because it shows how a fault in one core service can affect products that look unrelated to email.

Organisations that hosted Microsoft services on their own servers, rather than in the cloud, were somewhat spared. That detail became part of the wider discussion about cloud concentration and business continuity.

## The cause: a network upgrade that went wrong

Microsoft's first explanation was careful. On Friday it said: "This was a technical issue not related to cyber or AI / agents. The incident was introduced by an issue during an earlier network capacity upgrade that surfaced following a recent network change."

In plain terms, a problem crept in when Microsoft added network capacity earlier, and it only showed itself after a later change to the network. The company said it had addressed the underlying issue and was restoring service to remaining customers and regions.

Charles Lamanna, Microsoft's executive vice president for Copilot, Agents and Platform, gave a more technical description on X. He said the investigation pointed to "technical challenges and failure modes (cascading failures + thundering herds at our network perimeter) that made recovery more difficult than normal". He added that Microsoft would publish a full post-mortem covering the step-by-step timeline and the repairs needed to avoid a repeat.

The Threshold, which tracked the incident closely, reported that a large number of servers had failed automated health checks and dropped out of service. That pushed their work onto the remaining servers and overloaded them. Engineers paused deployments, restarted servers, tried a different health-check method and rolled back recent configuration changes. Some servers that came back failed again.

That sequence explains why the outage lasted so long. A simple software bug can often be fixed with a rollback. A cascading failure in a global network is harder, because every fix has to be tested against a system that is already under strain.

## Why recovery took so long

Microsoft said it restored services gradually and checked stability at each stage. "Given the scale of demand, we restored services gradually, validating stability at each stage," the company said. "While this took longer, it helped ensure a stable restoration."

That approach is standard in large incidents. Bringing every server back at once can create a second wave of failures, especially when millions of users reconnect at the same time. The trade-off is that recovery feels slow to customers, who may see improvement in one region while another is still down.

The email backlog added time. Even after mailboxes became reachable, messages that had been queued during the outage had to be processed and delivered. Microsoft said it was monitoring the backlog before it considered the incident resolved.

The company also apologised. "We are deeply sorry for the disruption this incident has caused our customers and partners," it said. "We know the trust they place in our services and take that responsibility extremely seriously."

![Building 92 on the Microsoft Redmond campus](/images/editorial/trending-pk-20261115-daily/microsoft-365-outage-inline.webp)

Building 92 on the Microsoft campus in Redmond. Archive photograph, not linked to the November 2026 outage.

## The global impact

The outage affected governments, courts, healthcare services, businesses, airlines and banks in many countries. Governments including Japan, Singapore and Australia reported that some operations were affected. The UK government activated emergency measures, and the National Pharmacy Association warned customers of delays in getting medication.

NHS England said staff were enacting long-standing measures to overcome IT outages, including using paper records. Police forces in England and Wales said they were unable to receive crime reports online. Government cyber minister Baroness Lloyd of Effra said the failure mostly affected back-office functions, with contingency plans in place, but acknowledged limited reports of impact on frontline service delivery.

In India, IndiGo, Air India and Akasa Air reported disruptions to email-based customer support. Air India temporarily rerouted email services, while flight operations were not reported to have been affected. Trading firms reported delays, some companies struggled to publish earnings, and airlines warned customers about communication lags.

The outage also affected other AI chat services, according to The Independent, which reported that OpenAI's ChatGPT and Anthropic's Claude were disrupted. That detail is a reminder that many online services depend on shared infrastructure, even when they are not Microsoft products.

## The numbers behind the outage

Downdetector, the outage tracker owned by Ookla, recorded more than 7.4 million reports worldwide over the course of the incident. Reports peaked at nearly 20,000 a minute, more than 1,500 times normal levels. The tracker received reports from more than 70 countries and territories, with one count putting the figure at 74 within the first hour.

At the first peak on Thursday, Downdetector logged more than 129,000 Outlook reports. The Independent reported more than 130,000 Outlook reports in the US at its peak on Thursday night. Those figures are not a count of affected users, because Downdetector relies on self-reported problems, but they show the scale and speed of the disruption.

The BBC noted that more than 430 million people use the affected products. Microsoft has not said how many customers were affected.

## What Microsoft said, and what comes next

Microsoft's public statements followed a consistent line. The outage was technical, not malicious. It was not caused by AI or by an AI agent. It originated in a network capacity upgrade and surfaced after a network change. The company apologised, restored service gradually, and promised a full post-incident report.

The company said it would publish a preliminary post-incident report within two business days and a final report within five business days, according to The Threshold. That report should answer the questions customers are still asking: which change was made, why it was not caught by testing, why the health checks failed, and what Microsoft will change to prevent a repeat.

Until that report is published, some details remain unclear. Microsoft has not disclosed the exact faulty change or the full technical sequence. It has not said how many customers were affected or what compensation, if any, will be offered. It has not explained why some regions recovered faster than others.

Those gaps are normal in the first days after a major incident. They are also why readers should be careful with definitive claims about the cause. The company's own account is the most reliable source so far, and it is still incomplete.

## What users and IT teams should do now

For individual users, the practical steps are simple. Check that Outlook, Teams and Copilot are working. Look for delayed email that may have arrived late. Re-send anything urgent that did not go through. If a calendar invite failed during the outage, confirm it with the organiser.

For IT teams, the incident is a reminder to review continuity plans. Organisations should know which business processes depend on Microsoft 365, which have offline workarounds, and how staff will communicate if email and chat are unavailable. They should also check whether critical alerts are routed through the same provider that is down.

Microsoft's admin centre incident IDs, EX1550543 and MO1550821, are useful for tracking the official timeline. Administrators can use those references when reviewing logs, communicating with staff and preparing their own post-incident reports.

## The bigger issue: concentration risk

The outage raised a question that goes beyond Microsoft. The modern working day runs through a small number of cloud providers. When one of them fails, the effects spread quickly across governments, hospitals, airlines and small businesses.

Luke Kehoe, lead industry analyst at Ookla, put it plainly: "It shows how much of the working day now runs through one provider's email and collaboration tools." That is not a criticism of Microsoft specifically. It is a description of how digital infrastructure has consolidated.

The answer is not to abandon cloud services. The answer is to understand the dependency, build sensible fallbacks and test them before they are needed. That applies to a two-person business using Outlook as much as to a government department running critical services.

The outage also showed the value of clear public communication. Microsoft's status updates were frequent, but the company initially struggled to explain why recovery was taking so long. The later statements from Lamanna and the apology from the main account were more useful because they described the failure mode in plain language.

## Questions readers are asking

### Is Microsoft 365 working again?

Yes. Microsoft said it had completed its efforts to address the underlying issue and restored service to the remaining affected customers and regions. Its final status updates were posted around 04:15 UTC on Saturday 14 November. Some users reported isolated problems after that, but the company said all products were operational.

### What caused the outage?

Microsoft said the incident was introduced by an issue during an earlier network capacity upgrade that surfaced following a recent network change. It said the problem was not related to cyber activity or AI. A large number of servers failed automated health checks, which caused cascading failures and overloaded the remaining capacity.

### Was it a cyberattack?

No. Microsoft said it was not aware of any malicious activity and described the incident as a technical issue. The company explicitly ruled out cyber activity and AI as causes.

### Which services were affected?

Outlook and Exchange Online were the worst affected. Teams, Copilot, SharePoint sharing, Planner, To Do, Intune, Purview, Defender for Office 365 and Power BI also appeared on Microsoft's list of affected services at various points.

### How long did it last?

The first problems appeared shortly after 16:00 UTC on Thursday 12 November. Microsoft's final status updates were posted around 04:15 UTC on Saturday 14 November. That is roughly 36 hours, although the worst impact for most users was concentrated on Thursday night and Friday.

### Will Microsoft publish a report?

Yes. Microsoft said it would publish a full post-incident report once its review was complete. The company also said it would provide a preliminary report within two business days and a final report within five business days, according to The Threshold.

## What to watch next

The main thing to watch is Microsoft's post-incident report. It should explain the technical cause in more detail, set out the timeline and list the changes the company will make. That document will matter to IT teams, regulators and anyone who depends on Microsoft 365 for work.

The second thing to watch is the wider debate about cloud concentration. Outages like this one tend to produce calls for more resilience, more transparency and more competition. Whether those calls lead to real changes is a different question.

For now, the practical lesson is simple. Email and collaboration tools are critical infrastructure for millions of organisations. When they fail, the backup plan has to be more than a message saying the service is down.

## Sources

- Associated Press, Microsoft says services fully restored after hourslong global outage, 14 November 2026: https://apnews.com/article/microsoft-outage-outlook-email-365-recover-ca395c0f1e51af784b6d70afb6554f6a
- The Verge, Microsoft has finished restoring service after its massive Outlook outage, 14 November 2026: https://www.theverge.com/tech/1033864/microsoft-has-finished-restoring-service-after-its-massive-outlook-outage
- The Independent, Microsoft confirms services fully restored after major global outage, 14 November 2026: https://www.independent.co.uk/tech/microsoft-global-outage-down-nhs-b3084951.html
- Channel NewsAsia, Microsoft restores service to Outlook and Teams after global outage, 14 November 2026: https://www.channelnewsasia.com/world/microsoft-restore-full-service-outlook-teams-global-outage-6551486
- Gulf News, Microsoft 365 outage: UAE users face continued issues despite service restoration, 14 November 2026: https://gulfnews.com/technology/microsoft-says-outage-is-fixed-but-some-uae-users-still-report-issues-1.500747039
- The Threshold, Microsoft outage: what happened to Outlook and Teams, 14 November 2026: https://thethreshold.media/blog/microsoft-outage-outlook-teams-what-happened-2026

Sources checked on 15 November 2026. Timeline, affected services, Microsoft statements, outage tracker figures and the cause were checked against the Associated Press, The Verge, The Independent, Channel NewsAsia, Gulf News and The Threshold. Image credits: cover photograph of the Microsoft Redmond campus by Atomic Taco, CC BY-SA 2.0, via Wikimedia Commons, resized and converted to WebP. Inline photograph of Building 92 by Jiaqian AirplaneFan, CC BY 3.0, via Wikimedia Commons, resized and converted to WebP. Both images are archive photographs and are not linked to the November 2026 outage.
