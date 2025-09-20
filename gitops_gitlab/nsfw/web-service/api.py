import re
from string import punctuation

from fastapi import FastAPI, Body
from pydantic import BaseModel

from database.manager import insert_query, read_query
from detoxer.loockup import highlight_curses
from detoxer.contextual import LMClassifier

lm_classifier = LMClassifier("parsdetoxer/ferdowsi_tokenizer", "parsdetoxer/roberta-clasification.pt")


class InputText(BaseModel):
    """
    Declaring request body for toxic classification that
    must pass an input text that their key is `sentence` and value as a string.
    """

    sentence: str


class Swear(BaseModel):
    """
    Declaring parameters for add slang word and label
    """

    word: str
    label: str


app: FastAPI = FastAPI()

DB_PATH: str = "./swears.sqlite3"
profanities_q: str = "SELECT * FROM profanities"

swears = read_query(profanities_q, DB_PATH)


@app.post("/lookup-detoxification")
def detoxification(item: InputText):
    cleaned_string = re.sub(f"[{punctuation}؟،٪×÷»«]+", "", item.sentence)
    cleaned_string = f" {cleaned_string} "
    swears = read_query(profanities_q, DB_PATH)
    result = highlight_curses(swears, cleaned_string)

    return result


@app.post("/add")
def add_word(item: Swear):
    q = "INSERT INTO profanities VALUES(?, ?)"
    insert_query(q, (item.word, item.label), DB_PATH)
    global swears
    swears = read_query(profanities_q, DB_PATH)

    return {"detail": f"word {item.word} added with {item.label}."}


@app.post("/detoxify")
def context_detoxify(
    item: InputText = Body(
        examples={
            "toxic": {
                "summary": "A toxic text",
                "description": "A sentence with swear words, the label must be POSITIVE",
                "value": {"sentence": "هم قیافت کیریه هم توییتهات هم طرز فکرت"},
            },
                "normal": {
                    "summary": "A normal text",
                    "description": "A sentence without any swear words, the label must be NEGATIVE",
                    "value": {"sentence": "این برنامه شاید بهترین نباشه ولی توسط بهترین برنامه نویس کهکشان ساخته شده. امید"},
                },
            },
    )
):
    """
    post request with only a key (sentence) that
    check with a ML model to classifing and return the label
    """
    if detoxification(item):
        return {"label": 1.0}
    cleaned_string = re.sub(f"[{punctuation}؟،٪×÷»«]+", "", item.sentence)
    label = lm_classifier.predict(cleaned_string)
    # label = label / 2 + 0.4
    return {"label": label}
