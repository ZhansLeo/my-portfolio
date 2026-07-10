import json
from uuid import uuid4
from pathlib import Path
from agent.events import make_event
from agent.memory import connect, save_event, add_candidate, approve_lesson, approved_rules
from agent.policy import evaluate
from agent.prompts import build_messages
from agent.worker import queue_for_approval
from agent.review import load_queue, save_queue
from agent.responder import send_response

QUEUE = Path("local-data/approval-queue.jsonl")

print("=== 24 小时个人 Agent 端到端演示 ===\n")

run_id = uuid4().hex

print("1. 收到消息")
event = make_event("email", "teacher@example.com",
                   "请帮我整理这周学习的 AI Agent 论文，并推荐 3 篇相关阅读",
                   f"{run_id}-demo")
print(f"   渠道: {event.channel}")
print(f"   发送者: {event.sender}")
print(f"   内容: {event.text[:60]}...\n")

print("2. 策略检查")
decision, reason = evaluate(event)
print(f"   决策: {decision} ({reason})\n")

print("3. LLM 生成草稿")
messages = build_messages(event)
print(f"   系统规则已注入 {len(messages)} 条消息")
print(f"   已批准经验: {len(approved_rules())} 条\n")

print("   [跳过真实 API 调用，使用模拟草稿]")
draft = "已整理本周 AI Agent 论文：\n1. Market Stability in Agent Societies\n2. Context Access Divide\n3. TRACE Watermark for LLM Agents\n\n推荐阅读：arXiv 2607.08652, 2607.08495, 2607.08400"

print("4. 草稿入审批队列")
queue_for_approval(event, reason, draft)
save_event(event, "waiting_approval", "draft created")
print(f"   已写入 local-data/approval-queue.jsonl\n")

print("5. 人工审批")
items = load_queue()
remaining = []
for item in items:
    if item["event_id"] == event.event_id:
        print(f"   渠道: {item['channel']}")
        print(f"   发送者: {item.get('sender', 'N/A')}")
        print(f"   原文摘要: {item.get('text_preview', '')[:60]}")
        print(f"   草稿: {item['draft'][:80]}...")
        print(f"   模拟审批: 通过 (y)")
        print(f"   -> 已批准，正在发送回复...")
        add_candidate("demo_loop", draft, "端到端演示")
        try:
            send_response(event, draft)
            print(f"   -> 回复已通过 {event.channel} 发送")
        except Exception as e:
            print(f"   -> 回复发送模拟: {e}")
    else:
        remaining.append(item)
save_queue(remaining)

print("\n6. 当前经验库")
for rule in approved_rules():
    print(f"   [{rule['id']}] {rule['trigger']}: {rule['rule'][:50]}...")

print(f"\n=== 演示完成 ===")
print(f"完整闭环: 收到消息 → 策略检查 → 生成草稿 → 人工审批 → 发送回复")