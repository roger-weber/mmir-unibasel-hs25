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
> <summary>Solution</summary>
> <br>
> Calculating nDCG yields a score of 0.602 for Engine A and 0.587 for Engine B. Engine B's lower performance on the final query reduced its overall score. Given the closeness of the results, it is difficult to determine a clear winner between the two engines.
> </details>

---

# Task 2.1b

Consider the 10 queries for Task 2.1c: both systems are tested on 10 queries, each returning the top 10 results. A '+' indicates a relevant document (grade = 1), and a blank cell indicates a non-relevant document (grade = 0). Compare both systems using the average nDCG.


> <details>
> <summary>Solution</summary>
> <br>
> Once again, Engine B outperforms Engine A, achieving an nDCG score of 0.490 compared to 0.415. Recall that there are five relevant documents in total; therefore, the ideal ranking places these five 1-graded documents at the top, followed by five 0-graded documents.
> </details>

---

# Task 2.1c

Two DCG calculation methods are given below. Apply both methods to the scenario in (b), changing the relevance grades for '+' documents from 1 to 3. Describe your observations.

  * variant (i)
  $$DCG_k=\sum_{i=1}^k \frac{rel_i}{\log_2\left(i+1\right)}$$
  
  * variant (ii)
  $$DCG_k^`=\sum_{i=1}^k \frac{2^{rel_i}-1}{\log_2\left(i+1\right)}$$

> <details>
> <summary>Solution</summary>
> <br>
> When we adjust the relevance grades from 1 to 3, the nDCG values for Engines A and B remain unchanged when using the formula on the left. This occurs because both DCG and IDCG scale proportionally with the grade values of relevant documents, and this proportionality cancels out when computing their ratio in nDCG. The same principle applies to the formula on the right. Since our evaluation uses only 0 and maximum-grade values, $2^{max−grade}−1$ serves merely as a scaling factor for both DCG and IDCG, resulting in identical nDCG values regardless of the chosen maximum grade. Differences in nDCG would appear only if intermediate grades between 0 and 3 were included.
> When we adjust grades from 1 to 3, nDCG values for A and B remain unchanged with the left formula below. This is because both DCG and IDCG are proportionate to the grade value of relevant documents, canceling out when we calculate their ratio for nDCG. The same principle applies to the right formula below. Given our assessment uses only 0 and max-grade values,  becomes the scaling factor for DCG and IDCG, resulting in identical nDCG values as we change max-grade. Differences in results would emerge if we included grades between 0 and 3.
>
> </details>


