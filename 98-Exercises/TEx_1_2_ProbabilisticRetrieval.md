# Theoretical Exercise 1.2: Probabilistic Retrieval (Theoretical)

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
> <summary>Solution</summary>
> <br>
>
>The table below shows the $c_j$ values. Here, $l = 12$ (number of relevant documents) and $k = 20$ (number of presented documents).
>
>|       | $l_j$ | $k_j$ | $r_j$ | $n_j$ | $c_j$ |
>| :---- | :---- | :---- | :---- | :---- | :---- |
>| $x_1$ | 8     | 11    | 2/3   | 3/8   | 1.20  |
>| $x_2$ | 7     | 11    | 7/12  | 1/2   | 0.34  |
>
>The binary representations can be ordered as (1,1) > (1,0) > (0,1) > (0,0). The feedback did not change the ranking, so the order remains the same. This result is common for small queries with few terms. Task 1.2c is expected to give better results.
>
> </details>

---

### Task 1.2b

The BIR model relies on three key assumptions. To test their validity, calculate the probability $P(R\mid \mathbf{x})$ in two different ways:

   * **Direct counting:** For each distinct binary representation $\mathbf{x}$, count how many documents are relevant and non-relevant and estimate the probability from these counts.
   * **Model-based computation:** Express $P(R\mid \mathbf{x})$ using the standard BIR formulation with parameters $q_j$ and $n_j$.

Start from the relationship

   $$
       \text{sim}(Q,D_i) = \frac{P(R\mid D_i)}{P(NR\mid D_i)}
         = \frac{P(R\mid D_i)}{1 - P(R\mid D_i)}
         = \frac{P(R\mid \mathbf{x})}{1 - P(R\mid \mathbf{x})}
         = \dots
   $$

and solve for $P(R\mid \mathbf{x})$.

**Discussion:** Compare the two results. What pattern do you observe? Which of the BIR assumptions does the data appear to violate?


> <details>
> <summary>Solution</summary>
> <br>
>
>We first calculate the probability $P(R|𝐱)$ using the BIR assumptions:
>
>$$\text{sim}\left(Q,D_i\right)=\frac{P(R|𝒙)}{1-P(R|𝒙)}=\frac{P(R)}{P(NR)}∙\prod_{\forall j:x_j=1, q_j=1} \frac{r_j}{n_j}∙\prod_{\forall j:x_j=0, q_j=1} \frac{1-r_j}{1-n_j}$$
>
>$$P\left(R\vert 𝒙\right)=\frac{\frac{P(R)}{P(NR)}∙\prod_{\forall j:x_j=1, q_j=1} \frac{r_j}{n_j}∙\prod_{\forall j:x_j=0, q_j=1} \frac{1-r_j}{1-n_j}}{1+\frac{P(R)}{P(NR)}∙\prod_{\forall j:x_j=1, q_j=1} \frac{r_j}{n_j}∙\prod_{\forall j:x_j=0, q_j=1} \frac{1-r_j}{1-n_j}}$$
>
>For counting, we have $P(R) = 12/20$ (12 out of 20 documents are relevant) and $P(NR) = 1 - P(R) = 8/20$. For $P(R|𝐱)$, for example, $P(R(0,0)) = 1/3$ (1 out of 3 documents with representation (0,0) is relevant). This gives:
>
>| $P(R\vert 𝒙)$ | $(0,0)$ | $(0,1)$ | $(1,0)$ | $(1,1)$ |
>| :- | :- | :- | :- | :- |
>| counted | 0.33 | 0.50 | 0.67 | 0.80 |
>| computed | 0.40 | 0.48 | 0.69 | 0.76 |
>
> The differences arise from the assumption that terms are independent. In reality, this assumption is not always true, causing the probabilities to differ.
>
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
> <summary>Solution</summary>
> <br>
>
>The table below shows the $c_j$ values using the BIR model. In the first step, we use the initial estimates for $r_j$ and $n_j$. In the second step, these estimates are updated with feedback, with $l = 5$ and $k = 9$.
>
> First step:
>| **term** $t_j$ | $df(t_j)$ | $r_j$ | $n_j$ | $c_j$ |
>| :------------- | :-------- | :---- | :---- | :---- |
>| human          | 2         | 0.5   | 0.22  | 1.25  |
>| computer       | 2         | 0.5   | 0.22  | 1.25  |
>| interaction    | 0         | 0.5   | 0     | 0     |
>
> Second step:
>| **term** $t_j$ | $l_j$ | $k_j$ | $r_j$ | $n_j$ | $c_j$ |
>| :------------- | :---- | :---- | :---- | :---- | :---- |
>| human          | 2     | 2     | 0.42  | 0.1   | 1.86  |
>| computer       | 2     | 2     | 0.42  | 0.1   | 1.86  |
>| interaction    | 0     | 0     | 0.08  | 0.1   | -0.2  |
>
> We use the $c_j$ values to rank the documents, shown in columns 1 and 2. However, like in Task 1.2a, the feedback does not improve the ranking.
>
>| $\text{sim}(Q,D)$ | 1st step     | 2nd step     | with new terms |
>| :----             | :----------- | :----------- | :------------- |
>| c1                | 2.50         | 3.72         | 5.58           |
>| c2                | 1.25         | 1.86         | 10.65          |
>| c3                | 0            | 0            | 6.93           |
>| c4                | 1.25         | 1.86         | 4.14           |
>| c5                | 0            | 0            | 6.26           |
>| m1                | 0            | 0            | -3.25          |
>| m2                | 0            | 0            | -6.49          |
>| m3                | 0            | 0            | -8.89          |
>| m4                | 0            | 0            | -5.89          |
>
>
> To improve the query, we can add terms with high absolute $c_j$ values. Adding all terms from the table below results in retrieving all relevant documents, including c3 and c5, which now appear among the top three.
>
>| Term $t_j$ | $l_j$ | $k_j$ | $r_j$ | $n_j$ | $c_j$ |
>| :--------- | :---- | :---- | :---- | :---- | :---- |
>| human      | 2     | 2     | 0.42  | 0.1   | 1.86  |
>| interface  | 2     | 2     | 0.42  | 0.1   | 1.86  |
>| computer   | 2     | 2     | 0.42  | 0.1   | 1.86  |
>| user       | 3     | 3     | 0.58  | 0.1   | 2.53  |
>| system     | 3     | 3     | 0.58  | 0.1   | 2.53  |
>| response   | 2     | 2     | 0.42  | 0.1   | 1.86  |
>| time       | 2     | 2     | 0.42  | 0.1   | 1.86  |
>| eps        | 2     | 2     | 0.42  | 0.1   | 1.86  |
>| survey     | 1     | 2     | 0.25  | 0.3   | -0.25 |
>| trees      | 0     | 3     | 0.08  | 0.7   | -3.25 |
>| graph      | 0     | 3     | 0.08  | 0.7   | -3.25 |
>| minors     | 0     | 2     | 0.08  | 0.5   | -2.40 |
>
> <br>
> </details>
