# **Practical Exercise 2: Text Retrieval with Lucene**

In this exercise, you will use **Lucene** and its **fuzzy retrieval model** to search for movie titles. The dataset used is the same as in Practical Exercise 1, available on [KaggleHub](https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset). This dataset contains approximately **45,000 movies** with summaries, cast information, and various metadata such as ratings and release years.

The folder **[PEx_2_Benchmarking](./PEx_2_TextRetrieval/)** contains the resources needed to create the dataset for your Java code. Specifically, the **data** folder includes a **[JSONL file with the first 3,000 movies](./PEx_2_TextRetrieval/data/movie_dataset.jsonl)**. You may create a larger dataset using the provided notebook, but development will be faster with this smaller subset.

Prioritize functionality and keep the interface simple and text-based. You can design your program to use either a **menu-driven interface** or **command-line arguments** to invoke different sub-tasks.
This task is **open-ended** and the following sub-tasks are suggestions for what you can achieve with Lucene. Use **timeboxing** (allocating a specific number of hours for each part), and consult the Lucene documentation and example code as needed.

You may use **AI-assisted code generation tools** (make sure to reference the parts that were generated), but ensure you understand what is happening in the code. Lucene’s API has changed frequently across major versions, so expect some compatibility challenges. Collaborate with your classmates to share strategies and save time when exploring Lucene’s documentation.

---

## **Task 2.1a – Basic Functionality**

Provide a simple interface for basic **keyword-based movie search**, including predicates on metadata such as release year or ratings. During development, it is best to use a small subset of the data (e.g., the first 1,000 entries) and **rebuild the index from scratch** each time to avoid inconsistencies from previous runs.

**Subtasks:**

* **Import the JSONL data into a Lucene index:**
  Create a Lucene index and implement code to read the JSONL file. Extract relevant information such as movie titles, descriptions, ratings, and other metadata, and add them to the index.

* **Implement a basic keyword search function:**
  Develop a simple search function that allows users to input keywords and retrieve movies whose titles or descriptions contain those keywords.

* **Enhance search with filter criteria:**
  Add support for filters based on movie ratings, release dates, or other metadata. You may also improve ranking by prioritizing keyword occurrences in specific fields (e.g., cast, title).

---

## **Task 2.1b – Enhanced Functionality**

Add more advanced retrieval features to improve user experience and search accuracy.

**Subtasks:**

* **Fuzzy retrieval:**
  Implement fuzzy search support so users can mark keywords for fuzzy matching. For example, allow queries like `"leon?"` to trigger a fuzzy search with a predefined fuzziness factor (e.g., 0.8).

* **Automated query expansion:**
  Automatically expand user queries if too few search results are returned, rather than requiring users to specify fuzzy terms manually.

* **Spell checking:**
  Implement spell-check functionality to correct misspelled user queries.

* **Faceted search:**
  Enable faceted navigation so users can filter search results by categories such as **release decade** (e.g., 1990s, 2010s) or other relevant metadata. After showing results, prompt users for feedback to refine their filters.

* **Pagination:**
  Implement pagination for search results. Display 10 results per page and allow users to navigate using commands like `next` or `prev`.

---

## **Task 2.1c – Alternative Retrieval Engine**

Reimplement **Task 2.1a** using an **alternative retrieval engine**, such as **Whoosh**, **Haystack**, or **PostgreSQL Full-Text Search**. After implementation, **compare** the methods and **discuss which one worked best** for you, explaining the reasons for your conclusion.
