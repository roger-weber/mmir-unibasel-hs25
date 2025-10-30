## Theoretical Exercise 2.1: Precision, Recall, and MRR

Two search engines, A and B, search the same document collection and each return the top 30 results for one query, ranked by relevance. The table below shows these rankings, with a '+' indicating a relevant document and an empty cell indicating a non-relevant one. For this query, there are 12 relevant documents in total.

|  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 |
| :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :- |
| A | + | + |  | + |  |  |  | + |  |  |  | + |  |  |  |  |  |  |  | + |  |  |  |  |  |  |  |  |  | + |
| B |  | + | + |  |  |  | + |  |  | + | + |  | + |  |  |  | + |  |  | + |  |  | + |  | + |  |  |  |  |  |



### Task 2.1a
Draw the precision-recall curves for both engines. Which engine performs better, and why?

> <details>
> <summary>Solution</summary>
> <br>
> <img src="TEx_2_1_PRCurve.png" width="600"/>
> <br>
> The choice depends on the user's priorities regarding precision and recall. If precision is the main concern, Engine A is superior to Engine B, as it returns more relevant documents among the top results. However, if recall is more important, Engine B is preferable since it retrieves a greater number of relevant documents while maintaining higher precision as recall increases. Finally, in terms of system efficiency, Engine B outperforms Engine A, achieving a score of 0.42 compared to 0.37.
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
> <summary>Solution</summary>
> <br>
> We can calculate precision and recall for each query and then compute their averages using the following metrics:
> <table>
>   <th>
>     <td> Precision@ 10 <td>  Recall@10 <td>  R-Precision (20%) <td>  R-Precision (40%) <td>  MRR
>   </th>
>   <tr>
>       <td> A <td> 30% <td> 60% <td> 36% <td> 40% <td> 0.36
>   </tr>
>   <tr>
>       <td> B <td> 31% <td> 62% <td> 53% <td> 49% <td> 0.53
>   </tr>
> </table>
> <ul>
> <li> Precision@10: Both engines return approximately three relevant documents per query, showing no significant difference and therefore comparable performance. (Note: In this case, micro and macro evaluations yield the same value, though this is not always true.)
> <li> Recall@10: Both engines retrieve three out of five relevant documents per query, again showing no significant difference and indicating equal performance. (Note: Here too, micro and macro evaluations yield the same value, which is not always the case.)
> <li> R-Precision (20%): Engine B clearly outperforms Engine A, achieving much higher precision after retrieving the first relevant document. (Note: In this example, 20% recall corresponds to “@first relevant.”)
> <li> R-Precision (40%): Engine B again demonstrates superior performance, maintaining substantially higher precision after retrieving the first two relevant documents. (Note: In this example, 40% recall corresponds to “@second relevant.”)
> <li> MRR: Engine B significantly outperforms Engine A by retrieving the first relevant document much earlier. (Note: In this constructed example, the MRR value equals the R-Precision at 20%, though this is typically not the case, as MRR does not depend on the total number of relevant documents.)
> </ul>
> </details>
