import json
import sys
from pathlib import Path
from agent.memory import connect, add_candidate, approve_lesson, save_event
from agent.events import make_event

QUEUE = Path("local-data/approval-queue.jsonl")


def load_queue():
    if not QUEUE.exists():
        return []
    items = []
    with open(QUEUE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                items.append(json.loads(line))
    return items


def save_queue(items):
    with open(QUEUE, "w", encoding="utf-8") as f:
        for item in items:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")


def mark_event(event_id, channel, sender, text, status):
    event = make_event(channel, sender, text, event_id)
    save_event(event, status)


def main():
    items = load_queue()
    if not items:
        print("审批队列为空。")
        return

    remaining = []
    for i, item in enumerate(items):
        print(f"\n{'='*50}")
        print(f"[{i+1}/{len(items)}]")
        print(f"渠道:     {item['channel']}")
        print(f"发送者:   {item['sender']}")
        print(f"原文摘要: {item['text'][:80]}")
        draft = item["draft"]
        print(f"AI 草稿:")
        print(f"  trigger:  {draft['trigger']}")
        print(f"  rule:     {draft['rule']}")
        print(f"  evidence: {draft['evidence']}")
        print(f"{'='*50}")

        while True:
            choice = input("通过(y)/驳回(n)/跳过(s)? ").strip().lower()
            if choice in ("y", "n", "s"):
                break
            print("请输入 y、n 或 s")

        if choice == "y":
            rule_id = add_candidate(draft["trigger"], draft["rule"], draft["evidence"])
            approve_lesson(rule_id)
            mark_event(item["event_id"], item["channel"], item["sender"], item["text"], "approved")
            print(f"  -> 已批准 (lesson id={rule_id})")
        elif choice == "n":
            mark_event(item["event_id"], item["channel"], item["sender"], item["text"], "rejected_by_human")
            print("  -> 已驳回")
        else:
            remaining.append(item)
            print("  -> 已跳过")

    save_queue(remaining)
    print(f"\n审批完成。剩余 {len(remaining)} 条待处理。")


if __name__ == "__main__":
    main()