"""Compile the reviewed guides; preserve page contents and add navigation outlines."""
from pathlib import Path
from html import escape
import hashlib,json,zipfile
from pypdf import PdfReader,PdfWriter
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle
from reportlab.lib.styles import getSampleStyleSheet,ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
ROOT=Path(__file__).resolve().parents[1]
QA=Path(r'D:\raytech-dit-completion\qa')
books=json.loads((QA/'book-sources.json').read_text(encoding='utf-8'))
modules=json.loads((QA/'authored-modules.json').read_text(encoding='utf-8'))
verification=json.loads((QA/'program-verification.json').read_text(encoding='utf-8'))
assert sorted(verification['numberedPracticals'])==list(range(1,30))
out=ROOT/'public/documents/dit/books';out.mkdir(parents=True,exist_ok=True)
styles=getSampleStyleSheet();styles.add(ParagraphStyle(name='GuideBody',fontName='Helvetica',fontSize=10,leading=14,spaceAfter=10));styles['Title'].textColor=colors.HexColor('#0f172a')
manifest=[]
for book in books:
    source=[];first=2;rows=[['Module','Guide','First book page']]
    for guide in book['guides']:
        file=ROOT/'public'/guide['url'].lstrip('/');reader=PdfReader(file)
        label='Workbook' if guide['extra'] else str(guide['module'])
        rows.append([label,Paragraph(escape(guide['title']),styles['GuideBody']),str(first)])
        source.append({**guide,'pages':len(reader.pages),'sha256':hashlib.sha256(file.read_bytes()).hexdigest()});first+=len(reader.pages)
    cover=QA/(book['id']+'-book-cover.pdf')
    story=[Paragraph('RAYTECH INSTITUTE',styles['Heading2']),Spacer(1,18),Paragraph(escape(book['title']),styles['Title']),Paragraph('D.I.T First Semester Study Book',styles['Heading1']),Paragraph('Original syllabus-aligned guides, solved answers, revision questions and practical workbooks. Not an official PBTE textbook or authenticated past-paper collection.',styles['GuideBody']),Paragraph('Use all mapped topics and keep instructor-checked lab evidence. GUI, physical equipment, Windows/Office and simulator exercises require their stated lab environment.',styles['GuideBody']),Paragraph('Study online: https://raytechinstitute.com/classes/dit-intermediate/',styles['GuideBody']),Paragraph('Prepared 24 November 2026',styles['GuideBody']),Spacer(1,8)]
    table=Table(rows,colWidths=[55,365,85],repeatRows=1,hAlign='LEFT');table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#e8eff6')),('GRID',(0,0),(-1,-1),.4,colors.HexColor('#cbd5e1')),('FONTNAME',(0,0),(-1,0),'Helvetica-Bold'),('FONTSIZE',(0,0),(-1,-1),9),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]));story.append(table)
    SimpleDocTemplate(str(cover),pagesize=A4,leftMargin=45,rightMargin=45,topMargin=45,bottomMargin=45,title=book['title']+' DIT Study Book',author='RayTech Institute').build(story)
    assert len(PdfReader(cover).pages)==1,'Update contents page offsets if a cover grows beyond one page'
    writer=PdfWriter();writer.append(cover,outline_item='Contents and study guidance')
    for guide in source:writer.append(ROOT/'public'/guide['url'].lstrip('/'),outline_item=('Practical workbook' if guide['extra'] else 'Module '+str(guide['module']))+': '+guide['title'])
    writer.add_metadata({'/Title':book['title']+' - DIT First Semester Study Book','/Author':'RayTech Institute','/Subject':'Original PBTE-syllabus-aligned educational revision material'})
    filename=book['id']+'-study-book.pdf';target=out/filename
    with target.open('wb')as stream:writer.write(stream)
    count=len(PdfReader(target).pages);assert count==1+sum(guide['pages'] for guide in source)
    record={'id':book['id'],'title':book['title'],'url':'/documents/dit/books/'+filename,'chapters':book['chapters'],'guides':len(source),'pages':count,'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'sources':source}
    manifest.append(record);print(json.dumps({k:record[k]for k in ['id','chapters','guides','pages','bytes']}),flush=True)
(ROOT/'content/dit/completion/study-books.generated.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')

archive=ROOT/'public/documents/dit/complete/python-practical-solutions.zip'
cases=[]
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9)as package:
    package.writestr('README.txt','RayTech Institute DIT Semester 1 Python practical solutions\n\nThe official printed list contains numbered tasks 1-29. Its earlier 25-31 reference does not supply extra tasks 30/31.\nRun code in a new practice folder using Python 3. GUI tasks 25-29 require desktop Turtle/Tk. The additional Excel example requires pandas and openpyxl; it refuses to overwrite an existing practice workbook.\nThese are original educational solutions, not authenticated past-paper answers. Headless geometry checks do not claim actual GUI execution. Windows/Office/network installation changes are not performed by this archive.\n')
    for module in modules:
        if module['slug']!='dit-python':continue
        for exercise in module['labs']:
            if not exercise.get('code'):continue
            numbers=exercise.get('practicals',[]);filename=(f'{numbers[0]:02d}-'if numbers else'additional-')+exercise['id']+'.py'
            code='# '+exercise['title']+'\n# Environment: '+exercise.get('environment','Python 3 console')+'\n'+exercise['code']+'\n'
            package.writestr(filename,code)
            cases.append({'file':filename,'expected':exercise['expected'],'tests':exercise.get('tests',[{k:exercise[k]for k in ['stdin','stdout']if k in exercise}]),'codeSha256':hashlib.sha256(code.encode()).hexdigest()})
    package.writestr('TEST-CASES.json',json.dumps(cases,indent=2))
with zipfile.ZipFile(archive)as package:assert package.testzip()is None and len([n for n in package.namelist()if n.endswith('.py')])==30
(ROOT/'content/dit/completion/practical-download.generated.json').write_text(json.dumps({'url':'/documents/dit/complete/python-practical-solutions.zip','numberedSolutions':29,'additionalExcelExample':1,'bytes':archive.stat().st_size,'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'pythonSourceSha256':verification['pythonSourceSha256']},indent=2)+'\n',encoding='utf-8')
print('Five navigable study books and checked Python solution ZIP prepared.',flush=True)
