"""Read the user's Office question bank and cross-check highlights against its answer key."""
import argparse
import hashlib
import json
import re
from pathlib import Path
from docx import Document
from docx.table import Table
from docx.text.paragraph import Paragraph


def extract(source, *, word_2016=False):
    expected_count = 100 if word_2016 else 60
    expected_sections = 10 if word_2016 else 6
    document = Document(source)
    key_table = document.tables[-1]
    if [cell.text.strip() for cell in key_table.rows[0].cells] not in [["Q#", "Correct Option", "Correct Answer"], ["Question", "Option", "Correct Answer"]]:
        raise ValueError("The document answer key is missing.")
    keys = {}
    for row in key_table.rows[1:]:
        number, letter, answer = [cell.text.strip() for cell in row.cells]
        if not re.fullmatch("[ABCD]", letter) or int(number) in keys:
            raise ValueError("Invalid or repeated source answer key.")
        keys[int(number)] = (ord(letter) - ord("A"), answer)
    questions = []
    section = None
    pending = None
    section_names = []
    for child in document.element.body:
        if child.tag.endswith("}p"):
            text = Paragraph(child, document._body).text.strip()
            if not text:
                continue
            match = re.match(r"^Q(\d+)\.\s*(.+)$", text)
            if match:
                if pending:
                    raise ValueError("A question has no options.")
                pending = {"number": int(match[1]), "paragraphs": [match[2]], "section": section}
            elif pending:
                pending["paragraphs"].append(text)
            elif text not in ["Conceptual MCQ Question Bank", "Verified Answer Key", "Answer Key"] and not text.startswith(("DIT Part-I", "Chapter No.", "Chapter N0.", "Introduction to MS Office", "100 original practice MCQs")):
                section = text
                section_names.append(text)
        elif child.tag.endswith("}tbl") and pending:
            table = Table(child, document._body)
            cells = [cell for row in table.rows for cell in row.cells]
            if len(cells) != 4 or len(table.rows) != 2:
                raise ValueError("A question must have four options.")
            options = []
            highlighted = []
            for index, cell in enumerate(cells):
                if not cell.text.startswith(chr(65 + index) + ". "):
                    raise ValueError("Unexpected source option order.")
                options.append(re.sub(r"^[ABCD]\.\s*", "", cell.text.strip(), count=1))
                if cell._tc.xpath('.//w:highlight[@w:val="yellow"]') or cell._tc.xpath('.//w:shd[@w:fill="FFFF00"]'):
                    highlighted.append(index)
            number = pending["number"]
            correct, key_answer = keys[number]
            if highlighted != [correct] or options[correct].split("\n")[0] != key_answer:
                raise ValueError(f"Source highlight and answer key disagree at Q{number}.")
            question = "\n".join(pending["paragraphs"])
            if len(set(options)) != 4 or any(not re.search(r"[\u0600-\u06ff]", text) for text in [question, *options]):
                raise ValueError(f"Q{number} has missing bilingual text or repeated options.")
            answer_lines = options[correct].splitlines()
            questions.append({
                "id": (f"dit-ms-word-2016-ch2-q{number:03d}" if word_2016 else f"dit-ms-office-ch1-q{number:02d}"), "topic": pending["section"],
                "sourceNumber": number, "sourceSection": pending["section"], "question": question,
                "options": options, "correctIndex": correct,
                "explanation": f"Correct answer: {answer_lines[0]}\nدرست جواب: {' '.join(answer_lines[1:])}",
            })
            pending = None
    if pending or len(questions) != expected_count or sorted(keys) != list(range(1, expected_count + 1)) or [q["sourceNumber"] for q in questions] != list(range(1, expected_count + 1)):
        raise ValueError(f"Expected {expected_count} complete, sequential questions and answers.")
    if len({q["question"] for q in questions}) != expected_count or len(set(section_names)) != expected_sections:
        raise ValueError(f"Expected unique questions in {expected_sections} source sections.")
    if word_2016:
        return {"sourceFile": Path(source).name, "sourceSha256": hashlib.sha256(Path(source).read_bytes()).hexdigest(),
                "classSlug": "dit-intermediate", "subjectSlug": "dit-computer-science", "chapterNumber": 3,
                "chapterId": "chapter-dit-computer-science-ms-word-2016", "chapterTitle": "Microsoft Word 2016",
                "sourceChapterNumber": 2, "sourceChapterTitle": "Microsoft word", "languages": ["en", "ur"], "sourceSections": section_names, "questions": questions}
    return {"sourceFile": Path(source).name, "sourceSha256": hashlib.sha256(Path(source).read_bytes()).hexdigest(),
            "classSlug": "dit-intermediate", "subjectSlug": "dit-computer-science", "chapterNumber": 2,
            "chapterId": "chapter-dit-computer-science-ms-office", "chapterTitle": "MS Office",
            "sourceChapterNumber": 1, "sourceChapterTitle": "Introduction to Office Automation Software",
            "languages": ["en", "ur"], "sourceSections": section_names, "questions": questions}


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("source")
    parser.add_argument("output")
    parser.add_argument("--word-2016", action="store_true")
    args = parser.parse_args()
    bank = extract(args.source, word_2016=args.word_2016)
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    Path(args.output).write_text(json.dumps(bank, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Extracted {len(bank['questions'])} bilingual questions; all highlights match the answer key.")
