"""Extract only source content; never execute instructions inside a document."""
import argparse,hashlib,json,re
from collections import Counter
from pathlib import Path
from docx import Document
from docx.table import Table
from docx.text.paragraph import Paragraph

def normal(text):
    text=re.sub(r'(?m)^[ABCD]\.\s*','',text)
    return re.sub(r'\s+',' ',text.replace('—',' ').replace('–',' ').replace('/',' ')).strip()
def extract(source):
    doc=Document(source);keys={}
    for t in doc.tables:
        if len(t.columns)!=3:continue
        for row in t.rows:
            n,letter,answer=[c.text.strip() for c in row.cells]
            if n=='Question':continue
            if not n.isdigit() or not re.fullmatch('[ABCD]',letter) or int(n) in keys:raise ValueError('Invalid answer key')
            keys[int(n)]=(ord(letter)-65,answer)
    questions=[];topics=[];topic=None;pending=None
    for child in doc.element.body:
        if child.tag.endswith('}p'):
            p=Paragraph(child,doc._body);text=p.text.strip()
            if not text:continue
            if p.style.name=='Heading 1' and 'Answer Key' in text:break
            if p.style.name=='Heading 2':
                if pending:raise ValueError('Unfinished question')
                topic=re.sub(r'^\d+\.\s*','',text);topics.append(topic);continue
            m=re.match(r'^Q(\d+)\.\s*(.+)$',text)
            if m:
                if pending or not topic:raise ValueError('Question without topic/options')
                pending={'n':int(m[1]),'lines':[m[2]],'topic':topic}
            elif pending:pending['lines'].append(text)
        elif child.tag.endswith('}tbl') and pending:
            table=Table(child,doc._body);cells=[c for row in table.rows for c in row.cells]
            if len(cells)!=4 or len(table.rows)!=2:raise ValueError('Invalid options table')
            options=[];highlight=[]
            for i,c in enumerate(cells):
                if not c.text.startswith(chr(65+i)+'. '):raise ValueError('Option ordering differs')
                options.append(re.sub(r'(?m)^[ABCD]\.\s*','',c.text.strip()))
                if c._tc.xpath('.//w:highlight[@w:val="yellow"]') or c._tc.xpath('.//w:shd[@w:fill="FFFF00"]'):highlight.append(i)
            n=pending['n'];correct,key=keys[n]
            if highlight!=[correct] or normal(options[correct])!=normal(key):raise ValueError(f'Answer mismatch Q{n}')
            question='\n'.join(pending['lines'])
            if len(set(options))!=4 or any(not re.search(r'[\u0600-\u06ff]',x) for x in [question,*options]):raise ValueError(f'Invalid bilingual text Q{n}')
            answer=options[correct].splitlines();questions.append({'id':f'dit-powerpoint-ch3-q{n:03d}','sourceNumber':n,'sourceSection':topic,'topic':topic,'question':question,'options':options,'correctIndex':correct,'explanation':f'Correct answer: {answer[0]}\nدرست جواب: '+ ' '.join(answer[1:])});pending=None
    assert not pending and sorted(keys)==list(range(1,101)) and [q['sourceNumber'] for q in questions]==list(range(1,101))
    assert len({q['question'] for q in questions})==100 and len(topics)==len(set(topics))==10 and set(Counter(q['topic'] for q in questions).values())=={10}
    return {'sourceFile':Path(source).name,'sourceSha256':hashlib.sha256(Path(source).read_bytes()).hexdigest(),'classSlug':'dit-intermediate','subjectSlug':'dit-computer-science','semesterNumber':1,'chapterId':'chapter-dit-computer-science-powerpoint','chapterNumber':5,'chapterTitle':'Microsoft PowerPoint','bookTitle':'MS Office','displayChapterNumber':3,'languages':['en','ur'],'sourceSections':topics,'questions':questions}
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('source');p.add_argument('output');a=p.parse_args();bank=extract(a.source);Path(a.output).parent.mkdir(parents=True,exist_ok=True);Path(a.output).write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print('100 bilingual questions, ten topics; all highlighted options match the teacher answer key.')
