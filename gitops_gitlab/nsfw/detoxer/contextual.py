from typing import Text, Type

import torch
from transformers import (
    PreTrainedTokenizerFast,
    RobertaTokenizerFast
)


class LMClassifier:
    """
    class of predict a text is toxic or no
    """

    def __init__(self, model_name: str, model_weights: str) -> None:
        self.model_name = model_name
        self.model_weights = model_weights
        self._load_model_instance()

    def _load_model_instance(self):
        self.tokenizer: PreTrainedTokenizerFast = RobertaTokenizerFast.from_pretrained(self.model_name)
        self.model = torch.jit.load(self.model_weights)

    def _lm_tokenize(self, text: Text):
        tokens = self.tokenizer(
            text,
            truncation=True,
            max_length=512,
            return_tensors="pt",
        )
        return tokens

    def _process(self, text: str):
        inputs = self._lm_tokenize(text)
        with torch.no_grad():
            logits = self.model(**inputs)['logits'].squeeze()
            probability = torch.sigmoid(logits)

        return probability.tolist()

    def _predict(self, text: str) -> float:
        logits = self._process(text)
        return logits

    def predict(self, text: str) -> float:
        """
        predict that the label of input text with torch model

        Parameters
        ----------
        text : str
            input sentence for classification

        Returns
        -------
        float
            probability from 0 to 1
        """
        return self._predict(text)
