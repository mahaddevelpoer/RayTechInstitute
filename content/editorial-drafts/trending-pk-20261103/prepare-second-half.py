"""Assemble the remaining four articles of the first ten, locally only."""
import runpy
from pathlib import Path

ROOT = Path(__file__).resolve().parent
module = runpy.run_path(str(ROOT / 'prepare-first-batch.py'))

EXTRA = [
    {
        'key': 'us-midterm-elections',
        'title': 'US Midterm Elections 2026: What Changes and Where to Find Voting Information',
        'seoTitle': 'US Midterms 2026 - Voting and Results | RayTech Institute',
        'slug': 'us-midterm-elections-2026-voting-results-explained',
        'description': 'Understand the 2026 US midterms, find official polling-place and state election guidance, and distinguish early vote counts from certified results.',
        'category': 'world-affairs',
        'tags': 'US midterm elections|2026 US midterms|3 November 2026|where to vote|official polling place|state election office|local election office|Vote.gov|USAGov voting guidance|Election Assistance Commission|House elections|Senate elections|six year Senate terms|staggered Senate classes|special election distinction|state and local ballots|registration information|voter privacy|polling hours|local time zones|Pakistan readers US elections|absentee voting|mail ballot deadlines|ballot request versus return|overseas voter guidance|Federal Voting Assistance Program|online voting distinction|sample ballot|unofficial election results|certified election results|canvass process|media projections|election night reporting|partial vote totals|vote share denominator|Senate seat graphics|district versus state|official result sources|nonpartisan civic guide|election status labels|current jurisdiction instructions|no live winner claims',
        'photos': [
            ('United States Capitol - west front.jpg', 'The west front of the United States Capitol in a historical photograph', 'Historical congressional-building photograph, not an image of a 2026 election result or a live event.'),
            ('Example voting booth.jpg', 'An example voting booth inside the Old State House in Hartford, Connecticut', 'Demonstration voting booth photographed in 2023, not a polling-place assignment or a current voting-method instruction.'),
        ],
        'limitations': ['Nonpartisan general explanation; no individual eligibility determination, universal deadline or candidate recommendation.', 'No live vote totals, invented winners or claims of election wrongdoing.', 'Polling location, hours and deadlines must come from the applicable official jurisdiction.'],
    },
    {
        'key': 'helicopter',
        'title': 'How a Helicopter Flies: Rotors, Hovering and Flight Controls',
        'seoTitle': 'Helicopter Flight - Rotors and Hovering | RayTech Institute',
        'slug': 'how-helicopter-flies-rotors-hovering-controls',
        'description': 'Learn how helicopter rotors create lift, why hovering needs power, what collective and cyclic mean, and how air density affects performance.',
        'category': 'technology',
        'tags': 'helicopter|how a helicopter flies|rotating wings|rotor lift|airfoil concept|relative airflow|hovering physics|climbing versus hovering|force balance|weight force|thrust vector|horizontal force component|collective pitch|cyclic pitch|anti torque pedals|tail rotor purpose|single main rotor|counter rotating rotors|rotorcraft category|gyroplane distinction|air density|density altitude|aircraft weight|performance limits|rotor downwash|aircraft specific training|autorotation concept|airflow driven rotor|no flight procedures|paper rotor experiment|NASA paper helicopter|fair testing|blade length comparison|repeated observations|camera sampling|apparent backward rotation|frame rate effect|runway distinction|vertical takeoff|NASA student science|FAA helicopter handbook|introductory aerodynamics',
        'photos': [
            ('Bell 206L-4 LongRanger IV over Botafogo Bay, Rio de Janeiro.jpg', 'A Bell 206L-4 LongRanger helicopter above Botafogo Bay in Rio de Janeiro', 'Real aircraft photograph used to illustrate rotorcraft design, not an accident report or a flight instruction.'),
            ('R44 rotorhub.jpg', 'The rotor hub and blade attachments of a Robinson R44 helicopter', 'Component photograph illustrates a different aircraft design from the cover; it is not a maintenance or operating procedure.'),
        ],
        'limitations': ['Introductory physics and design only; no operating sequences, aircraft-specific loading limits or emergency instructions.', 'Paper-model comparison is an original classroom illustration, not a full-scale performance model.', 'No current aviation incident alleged.'],
    },
    {
        'key': 'vivo-y32-5g',
        'title': 'vivo Y32 5G: Confirmed Features and Pakistan Price Checks',
        'seoTitle': 'vivo Y32 5G - Specs and Pakistan Price | RayTech Institute',
        'slug': 'vivo-y32-5g-specifications-pakistan-price-checks',
        'description': 'Check vivo Y32 5G battery, display, chipset and protection claims, plus what remains unverified about Pakistan price, availability and local warranty.',
        'category': 'technology',
        'tags': 'vivo Y32 5G|vivo Y32 specifications|8000mAh typical battery|rated battery capacity|44W charging|Snapdragon 4 Gen 2|6.87 inch HD plus|120Hz refresh rate|50MP main camera|2MP depth camera|8MP front camera|IP68 protection|IP69 protection|manufacturer footnotes|Pakistan price unverified|Pakistan launch checks|local warranty verification|regional model variant|older Y32 distinction|4G versus 5G variant|battery runtime conditions|charging power varies|physical RAM|expanded memory distinction|internal storage capacity|memory card support|screen resolution|refresh versus frame rate|display brightness conditions|camera megapixels|document photography|network band compatibility|operator coverage|chip platform limits|software workload|no hands on test|no invented benchmark|retailer offer comparison|exact model identifier|Taiwan official listing|Qualcomm platform source|local sale verification',
        'photos': [
            ('Dabri Oppo-Vivo shop.jpg', 'An electronics shop advertising Oppo and vivo mobile phones in Dabri', 'Historical Indian retail-context image, not the Y32 5G, a Pakistan launch or a claim of authorised local stock.'),
            ('Ultra-plus-microsdxc-card-64gb.jpg', 'A 64GB microSDXC memory card', 'Storage illustration only; this card is not claimed to be included with the phone or recommended as a specific purchase.'),
        ],
        'limitations': ['Manufacturer-specification analysis, not a hands-on review or original battery, camera or benchmark test.', 'Taiwan listing does not confirm Pakistan availability, price, network support or local warranty.', 'Context photographs are not presented as images of the Y32 5G handset.'],
    },
    {
        'key': 'adrian-hamilton-manns-pia',
        'title': 'Adrian Hamilton-Manns Takes Charge as PIA CEO: Appointment Explained',
        'seoTitle': 'Adrian Hamilton-Manns - PIA CEO | RayTech Institute',
        'slug': 'adrian-hamilton-manns-pia-ceo-appointment-november-2026',
        'description': "Read the confirmed Adrian Hamilton-Manns PIA appointment, his earlier airline background and what the CEO change does not yet prove about service.",
        'category': 'world-affairs',
        'tags': 'Adrian Hamilton Manns|Adrian Hamilton-Manns PIA CEO|PIA CEO appointment|2 November 2026|Pakistan International Airlines|Amir Hayat successor|airline management transition|New Zealand aviation executive|SalamAir background|FlyArystan background|Air Astana management release|April 2024 historical record|professional career timeline|airline leadership|chief executive responsibilities|corporate governance|management versus ownership|PIA transformation goals|service standards objective|sustainable profitability objective|attributed company statement|appointment versus achievement|operational evidence|departure punctuality|cancellation measure|customer response metric|baggage service measure|load factor versus profit|revenue and cost distinction|route announcement checks|schedule versus operated flight|official booking verification|passenger information|no invented fare changes|aircraft image context|historical company profile|no private salary claims|dated appointment source|public professional history|Aviation Week confirmation|PIA statement reporting|Pakistan aviation news',
        'photos': [
            ('AP-BGJ, Boeing 777-200ER of Pakistan International Airlines at Allama Iqbal International Airport, 2019.jpg', 'PIA Boeing 777-200ER AP-BGJ at Allama Iqbal International Airport in 2019', 'Historical airline photograph, not a new aircraft order or a photograph of the CEO appointment.'),
            ('Karachi Jinnah Airport.jpg', 'Jinnah Terminal at Karachi International Airport in a historical photograph', 'Historical airport context, not evidence of a service improvement, current flight assignment or new management project.'),
        ],
        'limitations': ['Appointment and start date follow public reporting of the embedded airline statement; direct X retrieval was blocked.', 'Only publicly accessible Aviation Week text was reviewed; no subscription-only facts inferred.', 'Historical Air Astana release indexed but direct PDF retrieval failed; no unseen details added.', 'Corporate goals are attributed expectations, not independently confirmed achieved results.'],
    },
]

module['ENTRIES'].extend(EXTRA)
module['main']()
