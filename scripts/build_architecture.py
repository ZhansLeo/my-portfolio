import json
import re
from pathlib import Path

SRC = Path("docs/architecture.md")
OUT = Path("public/data/architecture.json")

raw = SRC.read_text(encoding="utf-8")
lines = raw.split("\n")

elements = []
i = 0
in_code = False
code_lang = ""
code_lines = []
in_table = False
table_rows = []
in_list = False
list_items = []

def flush_code():
    global in_code, code_lang, code_lines
    if in_code:
        elements.append({"type": "code", "lang": code_lang, "content": "\n".join(code_lines)})
        code_lines = []
        in_code = False

def flush_table():
    global in_table, table_rows
    if in_table:
        if len(table_rows) > 1:
            elements.append({"type": "table", "rows": table_rows})
        table_rows = []
        in_table = False

def flush_list():
    global in_list, list_items
    if in_list:
        elements.append({"type": "list", "items": list_items})
        list_items = []
        in_list = False

while i < len(lines):
    line = lines[i]

    if line.startswith("```"):
        flush_table()
        flush_list()
        if in_code:
            flush_code()
        else:
            in_code = True
            code_lang = line[3:].strip() or "text"
        i += 1
        continue

    if in_code:
        code_lines.append(line)
        i += 1
        continue

    if line.startswith("# "):
        flush_table()
        flush_list()
        elements.append({"type": "h1", "text": line[2:].strip()})
    elif line.startswith("## "):
        flush_table()
        flush_list()
        elements.append({"type": "h2", "text": line[3:].strip()})
    elif line.startswith("### "):
        flush_table()
        flush_list()
        elements.append({"type": "h3", "text": line[4:].strip()})
    elif line.startswith("> "):
        flush_table()
        flush_list()
        elements.append({"type": "blockquote", "text": line[2:].strip()})
    elif line.startswith("|"):
        flush_list()
        if not in_table:
            in_table = True
            table_rows = []
        cells = [c.strip() for c in line.strip("|").split("|")]
        if all(re.match(r"^[-:]+$", c) for c in cells):
            table_rows.append({"type": "sep"})
        else:
            table_rows.append({"type": "row", "cells": cells})
    else:
        if in_table:
            flush_table()
        stripped = line.strip()
        if stripped.startswith("- "):
            list_items.append(stripped[2:])
            in_list = True
        elif stripped == "":
            flush_list()
        else:
            flush_list()
            if stripped:
                elements.append({"type": "p", "text": stripped})

    i += 1

flush_code()
flush_table()
flush_list()

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(elements, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"architecture.json exported ({len(elements)} elements)")