# Practical Exercise 1: Benchmarking

In this part of the exercise, we address the challenge of establishing a benchmark using the movies database from [kagglehub](https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset). This database contains approximately 45,000 movies with summaries, cast information, and other attributes like ratings and release year. For this exercise, we recommend using a subset of 1,000-3,000 movies to expedite development. The main goal is not to create an exhaustive benchmark of the entire collection, but rather to establish a robust framework and demonstrate its functionality through a few key steps.

A benchmark consists of 4 essential components:
- Document Collection: The [PEx_1_Benchmarking](./PEx_1_Benchmarking/) folder contains resources to help you get started. Specifically, the data folder includes a [jsonl file containing the first 3000 movies](./PEx_1_Benchmarking/data/movie_dataset.jsonl). You can create a larger dataset using the provided notebook, though 3000 entries are sufficient for this exercise. (Note: Due to duplicates in the original data, the final count may be lower than selected)

- Queries/Topics: In [Task 1.1a](#task-11a), we explore automated approaches for generating a balanced set of queries for this collection.  This involves defining a specific use case and justifying why certain metrics best measure search effectiveness (focusing solely on result quality, not performance metrics like latency). The goal is to leverage generative AI to create queries rather than crafting them manually.

- Relevance Assessment: In [Task 1.1b](#task-11b), we examine efficient methods for evaluating search results using generative AI to streamline the assessment process.

- Performance Metrics: In [Task 1.1c](#task-11c), we will determine the most appropriate evaluation metrics for the use case scenario defined in [Task 1.1a](#task-11a).

This exercise emphasizes planning over implementation. Your task is to create a markdown document (or just a text file) that details the benchmark creation process, including the necessary steps and prompts. The goal is to provide a comprehensive specification and framework for the benchmark. Utilize available generative AI tools and optimize your prompts to maximize automation in establishing the benchmark.



---

### Task 1.1a

Start by defining a use case scenario for the movie collection. Try to avoid an overly generic scenario such as just "movie search". Rather, define a persona that wants to achieve some task over the movie database, for example, a "movie enthusiast wants to find a movie to watch". Then define a variety of queries and topics using generative AI:

- Consider different types of queries such as keywords only ("star wars"), questions ("what was the movie with Harrison Ford in that space opera"), or recommendations ("movies like star wars").

- Define a prompt that, given a few movie samples, can generate queries (check the limits of your AI chat assistant; some allow you to upload entire documents against which you can prompt afterwards).

- Try to model the frequency and likelihood of queries and consider that in your query collection. For example, searches for A-movies are more likely than for B-movies. Also try to vary the difficulty of queries.

The goal of this task is to create markdown documentation of how to create the queries with 2-3 examples. Provide the prompts that generate the queries. This task does not require you to implement the query generation process; execute it manually in steps to validate your approach.

Use this code snippet at the end of your [notebook](./PEx_1_Benchmarking/precision-recall.ipynb) to generate contextual information for your AI assistant (note: you must initialize the collection before running this)
```python
print(collection.prompt_context(["tt0076759", "tt0120915"]))
```



---

### Task 1.1b

The [notebook](./PEx_1_Benchmarking/precision-recall.ipynb) contains sample code for Boolean retrieval (using keywords with the AND operator) that produces a result set. The following code snippet:

```python
prompt=f"""
You are assessing movies. Given the query below and the results, assess which movies are relevant for the query

Query: {query}

Results:
{collection.prompt_context(result)}
"""
```

generates a prompt for the query and the retrieved documents. Work on the prompt to ensure your generative AI tool returns the relevant documents. Optimize the prompt so that the tool’s response can be automatically parsed to extract relevance assessments. The current prompt may produce verbose outputs that take longer to generate and are harder to parse. Test different types of queries with your prompt to evaluate performance.

For debugging, you may also ask the tool to explain its assessment. What is your anecdotal experience with the quality of the relevance assessment?

Document the steps in your markdown response. Implementation and automation of the assessment is not required.



---

### Task 1.1c

The final component of the benchmark involves selecting appropriate metrics for evaluating different retrieval approaches (though we will not perform the actual evaluation). For your defined use case scenario, analyze and compare various options for assessing search quality across a substantial query set. Justify your selected metric(s) and document your reasoning in the markdown response.


