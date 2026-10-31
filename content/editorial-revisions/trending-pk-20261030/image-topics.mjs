export const imageTopics=Object.fromEntries(`
1|Eden Park|India national cricket team
2|Pakistan national cricket team|Hong Kong Cricket Sixes
3|Al Nassr FC|Al-Kholood Club
4|Computer security|Security token
5|Al Nassr FC|Association football tactics
6|Patrick Stewart|Royal Shakespeare Company
7|Pluto|Hubble Space Telescope
8|Sahibzada Farhan|Batting (cricket)
9|Emma Corrin|Television studio
10|Smartphone|Mobile phone camera
11|Rashid Khan|Afghanistan national cricket team
12|Nayeem Hasan|Off spin
13|Anant Ambani|Reliance Industries
14|Daryl Mitchell (cricketer)|New Zealand national cricket team
15|Country|United Nations General Assembly
16|England cricket team|Sri Lanka national cricket team
17|Prince Yadav (cricketer)|Cricket ball
18|Mitchell Santner|Spin bowling
19|Tim Seifert|Wicket-keeper
20|Study skills|Calendar
21|Nitish Kumar Reddy|All-rounder
22|Petroleum|Oil refinery
23|Attock Refinery|Pakistan State Oil
24|Doha|National Museum of Qatar
25|Roston Chase|Test cricket
26|Ireland cricket team|Namibia national cricket team
27|ICC Cricket World Cup Qualifier|Net run rate
28|India|New Delhi
29|Afghanistan national cricket team|Sharjah Cricket Stadium
30|Pakistan Stock Exchange|Economy of Pakistan
31|Oman national cricket team|ICC Academy Ground
32|Tensor Processing Unit|Google DeepMind
33|Shivaji Satam|Television production
34|American football|American football field
35|Zimbabwe national cricket team|Afghanistan national cricket team
36|Everton F.C.|Newcastle United F.C.
37|Sikandar Raza|Zimbabwe national cricket team
38|Education in Pakistan|Female education
39|Christine Lagarde|Seat of the European Central Bank
40|MacBook Pro|Apple silicon
41|Iran|Tehran
42|Pavan Rathnayake|Batting (cricket)
43|Shah Rukh Khan|Film production
44|Australia national cricket team|Melbourne Cricket Ground
45|Pashto music|Rubab (instrument)
46|Kusal Mendis|Wicket-keeper
47|Novak Djokovic|Australian Open
48|Pakistan State Oil|Fuel dispenser
49|Fazl-ur-Rehman (politician, born 1953)|Parliament House, Islamabad
50|Pakistani rupee|Receipt
51|Farakka Barrage|Ganges Delta
52|Smog|Air quality index
53|Game controller|PlayStation 5
54|Mukesh Ambani|Jamnagar Refinery
55|Sanjay Dutt|Movie projector
56|Tarbela Dam|Hydroelectricity
57|Lahore High Court|Law library
58|Sonny Baker|Fast bowling
59|Jack-o'-lantern|Halloween
60|AVE|Toledo railway station
61|Jordan Cox (cricketer)|Wicket-keeper's gloves
62|Reading|Homeschooling
63|David Bedingham|Riverside Ground
64|Sohail Afridi|Provincial Assembly of Khyber Pakhtunkhwa
65|HB Køge (women)|FC Barcelona Femení
66|Sri Lanka|Galle
67|Education in Pakistan|Library
68|Harare|Zimbabwe
69|United States dollar|Foreign exchange market
70|Garena Free Fire|Mobile game
71|Dasun Shanaka|Scoreboard
72|Library catalog|Search engine
73|Carlos Alcaraz|Clay court
74|Ryan Rickelton|South Africa national cricket team
75|Karan Johar|Clapperboard
76|Aiden Markram|South Africa national cricket team
77|European badger|Woodland
78|Inflation|Grocery store
79|Shri|Devanagari
`.trim().split('\n').map(line=>{const [position,...topics]=line.split('|');return [Number(position),topics];}));
