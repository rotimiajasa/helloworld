"""In-memory rolling store of recent transactions per account / device / IP.

Production deploys swap this for Redis with the same interface. Kept
deliberately small so the code is reviewable end-to-end.
"""

from __future__ import annotations

import threading
import time
from collections import defaultdict, deque
from dataclasses import dataclass
from typing import Deque


@dataclass
class Event:
    ts: float
    amount_kobo: int
    geo_state: str | None
    beneficiary_account: str
    is_new_beneficiary: bool


class RollingStore:
    """Thread-safe rolling per-key event buffer.

    Keeps up to `max_events` events per key, evicting older ones.
    """

    def __init__(self, max_events: int = 200, ttl_seconds: int = 24 * 3600) -> None:
        self._max_events = max_events
        self._ttl = ttl_seconds
        self._buckets: dict[tuple[str, str], Deque[Event]] = defaultdict(deque)
        self._lock = threading.Lock()
        self._fraud_beneficiaries: set[str] = set()

    def add(self, key_type: str, key: str, event: Event) -> None:
        with self._lock:
            bucket = self._buckets[(key_type, key)]
            bucket.append(event)
            while len(bucket) > self._max_events:
                bucket.popleft()

    def recent(self, key_type: str, key: str, window_seconds: int) -> list[Event]:
        cutoff = time.time() - window_seconds
        with self._lock:
            bucket = self._buckets.get((key_type, key))
            if not bucket:
                return []
            return [e for e in bucket if e.ts >= cutoff]

    def mark_fraud_beneficiary(self, account: str) -> None:
        with self._lock:
            self._fraud_beneficiaries.add(account)

    def is_known_mule(self, account: str) -> bool:
        with self._lock:
            return account in self._fraud_beneficiaries
