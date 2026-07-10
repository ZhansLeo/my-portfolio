import json
from agent.events import make_event


def from_feishu(payload):
    # payload 必须已经通过飞书官方签名校验与 challenge 流程。
    header = payload["header"]
    event = payload["event"]
    message = event["message"]
    content = json.loads(message["content"])
    text = content.get("text", "")
    sender = event["sender"]["sender_id"]["open_id"]
    return make_event("feishu", sender, text, header["event_id"])


def from_wecom(message):
    # message 是企业微信官方 SDK 验签、解密之后的字段字典。
    return make_event(
        "wecom",
        message["FromUserName"],
        message.get("Content", ""),
        message.get("MsgId", "")
    )