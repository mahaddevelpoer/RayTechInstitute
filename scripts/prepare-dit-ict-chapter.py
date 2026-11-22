"""Build original syllabus-aligned ICT material locally; never connect to production."""
from pathlib import Path
from collections import Counter
from html import escape
import json
import hashlib
import re
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / 'content/dit/ict-chapter-1.json'
data = json.loads(source.read_text(encoding='utf-8'))
dest = ROOT / 'public/documents/dit/ict'
dest.mkdir(parents=True, exist_ok=True)
prefix = 'ict-chapter-1-introduction-to-computers'
questions = []
for topic in data['topics']:
    for raw in topic['questions']:
        question, correct, a, b, c, explanation = raw
        index = len(questions)
        position = [2,0,3,1,0,2,1,3,2,1,3,0][index % 12]
        options = [a,b,c]
        options.insert(position, correct)
        questions.append(dict(id=f'dit-ict-ch1-q{index+1:02}', classSlug='dit-intermediate',subjectSlug='dit-ict',chapterNumber=1,topic=f"{topic['code']} {topic['title']}", question=question, options=options, correctIndex=position, explanation=explanation))
assert len(questions) == 60
assert len({q['question'] for q in questions}) == 60
assert Counter(q['correctIndex'] for q in questions) == {0:15,1:15,2:15,3:15}
assert all(len(set(q['options']))==4 for q in questions)

short = [
('Define a computer.', 'A computer is a programmable electronic device that accepts data, processes it according to instructions, produces results and can store data and results.'),
('Distinguish data from information.', 'Data are raw facts or symbols. Information is data interpreted in a useful context. Individual marks are data; a labelled report of a total and grade is information.'),
('State the stored-program concept.', 'Program instructions are stored in memory. A general-purpose machine can perform different tasks by loading different programs instead of rebuilding its hardware.'),
('List the main hardware roles.', 'Input captures data, processing executes instructions, output presents results, storage retains saved data and communication exchanges data with other devices.'),
('How do RAM and an SSD differ?', 'RAM normally holds working programs and data temporarily and is volatile. An SSD retains saved files when power is removed. Save important work to persistent storage.'),
('Why is a touchscreen both input and output?', 'Its display presents visual output while its touch sensor accepts the user\'s input. A device can perform multiple roles.'),
('Distinguish system software from application software.', 'System software manages or supports computer operation, as an operating system or driver does. Application software supports user tasks, such as writing documents or editing images.'),
('Distinguish downloading, installation and execution.', 'Downloading transfers files. Installation prepares and configures software for use. Execution runs the program instructions. These are different operations.'),
('Define an algorithm.', 'An algorithm is a finite ordered set of clear steps for solving a problem. It can be described before choosing a programming language.'),
('Distinguish testing from debugging.', 'Testing compares observed behaviour with expected results. Debugging investigates a fault\'s cause and corrects it. A fix should then be tested again.'),
('What is an embedded computer?', 'It is a computer built into a larger product to control or monitor particular functions, such as the controller inside a washing machine.'),
('Give two computer applications and one responsibility in each.', 'A school system calculates grades and must use accurate marks. A patient-records system stores clinical information and must limit access to authorised users.')
]
long = [
('Explain the evolution of electronic computing.', [('Early methods','Calculating aids and mechanical devices supported arithmetic before electronic machines. Electromechanical machines combined electrical switching with mechanical movement.'),('Electronic developments','The common generation model associates vacuum tubes with the first generation, transistors with the second and integrated circuits with the third. Microprocessors are associated with the fourth. Dates and developments overlap.'),('Stored programs and modern use','Storing instructions in memory makes different tasks possible on the same general-purpose hardware. Smaller components helped make personal and mobile systems practical. AI-oriented fifth-generation descriptions are broad, not a universal hardware test.'),('Example','A modern school computer can run both document-editing and accounting applications by using different programs.')]),
('Explain input, processing, output, storage and communication using a school result system.', [('Input','A teacher enters marks using a keyboard. The program checks the permitted range and identifies each student.'),('Processing','The processor executes instructions that add marks, calculate percentages and apply the stated grade rules. RAM holds data and program state during this work.'),('Output and storage','A monitor shows the result and a printer can produce a report. Saving the file on an SSD provides persistent storage; merely viewing the report does not save it.'),('Communication and responsibility','A network can transfer approved results to an authorised office. Incorrect marks or grade rules can produce incorrect results, so the teacher must review them.')]),
('Compare system software and application software and explain safe installation.', [('System software','An operating system manages resources and supports applications. Drivers help it communicate with specific hardware. These functions support operation of the computer.'),('Application software','Word processors, spreadsheets and image editors help users carry out specific tasks. A program\'s price or download method does not determine its category.'),('Installation and use','Check compatibility, available resources, licence and publisher. Obtain a trustworthy installer, review permissions and follow its instructions. Start the program to run it; use its supported uninstaller to remove it.'),('Maintenance','Review updates, keep important files backed up and avoid untrusted installers. Deleting a shortcut normally removes a link rather than the application.')]),
('Describe a simple software-development process for an average calculator.', [('Requirements and design','State the number of marks, allowed range and required output. Design steps to obtain three values, add them, divide by three and display the mean.'),('Implementation','Write code expressing the design. Use meaningful variable names and clear input and output. Reject or handle unsuitable input according to the requirements.'),('Testing and debugging','For 10, 20 and 30, expect 20. Compare the observed result. If the code divides by two, investigate and fix that logical error. Test again after the change.'),('Release and maintenance','Provide instructions, release the checked program and maintain it when requirements change or faults are found. Passing a few tests does not prove every possible case correct.')]),
('Compare personal, embedded, server, mainframe and supercomputer systems.', [('Individual and embedded use','A personal computer supports an individual\'s work. Desktops are generally stationary; laptops are portable. Embedded computers control functions inside products.'),('Services','Servers provide resources to clients. Thin clients rely substantially on servers but still contain hardware and perform some local work.'),('Large workloads','Mainframes emphasise dependable high-volume transaction processing. Supercomputers emphasise very large computational workloads such as scientific simulations.'),('Selection','Categories overlap. Select by workload, mobility, reliability and cost rather than by cabinet size or product name alone.')]),
('Explain computer applications in the eight sectors named by the syllabus.', [('Education and finance','Learning platforms, quizzes and marks processing support education. Finance systems record transactions, calculate balances and support payments.'),('Government and health care','Government systems manage registrations and services. Health-care systems manage appointments and clinical records and support qualified interpretation.'),('Science and publishing','Scientific computing analyses measurements and models processes. Publishing tools support writing, editing, page layout and distribution.'),('Travel and manufacturing','Travel systems check availability and manage reservations. Manufacturing systems support design, scheduling and machine control.'),('Responsibilities','Use accurate input, protect personal data, maintain backups and apply appropriate human review. Automation can repeat mistakes as readily as correct operations.')])
]
test_indices = [1,3,7,10,12,14,16,19,22,24,27,30,33,36,41,44,48,51,55,59]
test_questions = [questions[i] for i in test_indices]
practical = [
('Identify and classify devices','Observe available devices without opening a powered computer. Record one input device, one output device, one storage device and one communication device. Explain any device with two roles.','A labelled list with correct roles and reasons.'),
('Trace a marks calculation','Use three sample marks: 10, 20 and 30. Write the input, addition, division by three and displayed result. Save the explanation as a file.','Mean 20; distinguish working memory from the saved file.'),
('Classify installed software','Inspect the names of applications already available on a permitted device. Identify its operating system and two applications. Do not install unknown software.','A correct system/application distinction and an explanation of each task.'),
('Design an algorithm','Write clear ordered steps for calculating the mean of three values. Test your steps with two sets of values and state the expected results.','A finite set of steps with correct input, processing and output.'),
('Choose an appropriate computer','Choose a system for a travelling student, a washing-machine controller and a weather-simulation centre. Give reasons based on the task.','Portable personal computer, embedded controller and high-performance computing system, with reasons.')
]

def mcq_markdown(q, number, answer=True):
    result = [f"### Q{number}. {q['question']}"]
    for i,opt in enumerate(q['options']):
        value=f"{chr(65+i)}) {opt}"
        result.append(f"**{value}**" if answer and i==q['correctIndex'] else value)
    if answer: result.append(f"**Correct answer: {chr(65+q['correctIndex'])}.** {q['explanation']}")
    return '\n\n'.join(result)

parts=["## Chapter overview and syllabus coverage", "This original English study guide follows PBTE's two-year D.I.T first-semester ICT Module 1, syllabus sections 1.1 to 1.6. It includes 60 explained revision MCQs, six topic guides and a separate practice test. These are authored practice questions, not verified past-paper questions.", "| Syllabus section | Topic | Revision MCQs |\n|---|---|---|"+'\n'+ '\n'.join(f"| {t['code']} | {t['title']} | 10 |" for t in data['topics']), "## Topic-wise revision MCQs"]
for t_index,t in enumerate(data['topics']):
    parts.append(f"## {t['code']} {t['title']} MCQs")
    parts.extend(mcq_markdown(q,t_index*10+i+1) for i,q in enumerate(questions[t_index*10:(t_index+1)*10]))
parts.append('## Easy topic-wise notes')
for t in data['topics']:
    parts += [f"## {t['code']} {t['title']}",t['notes'],'### Practical examples','\n'.join('- '+v for v in t['examples']),'### Common mistakes','\n'.join('- '+v for v in t['mistakes']),'### Quick revision','\n'.join('- '+v for v in t['revision'])]
parts += ['## Diagrams and comparisons', '![Input processing output and storage diagram](/documents/dit/ict/computer-system-flow.svg)', 'Input supplies data to processing; processing produces output and exchanges data with storage. Communication allows the system to exchange data with other devices.', '| Feature | RAM | SSD or hard drive |\n|---|---|---|\n| Main role | Working memory | Persistent storage |\n| Power removed | Normally loses contents | Retains saved data |\n| Student action | Edit current work | Save a file |', '| Category | Main role | Example |\n|---|---|---|\n| System software | Support computer operation | Operating system, driver |\n| Application software | Support a user task | Word processor, spreadsheet |', '## Solved short questions']
parts += [f"### {i+1}. {q}\n\n{a}" for i,(q,a) in enumerate(short)]
parts.append('## Solved long questions')
for i,(q,sections) in enumerate(long):
    parts.append(f'### {i+1}. {q}')
    parts += [f'**{h}.** {text}' for h,text in sections]
parts += ['## Expected practice and past-paper status', 'The questions in this guide are original syllabus-based practice. No supplied past paper was available for verification. No board/year appearance, frequency claim or guaranteed exam question is asserted. Use all six topic sections for preparation.', '## Practical activities and viva preparation']
for name,steps,result in practical: parts += [f'### {name}',steps,f'**Expected result:** {result}']
parts += ['### Viva questions', 'Explain why a touchscreen has two roles. Why does saving matter? How is a program different from an algorithm? Why can automation repeat a mistake? Use the topic notes and solved answers above to check your explanation.', '## Chapter practice test', 'Suggested practice format: 20 MCQs, 10 short questions and 3 long questions. This is a learning exercise, not an official PBTE paper pattern. Attempt it before reading the key. Some MCQs revisit the revision bank to check retention.']
parts += [mcq_markdown(q,i+1,False) for i,q in enumerate(test_questions)]
parts.append('### Short questions')
parts += [f'{i+1}. {short[k][0]}' for i,k in enumerate([0,1,3,4,5,6,7,8,9,10])]
parts += ['### Long questions']+[f'{i+1}. {long[k][0]}' for i,k in enumerate([1,3,5])]
parts += ['## Practice test answer key and explanations']+[f"{i+1}. **{chr(65+q['correctIndex'])}**. {q['explanation']}" for i,q in enumerate(test_questions)]
parts += ['### Written-answer guidance', 'Short questions correspond to solved short answers 1, 2, 4, 5, 6, 7, 8, 9, 10 and 11. Long questions correspond to solved long answers 2, 4 and 6. Award credit for correct concepts, clear terminology, relevant examples and labelled diagrams; do not require identical wording.', '## Sources and further study', f"- [PBTE official two-year DIT syllabus, ICT Module 1, page 7]({data['syllabusUrl']})", '- [IBM explanation of computer hardware](https://www.ibm.com/think/topics/hardware)', '- [Computer History Museum semiconductor timeline](https://www.computerhistory.org/siliconengine/timeline/)']
markdown='\n\n'.join(parts)+'\n'
(ROOT/'content/dit/ict-chapter-1.md').write_text(markdown,encoding='utf-8')

navy=colors.HexColor('#032C68')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyGuide',fontName='Helvetica',fontSize=10.5,leading=13.2,spaceAfter=6))
styles.add(ParagraphStyle(name='OptionGuide',fontName='Helvetica',fontSize=10,leading=13,spaceAfter=2,leftIndent=10))
styles.add(ParagraphStyle(name='CorrectGuide',parent=styles['OptionGuide'],backColor=colors.HexColor('#e5f3e7')))
styles['Title'].textColor=navy
styles['Heading1'].textColor=navy
styles['Heading2'].textColor=navy
story=[]
def p(text,style='BodyGuide'):
    return Paragraph(escape(text),styles[style])
def heading(text): story.extend([p(text,'Heading1'),Spacer(1,6)])
def add_mcq(q,num,reveal=True):
    block=[p(f"Q{num}. {q['question']}")]
    block += [p(f"{chr(65+i)}) {opt}",'CorrectGuide' if reveal and i==q['correctIndex'] else 'OptionGuide') for i,opt in enumerate(q['options'])]
    if reveal: block += [p(f"Answer {chr(65+q['correctIndex'])}. {q['explanation']}")]
    block.append(Spacer(1,7))
    story.append(KeepTogether(block))
def canvas_page(canvas,doc):
    canvas.saveState()
    canvas.setFillColor(colors.HexColor('#eaf0f8'))
    canvas.translate(306,396); canvas.rotate(40); canvas.setFont('Helvetica-Bold',40)
    canvas.drawCentredString(0,0,'RAYTECH INSTITUTE')
    canvas.restoreState(); canvas.saveState()
    canvas.setFillColor(navy);canvas.setFont('Helvetica-Bold',9)
    canvas.drawString(46,760,'RAYTECH INSTITUTE')
    canvas.setFont('Helvetica',8);canvas.drawRightString(566,760,'Learn. Understand. Apply.')
    canvas.drawString(46,30,'D.I.T Semester 1 | ICT Chapter 1')
    canvas.drawRightString(566,30,f'Page {doc.page}')
    canvas.restoreState()
story += [Spacer(1,80),p('Introduction to Computers','Title'),p('D.I.T two-year programme | First semester','Heading2'),p('Introduction to ICT | Chapter 1','Heading2'),Spacer(1,20),p('60 explained MCQs, easy topic notes, solved questions, practical activities and a separate chapter practice test.'),p('Original English study material aligned to PBTE syllabus sections 1.1 to 1.6. Practice questions are not verified past-paper questions.'),PageBreak()]
heading('Chapter overview and topic coverage')
story += [p('Read each topic, attempt its questions and explain the reason for each answer. Use the separate test after revision. All six syllabus sections below are covered.')]
table=Table([['Section','Topic','MCQs']]+[[t['code'],Paragraph(escape(t['title']),styles['BodyGuide']),'10'] for t in data['topics']],colWidths=[55,380,45],hAlign='LEFT')
table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),navy),('TEXTCOLOR',(0,0),(-1,0),colors.white),('GRID',(0,0),(-1,-1),.5,colors.HexColor('#d9d9d9')),('VALIGN',(0,0),(-1,-1),'MIDDLE'),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
story.extend([table,Spacer(1,16),p('The six topic groups each contain ten revision MCQs. Their correct options are shaded light green. The final practice test keeps answers separate.'),PageBreak()])
for t_index,t in enumerate(data['topics']):
    heading(f"{t['code']} {t['title']} MCQs")
    for i,q in enumerate(questions[t_index*10:(t_index+1)*10]): add_mcq(q,t_index*10+i+1)
    story.append(PageBreak())
for t in data['topics']:
    heading(f"{t['code']} {t['title']} Notes")
    for paragraph in t['notes'].split('\n\n'): story.append(p(paragraph))
    for label,key in [('Practical examples','examples'),('Common mistakes','mistakes'),('Quick revision','revision')]:
        story.append(p(label,'Heading2'))
        story.extend(p('- '+v) for v in t[key])
    story.append(PageBreak())
heading('System diagram and comparisons')
# Editable equivalent in Word; vector diagram in PDF and SVG on the website.
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Polygon
d=Drawing(480,155)
for x,label in [(0,'INPUT'),(180,'PROCESSING'),(360,'OUTPUT')]:
    d.add(Rect(x,90,120,40,fillColor=colors.HexColor('#e8effa'),strokeColor=navy));d.add(String(x+60,105,label,textAnchor='middle',fontSize=10,fillColor=navy))
for x in [125,305]:
    d.add(Line(x,110,x+45,110,strokeColor=navy));d.add(Polygon([x+45,110,x+38,114,x+38,106],fillColor=navy))
d.add(Rect(180,10,120,40,fillColor=colors.HexColor('#e8effa'),strokeColor=navy));d.add(String(240,25,'STORAGE',textAnchor='middle',fontSize=10,fillColor=navy))
d.add(Line(235,50,235,90,strokeColor=navy));d.add(Polygon([235,90,231,83,239,83],fillColor=navy));d.add(Line(245,90,245,50,strokeColor=navy));d.add(Polygon([245,50,241,57,249,57],fillColor=navy))
story.extend([d,p('Input supplies data; processing executes instructions; output presents results. Processing reads saved data from storage and writes results back to storage. Communication exchanges data with other devices.')])
for text in ['RAM is working memory and is normally volatile. An SSD is persistent storage for saved files.','System software manages or supports computer operation. Application software carries out user tasks.','A mainframe prioritises dependable high-volume transaction work. A supercomputer prioritises very large computational workloads.']:
    story.append(p(text))
story.append(PageBreak())
heading('Solved short questions')
for i,(q,a) in enumerate(short):story.extend([p(f'{i+1}. {q}','Heading2'),p(a)])
heading('Solved long questions')
for i,(q,sections) in enumerate(long):
    story.append(p(f'{i+1}. {q}','Heading2'))
    for h,text in sections: story.append(p(h+': '+text))
story.append(PageBreak());heading('Practical activities and viva')
for name,steps,result in practical: story.extend([p(name,'Heading2'),p(steps),p('Expected result: '+result)])
story += [p('Viva questions','Heading2'),p('Why does a touchscreen have two roles? Why does saving matter? How is an algorithm different from a program? Why can automation repeat a mistake?'),p('Past-paper status','Heading2'),p('All questions are authored syllabus-based practice. No supplied past paper was available for verification. No board/year appearance or guaranteed exam prediction is claimed.'),PageBreak()]
heading('Chapter practice test')
story.append(p('Learning exercise: 20 MCQs, 10 short questions and 3 long questions. This is not a verified official PBTE paper pattern. Some questions revisit the revision bank. Do not consult the following answer key until you have attempted the test.'))
for i,q in enumerate(test_questions):add_mcq(q,i+1,False)
story.append(PageBreak())
story.append(p('Short questions','Heading2'))
for i,k in enumerate([0,1,3,4,5,6,7,8,9,10]):story.append(p(f'{i+1}. {short[k][0]}'))
story.append(p('Long questions','Heading2'))
for i,k in enumerate([1,3,5]):story.append(p(f'{i+1}. {long[k][0]}'))
story.append(PageBreak());heading('Practice test answer key')
for i,q in enumerate(test_questions):story.append(p(f"{i+1}. {chr(65+q['correctIndex'])}. {q['explanation']}"))
story.append(p('Written-answer guidance','Heading2'))
story.append(p('Short questions correspond to solved short answers 1, 2, 4, 5, 6, 7, 8, 9, 10 and 11. Long questions correspond to solved long answers 2, 4 and 6. Check concepts, examples and diagrams rather than memorising identical wording.'))
story.append(p('Sources and further study','Heading2'))
story.append(Paragraph(f'<link href="{escape(data["syllabusUrl"],quote=True)}" color="#1449AD">PBTE official two-year DIT first-semester syllabus, ICT Module 1, page 7</link>',styles['BodyGuide']))
story.extend([p('IBM: What is computer hardware? https://www.ibm.com/think/topics/hardware'),p('Computer History Museum: The Silicon Engine timeline. https://www.computerhistory.org/siliconengine/timeline/')])
pdf=dest/(prefix+'.pdf')
SimpleDocTemplate(str(pdf),pagesize=letter,rightMargin=46,leftMargin=46,topMargin=52,bottomMargin=48,title='ICT Chapter 1 Introduction to Computers',author='RayTech Institute').build(story,onFirstPage=canvas_page,onLaterPages=canvas_page)

# Word uses native editable paragraphs and tables. Rendering is a separate QA gate.
doc=Document()
section=doc.sections[0]
section.page_width=Inches(8.5);section.page_height=Inches(11)
section.top_margin=section.bottom_margin=Inches(.75)
section.left_margin=section.right_margin=Inches(.7)
normal=doc.styles['Normal'];normal.font.name='Arial';normal.font.size=Pt(11)
normal.paragraph_format.space_after=Pt(7)
for name in ['Heading 1','Heading 2','Heading 3']:
    doc.styles[name].font.color.rgb=RGBColor.from_string('1449AD')
doc.styles['Title'].font.color.rgb=RGBColor(0,0,0)
head=section.header.paragraphs[0];head.text='RAYTECH INSTITUTE | Learn. Understand. Apply.'
head.runs[0].font.size=Pt(9)
footer=section.footer.paragraphs[0];footer.text='D.I.T Semester 1 | ICT Chapter 1 | Page '
field=OxmlElement('w:fldSimple');field.set(qn('w:instr'),'PAGE');footer._p.append(field)
doc.add_paragraph('Introduction to Computers','Title')
doc.add_paragraph('D.I.T two-year programme | Introduction to ICT | Chapter 1')
doc.add_paragraph('60 explained MCQs, topic notes, solved questions and a separate practice test.')
doc.add_page_break()
for line in markdown.splitlines():
    if not line:continue
    if line.startswith('!['):
        doc.add_paragraph('INPUT -> PROCESSING -> OUTPUT\n                    STORAGE exchanges data with PROCESSING')
    elif line.startswith('|'):
        if re.match(r'^\|[-| ]+\|$',line):continue
        doc.add_paragraph(line.strip('|').replace('|','  |  '))
    elif line.startswith('### '):doc.add_paragraph(line[4:],'Heading 2')
    elif line.startswith('## '):doc.add_paragraph(line[3:],'Heading 1')
    else:
        paragraph=doc.add_paragraph()
        run=paragraph.add_run(line.replace('**',''))
        if re.match(r'^\*\*[A-D]\)',line):
            run.bold=True
            shading=OxmlElement('w:shd');shading.set(qn('w:fill'),'E5F3E7');run._r.get_or_add_rPr().append(shading)
drafts = ROOT / 'artifacts/dit-ict/word-draft'
drafts.mkdir(parents=True, exist_ok=True)
doc.save(drafts/(prefix+'.docx'))
svg='''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 220" width="640" height="220" role="img" aria-labelledby="title"><title id="title">Input processing output with storage exchanging data with processing</title><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#032c68"/></marker></defs><g fill="#e8effa" stroke="#032c68"><rect x="10" y="30" width="170" height="60" rx="5"/><rect x="235" y="30" width="170" height="60" rx="5"/><rect x="460" y="30" width="170" height="60" rx="5"/><rect x="235" y="150" width="170" height="60" rx="5"/></g><g fill="#032c68" font-family="Arial,sans-serif" font-size="18" text-anchor="middle"><text x="95" y="66">Input</text><text x="320" y="66">Processing</text><text x="545" y="66">Output</text><text x="320" y="186">Storage</text></g><g stroke="#032c68" stroke-width="2" marker-end="url(#arrow)"><path d="M180 60H230"/><path d="M405 60H455"/><path d="M310 95V145"/><path d="M330 145V95"/></g></svg>'''
(dest/'computer-system-flow.svg').write_text(svg,encoding='utf-8')
generated=dict(title=data['title'],content=markdown,questions=questions,pdfBytes=pdf.stat().st_size,pdfSha256=hashlib.sha256(pdf.read_bytes()).hexdigest(),sourceSha256=hashlib.sha256(source.read_bytes()).hexdigest())
(ROOT/'content/dit/ict-chapter-1.generated.json').write_text(json.dumps(generated,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(json.dumps({'questions':len(questions),'topics':len(data['topics']),'words':len(markdown.split()),'shortAnswers':len(short),'longAnswers':len(long),'practiceMCQs':len(test_questions),'pdfBytes':pdf.stat().st_size,'productionWrites':0}))
