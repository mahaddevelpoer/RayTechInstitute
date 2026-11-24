"""Render all new guide pages and book covers for human visual review."""
import json
import os
import subprocess
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
QA = Path(os.environ.get('DIT_COMPLETION_QA', 'D:/raytech-dit-completion/qa')) / 'visual-review'
POPPLER = Path('C:/Users/HP/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe')
QA.mkdir(parents=True, exist_ok=True)
manifest = json.loads((ROOT / 'content/dit/completion/pdf-manifest.json').read_text(encoding='utf-8'))

def render_guide(item):
    key, guide = item
    folder = QA / key
    folder.mkdir(exist_ok=True)
    subprocess.run([str(POPPLER), '-scale-to', '400', '-png', str(ROOT / ('public' + guide['url'])), str(folder / 'page')], check=True, capture_output=True)
    pages = sorted(folder.glob('page-*.png'))
    assert len(pages) == guide['pages'], key
    width, height = 310, 430
    sheet = Image.new('RGB', (width * 4, height * ((len(pages) + 3) // 4)), '#cbd5e1')
    draw = ImageDraw.Draw(sheet)
    for i, page in enumerate(pages):
        with Image.open(page) as image:
            image.thumbnail((width - 12, height - 28))
            x, y = (i % 4) * width + 6, (i // 4) * height + 22
            sheet.paste(image, (x, y))
            draw.text((x, y - 18), f'{key} / page {i+1}', fill='#0f172a')
    sheet.save(QA / (key + '-contact.png'))
    return {'key': key, 'pages': len(pages)}

with ThreadPoolExecutor(max_workers=3) as pool:
    results = list(pool.map(render_guide, manifest.items()))

books = json.loads((ROOT / 'content/dit/completion/study-books.generated.json').read_text(encoding='utf-8'))
for i, book in enumerate(books):
    subprocess.run([str(POPPLER), '-f', '1', '-l', '2', '-scale-to', '1200', '-png', str(ROOT / ('public' + book['url'])), str(QA / ('book-' + str(i+1)))], check=True, capture_output=True)

(QA / 'render-report.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
print(json.dumps({'guides': len(results), 'pages': sum(r['pages'] for r in results), 'bookSamples': 10, 'directory': str(QA)}))
