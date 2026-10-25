"""Prepare a faithful, printable HTML conversion without changing the DOCX."""
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
font = base64.b64encode(Path('public/fonts/noto-naskh-arabic/NotoNaskhArabic.ttf').read_bytes()).decode()

def lines(text):
    result = []
    for line in text.splitlines():
        # The supplied file contains replacement glyphs in its English separators.
        line = line.replace('\ufffd', '-').strip()
        if not line:
            continue
        urdu = any('\u0600' <= c <= '\u06ff' for c in line)
        result.append(f'<span lang="{"ur" if urdu else "en"}" dir="{"rtl" if urdu else "ltr"}">{html.escape(line)}</span>')
    return ''.join(result)

parts = []
topic_count = 0
table_count = 0
answer_keys = False
topic_titles = ['Communication Model and Components', 'Data Communication Process', 'Transmission Media and Protocols', 'Network Benefits and Classification', 'LAN, MAN and WAN', 'VLAN (Virtual Local Area Network)', 'VPN (Virtual Private Network)', 'Internet and Network Applications']
for child in doc.element.body:
    if child.tag.endswith('}p'):
        p = Paragraph(child, doc)
        if not p.text.strip():
            continue
        text = p.text.strip()
        if table_count == 8 and text.startswith('Correct options highlighted'):
            answer_keys = True
            parts.append('<h2 class="new-page">Answer key</h2><p>' + lines(text) + '</p>')
        elif answer_keys and text in topic_titles:
            parts.append('<h3>' + lines(text) + '</h3>')
        elif table_count < 8 and text in topic_titles:
            parts.append(f'<h2 class="topic {"new-page" if topic_count else ""}">{lines(text)}</h2>')
            topic_count += 1
        elif not parts:
            parts.append(f'<h1>{lines(text)}</h1>')
        else:
            parts.append(f'<p>{lines(text)}</p>')
    elif child.tag.endswith('}tbl'):
        table_count += 1
        table = Table(child, doc)
        rows = []
        for ri, row in enumerate(table.rows):
            cells = []
            for cell in row.cells:
                marked = cell._tc.xpath('.//w:highlight[@w:val="yellow"]') or cell._tc.xpath('.//w:shd[@w:fill="FFFF00"]')
                tag = 'th' if ri == 0 else 'td'
                cells.append(f'<{tag} class="{"correct" if marked else ""}">{lines(cell.text)}</{tag}>')
            rows.append('<tr>' + ''.join(cells) + '</tr>')
        parts.append('<table><colgroup><col style="width:6%"><col style="width:38%">' + '<col style="width:14%">' * 4 + '</colgroup><thead>' + rows[0] + '</thead><tbody>' + ''.join(rows[1:]) + '</tbody></table>')

assert topic_count == 8 and len(doc.tables) == 8
css = f'''@font-face{{font-family:Urdu;src:url(data:font/ttf;base64,{font}) format("truetype");font-weight:400 700}}
@page{{size:A4 landscape;margin:12mm 11mm 15mm}}*{{box-sizing:border-box}}body{{font:10pt/1.4 Arial,sans-serif;color:#111;margin:0}}h1{{font-size:19pt;margin:0 0 5mm}}h2{{font-size:14pt;margin:5mm 0 3mm;break-after:avoid}}h3{{font-size:11pt;margin:3mm 0 1mm;break-after:avoid}}p{{margin:2mm 0}}span{{display:block;unicode-bidi:isolate}}[lang=ur]{{font:12.5pt/1.5 Urdu;text-align:right;margin-top:1mm}}.new-page{{break-before:page}}table{{border-collapse:collapse;width:100%;table-layout:fixed;margin:3mm 0 5mm}}thead{{display:table-header-group}}tr{{break-inside:avoid}}td,th{{border:.25mm solid #9ca3af;padding:2mm;vertical-align:top;overflow-wrap:anywhere}}th{{font-weight:700;background:#e8edf3;text-align:left}}.correct{{background:#fff3b0}}'''
out = Path(args.output)
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>DIT Computer Networks Chapter 1 Basic Terminologies</title><style>' + css + '</style></head><body>' + ''.join(parts) + '</body></html>', encoding='utf-8')
print(f'Converted all {len(doc.tables)} topic tables and {len(doc.paragraphs)} source paragraphs to printable HTML.')
