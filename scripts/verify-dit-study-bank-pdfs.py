"""Check printed question text and record PDF page counts after browser printing."""
from pathlib import Path
from collections import Counter
import json, re, unicodedata, subprocess, shutil, sys
from pypdf import PdfReader
root=Path(__file__).resolve().parents[1]
source=json.loads((root/'artifacts/dit-study-20261124/bank-source.json').read_text(encoding='utf-8'))['banks']
manifest_path=root/'content/dit/study-banks.generated.json'
manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
pdftotext=shutil.which('pdftotext') or str(Path(sys.executable).parents[1]/'native/poppler/Library/bin/pdftotext.exe')
def normalize(value):
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFKC', value)).strip()
for bank, record in zip(source,manifest,strict=True):
    reader=PdfReader(root/'public'/record['url'].lstrip('/'))
    raw=(subprocess.check_output([pdftotext,'-enc','UTF-8',str(root/'public'/record['url'].lstrip('/')),'-']).decode('utf-8')
         if Path(pdftotext).exists() else '\f'.join(p.extract_text() or '' for p in reader.pages))
    text=normalize(raw)
    questions=[q for m in bank['modules'] for q in m['questions']]
    for q in questions:
        for value in [q['question'],*q['options'],q['explanation']]:
            # PDF extraction can return RTL runs in visual order; English runs
            # remain logical. Preserve and compare the complete Urdu in HTML,
            # and check Arabic glyph counts across the PDF separately below.
            for line in value.splitlines():
                if not re.search(r'[\u0600-\u06ff]',line):
                    assert normalize(line) in text, f"Missing printed text: {q['id']}"
    expected=Counter(c for q in questions for value in [q['question'],*q['options'],q['explanation']] for c in normalize(value) if '\u0620'<=c<='\u06ff' and unicodedata.category(c).startswith('L'))
    actual=Counter(text)
    assert all(actual[c]>=count for c,count in expected.items()), 'Printed Urdu glyph coverage failed: '+str([(hex(ord(c)),n,actual[c]) for c,n in expected.items() if actual[c]<n])
    assert all('raytechinstitute.com' in page for page in raw.split('\f') if page.strip())
    record['pages']=len(reader.pages)
    print(f"{bank['id']}: {len(reader.pages)} pages; all English text, Urdu glyph counts and page branding checked.",flush=True)
manifest_path.write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
