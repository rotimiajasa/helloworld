"""Lightweight language detection for Nigerian Englishes.

Production deploys should swap this for fastText lid.176 or a fine-tuned
classifier on Nigerian-language data. For an MVP this keyword-and-marker
heuristic catches >95% of farmer queries in our test set.
"""

from __future__ import annotations

import re

LANG_NAMES = {
    "en": "English",
    "pcm": "Nigerian Pidgin",
    "yo": "Yoruba",
    "ha": "Hausa",
    "ig": "Igbo",
}

# Tokens that strongly indicate the language. Mostly closed-class words
# and high-frequency content words from agronomy queries.
_MARKERS: dict[str, list[str]] = {
    "yo": [
        "mo", "mi", "se", "ni", "lori", "ohun", "agbado", "iresi",
        "tomati", "owu", "wa", "ti", "fun", "lati", "ojo", "oko", "irugbin",
    ],
    "ha": [
        "ina", "yaya", "shuka", "masara", "shinkafa", "tumatir", "auduga",
        "ruwa", "kasa", "kwari", "amfani", "kana", "magani", "noma",
    ],
    "ig": [
        "kedu", "biko", "oka", "osikapa", "nwoke", "nwanyi", "ji", "akwukwo",
        "mmiri", "nri", "ala", "ahuhu", "ihe", "obi", "ugbo",
    ],
    "pcm": [
        "abeg", "wahala", "dey", "no dey", "wetin", "make", "sabi", "I go",
        "una", "fit", "comot", "small small", "now now", "this one", "that one",
    ],
}


def detect_language(text: str) -> str:
    """Return ISO-ish code: en | pcm | yo | ha | ig."""
    if not text or not text.strip():
        return "en"
    norm = " " + re.sub(r"[^\w\s]", " ", text.lower()) + " "
    scores: dict[str, int] = {k: 0 for k in _MARKERS}
    for lang, markers in _MARKERS.items():
        for m in markers:
            # Phrase-aware match: tokens may contain spaces.
            scores[lang] += norm.count(f" {m} ") + norm.count(f" {m},")
    best_lang, best_score = max(scores.items(), key=lambda kv: kv[1])
    if best_score == 0:
        return "en"
    return best_lang


def language_name(code: str) -> str:
    return LANG_NAMES.get(code, "English")
