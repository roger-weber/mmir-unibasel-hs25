import csv, kagglehub, os, ast, json
from typing import List, Dict, Optional, Any
from helpers import display_md, display_json, read_jsonl, write_jsonl
from tqdm.notebook import tqdm
            
class Movie:
    """Represents a single movie with extracted metadata."""
    
    def __init__(self, index: int, imdb_id: str, title: str, overview: str, tagline: str, cast: str, genres: List[str], runtime: int, rating: float, year: int) -> None:
        self.index = index
        self.imdb_id = imdb_id
        self.title = title
        self.overview = overview
        self.tagline = tagline
        self.cast = cast
        self.genres = genres
        self.runtime = runtime
        self.rating = rating
        self.year = year
    
    def __str__(self) -> str:
        return json.dumps(self.__dict__, indent=2)
    
    def display_as_json(self) -> None:
        """Print movie metadata as JSON."""
        display_json(self.__dict__)

    def to_text(self) -> str:
        """Convert movie metadata to a text representation for search."""
        return f"{self.title} {self.overview} {self.tagline} {self.cast} {' '.join(self.genres)}"


class MovieCollection:
    """Class for managing movie dataset loading and caching."""
    
    FILE_NAME_METADATA = './data/movie_dataset.jsonl'

    def __init__(self, max_records: int = None) -> None:
        """Initialize attributes only once to prevent data loss in singleton."""
        if not hasattr(self, 'movies'):
            self.movies: List[Movie] = []
            self.cast_lookup: Dict[str, str] = {}
            self.max_records = 45000 if max_records is None else max_records
            self._load_movies()
    
    def _load_cast(self) -> None:
        """Load cast data from credits.csv, keeping only top actors (2%)."""
        path = kagglehub.dataset_download("rounakbanik/the-movies-dataset")
        actor_counts: Dict[str, int] = {}
        with open(os.path.join(path, 'credits.csv'), 'r', encoding="utf-8") as f:
            reader = csv.DictReader(f)
            rows = []
            for row in tqdm(reader, desc="Loading actors"):
                cast = ast.literal_eval(row['cast'])
                rows.append({"id": row['id'], "cast": cast})
                for d in cast:
                    actor_counts[d['name']] = actor_counts.get(d['name'], 0) + 1
                if len(rows) > self.max_records:
                    break
            # sort actor_coutns by count, then pick top 2%
            top_actors = set(sorted(actor_counts, key=actor_counts.get, reverse=True)[:int(len(actor_counts)/50)])
            for row in rows:
                id, cast = row['id'], row['cast']
                top_cast = [d['name'] + " as " + d['character'] for d in cast if d['name'] in top_actors]
                self.cast_lookup[id] = ", ".join(top_cast)
        display_md(f"loaded actors with {len(top_actors) * 100 / len(actor_counts):.0f}% top actors ({len(top_actors)}/{len(actor_counts)})")
    
    def _get_cast(self, id: str) -> str:
        """Get cast string for movie ID, loading cast data if needed."""
        if len(self.cast_lookup) == 0:
            self._load_cast()
        return self.cast_lookup[id] if id in self.cast_lookup else ''
    
    def _download_movie_dataset(self) -> List[Dict[str, Any]]:
        """Download and process movie metadata from Kaggle dataset."""
        display_md("- downloading from kagglehub: rounakbanik/the-movies-dataset")
        path = kagglehub.dataset_download("rounakbanik/the-movies-dataset")
        records = []
        display_md("- parsing data")
        with open(os.path.join(path, 'movies_metadata.csv'), 'r', encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in tqdm(reader, desc="Processing movies"):
                if row['adult'] == 'True' or not(row['runtime']) or not(row['release_date']):
                    continue
                record = {
                    'index': len(records),
                    'imdb_id': row['imdb_id'],
                    'title': row['title'],
                    'overview': row['overview'],
                    'tagline': row['tagline'],
                    'cast': self._get_cast(row['id']),
                    'genres': [g['name'] for g in ast.literal_eval(row['genres'])],
                    'runtime': int(float(row['runtime'])),
                    'rating': float(row['vote_average']),
                    'year': int(row['release_date'][:4])
                }
                records.append(record)
                if len(records) > self.max_records:
                    break
        return records
    

    def _load_movies(self) -> List[Movie]:
        """Load movie collection from cache or download if needed.
        
        Args:
            max_records: Maximum number of movies to return
            
        Returns:
            List of Movie objects
        """
        path = os.path.dirname(self.FILE_NAME_METADATA)
        if not os.path.exists(path):
            os.makedirs(path)
        
        if os.path.exists(MovieCollection.FILE_NAME_METADATA):
            display_md(f"- reading dataset from local cache ({self.FILE_NAME_METADATA})")
            dataset = read_jsonl(MovieCollection.FILE_NAME_METADATA)
        else:
            dataset = []
        
        if len(dataset) < self.max_records:
            display_md(f"- dataset not found or incomplete, downloading from kagglehub")
            dataset = self._download_movie_dataset()
            display_md(f"- writing to local cache ({self.FILE_NAME_METADATA})")
            write_jsonl(dataset, self.FILE_NAME_METADATA)
        
        dataset = dataset[0:self.max_records]
        self.movies = [Movie(**record) for record in dataset]
        self.index = {movie.imdb_id: movie for movie in self.movies} 

    def get(self, imdb_id: str) -> Movie:
        """Get movie by IMDB ID."""
        return self.index.get(imdb_id, None)

    def __iter__(self):
        """Iterator over movies in collection."""
        return iter(self.movies)    

    def display_result(self, result):
        if len(result) == 0:
            display_md('no results')
            return
        if type(result[0]) == str:
            # unranked results
            text = '|id|title|overview|cast\n|-|-|-|-|\n'
            for id in result:
                movie = self.get(id)
                tagline = f"**{movie.tagline}**<br/>" if len(movie.tagline) > 0 else ""
                text += f'|{id}|**{movie.title}** ({movie.year})|{tagline}[{", ".join(movie.genres)}]<br/><br/>{movie.overview}|{movie.cast}\n'
            display_md(text)
        else:
            # ranked results
            text = '|rank|score|id|title|overview|cast\n|-|-|-|-|-|-|\n'
            for i, (id, score) in enumerate(result):
                movie = self.get(id)
                tagline = f"**{movie.tagline}**<br/>" if len(movie.tagline) > 0 else ""
                text += f'|{i+1}|{score:.2f}|{id}|**{movie.title}** ({movie.year})|{tagline}[{", ".join(movie.genres)}]<br/><br/>{movie.overview}|{movie.cast}\n'
            display_md(text)
            
    def prompt_context(self, result):
        if len(result) == 0:
            return "no results found"
        if type(result[0]) != str:
            result = [id for id, _ in result]
        # unranked results
        text = ""
        for id in result:
            movie = self.get(id)
            text += f"ID: {id}\nTitle: {movie.title} ({movie.year})\nSummary: {movie.tagline}. {movie.overview}\nGenres: [{", ".join(movie.genres)}]\nCast: {movie.cast}\n\n"
        return text
        
