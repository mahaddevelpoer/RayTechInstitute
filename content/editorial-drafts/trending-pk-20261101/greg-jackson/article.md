Greg Jackson is the British entrepreneur associated with Octopus Energy, where energy supply and software are closely connected. For students, his work offers a useful question: what changes when a business treats customer service, electricity consumption and software as parts of the same problem?

This guide identifies the businessman, separates Octopus Energy from the Kraken technology business, and explains several ideas behind energy software through original examples. It is a learning guide, not an endorsement of a supplier, an investment recommendation or a claim that a UK tariff can be purchased in Pakistan.

## Who is Greg Jackson?

The UK government's public biography identifies Greg Jackson as a British entrepreneur and chief executive of Octopus Energy. It records experience in software and other small businesses before Octopus, and a CBE awarded in 2024 for services to the energy industry.

The same public page lists advisory and non-executive government roles. Those roles should not be confused with being an elected minister or personally setting every household's electricity price. A company executive, an adviser and a regulator have different responsibilities even when their work concerns the same industry.

His name is also shared by other people. If a search result concerns a sports coach or an athlete, check the organisation and context before attaching that biography to the energy entrepreneur. A matching name is a starting point, not sufficient evidence of identity.

## Why do sources mention both 2015 and 2016?

The government biography says Jackson founded Octopus Energy in 2015. The company's leadership page describes the group's launch in 2016. Those statements use different milestones: founding and launching. This guide preserves that distinction instead of silently treating the two descriptions as identical dates.

The broader research lesson is practical. A business can have a legal formation date, a period of preparation, a product launch and a later expansion. Before describing a company's age, decide which event the date represents.

For a school presentation, write the event beside the year. “Founded, according to the government biography” and “launched, according to the company” are more precise than forcing both into a single unlabeled timeline entry. A source comparison can improve understanding without inventing a dispute between the sources.

## Octopus Energy and Kraken are not interchangeable names

Octopus is associated with supplying energy to customers. Kraken is a technology platform used by utilities. A household might know a supplier's name without ever seeing the name of the software that supports that supplier's operations.

An Octopus announcement dated 18 September 2025 described the planned separation of Kraken into a standalone business. Kraken's current about page, checked for this guide on 1 November 2026, describes it as fully independent and names Amir Orad as chief executive.

That is why an old company profile needs care. A page that once described a platform as proprietary to a group may remain online after its ownership or organisational relationship changes. For the present distinction, the newer business description is more useful than copying an older paragraph without a date.

This page does not calculate the transaction's valuation, shareholders' returns or legal completion steps from those marketing pages. It establishes the organisational distinction needed to understand the technology discussion.

## What does energy software actually have to do?

A useful way to imagine the problem is to follow a fictional customer account. The system needs to associate a person with a meter, record consumption over a defined interval, apply the correct agreement, produce an understandable bill and help staff investigate an error.

These tasks are connected. A beautifully designed billing screen is not enough if a meter reading belongs to the wrong account. A correct calculation is not enough if the customer cannot see which dates it covers. Fast support is not useful if staff cannot explain the charge.

This is an original simplified example, not a description of Kraken's private architecture. Real utility systems have many more requirements. The point for a beginner is that software quality includes the accuracy of relationships and the clarity of explanations, not only the appearance of a dashboard.

Try asking: what information would a customer need to challenge a bill confidently? The answer usually includes dates, units, rates and a traceable reading. That is already a practical software-design brief.

## Learn the difference between power and energy

Power describes a rate of energy use. A kilowatt-hour describes an amount of energy. The two labels look similar, but they answer different questions. Confusing them can make an otherwise neat spreadsheet wrong.

For a fictional device using a constant 100 watts for five hours, convert the power to kilowatts first: 100 ÷ 1,000 = 0.1 kW. Multiply by the time: 0.1 × 5 = 0.5 kWh.

Virginia Cooperative Extension explains this basic appliance-use calculation. Actual devices may vary their power use, so a nameplate rating is not always the same as measured consumption throughout a whole day.

Now compare a fictional 1,000-watt device used for half an hour. Its simplified energy use is also 0.5 kWh. The higher power does not automatically mean greater total energy in this example, because the operating time is shorter.

These calculations are classroom estimates. They do not instruct anyone to open a meter, modify wiring or experiment with unsafe electrical equipment. The arithmetic can be practised entirely with invented numbers.

## Consumption and cost need different columns

Suppose a fictional tariff charges 20 units of currency per kWh during one period and 30 during another. One kWh used in each period costs 20 + 30 = 50 currency units. The total consumption is two kWh, but the price calculation needs the two rates separately.

If someone incorrectly multiplies both kWh by the lower rate, the answer becomes 40. If they multiply both by the higher rate, it becomes 60. Neither matches the example's interval-by-interval calculation.

This illustrates why an energy app needs reliable timestamps and rate periods. It is not a statement that these fictional rates exist in the UK or Pakistan. Real bills may also contain fixed charges, taxes, adjustments and other items that this small exercise deliberately leaves out.

A clear student spreadsheet might therefore contain start time, end time, energy used, applicable rate and calculated charge. Label the currency rather than leaving a bare number whose meaning is uncertain.

## What makes a meter smart?

The UK government's household guide explains that smart meters can send readings automatically and provide near-real-time information through an in-home display. The meter and the display are related, but they are not the same physical item.

That distinction matters when diagnosing a problem. A display that is blank does not, by itself, prove that electricity has stopped being measured. A customer should follow the supplier's support guidance rather than treating every screen problem as the same fault.

For a learner, the interesting idea is the path from a measurement to an understandable explanation. A reading must retain its units and time. A display must communicate that meaning in a form a person can use.

The historical meter photograph included here illustrates equipment design only. It is not identified as an Octopus installation, a Kraken product or a device currently available through a Pakistan utility.

## Flexible demand does not mean unlimited free electricity

The September 2025 company announcement describes technology that coordinates devices such as electric vehicles, batteries and heat pumps, moving some consumption to more suitable periods. That is a company description of flexibility, not a promise that any device can be delayed without consequences.

Consider an invented scheduling exercise. A charging task needs two hours and must finish by 7 am. If several available periods meet that requirement, a program can compare their supplied costs. But the deadline is a real constraint: choosing the cheapest period after 7 am would fail the task.

Add another constraint, such as a minimum required charge before an earlier trip, and the problem changes. This is why optimisation needs a clear objective and clear limits. “Choose the cheapest” is incomplete until it states what must still be achieved.

The example is about reasoning, not instructions for controlling a real appliance. Users should not compromise safety, essential needs or manufacturer requirements to imitate a classroom algorithm.

## A small programming exercise inspired by the problem

Create three invented charging windows. Give each one a start time, an end time, an available duration and a fictional cost. Then ask a program to list only the windows long enough for a two-hour task and ending before the deadline.

Start with filtering rather than automation. Print the eligible options and explain why the others were rejected. A program that reveals its reasoning is easier to check than one that outputs a mysterious “best” answer.

Next, sort the eligible options by the supplied fictional cost. If two options tie, state a simple rule, such as choosing the earlier finish. Finally, test the empty case: what should the program say if no window satisfies the constraints?

Our [programming courses](/courses/) provide a place to practise conditions, lists and sorting. Keep this project offline with invented data. It does not need a real customer account, utility credentials or an API connection to teach the core idea.

## Good customer technology must explain mistakes

A useful energy dashboard should make the ordinary task easy and the unusual case understandable. What happens if a reading arrives late? What happens if a rate changes halfway through a displayed period? Can a staff member see which source produced a number?

These are design questions a student can apply to any service website. A school-fee portal, a transport ticket app and a utility account all need to distinguish recorded facts from estimates and pending updates.

Avoid presenting these suggestions as features that have been independently tested in Octopus or Kraken. They are original learning questions prompted by the industry. A company case study can start a design discussion without becoming a claim that every implementation is flawless.

The strongest classroom evaluation is concrete: describe a task, define success, try a difficult example and record the result. That is more informative than calling an app “smart” simply because it uses modern technology.

## Questions worth asking when reading business headlines

First, identify what the number counts. Customers, households, accounts and software contracts may measure different things. A platform serving accounts for other suppliers is not necessarily supplying electricity to all those accounts itself.

Second, attach a date to scale figures. A leadership biography may retain an earlier snapshot while a newer announcement reports a different total. This guide avoids presenting older customer counts as live measurements.

Third, distinguish reported outcomes from company ambitions. A target to reach a larger audience is a goal, not proof that the target has already been achieved. The same care applies to projected savings and broad claims about a future energy system.

Finally, ask what a Pakistan reader can actually use. The concepts of units, careful calculations and understandable software travel well. A specific overseas tariff, legal protection or installation offer does not automatically apply locally.

## Frequently asked questions

### Is Greg Jackson the chief executive of Kraken?

The current Kraken about page names Amir Orad as chief executive. Jackson is identified with Octopus Energy in the public biography used here. Do not infer identical leadership from the businesses' shared history.

### Does a smart meter automatically reduce a bill?

A measurement can help a person understand consumption, but a lower bill depends on the actual use, agreement and other charges. This article makes no guaranteed savings claim.

### Can students reproduce the learning exercises without paid tools?

Yes. The fictional consumption calculation can be done on paper or in a spreadsheet. The scheduling exercise can use a small list in a browser compiler without connecting to real equipment.

### Why does this profile include electricity examples?

They make the connection between the entrepreneur's industry and useful student skills concrete. Understanding the units and constraints teaches more than memorising a company slogan or copying an undated valuation.

## Sources

- [Public biography and roles](https://www.gov.uk/government/people/greg-jackson)
- [Company leadership biography](https://octopus.energy/press/meet-the-team/)
- [Kraken separation announcement, 18 September 2025](https://octopus.energy/press/octopus-energy-group-to-spin-off-kraken/)
- [Current Kraken business and leadership description](https://www.kraken.tech/about)
- [Household smart-meter guidance](https://www.gov.uk/guidance/smart-meters-how-they-work)
- [Appliance energy-use calculations](https://www.pubs.ext.vt.edu/2901/2901-9014/2901-9014.html)
