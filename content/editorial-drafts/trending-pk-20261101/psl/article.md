Peshawar Zalmi won the HBL PSL 11 final on 3 May 2026, beating Hyderabad Kingsmen by five wickets in Lahore. That gives you the result. Understanding the result takes another step: what does the margin mean, how do bowling figures work, and why is a playoff bracket different from a league table?

This guide revisits the completed 2026 final and uses original exercises to make a cricket scorecard easier to read. It is a season retrospective, not a live score service or an announcement of the next tournament's dates.

## Who won the HBL PSL 2026 final?

Peshawar Zalmi took their second title, following their 2017 championship. The final was at Gaddafi Stadium, Lahore. Hyderabad made 129 all out in 18 overs; Peshawar reached 130 for five in 15.2 overs. Aaron Hardie was player of the final, taking four wickets for 27 and scoring an unbeaten 56 from 39 balls.

Those are the essential match facts from the league's official final report. Keep that short record separate from interpretation. Saying who won is a factual result. Explaining how pressure changes during a chase is analysis, and an analyst should identify the particular score or passage behind the argument rather than supply an imaginary conversation from the dressing room.

An easy habit is to write three labels beside any score you save: competition, date and match stage. A brilliant innings from a Qualifier and an innings in the final belong to different records. Both matter, but combining them can create a story that never happened.

## Read the final scoreboard in the right order

Start with the innings total, then wickets, then overs. Resist the temptation to look only at a large number beside a famous name. Cricket is a team contest, and extras or other batters' contributions also belong in the total.

| Scorecard entry | How to read it | What it does not mean |
|---|---|---|
| 129 all out | The first innings ended with a team total of 129 | Every batter individually scored 129 |
| Target 130 | The chasing side needed one more than the completed first-innings total | Both teams needed to finish on the same score |
| 130/5 | The chasing side reached 130 after losing five wickets | Five runs were still needed |
| 15.2 overs | Fifteen complete overs and two additional legal balls | Fifteen point two decimal overs |
| Five-wicket win | Five wickets remained when the winning target was reached | The teams finished five runs apart |

This table describes this unrevised final score, not every rain-affected match. If a target has been revised, read the official target and conditions before applying the ordinary one-more-run calculation. Do not silently substitute the first-innings score for a displayed revised target.

Try writing a one-sentence result yourself before checking a headline. Include the winner, opponent and margin. Then add the venue in a second sentence. Keeping each sentence responsible for one thing makes it much harder to confuse the score, location and stage.

## Why 15.2 overs is 92 balls

Overs notation looks like a decimal, but the part after the dot counts legal deliveries. Six legal balls complete an over. Consequently, 15.2 means fifteen groups of six plus two, giving 92 legal deliveries. Multiplying 15.2 by six would give 91.2, which cannot describe a count of completed balls.

In a standard 20-over allocation there are 120 legal deliveries. Subtracting 92 leaves 28. This independently checks the final report's statement that the chase finished with 28 balls remaining. It is a useful consistency check because it connects two different scorecard fields.

Wides and no-balls complicate a different question: how many physical deliveries did the bowler send down? A legal-ball count is not necessarily the count of every delivery a spectator watched. Without the ball-by-ball record, do not invent a total that includes illegal deliveries.

Here is a fictional practice set. Convert 8.4, 11.0 and 19.5 into legal deliveries. The answers are 52, 66 and 119. A value such as 10.7 should make your checking routine stop: the final digit cannot be seven in ordinary six-ball-over notation.

If you are learning Python, the same idea becomes a small validation task:

```python
def legal_balls(overs_text):
    parts = overs_text.split('.')
    if len(parts) != 2 or not all(p.isdigit() for p in parts):
        raise ValueError('Use complete overs and extra balls, such as 15.2')
    overs, balls = map(int, parts)
    if not 0 <= balls <= 5:
        raise ValueError('Extra legal balls must be between zero and five')
    return overs * 6 + balls

print(legal_balls('15.2'))  # 92
```

The input stays text until its two parts have been checked. That is intentional. A general decimal number loses the special meaning of the final digit and encourages the wrong arithmetic.

## What do Hardie's four for 27 mean?

Bowling figures put wickets taken before runs conceded: 4/27 means four wickets for 27 runs charged to that bowler. A team's 27/4 means something completely different: 27 runs scored with four wickets lost. Check whether the number belongs to a bowler's row or a team's innings before interpreting the slash.

Also separate bowling runs from every run on the board. Scorecards distinguish extras, and not every extra is charged to a bowler in the same way. Adding bowling figures without understanding that accounting can produce a total that appears wrong even when the official record is consistent.

For a fictional comparison, imagine Bowler A takes two wickets for 18 and Bowler B takes three for 30. B took more wickets; A conceded fewer runs. Neither observation alone settles who bowled better. The number of overs, stage of the innings and match situation would help answer a more specific question.

You can make the comparison fairer by stating what you are measuring. If you are examining wicket-taking, discuss wickets and opportunities. If you are examining scoring restriction, calculate economy using legal deliveries. Avoid changing the measuring rule halfway through simply because one statistic favours a preferred player.

## How to interpret an unbeaten 56 from 39

Batting strike rate measures runs per 100 balls faced. With 56 runs from 39 balls, the calculation is 56 divided by 39, multiplied by 100, or approximately 143.59. This is a rate, not a prediction that the batter would necessarily score that many runs if allowed 100 deliveries.

Hardie's nine fours contributed 36 runs. Subtracting those from 56 leaves 20 other runs in his innings. That remainder should not be labelled twenty singles: it could contain a mixture of scoring events. You would need more detailed scoring information to allocate every remaining run accurately.

The not-out marker answers another question. It tells you the batter had not been dismissed when the innings ended. It does not mean he faced no difficult deliveries, and it should not be erased when compiling an average. Batting averages use dismissals, while a simple runs-per-innings figure uses innings as its denominator.

To practise, compare these fictional records: 40 from 20 balls and 60 from 50. The first strike rate is 200; the second is 120. The second batter made more runs, but the first scored faster per ball. A good explanation can acknowledge both facts without treating one number as the entire performance.

## Follow the playoff route without confusing the matches

The league's match-report archive records Peshawar beating Islamabad in the Qualifier on 28 April. Hyderabad then beat Multan in Eliminator 1 on 29 April and Islamabad in Eliminator 2 on 1 May, before meeting Peshawar in the 3 May final. These are separate fixtures, with separate consequences.

Think of the playoff bracket as a route map. A node is a match and an arrow shows where a winner or loser goes next. The league table answers who earned a position before that route began; the bracket answers what happened after the route began. They should not be used interchangeably.

Draw four boxes on paper and put only the match stage and date in each. Next add the winning team using the archive. Finally draw the connections. Doing the structure before adding statistics reduces clutter and shows why a Qualifier victory should not be described as winning the championship itself.

This exercise also explains why a team's earlier loss does not necessarily predict the final. A bracket establishes eligibility and progression, not certainty. If you want to argue that one matchup favoured a side, supply evidence specific to that matchup rather than presenting the competition's structure as a forecast.

## Build a useful HBL PSL season notebook

A good notebook does more than collect screenshots. Give each match a row with date, teams, stage, venue, result and source. Add a separate column for your observation. That separation prevents a personal opinion from returning later as an apparently official fact.

For example, your observation might say, "I want to study how a chase changes after early wickets." That is a worthwhile research question. It is more careful than claiming to know a batter's private strategy, which a scorecard alone cannot establish.

Save the date on which you checked a statistics page. Season totals are meaningful only when the season and scope are known. A career total, one franchise season and one playoff innings are different datasets even when the player's name is identical. Label the scope before you compare the values.

Students practising spreadsheets can give every row a unique match identifier. Store runs and wickets in separate numeric columns rather than one combined string. Keep overs as a displayed notation plus a converted legal-ball column. That design makes sorting, calculations and validation easier without losing the familiar cricket presentation.

You can develop those skills through our [programming courses](/courses/) and apply the same habit of checking evidence when using [class study resources](/classes/). The subject changes, but the discipline remains useful: identify the record, preserve its units and explain your calculation.

## Common questions about the completed 2026 season

### Is this today's HBL PSL live score?

No. This page explains a final played on 3 May 2026. A retrospective should retain its match date even when a reader opens it months later. For an ongoing match, use a current official fixture or scorecard and check whether the status is scheduled, in progress or completed.

### Was the final played in Karachi?

The final discussed here was at Gaddafi Stadium in Lahore. Karachi appears in the playoff chronology because the Qualifier was there. The historical Karachi stadium photograph illustrates that separate venue context; it is not evidence that Karachi hosted this final.

### Can I calculate a win margin from the run difference alone?

Not for a successful chase. A chasing side's winning margin is normally stated in wickets remaining, while a defending side's victory is normally stated in runs. First determine which side won and whether it was batting first or chasing, then interpret the official margin.

### Does a high strike rate always mean a better innings?

It means faster scoring per ball faced within the record being measured. Whether that helped most depends on the target, wickets and situation. State the narrow statistical claim first. Then discuss context without pretending the statistic measures every aspect of batting quality.

### Are the next season's dates and ticket prices confirmed here?

No. This article does not publish a future schedule, price list or broadcast-rights promise. Those details require their own dated official announcements. A previous season's page is useful history, but it should not become a checkout guide for a different edition.

## A final three-question check

Before sharing a cricket result, ask yourself: have I identified the correct edition and match stage; have I interpreted the units properly; and can a reader open the source behind the factual claim? If all three answers are clear, your summary is already more useful than an isolated score pasted without a date.

For one last exercise, explain the final to a friend without reciting the whole report. Give the result, explain why 15.2 overs is 92 balls, and show the strike-rate calculation. You will have communicated a verified outcome and taught two reusable skills at the same time.

## Sources

- [HBL PSL final report, 3 May 2026](https://psl-t20.com/hardies-all-round-masterclass-leads-zalmi-to-second-hbl-psl-title/)
- [HBL PSL match-report archive and playoff chronology](https://psl-t20.com/match-report/)
