from helpers import tokenize, reduce_to_stems, eliminate_stopwords, set_of_words
from collections import defaultdict
from heapq import heappop, heappush
from typing import Callable
import math


class Feedback:
    """
        Collects feedback for documents and provides functions to check if 
        document is assessed, relevant or not relevant.
    """
    def __init__(self, assessment_func: Callable[[int], bool] = None):
        self.assessment_func = assessment_func
        self.clear()

    def clear(self):
        self.assessed = set()
        self.relevant = set()
    
    def is_initial_step(self) -> bool:
        return len(self.assessed) == 0

    def assess(self, doc_id: int) -> None:
        self.assessed.add(doc_id)
        if not self.assessment_func or self.assessment_func(doc_id):
            self.relevant.add(doc_id)
        
    def is_relevant(self, doc_id: int) -> bool:
        return doc_id in self.relevant
    
    def is_assessed(self, doc_id: int) -> bool:
        return doc_id in self.assessed
    
    def is_not_relevant(self, doc_id: int) -> bool:
        return (doc_id in self.assessed) and (doc_id not in self.relevant)

class TopKList:
    """
    Maintains a list of top-k documents. Initializer accepts
    a list of tuples (term, weight) to provide information about
    weights used by retrieval model. Implements the iter() interface.
    Takes an optional predicate(doc_id: int) function to filter documents
    before returning them (lazy evaluation of potentially expensive predicate
    function)
    """
    def __init__(self, k: int, term_weights: list[tuple[str,float]] = None, predicate: Callable[[int], bool] = None):
        self.docs_heap = []
        self.k = k
        self.predicate = predicate
        self.results = []
        if term_weights:
            self.term_weights = term_weights
            self.terms = [term for term, _ in self.term_weights]
            self.weights = dict(self.term_weights)
        else:
            self.term_weights = {}
            self.terms = []
            self.weights = {}

    def add(self, doc_id: int, score: float):
        # delay evaluation of predicate as it could be potentially expensive
        heappush(self.docs_heap, (-score, doc_id, {'id': doc_id, 'score': score}))

    def __iter__(self):
        # do we already have the results?
        for entry in self.results:
            yield entry
        # produce more results (if necessary and available)
        rank = len(self.results)
        while rank < self.k and len(self.docs_heap) > 0:
            entry = heappop(self.docs_heap)[2]
            # perform predicate only if the object is a candidate to return
            if self.predicate is None or self.predicate(entry['id']):
                rank += 1
                entry['rank'] = rank
                self.results.append(entry)
                yield entry

class BIRRetriever:
    """
        Generic class for the evaluation of the BIR model, inherited by the document-at-a-time (DAAT) and 
        term-at-a-time (TAAT) models. 
    """
    def __init__(self, collection: list[dict] = None, remove_stopwords: bool = True):
        self.build_index(collection or [], remove_stopwords)

    def _get_vector(self, text: str) -> set:
        tokens = tokenize(text)
        if self.remove_stopwords: tokens = eliminate_stopwords(tokens)
        # tokens = reduce_to_stems(tokens)
        return set_of_words(tokens)

    def _add_document(self, doc: dict):
        self.n_docs += 1
        doc_id = doc['id'] = self.n_docs
        self.documents[doc_id] = doc
        # create vector from str-properties
        text = ' '.join([value for key, value in doc.items() if type(value) == str])
        doc['vector'] = self._get_vector(text)
        # add to vocabulary and postings
        for term in doc['vector']:
            self.vocabulary[term] += 1
            self.index[term].append(doc_id)
    
    def build_index(self, collection: list[dict], remove_stopwords: bool = True):
        self.remove_stopwords = remove_stopwords
        self.n_docs = 0
        self.documents = {}
        self.index = defaultdict(list)
        self.vocabulary = defaultdict(int)
        # load all documents
        for doc in collection:
            self._add_document(doc)
        self.n_terms = len(self.vocabulary)
        self.all = set(self.documents.keys())


    def cj_weight(self, term: str, feedback: Feedback):
        doc_freq = len(self.index[term])
        if feedback.is_initial_step():
            rj = 0.5
            nj = (doc_freq + 0.5) / (len(self.documents) + 1)
        else:
            # get postings as set to siplify calculations in Python
            docs = set(self.index[term])

            # number of assessed relevant documents which have the term
            lj, L = len(feedback.relevant & docs), len(feedback.relevant)
            
            # number of assessed documents which have the term
            kj, K = len(feedback.assessed & docs), len(feedback.assessed)
            
            # calculate rj and nj
            rj = (lj + 0.5) / (L + 1)
            nj = (kj - lj + 0.5) / (K - L + 1)
        return math.log(rj / (1 - rj) * (1 - nj) / nj)

    # set this property to True to remove terms with negative weights
    PRUNE_NEGATIVE_WEIGHTS = False

    # set this property to remove terms with absolute weights smaller than this value
    PRUNE_WEIGHT_THRESHOLD  = False

    # set this property to select top-k weights based on absolute values
    PRUNE_TOPK = False

    # set this property to true to prune non-relevant documents from result list
    PRUNE_NON_RELEVANT = False

    def query_weights(self, terms: set[str], feedback: Feedback) -> list[tuple[str,float]]:
        # remove terms not in vocabulary
        terms = list(filter(lambda t: t in self.vocabulary, terms))
        # calculate weigths and produce tuples (term, weight)
        term_weights = list(map(lambda t: (t, self.cj_weight(t, feedback)), terms))
        # filter terms with negative weights
        if self.PRUNE_NEGATIVE_WEIGHTS:
            term_weights = list(filter(lambda t: t[1] >= 0, term_weights))
        # filter terms with small absolute weights
        if self.PRUNE_WEIGHT_THRESHOLD:
            term_weights = list(filter(lambda t: abs(t[1]) > self.PRUNE_WEIGHT_THRESHOLD, term_weights))
        # select top-k terms based on absolute values
        if self.PRUNE_TOPK:
            term_weights = sorted(term_weights, key = lambda t: (-abs(t[1]),len(self.index[t[0]]),t[0]))[:self.PRUNE_TOPK]
        return term_weights
