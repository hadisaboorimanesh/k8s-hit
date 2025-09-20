from typing import List, Tuple


def highlight_curses(toxic_data: List[Tuple[str, str]], text: str) -> List[Tuple[str, str]]:
    return [(curse, label) for curse, label in toxic_data if f" {curse} " in text]
