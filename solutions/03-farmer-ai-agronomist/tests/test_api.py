"""API contract tests with the Anthropic client mocked.

We don't hit the real API in unit tests — we patch app.llm.get_client to
return a fake that returns a deterministic Message-shaped object. This
exercises routing, validation, and language detection without burning
tokens or requiring an API key in CI.
"""

from types import SimpleNamespace

from fastapi.testclient import TestClient

from app import llm
from app.main import app


def _fake_response(text: str):
    return SimpleNamespace(
        content=[SimpleNamespace(type="text", text=text)],
        usage=SimpleNamespace(
            input_tokens=42, cache_read_input_tokens=120, output_tokens=80
        ),
    )


class _FakeAnthropic:
    def __init__(self, reply: str):
        self._reply = reply
        self.messages = self
        self.last_kwargs = None

    def create(self, **kwargs):
        self.last_kwargs = kwargs
        return _fake_response(self._reply)


def _patch_client(monkeypatch, reply: str) -> _FakeAnthropic:
    fake = _FakeAnthropic(reply)
    monkeypatch.setattr(llm, "get_client", lambda: fake)
    return fake


def test_health(monkeypatch):
    client = TestClient(app)
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["model"] == "claude-opus-4-7"


def test_chat_routes_to_anthropic_with_caching_system(monkeypatch):
    fake = _patch_client(
        monkeypatch,
        "Plant your maize between Mar 15 and Apr 15 in the South-West.",
    )
    client = TestClient(app)
    r = client.post(
        "/v1/chat",
        json={
            "question": "When should I plant maize in Lagos?",
            "state": "Lagos",
            "crop": "Maize",
        },
    )
    assert r.status_code == 200
    body = r.json()
    assert "Mar 15" in body["text"]
    # Confirm system prompt has the cached knowledge block.
    sent_system = fake.last_kwargs["system"]
    assert any(
        b.get("cache_control", {}).get("type") == "ephemeral" for b in sent_system
    )
    # Confirm Opus 4.7 + adaptive thinking.
    assert fake.last_kwargs["model"] == "claude-opus-4-7"
    assert fake.last_kwargs["thinking"] == {"type": "adaptive"}


def test_chat_detects_pidgin(monkeypatch):
    _patch_client(monkeypatch, "Make you check soil with finger.")
    client = TestClient(app)
    r = client.post(
        "/v1/chat",
        json={"question": "Abeg my tomato dey die small small. Wetin I go do?"},
    )
    assert r.status_code == 200
    assert r.json()["language"] == "pcm"


def test_ussd_first_dial_returns_menu(monkeypatch):
    _patch_client(monkeypatch, "ignored — no LLM call expected on menu nav")
    client = TestClient(app)
    r = client.post(
        "/v1/ussd",
        json={
            "sessionId": "s1",
            "serviceCode": "*789#",
            "phoneNumber": "+2348012345678",
            "text": "",
        },
    )
    assert r.status_code == 200
    assert r.text.startswith("CON")
    assert "Maize" in r.text


def test_ussd_canned_topic_calls_llm(monkeypatch):
    fake = _patch_client(
        monkeypatch,
        "Top-dress 100kg urea 4-5 weeks after planting. Split a final 50kg "
        "at 8 weeks for grain fill. Avoid spraying urea on wet leaves.",
    )
    client = TestClient(app)
    r = client.post(
        "/v1/ussd",
        json={
            "sessionId": "s1",
            "serviceCode": "*789#",
            "phoneNumber": "+2348012345678",
            "text": "1*2",  # Maize -> Fertiliser
        },
    )
    assert r.status_code == 200
    assert r.text.startswith("END ")
    assert "urea" in r.text.lower()
    # USSD reply trimmed to fit the 160-char screen.
    body = r.text[4:]
    assert len(body) <= 160
    assert fake.last_kwargs is not None  # LLM was actually called


def test_diagnose_sends_image_block(monkeypatch):
    fake = _patch_client(
        monkeypatch,
        "Looks like fall armyworm window-pane damage. Spray emamectin "
        "benzoate at the recommended rate; do not use pyrethroids alone.",
    )
    client = TestClient(app)
    r = client.post(
        "/v1/diagnose",
        json={
            "question": "What is wrong with my maize leaf?",
            "image_b64": "ZmFrZWltYWdlYnl0ZXM=",
            "image_media_type": "image/jpeg",
            "state": "Kaduna",
            "crop": "Maize",
        },
    )
    assert r.status_code == 200
    sent_messages = fake.last_kwargs["messages"]
    blocks = sent_messages[0]["content"]
    assert any(b["type"] == "image" for b in blocks)
    assert any(b["type"] == "text" for b in blocks)
