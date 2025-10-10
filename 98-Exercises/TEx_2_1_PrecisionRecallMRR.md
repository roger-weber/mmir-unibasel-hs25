## Theoretical Exercise 2.1: Precision, Recall, and MRR

Two search engines, A and B, search the same document collection and each return the top 30 results for one query, ranked by relevance. The table below shows these rankings, with a '+' indicating a relevant document and an empty cell indicating a non-relevant one. For this query, there are 12 relevant documents in total.

|  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
| :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- |
| A | + | + |  | + |  |  |  | + |  |  |  | + |  |  |  |  |  |  |  | + |  |  |  |  |  |  |  |  |  | + |
| B |  | + | + |  |  |  | + |  |  | + | + |  | + |  |  |  | + |  |  | + |  |  | + |  | + |  |  |  |  |  |



### Task 2.1a
Draw the precision-recall curves for both engines. Which engine performs better, and why?

> <details>
> <summary>Solution (coming soon)</summary>
> <br>
> Provided after deadline of exercise
> </details>

---

# Task 2.1b

Now assume we run 10 queries. Each query has 5 relevant documents. The tables below show the top 10 ranked results for search engines A and B, where '+' marks relevant documents. Determine which engine performs better in terms of precision, recall, and mean reciprocal rank (MRR).

| Q1 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- |
| A |  |  | + |  | + |  |  | + |  |  |
| B |  | + |  |  |  | + |  |  |  | + |

| Q2 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- |
| A |  |  |  | + |  |  |  |  |  | + |
| B |  | + |  |  |  | + |  |  |  |  |

| Q3 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- |
| A |  |  |  |  |  | + | + | + | + |  |
| B |  |  |  | + |  |  |  |  |  | + |

| Q4 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- |
| A |  | + | + |  |  |  | + |  |  |  |
| B | + | + | + |  |  |  |  |  |  | + |

| Q5 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- |
| A |  |  | + |  | + |  |  | + |  |  |
| B |  |  |  |  |  | + |  | + | + |  |

| Q6 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- |
| A |  | + |  |  | + |  |  |  |  | + |
| B | + |  | + |  |  |  |  | + |  |  |

| Q7 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- |
| A |  |  |  |  | + |  |  | + | + |  |
| B |  |  | + |  |  |  | + |  |  |  |

| Q8 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- |
| A |  |  | + |  |  |  |  |  | + |  |
| B |  |  |  | + | + | + |  | + |  |  |

| Q9 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- |
| A |  | + | + |  | + |  | + |  |  |  |
| B |  |  |  | + | + | + |  |  |  |  |

| Q10 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- |
| A |  | + |  | + |  |  |  | + |  |  |
| B | + | + | + |  |  |  | + |  |  | + |


> <details>
> <summary>Solution (coming soon)</summary>
> <br>
> Provided after deadline of exercise
> </details>
