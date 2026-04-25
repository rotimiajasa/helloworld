from app.languages import detect_language


def test_english_default():
    assert detect_language("My maize is yellow at the bottom leaves.") == "en"


def test_pidgin():
    assert detect_language("Abeg, my tomato dey die small small. Wetin I go do?") == "pcm"


def test_yoruba():
    assert detect_language("Mo ni iresi mi lori oko, agbado mi ti se kini") == "yo"


def test_hausa():
    assert detect_language("Ina shuka masara da shinkafa. Yaya zan yi?") == "ha"


def test_igbo():
    assert detect_language("Kedu, biko, oka m nwere ahuhu. Gini ka m ga eme?") == "ig"


def test_empty_returns_english():
    assert detect_language("") == "en"
