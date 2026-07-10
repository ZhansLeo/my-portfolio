import json
import sqlite3
from pathlib import Path

DB = Path("local-data/agent.db")
OUT = Path("public/data/agent-rules.json")

OUT.parent.mkdir(parents=True, exist_ok=True)

if not DB.exists():
    print(f"agent.db not found, writing empty rules")
    OUT.write_text("[]", encoding="utf-8")
else:
    db = sqlite3.connect(DB)
    rows = db.execute(
        "SELECT id, trigger, rule FROM lessons WHERE status='approved' ORDER BY uses DESC, id DESC LIMIT 100"
    ).fetchall()
    rules = [{"id": row[0], "trigger": row[1], "rule": row[2]} for row in rows]
    OUT.write_text(json.dumps(rules, ensure_ascii=False, indent=2), encoding="utf-8")
    db.close()
    print(f"agent-rules.json exported to {OUT} ({len(rules)} rules)")