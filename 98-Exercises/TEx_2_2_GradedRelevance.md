## Theoretical Exercise 2.2: Graded Relevance

We are evaluating the performance of two systems, A and B, using graded relevance and cumulative gain measures.

Assume there are five queries. For each query, both System A and System B return a ranked list of documents with graded relevance scores. The results (grades only) are shown below:

| Query | Result of A | Result of B |
| :- | :- | :- |
| Query 1 | 3, 1, 2, 0, 0 | 2, 3, 1, 0 ,0 |
| Query 2 |	3, 0, 2, 2, 1 | 2, 0, 3, 1 ,1 | 
| Query 3 |	1, 0, 2, 2, 3 | 3, 0, 2, 1, 2 | 
| Query 4 |	1, 0, 1, 1, 1 | 3, 3, 0, 1, 1 |
| Query 5 |	2, 3, 1, 3, 2 | 0, 0, 0, 3, 3 |

Each query contains 2 relevant documents with grade 3 and 3 relevant documents with grade 2.



### Task 2.2a
Compute the nDCG for each query and for both systems. Then, calculate the average nDCG for Systems A and B to determine which system performs better.

> <details>
> <summary>Solution (coming soon)</summary>
> <br>
> Provided after deadline of exercise
> </details>

---

# Task 2.1b

Consider the 10 queries for Task 2.1c: both systems are tested on 10 queries, each returning the top 10 results. A ‘+’ indicates a relevant document (grade = 1), and a blank cell indicates a non-relevant document (grade = 0). Compare both systems using the average nDCG.


> <details>
> <summary>Solution (coming soon)</summary>
> <br>
> Provided after deadline of exercise
> </details>

---

# Task 2.1c

Two DCG calculation methods are given below. Apply both methods to the scenario in (b), changing the relevance grades for ‘+’ documents from 1 to 3. Describe your observations.

  * variant (i)
  $$DCG_k=\sum_{i=1}^k \frac{rel_i}{\log_2\left(i+1\right)}$$
  
  * variant (ii)
  $$DCG_k^`=\sum_{i=1}^k \frac{2^{rel_i}-1}{\log_2\left(i+1\right)}$$

> <details>
> <summary>Solution (coming soon)</summary>
> <br>
> Provided after deadline of exercise
> </details>


