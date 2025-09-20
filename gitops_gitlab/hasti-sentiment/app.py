import os

from fastapi import FastAPI, Form
from scipy.special import softmax
from transformers import AutoConfig, AutoModelForSequenceClassification, AutoTokenizer

multi: str = os.getenv("MULTI_MODEL_PATH", "")

binary = os.getenv("BINARY_MODEL_PATH", "")



tokenizerM = AutoTokenizer.from_pretrained(multi)
configM = AutoConfig.from_pretrained(multi)
modelM = AutoModelForSequenceClassification.from_pretrained(multi)


tokenizerB = AutoTokenizer.from_pretrained(binary)
configB = AutoConfig.from_pretrained(binary)
modelB = AutoModelForSequenceClassification.from_pretrained(binary)


# text = "کیفیت محصول خیلی عالی بود ..."


app = FastAPI()


@app.post("/multi")
async def multi_classifier(text: str = Form(...)):

    encoded_input = tokenizerM(text, return_tensors="pt")
    output = modelM(**encoded_input)
    scores = output[0][0].detach().numpy()
    scores = softmax(scores)
    # ranking = np.argsort(scores)
    # ranking = ranking[::-1]
    # for i in range(scores.shape[0]):
    #     l = configM.id2label[ranking[i]]
    #     s = scores[ranking[i]]
    #     score.append(f"{l}: {np.round(float(s), 4)}")
    #     print(f"{i+1}) {l} {np.round(float(s), 4)}")

    return {
        "furious": "{}".format(scores[0]),
        "angry": "{}".format(scores[1]),
        "neutral": "{}".format(scores[2]),
        "happy": "{}".format(scores[3]),
        "delighted": "{}".format(scores[4]),
    }


@app.post("/binary")
async def binary_classifier(text: str = Form(...)):

    encoded_input = tokenizerB(text, return_tensors="pt")
    output = modelB(**encoded_input)
    scores = output[0][0].detach().numpy()
    scores = softmax(scores)

    return {"positive": "{}".format(scores[0]), "negative": "{}".format(scores[1])}
