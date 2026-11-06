"""Convert the supplied topology DOCX to print HTML without changing its content."""
import argparse
import base64
import html
from pathlib import Path
from docx import Document
from docx.table import Table
from docx.text.paragraph import Paragraph

parser = argparse.ArgumentParser()
parser.add_argument('source')
parser.add_argument('output')
args = parser.parse_args()
doc = Document(args.source)
assert len(doc.tables) == 110 and not len(doc.inline_shapes)
font = base64.b64encode(Path('public/fonts/noto-naskh-arabic/NotoNaskhArabic.ttf').read_bytes()).decode()

def lines(text):
    result = []
    for line in text.splitlines():
        if not line.strip():
            continue
        # Bilingual headings put English and Urdu on one line. Separate their
        # direction explicitly while retaining both strings and source order.
        segments = line.split(' / ') if ' / ' in line else [line]
        for segment in segments:
            urdu = any('\u0600' <= c <= '\u06ff' for c in segment)
            result.append(f'<span lang="{"ur" if urdu else "en"}" dir="{"rtl" if urdu else "ltr"}">{html.escape(segment.strip())}</span>')
    return ''.join(result)

parts = []
question_open = False
questions = 0
topics = 0
keys = False
for child in doc.element.body:
    if child.tag.endswith('}p'):
        p = Paragraph(child, doc._body)
        text = p.text.strip()
        if not text:
            continue
        if text.startswith('Q') and text.split('.')[0][1:].isdigit():
            assert not question_open
            parts.append('<section class="question"><p class="prompt">' + lines(text) + '</p>')
            question_open = True
            questions += 1
        elif p.style.name == 'Title':
            parts.append('<h1>' + lines(text) + '</h1>')
        elif p.style.name == 'Heading 1':
            assert not question_open
            keys = 'Answer Key' in text
            if not keys:
                topics += 1
            parts.append('<h2 class="new-page">' + lines(text) + '</h2>')
        elif p.style.name == 'Heading 2':
            
            if keys:
                parts.append('<section class="answer-topic"><h3>' + lines(text) + '</h3>')
            else:
                topics += 1
                parts.append('<h2' + (' class="new-page"' if topics > 1 else '') + '>' + lines(text) + '</h2>')
        else:
            parts.append(('<h1>' + lines(text) + '</h1>') if not parts else ('<p>' + lines(text) + '</p>'))
    elif child.tag.endswith('}tbl'):
        table = Table(child, doc._body)
        kind = 'key' if keys else 'options'
        rows = []
        for row in table.rows:
            cells = []
            for cell in row.cells:
                marked = cell._tc.xpath('.//w:highlight[@w:val="yellow"]') or cell._tc.xpath('.//w:shd[@w:fill="FFFF00"]')
                cells.append('<td class="' + ('correct' if marked else '') + '">' + lines(cell.text) + '</td>')
            rows.append('<tr>' + ''.join(cells) + '</tr>')
        parts.append('<table class="' + kind + '"><tbody>' + ''.join(rows) + '</tbody></table>')
        if question_open:
            parts.append('</section>')
            question_open = False
        elif keys:
            parts.append('</section>')
assert questions == 100 and topics == 10 and not question_open
css = f'''@font-face{{font-family:Urdu;src:url(data:font/ttf;base64,{font}) format("truetype");font-weight:400 700}}
@page{{size:A4;margin:12mm 12mm 16mm}}*{{box-sizing:border-box}}body{{font:9.5pt/1.35 Arial,sans-serif;color:#111;margin:0}}
h1{{font-size:21pt;margin:0 0 4mm}}h2{{font-size:15pt;margin:0 0 4mm;break-after:avoid;break-inside:avoid}}h3{{font-size:12pt;margin:5mm 0 2mm;break-after:avoid;break-inside:avoid}}.answer-topic{{break-inside:avoid}}
p{{margin:1.5mm 0}}span{{display:block;unicode-bidi:isolate}}[lang=ur]{{font:11.5pt/1.4 Urdu;text-align:right;margin-top:1mm;font-weight:400}}
.new-page{{break-before:page}}.question{{break-inside:avoid;margin:0 0 4mm}}.prompt{{font-weight:700}}table{{width:100%;border-collapse:collapse;table-layout:fixed;margin:2mm 0}}
td{{border:.25mm solid #aebdca;padding:1.7mm;vertical-align:top;overflow-wrap:anywhere}}tr{{break-inside:avoid}}.options td{{width:50%}}.correct{{background:#fff0b3}}
.key td:nth-child(1),.key td:nth-child(2){{width:9%;text-align:center}}.key{{break-inside:avoid}}'''
out = Path(args.output)
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Microsoft PowerPoint Conceptual MCQs</title><style>' + css + '</style></head><body>' + ''.join(parts) + '</body></html>', encoding='utf-8')
print('Converted 100 questions, 10 topics and all 10 teacher answer tables; bilingual content retained.')
