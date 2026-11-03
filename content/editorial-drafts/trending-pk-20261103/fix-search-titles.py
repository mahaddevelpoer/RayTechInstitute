"""Keep the shared page formatter from appending a second brand suffix."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parent
titles={
'adam-robinson':'Adam Robinson - Florida Crash Profile',
'adrian-hamilton-manns-pia':'Adrian Hamilton-Manns - PIA CEO',
'afc-champions-league':'AFC Champions League Elite - Results',
'al-ittihad-vs-al-ain':'Al Ittihad vs Al Ain - Result Guide',
'al-wasl-vs-al-quwa-al-jawiya':'Al Wasl vs Al Quwa Al Jawiya - Goals',
'anthropic-ipo':'Anthropic IPO - SEC Filing Explained',
'auqib-nabi':'Auqib Nabi - New Zealand ODI Squad',
'black-clover-episode-5':'Black Clover Episode 5 - Season 2 Guide',
'bragantino-vs-santos':'Bragantino vs Santos - Result Guide',
'cyber-attacks':'Cyber Attacks - Student Account Safety',
'dinesh-auluck':'Dinesh Auluck - Speed Records Profile',
'fatima-sana':'Fatima Sana - Career and Captaincy',
'forex-factory':'Forex Factory - Pakistan Calendar Guide',
'george-russell':'George Russell - Mercedes and F1 Points',
'glenn-maxwell-retirement':'Glenn Maxwell Retirement - BBL Continues',
'gurnoor-brar':'Gurnoor Brar - ODI Squad and Bowling',
'helicopter':'Helicopter Flight - Rotors and Hovering',
'hq-19':'HQ-19 - Public Missile Defence Evidence',
'icc-cricket-world-cup':'ICC Cricket World Cup 2027 - Format',
'islamabad-traffic-police':'Islamabad Traffic Police - Licence Help',
'merub-ali':'Merub Ali - Dramas and Interview Context',
'mohammad-amir':'Mohammad Amir - Record and Retirement',
'mr-patlu-wedding-incident':'Mr Patlu Wedding Incident - Case Update',
'oman-vs-netherlands':'Oman vs Netherlands - League 2 Result',
'over-rate':'Over Rate - Pakistan Fine and Stop Clock',
'pakhtakor-vs-al-nassr':'Pakhtakor vs Al-Nassr - Result Guide',
'perth-scorchers-vs-melbourne-stars':'Scorchers vs Stars - WBBL Result Guide',
'quaid-e-azam-trophy':'Quaid-e-Azam Trophy 2026-27 - Schedule',
'rajinikanth':'Rajinikanth - Career and Jailer Films',
'resident-evil-2026':'Resident Evil 2026 - Film Viewing Guide',
'rohit-sharma':'Rohit Sharma - ODI Status and Records',
'sassuolo-vs-fiorentina':'Sassuolo vs Fiorentina - Result Guide',
'shabana-mahmood':'Shabana Mahmood - Settlement Update',
'sleep':'Sleep for Students - Hours and Routine',
'taika-waititi':'Taika Waititi - Films and Oscar Guide',
'tucker-carlson':'Tucker Carlson - Career and TCN Guide',
'us-midterm-elections':'US Midterms 2026 - Voting and Results',
'usman-khawaja':'Usman Khawaja - Farewell and BBL Role',
'vivo-y32-5g':'vivo Y32 5G - Specs and Pakistan Price',
'wbbl':'WBBL 2026 - Fixtures and Standings',
}
if __name__=='__main__':
 changes=[]
 for key,primary in titles.items():
  new=primary+' | RayTech Institute'
  assert 50<=len(new)<=60,(key,len(new))
  file=ROOT/key/'post.json';post=json.loads(file.read_text(encoding='utf8'));old=post['seo']['title']
  if old==new:continue
  before=dict(post['seo']);post['seo']['title']=new
  changes.append(dict(key=key,id=post['id'],slug=post['slug'],before=before,after=post['seo']))
  file.write_text(json.dumps(post,ensure_ascii=False,indent=2),encoding='utf8')
  file=ROOT/key/'editorial.json';e=json.loads(file.read_text(encoding='utf8'));e['seoTitle']=new;file.write_text(json.dumps(e,ensure_ascii=False,indent=2),encoding='utf8')
  for helper in ROOT.glob('prepare-*.py'):
   text=helper.read_text(encoding='utf8')
   if old in text:helper.write_text(text.replace(old,new),encoding='utf8')
 if changes:(ROOT/'search-title-corrections.json').write_text(json.dumps(changes,ensure_ascii=False,indent=2),encoding='utf8')
 print(json.dumps(dict(titleCorrections=len(changes),articleTextChanged=False)))
