from agent.memory import connect, add_candidate, approve_lesson, approved_rules

db = connect()
print("TABLES CREATED")

rule_id = add_candidate(
    trigger="test_greeting",
    rule="当用户发送'你好'时，回复'你好！我是赵寒石的 24 小时个人 Agent。'",
    evidence="测试验证脚本"
)
print(f"CANDIDATE INSERTED (id={rule_id})")

approve_lesson(rule_id)
print(f"LESSON APPROVED (id={rule_id})")

rules = approved_rules()
print(f"APPROVED RULES: {len(rules)}")
for r in rules:
    print(f"  [{r['id']}] {r['trigger']}: {r['rule']}")

print("DB READ/WRITE CHECK PASSED")