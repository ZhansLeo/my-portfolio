import email
import imaplib
import os
from email.header import decode_header
from agent.events import make_event


def decode(value):
    parts = decode_header(value or "")
    return "".join(
        part.decode(charset or "utf-8", errors="replace") if isinstance(part, bytes) else part
        for part, charset in parts
    )


def unread_events(limit=10):
    events = []
    with imaplib.IMAP4_SSL(os.environ["IMAP_HOST"]) as box:
        box.login(os.environ["IMAP_USER"], os.environ["IMAP_APP_PASSWORD"])
        box.select("INBOX")
        _, data = box.search(None, "UNSEEN")
        for message_id in data[0].split()[-limit:]:
            _, content = box.fetch(message_id, "(RFC822)")
            message = email.message_from_bytes(content[0][1])
            sender = email.utils.parseaddr(message.get("From"))[1]
            subject = decode(message.get("Subject"))
            body = ""
            for part in message.walk():
                if part.get_content_type() == "text/plain" and not part.get_filename():
                    body = part.get_payload(decode=True).decode(part.get_content_charset() or "utf-8", errors="replace")
                    break
            events.append(make_event("email", sender, f"主题：{subject}\n{body}", message.get("Message-ID", "")))
    return events