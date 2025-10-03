import json, random
from IPython.display import display, Markdown
from typing import List, Dict, Any
from tqdm.notebook import tqdm

def display_md(str: str):
    display(Markdown(str))

def display_json(obj: any):
    def prefix_lines(text):
        return '\n'.join(f"> {line}" for line in text.split('\n'))
    display(Markdown(prefix_lines(f"```json\n\n{json.dumps(obj,indent=2)}\n\n```")))

def read_jsonl(file_path: str, progress: bool = False) -> List[Dict[str, Any]]:
    """Read JSONL file with optional progress bar."""
    data = []
    try:
        with open(file_path, 'r') as f:
            lines = f.readlines()
            iterator = tqdm(lines, desc="Reading JSONL") if progress else lines
            for line in iterator:
                data.append(json.loads(line.strip()))
    except:
        pass
    return data

def write_jsonl(data: List[Dict[str, Any]], file_path: str) -> None:
    """Write data to JSONL file."""
    with open(file_path, 'w') as f:
        for item in data:
            f.write(json.dumps(item) + '\n')


def display_vocabulary(vocabulary_df: Dict[str, float], vocabulary_idf: Dict[str, float], n_samples=20):
    samples = sorted(vocabulary_df.items(), key=lambda x: x[1], reverse=True)[::int(len(vocabulary_df)/n_samples)]  
    text = '|token|df|idf|\n|-|-|-|\n'
    for (token, _) in samples:
        text += f'|{token}|{vocabulary_df[token]}|{vocabulary_idf[token]}|\n'
    display_md(text)
    

    