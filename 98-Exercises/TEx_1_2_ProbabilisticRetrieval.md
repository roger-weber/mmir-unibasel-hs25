# Exercise 1.2: Probabilistic Retrieval (Theoretical)

This task explores the **Binary Independence Retrieval (BIR)** model and illustrates the approach with simple examples. For a query $Q$, the BIR method produces the following initial list of retrieved documents:

| Rank      | #1 | #2 | #3 | #4 | #5 | #6 | #7 | #8 | #9 | #10 | #11 | #12 | #13 | #14 | #15 | #16 | #17 | #18 | #19 | #20 |
| :-------- | :- | :- | :- | :- | :- | :- | :- | :- | :- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| $x_1$     | 1  | 1  | 1  | 1  | 1  | 1  | 1  | 1  | 1  | 1   | 1   | 0   | 0   | 0   | 0   | 0   | 0   | 0   | 0   | 0   |
| $x_2$     | 1  | 1  | 1  | 1  | 1  | 0  | 0  | 0  | 0  | 0   | 0   | 1   | 1   | 1   | 1   | 1   | 1   | 0   | 0   | 0   |
| Relevance | R  | R  | R  | R  | N  | R  | R  | R  | R  | N   | N   | R   | R   | R   | N   | N   | N   | R   | N   | N   |

The rows $x_1$ and $x_2$ show the binary term representations of the 20 documents. The final row provides the user’s relevance assessments: **R** for relevant and **N** for non-relevant.

### Task 1.2a

Use these relevance judgements to compute updated $c_j$ values and determine the revised ranking of the documents according to the BIR model.

> <details>
> <summary>Solution (coming soon)</summary>
> <br>
> Provided after deadline of exercise
> </details>

---

### Task 1.2b

The BIR model relies on three key assumptions. To test their validity, calculate the probability $P(R\mid \mathbf{x})$ in two different ways:

   * **Direct counting:** For each distinct binary representation $\mathbf{x}$, count how many documents are relevant and non-relevant and estimate the probability from these counts.
   * **Model-based computation:** Express $P(R\mid \mathbf{x})$ using the standard BIR formulation with parameters $q_j$ and $n_j$.

Start from the relationship

   $$
       sim(Q,D_i) = \frac{P(R\mid D_i)}{P(NR\mid D_i)}
         = \frac{P(R\mid D_i)}{1 - P(R\mid D_i)}
         = \frac{P(R\mid \mathbf{x})}{1 - P(R\mid \mathbf{x})}
         = \dots
   $$

and solve for $P(R\mid \mathbf{x})$.

**Discussion:** Compare the two results. What pattern do you observe? Which of the BIR assumptions does the data appear to violate?


> <details>
> <summary>Solution (coming soon)</summary>
> <br>
> Provided after deadline of exercise
> </details>

---

### Task 1.2c

Consider the following set of documents and the query **“human computer interaction.”**

Relevant documents: **c1–c5**
Non-relevant documents: **m1–m4**

| ID | Document |
|----|----------|
| c1 | **Human** machine interface for Lab ABC **computer** applications |
| c2 | A survey of user opinion of **computer** system response time |
| c3 | The EPS user interface management system |
| c4 | System and **human** system engineering testing of EPS |
| c5 | Relation of user-perceived response time to error measurement |
| m1 | The generation of random, binary, unordered trees |
| m2 | The intersection graph of paths in trees |
| m3 | Graph minors IV: Widths of trees and well-quasi-ordering |
| m4 | Graph minors: A survey |



**Evaluate the retrieval using the BIR approach**

1. Perform **two iterations** of the BIR model:

   * **Initialization step:** Compute the initial retrieval scores.
   * **Feedback step:** Update the term weights using the relevance information (c1–c5 relevant; m1–m4 non-relevant) and recompute the ranking.

2. Evaluate whether the relevance-feedback step improves retrieval performance.

3. Propose strategies to further enhance performance when using feedback, for example, adjustments to term weighting, query expansion techniques, or alternative feedback mechanisms.


> <details>
> <summary>Solution (coming soon)</summary>
> <br>
> Provided after deadline of exercise
> </details>