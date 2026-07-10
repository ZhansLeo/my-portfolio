import json
import os
from urllib.request import Request, urlopen
from urllib.error import URLError

BASE_URL = "https://njusehub.info/v1"
MODEL = "deepseek-v4-pro"


def call_llm(messages):
    api_key = os.environ.get("NJUSE_API_KEY")
    if not api_key:
        raise RuntimeError("NJUSE_API_KEY environment variable is not set")

    payload = json.dumps({
        "model": MODEL,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1024,
    }).encode("utf-8")

    request = Request(
        f"{BASE_URL}/chat/completions",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
    )

    try:
        with urlopen(request, timeout=60) as response:
            data = json.loads(response.read().decode("utf-8"))
            return data["choices"][0]["message"]["content"]
    except URLError as e:
        raise RuntimeError(f"LLM API call failed: {e}") from e
    except (KeyError, IndexError, json.JSONDecodeError) as e:
        raise RuntimeError(f"LLM API response parse error: {e}") from e