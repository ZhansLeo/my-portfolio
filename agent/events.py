from dataclasses import dataclass, asdict
from datetime import datetime, timezone
import hashlib
import json


@dataclass(frozen=True)
class Event:
    event_id: str
    channel: str
    sender: str
    text: str
    received_at: str

    def to_json(self):
        return json.dumps(asdict(self), ensure_ascii=False)


def make_event(channel, sender, text, external_id=""):
    raw = external_id or f"{channel}|{sender}|{text}"
    event_id = hashlib.sha256(raw.encode("utf-8")).hexdigest()[:24]
    return Event(event_id, channel, sender, text[:8000],
                 datetime.now(timezone.utc).isoformat())