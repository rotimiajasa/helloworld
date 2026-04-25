from app.ussd import fit_to_ussd, render_menu


def test_first_dial_shows_crop_menu():
    step = render_menu("")
    assert step.response.startswith("CON")
    assert "Maize" in step.response
    assert step.farmer_question is None


def test_pick_crop_then_topic():
    step = render_menu("1")  # Maize
    assert step.response.startswith("CON")
    assert "topic" in step.response.lower()
    assert step.farmer_question is None


def test_pick_canned_topic_returns_question_for_llm():
    step = render_menu("1*1")  # Maize -> When to plant
    assert step.farmer_question is not None
    assert "Maize" in step.farmer_question or "maize" in step.farmer_question
    assert step.crop == "Maize"


def test_invalid_crop():
    step = render_menu("99")
    assert step.response.startswith("END")


def test_free_text_prompt():
    step = render_menu("1*5")  # Maize -> Other (free)
    assert step.response.startswith("CON")
    assert "Type your question" in step.response


def test_free_text_question_passes_through():
    step = render_menu("1*5*Why my leaves dey turn yellow")
    assert step.farmer_question == "Why my leaves dey turn yellow"
    assert step.crop == "Maize"


def test_fit_to_ussd_truncates_with_ellipsis():
    long = "abc def " * 50
    out = fit_to_ussd(long, max_chars=80)
    assert len(out) <= 80
    assert out.endswith("...")


def test_fit_to_ussd_no_truncate_short():
    out = fit_to_ussd("Short answer.")
    assert out == "Short answer."
