from agent.channels import send_feishu, send_wecom, send_email


def send_response(event, text):
    channel_handlers = {
        "feishu": send_feishu,
        "wecom": send_wecom,
        "email": lambda t: send_email(event.sender, "Re: 您的消息", t),
    }
    handler = channel_handlers.get(event.channel)
    if not handler:
        raise ValueError(f"Unknown channel: {event.channel}")
    return handler(text)