import json
import sqlite3
from pathlib import Path

DB = Path("local-data/agent.db")


def connect():
    DB.parent.mkdir(exist_ok=True)
    db = sqlite3.connect(DB)
    db.execute("""CREATE TABLE IF NOT EXISTS events (
        event_id TEXT PRIMARY KEY, channel TEXT, sender TEXT,
        text TEXT, status TEXT, result TEXT, created_at TEXT
    )""")
    db.execute("""CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trigger TEXT, rule TEXT, evidence TEXT,
        status TEXT DEFAULT 'candidate', uses INTEGER DEFAULT 0
    )""")
    return db


def seen(event_id):
    with connect() as db:
        return db.execute("SELECT 1 FROM events WHERE event_id=?", (event_id,)).fetchone() is not None


def save_event(event, status, result=""):
    with connect() as db:
        db.execute("INSERT OR IGNORE INTO events VALUES (?, ?, ?, ?, ?, ?, ?)",
                   (event.event_id, event.channel, event.sender, event.text[:500],
                    status, result, event.received_at))


def recent_count(sender, seconds=60):
    with connect() as db:
        row = db.execute("""SELECT COUNT(*) FROM events
                            WHERE sender=?
                            AND julianday(created_at) >= julianday('now', ?)""",
                         (sender, f'-{seconds} seconds')).fetchone()
        return row[0]


def approved_rules(limit=8):
    with connect() as db:
        rows = db.execute("""SELECT id, trigger, rule FROM lessons
                             WHERE status='approved'
                             ORDER BY uses DESC, id DESC LIMIT ?""", (limit,)).fetchall()
        return [{"id": row[0], "trigger": row[1], "rule": row[2]} for row in rows]


def add_candidate(trigger, rule, evidence):
    with connect() as db:
        cursor = db.execute("INSERT INTO lessons(trigger, rule, evidence) VALUES (?, ?, ?)",
                            (trigger, rule, evidence))
        return cursor.lastrowid


def approve_lesson(lesson_id):
    with connect() as db:
        changed = db.execute("UPDATE lessons SET status='approved' WHERE id=? AND status='candidate'",
                             (lesson_id,)).rowcount
        if changed != 1:
            raise ValueError("lesson does not exist or is not a candidate")


def export_approved():
    rules = approved_rules(100)
    Path("local-data/approved-rules.json").write_text(
        json.dumps(rules, ensure_ascii=False, indent=2), encoding="utf-8")