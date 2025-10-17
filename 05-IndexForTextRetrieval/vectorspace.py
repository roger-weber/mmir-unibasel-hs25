from helpers import tokenize, reduce_to_stems, eliminate_stopwords, bag_of_words
from heapq import heappop, heappush
from typing import Callable
import math
from collections import defaultdict


BM25 = { 'k': 1.2, 'b': 0.75, 'adl': None }

def idf(doc_freq: int, num_docs: int) -> float:
    return math.log((num_docs + 1) / (doc_freq + 1))

def idf_bm25(doc_freq: int, num_docs: int) -> float:
    return math.log((num_docs - doc_freq + 0.5) / (doc_freq + 0.5))
    
def idf_bm25_pos(doc_freq: int, num_docs: int) -> float:
    return math.log((num_docs + 1) / (doc_freq + 0.5))

def normalize_doc_vector(vector: dict[str, int], vocabulary: dict[str, dict], measure: str) -> dict[str, float]:
    # dot-product: multiply each term's tf by its idf
    if measure == 'dot':
        return {term: tf * vocabulary[term]['idf'] for term,tf in vector.items()}

    # cosine-measure: multiply each term's tf by its idf and divide by total vector length
    if measure == 'cosine':
        norm = sum([(tf * vocabulary[term]['idf']) ** 2 for term, tf in vector.items()]) ** 0.5
        return {term: tf * vocabulary[term]['idf'] / norm for term, tf in vector.items()}

    # bm25: normalize with bm25 formula with document length
    if measure in ['bm25', 'bm25-pos'] and BM25['adl']:
        doc_len = sum(vector.values())
        return {term: tf * (BM25['k'] + 1) / (tf + BM25['k'] * (1 - BM25['b'] + BM25['b'] * doc_len / BM25['adl']))  for term, tf in vector.items()}

    # bm25: normalize with bm25 formula without document length
    if measure in ['bm25', 'bm25-nolen', 'bm25-pos']:
        return {term: tf * (BM25['k'] + 1) / (tf + BM25['k'])  for term, tf in vector.items()}

    raise ValueError('Unknown normalization measure')


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
            self.weigths = {}

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


class VSRetriever:
    """
        Generic class for the evaluation of the vector space model, inherited by the document-at-a-time (DAAT) and 
        term-at-a-time (TAAT) models. 
    """
    def __init__(self, collection: list[dict] = None, measure: str = 'dot', remove_stopwords: bool = True):
        self.build_index(collection or [], measure, remove_stopwords)
    
    def _get_vector(self, text: str) -> set:
        tokens = tokenize(text)
        if self.remove_stopwords: tokens = eliminate_stopwords(tokens)
        # tokens = reduce_to_stems(tokens)
        return bag_of_words(tokens)
    
    def _add_document(self, doc: dict):
        self.n_docs += 1
        doc_id = doc['id'] = self.n_docs
        self.documents[doc_id] = doc
        # create vector from str-properties
        text = ' '.join([value for key, value in doc.items() if type(value) == str])
        doc['vector'] = self._get_vector(text)
        doc['len'] = sum(doc['vector'].values())
        # add to vocabulary and count document frequency
        for term, tf in doc['vector'].items():
            self.vocabulary[term] += 1
    
    def _build_vocabulary(self):
        idf_func = {'bm25': idf_bm25, 'bm25-nolen': idf_bm25, 'bm25-pos': idf_bm25_pos}.get(self.measure, idf)
        self.vocabulary = {
            term: {'df': df, 'idf': idf_func(df, self.n_docs)}
            for term, df in self.vocabulary.items()
        }

    def _normalize_vectors(self):
        BM25['adl'] = sum([doc['len'] for doc in self.documents.values()]) / self.n_docs
        for doc_id, doc in self.documents.items():
            doc['norm-vector'] = normalize_doc_vector(doc['vector'], self.vocabulary, self.measure)

    def _build_postings(self):
        for doc_id, doc in self.documents.items():
            for term, tf_norm in doc['norm-vector'].items():
                self.index[term].append((doc_id, tf_norm))

    def build_index(self, collection: list[dict], measure: str = 'dot', remove_stopwords: bool = True):
        self.remove_stopwords = remove_stopwords
        self.measure = measure
        self.n_docs = 0
        self.doc_len_sum = 0
        self.documents = {}
        self.index = defaultdict(list)
        self.vocabulary = defaultdict(int)
        # load all documents
        for doc in collection:
            self._add_document(doc)
        # finalize the index with idf, normalization, and the postings
        if self.n_docs:
            self._build_vocabulary()
            self._normalize_vectors()
            self._build_postings()
        self.n_terms = len(self.vocabulary)
        self.all = set(self.documents.keys())

    def query_weights(self, vector: dict[str, int], measure: str) -> list[tuple[str,float]]:
        # remove terms not in vocabulary
        terms = list(filter(lambda t: t in self.vocabulary, vector.keys()))
        # dot product: multiply tf with idf
        if measure == 'dot':
            return list(map(lambda t: (t, vector[t] * self.vocabulary[t]['idf']), terms))
        # cosine measure: multiply tf with idf and take the cosine of the sum  
        if measure == 'cosine':
            norm = sum([(tf * self.vocabulary[term]['idf']) ** 2 for term, tf in vector.items()]) ** 0.5
            return list(map(lambda t: (t, vector[t] * self.vocabulary[t]['idf'] / norm), terms))
        # bm25: ignore tf and just use idf of term as weight
        if measure in ['bm25', 'bm25-nolen', 'bm25-pos']:
            return list(map(lambda t: (t, self.vocabulary[t]['idf']), terms))
     
        raise ValueError('Unknown normalization measure')
    

class VSRetriever_DAAT(VSRetriever):
    """
        Implements the DAAT model for the Vector Space model using inverted index method.
    """
    def search(self, query: str, k: int, measure: str = 'dot', predicate: Callable[[int], bool] = None, selected_docs: set[int] = None):
        query_vector = self._get_vector(query)

        # filter terms and obtain c_j-weights for terms in order of their importance 
        term_weights = self.query_weights(query_vector, measure)

        # get iterators for each term and fetch first posting; postings have form (term, tf)
        iters = [iter(self.index[term]) for (term, _) in term_weights]
        nexts = [next(iter, None) for iter in iters]

        # keep track of all retrieved documents and their score; stored as tuples (doc_id, score)
        topk = TopKList(k, term_weights, predicate)

        # iterate through all streams and calculate score for smallest doc id
        while not all(e is None for e in nexts):
            # get smallest value from nexts, ignoring None values
            smallest = min(nexts, key = lambda x: x and x[0] or math.inf)[0]
            # if selected_docs is given and smallest is not in selected_docs, skip this document
            if selected_docs is None or smallest in selected_docs:
                # if so, add it to topk
                score = sum([nexts[i][1] * term_weights[i][1] for i in range(len(nexts)) if nexts[i] and nexts[i][0] == smallest])
                topk.add(smallest, score)
            # for each entry in nexts, fetch next item if entry equals smallest
            for i, e in enumerate(nexts):
                if e and e[0] == smallest:
                    nexts[i] = next(iters[i], None)
        
        # finsihed, return topk for result iteration
        return topk
    

class VSRetriever_TAAT(VSRetriever):
    """
        Implements the TAAT model for the Vector Space model using inverted index method.
    """
    def search(self, query: str, k: int, measure: str = 'dot', predicate: Callable[[int], bool] = None, selected_docs: set[int] = None):
        query_vector = self._get_vector(query)

        # filter terms and obtain c_j-weights for terms in order of their importance 
        term_weights = self.query_weights(query_vector, measure)
        doc_scores = defaultdict(float)

        # iterate over terms and fetch postings
        for (term, weight) in term_weights:
            for (doc_id, tfidf) in self.index[term]:
                # check if doc_id is selected_docs (if given)
                if selected_docs is None or doc_id in selected_docs:
                    doc_scores[doc_id] += weight * tfidf

        # we do not need a full sort of doc_scores, but can use the heap in TopKList
        topk = TopKList(k, term_weights, predicate)
        for doc_id, score in doc_scores.items():
                topk.add(doc_id, score)
        
        # finisheds, return topk for result iteration
        return topk