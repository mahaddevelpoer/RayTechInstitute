export const imageQueries=Object.fromEntries(`
1|Eden Park Auckland cricket|India New Zealand cricket match
2|Pakistan cricket team|Mission Road Ground Hong Kong
3|Al Nassr football team|Al Kholood football
4|computer security hardware token|computer security laptop
5|Al Nassr football player|football tactics board
6|Patrick Stewart Comic Con|Patrick Stewart Shakespeare
7|Pluto New Horizons|Hubble Space Telescope orbit
8|Sahibzada Farhan|Pakistan cricket batting
9|Emma Corrin|Emma Corrin portrait
10|smartphone mobile reading|smartphone camera close up
11|Rashid Khan cricketer|Afghanistan cricket team
12|Nayeem Hasan cricket|Bangladesh Test cricket
13|Anant Ambani|Reliance Mumbai building
14|Daryl Mitchell cricketer|New Zealand cricket batting
15|political world map|United Nations General Assembly hall
16|England Sri Lanka cricket|Sri Lanka England cricket match
17|Prince Yadav cricketer|cricket fast bowling grip
18|Mitchell Santner|New Zealand spin bowling
19|Tim Seifert|cricket wicketkeeper gloves
20|student study planner|calendar notebook desk
21|Nitish Kumar Reddy|cricket all rounder India
22|Pakistan petroleum refinery|oil refinery pipes
23|Attock Refinery|Pakistan State Oil petrol station
24|Doha skyline Qatar|Qatar museum architecture
25|Roston Chase|West Indies Test cricket
26|Ireland Namibia cricket|Namibia cricket ground
27|cricket world cup qualifier|cricket scoreboard
28|India geographical map|New Delhi Parliament building
29|Afghanistan Zimbabwe cricket|Sharjah Cricket Stadium
30|Pakistan Stock Exchange Karachi|Pakistani rupee banknotes
31|Oman cricket ground|ICC Academy cricket ground Dubai
32|Google campus building|machine learning computer hardware
33|Shivaji Satam|television production camera
34|American football game|American football field
35|Afghanistan national cricket team|Zimbabwe national cricket team
36|Everton Newcastle football|Everton football stadium
37|Sikandar Raza|Zimbabwe batting cricket
38|Pakistan girls school|Pakistan school classroom girls
39|Christine Lagarde|European Central Bank building Frankfurt
40|MacBook Pro keyboard|MacBook Pro laptop display
41|Iran geographical map|Tehran skyline
42|Pavan Rathnayake cricket|Sri Lanka batsman cricket
43|Shah Rukh Khan|film production camera
44|Australia cricket team|Melbourne Cricket Ground
45|Gulrez Tabassum|Pashtun rubab instrument
46|Kusal Mendis|Sri Lanka wicketkeeper cricket
47|Novak Djokovic|Australian Open tennis court
48|Pakistan petrol station|petrol fuel pump Pakistan
49|Fazlur Rehman politician|National Assembly Pakistan building
50|Pakistani currency notes|cash receipt
51|Farakka Barrage|Ganges river Bangladesh
52|Lahore smog|air quality monitoring sensor
53|video game controller hands|PlayStation 5 console
54|Mukesh Ambani|Jamnagar refinery
55|Sanjay Dutt|cinema film projector
56|Tarbela Dam|hydroelectric turbine
57|Lahore High Court building|law library books
58|Sonny Baker cricketer|cricket fast bowler action
59|Halloween pumpkin|Halloween costumes festival
60|Spain AVE train|Toledo railway station
61|Jordan Cox cricketer|wicketkeeping gloves cricket equipment
62|mother son reading book|family studying children
63|David Bedingham|Durham county cricket
64|Sohail Afridi|Khyber Pakhtunkhwa Assembly building
65|HB Koge women football|Barcelona women football team
66|Sri Lanka geographical map|Galle Sri Lanka city
67|Pakistan students classroom|Pakistan school library
68|Harare Zimbabwe city|Zimbabwe geographical map
69|United States dollar banknotes|Pakistan currency exchange
70|Free Fire esports|mobile gaming smartphone hands
71|Dasun Shanaka|cricket batting scoreboard
72|library card catalogue|computer keyboard search
73|Carlos Alcaraz|clay tennis court
74|Ryan Rickelton|South Africa cricket batting
75|Karan Johar|film clapperboard studio
76|Aiden Markram|South Africa cricket team
77|European badger|badger woodland habitat
78|Pakistan food market|grocery prices market
79|Sanskrit manuscript|Shri honorific inscription
`.trim().split('\n').map(line=>{const [position,...queries]=line.split('|');return [Number(position),queries];}));
