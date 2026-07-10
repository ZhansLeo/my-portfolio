import json
from pathlib import Path
from agent.memory import save_event, seen
from agent.policy import evaluate
from agent.prompts import build_messages

QUEUE = Path("local-data/approval-queue.jsonl")


def queue_for_approval(event, reason, draft):
    QUEUE.parent.mkdir(exist_ok=True)
    record = {"event_id": event.event_id, "reason": reason,
              "channel": event.channel, "text_preview": event.text[:500],
              "draft": draft}
    with QUEUE.open("a", encoding="utf-8") as file:
        file.write(json.dumps(record, ensure_ascii=False) + "\n")


def handle(event, call_llm):
    if seen(event.event_id):
        return {"status": "duplicate", "event_id": event.event_id}

    decision, reason = evaluate(event)
    if decision == "reject":
        save_event(event, "rejected", reason)
        return {"status": "rejected", "reason": reason}

    messages = build_messages(event)
    draft = call_llm(messages)  # 只生成草稿，不在这里发送
    queue_for_approval(event, reason, draft)
    save_event(event, "waiting_approval", "draft created")
    return {"status": "waiting_approval", "event_id": event.event_id}