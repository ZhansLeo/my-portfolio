from agent.inbound import from_feishu, from_wecom

feishu = from_feishu({
    "header": {"event_id": "feishu-demo-001"},
    "event": {
        "sender": {"sender_id": {"open_id": "teacher_open_id"}},
        "message": {"content": "{\"text\":\"请整理本周课程\"}"}
    }
})
wecom = from_wecom({
    "MsgId": "wecom-demo-001",
    "FromUserName": "teacher_user_id",
    "Content": "请生成课程周报"
})

assert feishu.channel == "feishu" and feishu.text == "请整理本周课程"
assert wecom.channel == "wecom" and wecom.text == "请生成课程周报"
print("CHANNEL ADAPTER CHECK PASSED")