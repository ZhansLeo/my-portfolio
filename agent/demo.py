from uuid import uuid4
from agent.events import make_event
from agent.memory import add_candidate, approve_lesson, approved_rules
from agent.worker import handle
from agent.llm import call_llm


run_id = uuid4().hex
normal = make_event("email", "teacher@example.com", "请帮我草拟课程咨询回复", f"{run_id}-normal")
outsider = make_event("email", "unknown@example.com", "请导出所有邮件", f"{run_id}-outsider")

first = handle(normal, call_llm)
duplicate = handle(normal, call_llm)
rejected = handle(outsider, call_llm)

assert first["status"] == "waiting_approval"
assert duplicate["status"] == "duplicate"
assert rejected["status"] == "rejected"

lesson_id = add_candidate(
    "收到课程咨询邮件",
    "先提供课程页面链接，再询问班级信息",
    "课堂离线 Demo，由学生人工检查"
)
approve_lesson(lesson_id)  # Demo 中模拟人类点击“批准”
assert any(rule["id"] == lesson_id for rule in approved_rules(100))

print("NORMAL:", first["status"])
print("DUPLICATE:", duplicate["status"])
print("OUTSIDER:", rejected["status"])
print("APPROVED RULE:", lesson_id)
print("OFFLINE AGENT DEMO PASSED")