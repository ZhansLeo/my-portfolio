import unittest
from datetime import datetime, timezone, timedelta
from unittest.mock import patch
import tempfile
from pathlib import Path
import json
import collect_papers as collector

NOW = datetime(2026, 9, 17, 12, tzinfo=timezone.utc)

def paper(id, title, age=1, version=1):
    return {"id": id, "title": title, "summary": title, "authors": ["Test"],
            "published": (NOW - timedelta(days=age)).isoformat(),
            "updated": NOW.isoformat(), "version": version, "url": "https://arxiv.org/abs/" + id}

class PapersTest(unittest.TestCase):
    def test_four_and_diversity(self):
        candidates = [paper(str(i), "LLM agent tool use agentic") for i in range(6)]
        candidates += [paper("world", "world models")]
        result = collector.select(candidates, set(), NOW)
        self.assertEqual(len(result), 4)
        self.assertGreaterEqual(len({p["primaryTopic"] for p in result}), 2)

    def test_related_and_seen(self):
        result = collector.select([paper("a", "LLM agent"), paper("b", "video prediction"), paper("c", "unrelated biology")], {"a"}, NOW)
        self.assertEqual(len(result), 1)
        self.assertTrue(result[0]["related"])
        self.assertEqual(result[0]["primaryTopic"], "World Models")

    def test_duplicates_stale_and_future(self):
        result = collector.select([paper("a", "vision-language", version=1), paper("a", "vision-language", version=2), paper("b", "world model", age=8), paper("c", "LLM agent", age=-1)], set(), NOW)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["version"], 2)

    def test_reject_xml_entities(self):
        with self.assertRaises(ValueError):
            collector.parse_atom(b'<!DOCTYPE feed [<!ENTITY x "test">]><feed/>')
        with self.assertRaises(ValueError):
            collector.parse_atom(b'<html>Error</html>')

    def test_atom_text_is_not_executed(self):
        raw = b'<feed xmlns="http://www.w3.org/2005/Atom"><entry><id>http://arxiv.org/abs/2609.00001v2</id><title>&lt;script&gt;alert(1)&lt;/script&gt;</title><summary>LLM agent</summary><author><name>A</name></author><published>2026-09-16T00:00:00Z</published><updated>2026-09-17T00:00:00Z</updated></entry></feed>'
        p = collector.parse_atom(raw)[0]
        self.assertEqual(p["version"], 2)
        self.assertEqual(p["url"], "https://arxiv.org/abs/2609.00001")

    def test_failure_preserves_history_and_success_time(self):
        state = {"version": 1, "lastAttempt": None, "lastSuccess": "2026-09-10T00:00:00+00:00", "status": "ok", "message": "", "batches": [{"id": "old", "papers": [paper("a", "LLM agent")]}]}
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / "feed.json"
            target.write_text(json.dumps(state), encoding="utf-8")
            with patch.object(collector, "FEED", target), patch.object(collector, "now_utc", return_value=NOW), patch.object(collector, "candidates", side_effect=OSError("offline")):
                with self.assertRaises(OSError):
                    collector.collect()
            saved = json.loads(target.read_text(encoding="utf-8"))
            self.assertEqual(saved["batches"], state["batches"])
            self.assertEqual(saved["lastSuccess"], state["lastSuccess"])
            self.assertEqual(saved["status"], "error")

    def test_72_hour_gate(self):
        state = {"lastSuccess": NOW.isoformat()}
        with tempfile.TemporaryDirectory() as directory:
            target = Path(directory) / "feed.json"
            target.write_text(json.dumps(state))
            with patch.object(collector, "FEED", target), patch.object(collector, "now_utc", return_value=NOW), patch.object(collector, "candidates") as fetch:
                collector.collect()
                fetch.assert_not_called()

if __name__ == "__main__":
    unittest.main()
