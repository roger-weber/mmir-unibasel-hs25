import re
from nltk.tokenize import sent_tokenize
import torch
from sentence_transformers import SentenceTransformer, util
from langchain_text_splitters import NLTKTextSplitter, TextSplitter

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Device: {device}")

class CustomSplitterSimilarity(TextSplitter):
    def __init__(self, minimum_size: int = 100, maximum_size: int = 1000, percentage: int = 20, **kwargs):
        super().__init__(**kwargs)
        self.minimum_size = minimum_size
        self.maximum_size = maximum_size
        self.percentage = percentage
        self.model = SentenceTransformer('all-MiniLM-L6-v2', device=device)

    def initial_split(self, text: str):
        splitter = NLTKTextSplitter(
            separator = " ",
            chunk_size = self.minimum_size,
            chunk_overlap  = 0
        )
        return splitter.split_text(text)

        # merge small chunks so they have at least minimum_size characters
        # chunks = []
        # last = ''
        # for s in splits:
        #     if len(last) < self.minimum_size:
        #         last += ' ' + s
        #     else:
        #         chunks.append(last)
        #         last = s
        # chunks.append(last)
        # return chunks

    def merge_by_similarities(self, chunks: list[str]) -> list[str]:
        """
        Merges chunks based on their similarity to each other.
        """
        # get the embeddings for the current chunks
        embeddings = self.model.encode(chunks)

        # now assess similarities of neighboring chunks, ignore if chunk size of 
        # either neighbor is large enough and ignore if score is below threshold
        THRESHOLD = 0.2
        similarities = []
        for i in range(len(chunks)-1):
            if len(chunks[i]) + len(chunks[i+1]) >= self.maximum_size:
                continue
            # prefer smaller chunk merges over larger ones
            preference = (self.maximum_size - len(chunks[i]) - len(chunks[i+1])) / self.maximum_size
            score = float(util.dot_score(embeddings[i], embeddings[i+1]))
            if score > THRESHOLD: 
                similarities.append((i, preference * score))

        # similarities contain tuples of (index, score), let's sort them
        similarities.sort(key=lambda x: x[1], reverse=True)
        similarities = similarities[:self.percentage*len(chunks)//100]

        # now we have the top-k similarities
        # we traverse the indexes in their decreasing order to not change the index of other merge candidates
        for i in sorted([x[0] for x in similarities], reverse=True):
            # check if we still can merge (self.maximum_size)
            if len(chunks[i]) + len(chunks[i+1]) >= self.maximum_size:
                continue
            chunks = chunks[:i] + [chunks[i] + ' ' + chunks[i+1]] + chunks[i+2:]

        return chunks

    def split_text(self, text: str):
        chunks = self.initial_split(text)
        i, num = 1, len(chunks) * 2
        print(f'iteration {i}: {len(chunks)} chunks')
        while len(chunks) * 1.1 < num:
            num, i = len(chunks), i+1
            chunks = self.merge_by_similarities(chunks)
            print(f'iteration {i}: {len(chunks)} chunks')
        return chunks


class CustomSplitterParagraphs(TextSplitter):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self._tokenizer = sent_tokenize

    def split_text(self, text: str):
        SECTIONS = ['CHAPTER', 'PART']
        def merge_small(in_splits):
            out_splits = []
            last_len = 0
            for s in in_splits:
                # s does not include one of SECTIONS, is small, or previous parts are small
                if out_splits and (len(s) < 200 or last_len < 500) and not any(x in s for x in SECTIONS):
                    out_splits[-1].append(s)
                    last_len += len(s)
                else:
                    out_splits.append([s])
                    last_len = len(s)
            return out_splits
        
        def add_overlap(in_splits):
            def first_sentence(index):
                return [self._tokenizer(in_splits[index][0])[0]]
            def last_sentence(index):
                return [self._tokenizer(in_splits[index][-1])[-1]]        
            out_splits = [in_splits[0] + first_sentence(1)]
            for i in range(1, len(in_splits)-1):
                out = []
                if not any(x in in_splits[i][0] for x in SECTIONS):
                    out += last_sentence(i-1)
                out += in_splits[i]
                if not any(x in in_splits[i+1][0] for x in SECTIONS):
                    out += first_sentence(i+1)
                out_splits.append(out)
            out_splits.append(last_sentence(len(in_splits)-2) + in_splits[len(in_splits)-1])
            return out_splits

        splits = [s.strip() for s in re.split('\n\n', text) if s]
        return ['<p>' + '\n\n<p>'.join(s) for s in add_overlap(merge_small(splits))]
