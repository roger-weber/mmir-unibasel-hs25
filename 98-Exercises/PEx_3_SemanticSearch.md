# **Practical Exercise 3: Semantic Search**

In this exercise, you will implement **semantic search** using **embeddings** to search for movie titles. The dataset used is the same as in Practical Exercises 1 and 2, available on [KaggleHub](https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset). This dataset contains approximately **45,000 movies**, including summaries, cast information, and various metadata such as ratings and release years.

The folder **[PEx_2_TextRetrieval](./PEx_2_TextRetrieval/)** contains the resources you need to create the dataset for your solution. The **data** folder includes a **[JSONL file with the first 3,000 movies](./PEx_2_TextRetrieval/data/movie_dataset.jsonl)**. You can create a larger dataset using the provided notebook, but it is recommended to start with this smaller subset for faster development and testing.

Focus on functionality and keep your interface simple and text-based. You can design your program to use either a **menu-driven interface** or **command-line arguments** to run different sub-tasks. This task is **open-ended**, and the sub-tasks below are suggestions for what you can accomplish using Lucene. Use **timeboxing** (allocating a specific number of hours for each part), and refer to the Lucene documentation and example code when necessary.

You may use **AI-assisted code generation tools** (be sure to reference the parts that were generated), but ensure that you fully understand how the code works. Collaborate with classmates to share ideas and strategies to save time while learning about sentence transformers.

---

## **Task 3.1 – Basic Semantic Search**

In this first task, you will implement a simple **semantic search** using embeddings. Use **Python** and the **Sentence Transformers** library to create the embeddings and to perform comparisons directly in main memory. Since embedding generation can be computationally expensive, select a small model such as **Qwen 3 Embedding (0.6B)** and store the generated vectors in a file to allow faster iterations during development.

Model references:

* [Hugging Face: Qwen 3 Embedding - 0.6B](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B)
* [Hugging Face: Qwen 3 Reranker - 0.6B](https://huggingface.co/Qwen/Qwen3-Reranker-0.6B)

**Subtasks**

* **Create Embeddings**
Read the JSONL file and combine relevant movie information (e.g., title, overview, and cast) into a single text string for each movie. Use the embedding model to create vectors and store them in a file. Start with a small number of records to verify that your code works correctly before scaling up.
```python
import torch
from sentence_transformers import SentenceTransformer 

bi_encoder = SentenceTransformer("Qwen/Qwen3-Embedding-0.6B")
movie_texts = ["...", ... ]
embeddings = bi_encoder.encode(texts, show_progress_bar=True)
torch.save(embeddings, "./embeddings.pt")
# To read: embeddings = torch.load("./embeddings.pt")
```

* **Implement Basic Vector Search**
Encode a search query using the model (Qwen 3 differentiates between document and query embeddings) and find the most relevant results.
```python
from sentence_transformers import util

# Batch multiple queries
q_embeddings = bi_encoder.encode(queries, prompt_name="query")
hits = util.semantic_search(q_embeddings, embeddings, top_k=10)
# Print results for the queries
```

* **Expand the Pipeline with a Cross-Encoder**
Rerank the results obtained from the bi-encoder search using a **cross-encoder**. The **Qwen 3 Reranker** differs from the usual Sentence Transformers interface. Review the example code on the [Hugging Face model page](https://huggingface.co/Qwen/Qwen3-Reranker-0.6B) to learn how to use it for reranking documents effectively.

---

## **Task 3.2 – Use a Vector Search Engine**

In this task, you will extend your code from **Task 3.1** by storing and querying the embeddings using a **vector search engine** of your choice (for example, FAISS, Milvus, or Elasticsearch with vector support).

**Subtasks**

* **Load the Data (and Metadata)**
Load the movie dataset together with the precomputed embeddings. Ensure that metadata such as title, release year, and genre are accessible for filtering and display in the search results.

* **Run a Vector Search (Bi-Encoder Only)**
Encode a query and perform a vector search using the stored embeddings. Check whether the results are consistent with those obtained in **Task 3.1** when running the search directly in memory.

* **Run a Vector Search with Metadata Predicates**
Extend your search functionality by adding filters based on metadata fields (for example, restricting results by genre, release year, or rating). Combine vector similarity search with predicate-based filtering.

* **Implement the Full Pipeline**
Develop a complete search pipeline that integrates:

  - **BM25** or **vector search** as the retrieval stage
  - The **Qwen 3 Reranker** from Task 3.1 as the reranking stage

This pipeline should allow you to compare traditional lexical retrieval methods with semantic search approaches and evaluate the quality of results for movie recommendations.

