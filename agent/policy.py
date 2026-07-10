from agent.memory import recent_count

HIGH_RISK_WORDS = {"删除", "付款", "转账", "群发", "发布", "合并", "密码", "token"}
ALLOWED_SENDERS = {
    "feishu": {"teacher_open_id", "student_open_id"},
    "wecom": {"teacher_user_id"},
    "email": {"teacher@example.com"},
}


def evaluate(event):
    if event.sender not in ALLOWED_SENDERS.get(event.channel, set()):
        return "reject", "sender is not allowlisted"
    if recent_count(event.sender, seconds=60) >= 5:
        return "reject", "rate limit exceeded"
    if any(word in event.text.lower() for word in HIGH_RISK_WORDS):
        return "approval", "message may request an external or sensitive action"
    return "draft", "safe to prepare a draft; sending still requires approval"