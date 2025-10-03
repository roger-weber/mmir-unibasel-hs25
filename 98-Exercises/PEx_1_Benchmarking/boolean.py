from typing import Set, Dict, List


class BooleanRetriever:
    def __init__(self, feature_set: Dict[str, Set[str]]):
        self.n_docs: int = len(feature_set)
        self.documents: Dict[str, Set[str]] = feature_set

    def query_and(self, query: Set[str]) -> List[str]:
        return [id for (id, features) in self.documents.items() if query.issubset(features)]
    
    def query_or(self, query: Set[str]) -> List[str]:
        return [id for (id, features) in self.documents.items() if query.intersection(features)]
    
