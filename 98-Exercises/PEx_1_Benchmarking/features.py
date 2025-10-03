from itertools import islice
import re, math
from collections import Counter
from nltk.stem import PorterStemmer
from unidecode import unidecode
from typing import Dict, Set, List


STOP_WORDS: Set[str] = {
  'a',  'about', 'above', 'after', 'again', 'against', 'ain', 'all', 'am', 'an', 
  'and', 'any', 'are', 'aren', "aren't", 'as', 'at', 'be', 'because', 'been', 
  'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'couldn', 
  "couldn't", 'd', 'did', 'didn', "didn't", 'do', 'does', 'doesn', "doesn't", 
  'doing', 'don', "don't", 'down', 'during', 'each', 'few', 'for', 'from', 
  'further', 'had', 'hadn', "hadn't", 'has', 'hasn', "hasn't", 'have', 'haven', 
  "haven't", 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn', "isn't", 'it', "it's", 
  'its', 'itself', 'just', 'll', 'm', 'ma', 'me', 'mightn', "mightn't", 'more', 
  'most', 'mustn', "mustn't", 'my', 'myself', 'needn', "needn't", 'no', 'nor', 
  'not', 'now', 'o', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 
  'ours', 'ourselves', 'out', 'over', 'own', 're', 's', 'same', 'shan', "shan't", 
  'she', "she's", 'should', "should've", 'shouldn', "shouldn't", 'so', 'some', 
  'such', 't', 'than', 'that', "that'll", 'the', 'their', 'theirs', 'them', 
  'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 
  'to', 'too', 'under', 'until', 'up', 've', 'very', 'was', 'wasn', "wasn't", 
  'we', 'were', 'weren', "weren't", 'what', 'when', 'where', 'which', 'while', 
  'who', 'whom', 'why', 'will', 'with', 'won', "won't", 'wouldn', "wouldn't", 
  'y', 'you', "you'd", "you'll", "you're", "you've", 'your', 'yours', 'yourself', 
  'yourselves'
}


class FeatureExtractor:
    def __init__(self, *, stemming: bool = False, stopwords: bool = False) -> None:
        self.stemmer: PorterStemmer | None = PorterStemmer() if stemming else None
        self.stopwords: bool = stopwords

    def tokenize(self, text: str) -> List[str]:
        # Tokenize the text
        text = re.sub(r"[^\w\-]+", " ", text)
        tokens: List[str] = []
        for token in text.split(" "):
            token = unidecode(token.strip().lower())
            if len(token) < 2:
                continue
            if not (re.match(r"^[a-zA-Z][\w\-\.]*$", token)):
                continue
            tokens.append(token)

        # Remove stopwords
        if self.stopwords:
            tokens = [token for token in tokens if not (token in STOP_WORDS)]

        # Apply stemming
        if self.stemmer is not None:
            tokens = list(map(lambda token: self.stemmer.stem(token), tokens))

        # return tokens
        return tokens

    def bag_of_words(self, text: str) -> Dict[str, int]:
        return dict(Counter(self.tokenize(text)))

    def set_of_words(self, text: str) -> Set[str]:
        return set(self.tokenize(text))

    def df(self, list_of_tokens: List[Set[str]]) -> Dict[str, float]:
        """Compute document frequency (df) each word in the list of set of words."""
        df = {}
        for tokens in list_of_tokens:
            for token in tokens:
                df[token] = df.get(token, 0) + 1
        return df

    def idf(self, list_of_tokens: List[Set[str]]) -> Dict[str, float]:
        """Compute inverse document frequency (idf) for each word in the list of set of words."""
        df = self.df(list_of_tokens)
        # we use idf(t) = log ((N + 1) / (df(t) + 1))d        
        return {
            token: math.log((len(list_of_tokens) + 1) / (df[token] + 1))
            for token in df.keys()
        }

    def tfidf(self, bag_of_words: Dict[str, int], idf: Dict[str, float]) -> Dict[str, float]:
        """Compute term frequency (tf) and tf-idf for each word in the text."""
        return {
            token: tf * idf[token] for (token, tf) in bag_of_words.items()
        }
