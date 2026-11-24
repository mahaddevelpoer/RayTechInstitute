"""Check actual PDF text coverage and collect pages; GUI layout is reviewed separately."""
from pathlib import Path
from collections import Counter
from concurrent.futures import ProcessPoolExecutor
import hashlib,json,re,unicodedata
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]
def plain(value):
    # Arial's PDF ToUnicode map can alias Urdu heh-goal and Arabic heh to
    # one printed glyph. Fold that confirmed glyph family for presence checks;
    # visual review still checks joined Urdu and reading direction.
    return unicodedata.normalize('NFKC',value).replace('\u06c1','\u0647')
def tokens(value):return re.findall(r'[A-Za-z_][A-Za-z0-9_]*',plain(value).lower())
def verify(task):
    module,note,meta=task
    pdf=ROOT/'public'/meta['url'].lstrip('/')
    reader=PdfReader(pdf);pages=[page.extract_text() or '' for page in reader.pages]
    text='\n'.join(pages)
    visible=re.sub(r'!\[[^\]]*\]\([^)]+\)','',note['content'])
    visible=re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',visible)
    visible=re.sub(r'^~~~[^\n]*$','',visible,flags=re.M)
    expected=Counter(tokens(visible));actual=Counter(tokens(text))
    missing={word:n-actual[word] for word,n in expected.items() if actual[word]<n}
    assert not missing,f"{module['key']} missing printed English tokens: {missing}"
    expected_arabic=Counter(c for c in plain(visible) if '\u0620'<=c<='\u06ff' and unicodedata.category(c).startswith('L'))
    printed=Counter(plain(text));missing_arabic={hex(ord(c)):n-printed[c] for c,n in expected_arabic.items() if printed[c]<n}
    assert not missing_arabic,f"{module['key']} missing Arabic-script letters: {missing_arabic}"
    assert all('raytechinstitute.com' in page for page in pages),'Page branding missing'
    assert hashlib.sha256(pdf.read_bytes()).hexdigest()==meta['sha256']
    return module['key'],len(reader.pages),len(expected),sum(expected_arabic.values())
if __name__=='__main__':
    path=ROOT/'content/dit/completion/pdf-manifest.json';meta=json.loads(path.read_text())
    data=json.loads((ROOT/'content/dit/completion/generated.json').read_text(encoding='utf-8'))
    notes={note['id']:note for note in data['notes']};notes.update(data['replacements'])
    tasks=[(module,notes[module['noteId']],meta[module['key']]) for module in data['modules']]
    report=[]
    with ProcessPoolExecutor(max_workers=3) as pool:
        for key,pages,words,arabic in pool.map(verify,tasks):
            meta[key]['pages']=pages;report.append({'key':key,'pages':pages,'distinctEnglishTokensChecked':words,'arabicLettersChecked':arabic})
            print(f'{key}: {pages} pages, text and branding checked.',flush=True)
    path.write_text(json.dumps(meta,indent=2)+'\n',encoding='utf-8')
    (Path(r'D:\raytech-dit-completion\qa')/'pdf-verification.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
