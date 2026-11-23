Sevilla and Real Betis drew 1–1 at the Ramón Sánchez-Pizjuán on 21 November 2026. LaLiga’s official match centre lists Antony’s 50th-minute goal and Kike Salas’ equaliser at 90+1. Each club earned one league point. The late equaliser makes this fixture a useful lesson in added time, match-clock notation and the difference between a provisional lead and a final result.

Checked on 23 November 2026. This is a dated result guide for the senior men’s LaLiga match. It does not provide live minute-by-minute coverage or a permanently current table. The stadium photographs are historical venue illustrations, not images of either goal in the November fixture.

## What was the Sevilla vs Real Betis result?

The final score was 1–1. Betis led through Antony before Sevilla equalised through Kike Salas in added time. The official league match centre and results listing provide the source record. This page preserves the completed result rather than leaving an earlier 0–1 score in place after the equaliser.

The scorer notation is important: 90+1 identifies the first added-time minute of the second half. It does not mean the match had entered an extra-time period in a knockout tie. Added time and extra time are different concepts, even though both can involve play beyond the familiar 90-minute label.

The match produced two awarded goals, a zero final goal difference and one point for each club. Betis held a lead during the game, but did not finish as the winner. A result article should make that distinction immediately, especially when readers may encounter a cached headline or a screenshot taken before full time.

## How should we read 90+1?

The notation combines the regulation-time boundary with an added-time minute. Read it as a goal in the first minute of second-half added time. It is not a decimal value, and it should not be entered as 90.1 minutes in a spreadsheet that interprets decimals mathematically. A tenth of a minute is six seconds, which is not what the notation means.

For a simple display, store the regulation component as 90 and the added component as one. Keep a separate period field if the dataset includes first-half added time as well. This allows a system to display 45+2 and 90+1 correctly without pretending that either label provides the exact second of an event.

A numbered minute is a conventional event label. It does not necessarily identify a precise elapsed-time value such as 91 minutes and zero seconds. If a study requires exact timing, it needs an event source with that precision and a clear timekeeping definition. The familiar match-report notation is sufficient for chronology but not for every possible calculation.

This provides a useful ICT lesson. A text label that looks numerical may contain structure rather than a single number. Before importing it, decide whether the task is display, sorting or duration analysis. The best storage format depends on that purpose. Treating every visible character string as a decimal can create errors that remain hidden until a calculation is attempted.

## Why is added time different from extra time?

IFAB’s Law 7 explains allowances for time lost during a half. That allowance belongs to the half being played. Extra time, where competition rules require it, is an additional phase used in some matches that need a winner. A late league equaliser at 90+1 does not establish that an extra-time phase occurred.

The distinction matters when reading search summaries. A phrase such as last-minute goal can be informal, while an extra-time goal has a more specific competition meaning. Writers should identify the actual phase rather than using the expressions interchangeably. This page uses added time because that is what the official event notation describes.

For a classroom sorting task, give students labels such as first-half added time, second-half added time and an extra-time period. Ask them to place 45+2 and 90+1 in the appropriate categories. The goal is to understand the notation’s structure, not to assume that every football match has all the listed phases.

Do not infer the exact final whistle time from the equaliser’s minute. A goal at 90+1 tells us when the event was listed, not how much play followed it. A complete clock study would require the final whistle record as well. One timestamp can establish an event’s position in the game without supplying the total duration.

## Can a lead be treated as a result before full time?

A lead describes the current score difference while the match continues. A final result requires the completed match state. Betis’ 0–1 advantage and the eventual 1–1 draw are both valid descriptions of different moments. They become contradictory only if the earlier score is incorrectly labelled as the final result.

This is why a result page needs a visible status field. Scheduled, in play, half time and full time are not decorative labels. They tell the reader how to interpret the numbers. A score copied without its status can turn a temporary situation into a false completed outcome, even if the copied numbers were accurate at the time.

An educational spreadsheet can retain both the interim and final states. Use a timestamped event log rather than overwriting every prior value without history. The final-result table can then point to the completed state. This preserves the chronology while keeping the main results listing clear and avoiding several rows that look like separate matches.

The same reasoning applies to developing news and examination results. Provisional values may be useful, but they need labels and an update process. A reader should be able to tell whether a page reports an ongoing process or a confirmed outcome. The issue is not whether provisional information can be published; it is whether its status is represented accurately.

## How did the equaliser change the point allocation?

At full time, both clubs received one point. For a hypothetical comparison, had a 0–1 score remained the final result, Betis would have received three and Sevilla none. The equaliser therefore changes the comparison from three and zero to one and one. These are alternative final-outcome calculations, not points officially awarded and then removed during play.

This distinction makes the phrase two points dropped easier to understand. Relative to a win, a draw supplies two fewer points. It does not mean two previously held points are deducted from a club’s season total. The phrase uses a counterfactual reference point. Students should identify that reference point before treating commentary as literal accounting.

Across the two teams, a draw distributes two points in total and a decisive result distributes three. The difference can matter when checking a league dataset. If someone assumes every completed fixture distributes exactly three points, a set containing draws will fail that assumption. The count of drawn games must be included in the calculation.

For a fictional exercise with five matches, suppose three are decisive and two are drawn. The total points distributed are three times three plus two times two, or 13. The example is not a claim about this LaLiga round. It uses the points logic to show why the match outcome affects a competition-wide sum.

## What does the result say about goal difference?

Sevilla added one goal for and one against; Betis did the same. Neither club changed its cumulative goal difference through this fixture. The equaliser changed the match’s winner-or-draw classification while leaving a zero net goal difference at full time. Goals and points are related through the result, but they remain different fields.

Imagine a fictional club beginning with 16 goals for and 12 against. Adding a 1–1 draw gives 17 and 13, keeping the difference at plus four. A second fictional club beginning with 10 for and 15 against moves to 11 and 16, keeping minus five. Equal match contributions do not imply equal cumulative records.

Current rank cannot be inferred from either example or from the real score alone. The complete table contains other clubs and a defined ordering method. This article therefore explains the match contribution and directs readers to official records rather than attaching an unverified rank that may become stale as other fixtures are completed.

When maintaining a result database, calculate goal difference from goals for minus goals against instead of entering all three independently without checks. Independent manual entry creates opportunities for inconsistency. The raw totals should remain available so that a reader can reproduce the derived value and identify whether an error arose in the score or in the subtraction.

## How can students compare two late-match headlines?

Imagine one headline captured while Betis led and another written after full time. The first might say Betis leads; the second should say the clubs drew. To assess them fairly, inspect the publication or capture time and whether the first headline claimed to be final. Timing can explain a difference without requiring either report to have invented the score.

However, an old in-play label left unchanged on a completed result page is a maintenance problem. Readers arriving later need the final state. A useful editorial process checks the headline, summary, score display and structured result fields together so that one updated paragraph does not coexist with an outdated result elsewhere on the page.

Students can practise this by reviewing a fictional page containing a 1–1 headline, a 0–1 summary and a full-time label. Ask which fields conflict and what source should resolve them. The exercise teaches consistency across a document, not just accuracy in one sentence. It also shows why a correction should be checked in every visible location.

Avoid assuming that dramatic language supplies additional evidence. A late goal can be important without proving that one side deserved victory or that the other lost concentration. Those explanations require more than timing. A precise account can describe the change in score and points while leaving unsupported causal claims out.

## A worked exercise on clocks and outcomes

First, identify the two scoring teams in order: Betis, then Sevilla. Next, write the home-first states as 0–1 and 1–1. Third, classify the final result as a draw. Fourth, calculate each team’s match goal-difference contribution as zero. Each step uses a different piece of the same small event record.

Now explain why 90+1 should not be stored as 90.1. A correct answer says the plus sign separates regulation and added-time labels, while a decimal represents a fraction of a minute. Finally, identify what remains unknown from the goal label alone: the exact second, the full final duration and the reasons for every allowance made by the referee.

For a writing task, produce a brief explanation suitable for a younger student. It should state the 1–1 result, explain that the equaliser came in added time and distinguish that from extra time. Keep the wording direct and avoid introducing a knockout outcome that did not occur in this league fixture.

Our [sports scores guide](/blogs/sports-scores-rules-statistics-student-guide/) offers further practice with clocks and result labels. The central lesson from Sevilla–Betis is that time notation, match status and final points must be read together: a lead near the end can still become a draw before the match is complete.

## How can a timer field be stored without losing meaning?

Use separate values for half, regulation minute and added minute, plus an optional exact timestamp if the provider supplies one. A display function can then construct the familiar 90+1 label. Keeping the components separate avoids forcing a structured clock label into a decimal field that cannot represent its intended meaning.

Sorting needs a defined rule as well. A first-half 45+2 event occurs before the start of the second half, even though a naive numerical conversion may create confusion when compared with a 46th-minute label. The period identifier resolves the order. Within a period, use the provider’s event sequence or precise timestamp where available rather than assuming every minute label uniquely identifies an instant.

For an ICT task, ask students to design three sample records and describe how they would display and sort them. They do not need to write a full live-score application. The learning goal is to separate storage, presentation and chronological order, which are related but distinct problems.

Finally, preserve the original source label alongside any parsed fields. If the parser makes a mistake, the original text provides a review trail. Deleting it too early makes later correction harder and can leave a calculated value looking more precise than the evidence that produced it.

## Sources

- [LaLiga: official Sevilla–Real Betis match centre](https://www.laliga.com/es-DE/partido/temporada-2026-2027-laliga-ea-sports-sevilla-fc-real-betis-13)
- [LaLiga: official results listing](https://www.laliga.com/es-MA/laliga-easports/resultados)
- [IFAB Law 7: duration of the match and added time](https://www.theifab.com/laws/latest/the-duration-of-the-match/?selectedLanguage=en)
