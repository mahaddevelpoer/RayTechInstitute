"""Extract the supplied bilingual topology bank without modifying the source or live data."""
import argparse
import hashlib
import json
import re
from collections import Counter
from pathlib import Path
from docx import Document
from docx.table import Table
from docx.text.paragraph import Paragraph


def normalise(text):
    return re.sub(r"\s+", " ", text.replace("/", " ")).strip()


def extract(source):
    document = Document(source)
    keys = {}
    for table in document.tables:
        if len(table.columns) != 3:
            continue
        for row in table.rows:
            values = [cell.text.strip() for cell in row.cells]
            if not re.fullmatch(r"\d+", values[0]) or not re.fullmatch("[ABCD]", values[1]):
                raise ValueError("Unexpected answer-key row")
            number = int(values[0])
            if number in keys:
                raise ValueError(f"Duplicate answer key Q{number}")
            keys[number] = (ord(values[1]) - 65, values[2])
    questions, topics = [], []
    pending = None
    topic = None
    for child in document.element.body:
        if child.tag.endswith("}p"):
            paragraph = Paragraph(child, document._body)
            text = paragraph.text.strip()
            if not text:
                continue
            if paragraph.style.name == "Heading 1":
                if "Teacher Answer Key" in text:
                    break
                topic = text
                topics.append(topic)
                continue
            match = re.match(r"^Q(\d+)\.\s*(.+)$", text)
            if match:
                if pending or not topic:
                    raise ValueError("Missing topic or question options")
                pending = {"number": int(match[1]), "lines": [match[2]], "topic": topic}
            elif pending:
                pending["lines"].append(text)
        elif child.tag.endswith("}tbl") and pending:
            table = Table(child, document._body)
            cells = [cell for row in table.rows for cell in row.cells]
            if len(table.rows) != 2 or len(cells) != 4:
                raise ValueError("Expected a two-by-two options table")
            options, highlighted = [], []
            for index, cell in enumerate(cells):
                if not re.match(rf"^{chr(65 + index)}\.\s+", cell.text):
                    raise ValueError("Unexpected option order")
                options.append(re.sub(r"^[ABCD]\.\s*", "", cell.text.strip(), count=1))
                if cell._tc.xpath('.//w:highlight[@w:val="yellow"]') or cell._tc.xpath('.//w:shd[@w:fill="FFFF00"]'):
                    highlighted.append(index)
            number = pending["number"]
            correct, answer = keys[number]
            if normalise(options[correct]) != normalise(answer):
                raise ValueError(f"Answer text disagrees with option at Q{number}")
            if highlighted and highlighted != [correct]:
                raise ValueError(f"Highlight disagrees with key at Q{number}")
            question = "\n".join(pending["lines"])
            if len(set(options)) != 4 or any(not re.search(r"[\u0600-\u06ff]", value) for value in [question, *options]):
                raise ValueError(f"Missing bilingual text or repeated options at Q{number}")
            lines = options[correct].splitlines()
            questions.append({"id": f"dit-network-topology-ch2-q{number:03d}", "sourceNumber": number,
                              "sourceSection": topic, "topic": topic, "question": question,
                              "options": options, "correctIndex": correct,
                              "explanation": f"Correct answer: {lines[0]}\nدرست جواب: {' '.join(lines[1:])}"})
            pending = None
    if pending or sorted(keys) != list(range(1, 101)) or [q["sourceNumber"] for q in questions] != list(range(1, 101)):
        raise ValueError("Expected exactly 100 sequential questions and answers")
    if len(set(q["question"] for q in questions)) != 100 or len(topics) != 10 or set(Counter(q["topic"] for q in questions).values()) != {10}:
        raise ValueError("Expected 10 unique topics, each with 10 unique questions")
    return {"sourceFile": Path(source).name, "sourceSha256": hashlib.sha256(Path(source).read_bytes()).hexdigest(),
            "classSlug": "dit-intermediate", "subjectSlug": "dit-computer-science", "semesterNumber": 1,
            "chapterId": "chapter-dit-computer-science-network-topology", "chapterNumber": 4,
            "chapterTitle": "Network Topology", "bookTitle": "Computer Networking", "displayChapterNumber": 2,
            "sourceChapterNumber": 2, "languages": ["en", "ur"], "sourceSections": topics, "questions": questions}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("source")
    parser.add_argument("output")
    args = parser.parse_args()
    bank = extract(args.source)
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    Path(args.output).write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Extracted 100 bilingual MCQs in 10 topics; all 100 answers match the supplied answer key.")
