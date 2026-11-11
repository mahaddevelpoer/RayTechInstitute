"""Read supplied question banks as data; validate keys before staging any import."""
import hashlib,json,re
from pathlib import Path
from docx import Document
from docx.table import Table
from docx.text.paragraph import Paragraph

SOURCE=Path(r'C:\Users\HP\Downloads\Video\Upgrades')
DEST=Path('content/imports/dit-nov11')
FILES=[('network-models','Chapter5_Network_Models.docx','Computer Networking',5,150),('ip-addresses','Chapter6_IP_Addresses.docx','Computer Networking',6,70),('protocols','Chapter7_Protocols_MCQS.docx','Computer Networking',7,100),('transmission-media','chp 4_Transmission_Media_.docx','Computer Networking',4,110),('excel','Excel_Chapter3.docx','MS Office',3,130),('access','MS_Access_Chapter5 MCQS.docx','MS Office',5,100),('networking-devices','Networking_Devices_chp 3 Mcqs.docx','Computer Networking',3,100),('network-topology','Raytech_Network_Topology_chp # 2.docx','Computer Networking',2,100),('powerpoint','RayTech_PowerPoint_Conceptual_MCQs_Teacher-0.docx','MS Office',None,100)]
def normal(s):
 return re.sub(r'[^\w\u0600-\u06ff]','',s.lower())
def extract(key,name,book,chapter,expected):
 path=SOURCE/name;d=Document(path);answers={}
 for table in d.tables:
  if len(table.columns)!=3:continue
  for row in table.rows:
   n,letter,text=[c.text.strip() for c in row.cells]
   if not n.isdigit():continue
   if not re.fullmatch('[ABCD]',letter):raise ValueError(f'{name}: invalid answer letter Q{n}')
   assert int(n) not in answers,(name,'duplicate answer key',n)
   answers[int(n)]=(ord(letter)-65,text)
 questions=[];topics=[];pending=None;topic=None
 for element in d.element.body:
  if element.tag.endswith('}p'):
   p=Paragraph(element,d._body);text=p.text.strip()
   if not text:continue
   if re.search(r'answer\s*key',text,re.I):break
   if p.style.name.startswith('Heading'):
    assert not pending,(name,'unfinished before heading')
    topic=text;topics.append(topic);continue
   m=re.match(r'^(?:Q\s*)?(\d+)[.)]\s+(.+)$',text)
   if m:
    assert not pending and topic,(name,'question without topic/options',text[:60])
    pending={'sourceNumber':int(m[1]),'lines':[m[2]],'topic':topic}
   elif pending:pending['lines'].append(text)
  elif element.tag.endswith('}tbl') and pending:
   table=Table(element,d._body);cells=[c for row in table.rows for c in row.cells]
   assert len(cells)==4,(name,'options shape',pending['sourceNumber'])
   options=[];highlight=[]
   for i,c in enumerate(cells):
    assert re.match(rf'^{chr(65+i)}[.)]\s*',c.text),(name,'option order',pending['sourceNumber'])
    options.append(re.sub(r'(?m)^[ABCD][.)]\s*','',c.text.strip()))
    if c._tc.xpath('.//w:highlight[@w:val="yellow"]') or c._tc.xpath('.//w:shd[@w:fill="FFFF00"]'):highlight.append(i)
   n=pending['sourceNumber'];correct,answer=answers[n]
   assert not highlight or highlight==[correct],(name,'highlight/key disagreement',n,highlight,correct)
   selected=normal(options[correct]);expected_answer=normal(answer)
   assert selected.startswith(expected_answer) or expected_answer.startswith(selected),(name,'answer text mismatch',n,options[correct],answer)
   question='\n'.join(pending['lines'])
   assert len(set(options))==4 and all(s.strip() for s in options) and re.search(r'[\u0600-\u06ff]',question),(name,'bilingual/options validation',n)
   questions.append({'id':f'dit-{key}-nov11-q{n:03d}','sourceNumber':n,'topic':pending['topic'],'question':question,'options':options,'correctIndex':correct,'explanation':'Correct answer: '+options[correct]})
   pending=None
 assert not pending and [q['sourceNumber'] for q in questions]==list(range(1,expected+1)),(name,'question count',len(questions),expected)
 assert sorted(answers)==list(range(1,expected+1)),(name,'answer count',len(answers))
 assert len({q['question'] for q in questions})==expected,(name,'duplicate questions')
 return {'key':key,'sourceFile':name,'sourceSha256':hashlib.sha256(path.read_bytes()).hexdigest(),'classSlug':'dit-intermediate','subjectSlug':'dit-computer-science','semesterNumber':1,'bookTitle':book,'displayChapterNumber':chapter,'sourceSections':topics,'questions':questions}
if __name__=='__main__':
 DEST.mkdir(parents=True,exist_ok=True);results=[]
 for args in FILES:
  try:
   bank=extract(*args);(DEST/(args[0]+'.json')).write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');results.append({'key':args[0],'questions':len(bank['questions']),'topics':len(bank['sourceSections']),'state':'source-validated'})
  except Exception as e:results.append({'key':args[0],'state':'needs-review','error':str(e)})
 Path('artifacts/dit-nov11/extraction-report.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
 for r in results:print(json.dumps(r,ensure_ascii=True))
