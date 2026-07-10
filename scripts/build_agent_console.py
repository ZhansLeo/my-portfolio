import sqlite3
from html import escape
from pathlib import Path

db = sqlite3.connect("local-data/agent.db")
events = db.execute("""SELECT channel, status, created_at FROM events
                       ORDER BY created_at DESC LIMIT 20""").fetchall()
approved = db.execute("SELECT COUNT(*) FROM lessons WHERE status='approved'").fetchone()[0]
candidates = db.execute("SELECT COUNT(*) FROM lessons WHERE status='candidate'").fetchone()[0]

rows = "\n".join(
    f"<tr><td>{escape(channel)}</td><td>{escape(status)}</td><td>{escape(created)}</td></tr>"
    for channel, status, created in events
)
document = f'''<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>本地 Agent 控制台</title>
<style>body{{max-width:900px;margin:40px auto;font-family:system-ui}}td,th{{padding:8px;border-bottom:1px solid #ddd}}</style>
</head><body><h1>本地 Agent 控制台</h1>
<p>Approved rules：{approved}；Candidate lessons：{candidates}</p>
<table><thead><tr><th>渠道</th><th>状态</th><th>时间</th></tr></thead><tbody>{rows}</tbody></table>
<p>此页面不显示消息正文、发送者或密钥。</p></body></html>'''
Path("local-data/agent-console.html").write_text(document, encoding="utf-8")
print(f"Built local console with {len(events)} recent events")