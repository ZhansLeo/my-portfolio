import json
import os
import smtplib
from email.message import EmailMessage
from urllib.request import Request, urlopen


def post_json(url, payload):
    request = Request(url, data=json.dumps(payload).encode("utf-8"),
                      headers={"Content-Type": "application/json"})
    with urlopen(request, timeout=15) as response:
        return response.read().decode("utf-8")


def send_feishu(text):
    # 群机器人文本消息示例；具体 payload 以所用官方应用文档为准。
    return post_json(os.environ["FEISHU_WEBHOOK"], {
        "msg_type": "text", "content": {"text": text[:4000]}
    })


def send_wecom(text):
    # 企业微信群机器人文本消息示例。
    return post_json(os.environ["WECOM_WEBHOOK"], {
        "msgtype": "text", "text": {"content": text[:4000]}
    })


def send_email(to, subject, text):
    message = EmailMessage()
    message["From"] = os.environ["SMTP_USER"]
    message["To"] = to
    message["Subject"] = subject
    message.set_content(text)
    with smtplib.SMTP_SSL(os.environ["SMTP_HOST"], int(os.getenv("SMTP_PORT", "465"))) as server:
        server.login(os.environ["SMTP_USER"], os.environ["SMTP_APP_PASSWORD"])
        server.send_message(message)