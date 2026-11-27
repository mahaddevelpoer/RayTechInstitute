"""Local visual/text QA; needs Poppler, Pillow and pypdf. No production writes."""
import json, os, re, subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image, ImageDraw
from pypdf import PdfReader

root=Path('content/class11-computer-2027')
data=json.loads((root/'generated.json').read_text(encoding='utf-8'))
manifest=json.loads((root/'pdf-manifest.json').read_text(encoding='utf-8'))
qa=Path(os.environ.get('CLASS11_QA','D:/raytech-11cs-20261127/output'))
poppler=Path(os.environ.get('POPPLER_BIN',r'C:/Users/HP/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin'))
render=qa/'rendered';render.mkdir(exist_ok=True,parents=True)
def job(d):
 key=d['key'];pdf=Path('public/documents/class11/computer-2027')/(key+'.pdf')
 reader=PdfReader(pdf);pages=len(reader.pages)
 manifest[key]['pages']=pages
 if (poppler/'pdftotext.exe').exists():
  subprocess.run([str(poppler/'pdftotext.exe'),'-enc','UTF-8',str(pdf),str(qa/(key+'.txt'))],check=True,capture_output=True)
 elif not (qa/(key+'.txt')).exists() or (qa/(key+'.txt')).stat().st_mtime < pdf.stat().st_mtime:
  (qa/(key+'.txt')).write_text('\n'.join(p.extract_text() or '' for p in reader.pages),encoding='utf-8')
 text=(qa/(key+'.txt')).read_text(encoding='utf-8')
 assert '\ufffd' not in text,key
 if key=='400-mcq-bank':assert len(re.findall(r'Q\d+\.',text))==400
 if key in ['chapter-2','complete-study-book','400-mcq-bank']:assert '__name__' in text and '__main__' in text,key
 subprocess.run([str(poppler/'pdftoppm.exe'),'-scale-to','420','-png',str(pdf),str(render/key)],check=True,capture_output=True)
 images=sorted(render.glob(key+'-*.png'))
 assert len(images)==pages,(key,len(images),pages)
 for start in range(0,pages,24):
  chunk=images[start:start+24];sheet=Image.new('RGB',(6*310,4*450),'#cbd5e1');draw=ImageDraw.Draw(sheet)
  for i,p in enumerate(chunk):
   im=Image.open(p).convert('RGB');im.thumbnail((300,420));x=(i%6)*310;y=(i//6)*450;sheet.paste(im,(x,y+22));draw.text((x+4,y+4),f'{key} p{start+i+1}',fill='black')
  sheet.save(qa/f'contact-{key}-{start+1:03}.jpg',quality=85)
 return {'key':key,'pages':pages,'rendered':len(images),'missingGlyphs':0}
with ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(job,data['documents']))
(qa/'pdf-visual-review.json').write_text(json.dumps(results,indent=2)+'\n',encoding='utf-8')
(root/'pdf-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print(json.dumps(results));print('All pages rendered:',sum(r['pages'] for r in results))
