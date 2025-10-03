## Theoretical Exercise 1.1: Vector Space Retrieval

For vector space retrieval, we introduced the inner vector product and cosine measure to rank documents by their similarity to the query. We will examine now the geometric interpretation of these functions. For simplicity, we begin by analyzing a two-term query before extending to higher dimensions.


### Task 1.1a
Consider a two-term query and define a similarity threshold $α$. For both similarity metrics, identify the set of documents that have a similarity score greater than $α$. Describe this set using geometric terminology.


> <details>
> <summary>Solution (coming soon)</summary>
> <br>
> Provided after deadline of exercise
> </details>

---

### Task 1.1b
Using the geometric interpretations from Task 1.1a, identify which types of documents are favored by each similarity measure. Provide an example document that achieves the highest possible similarity scores. Then extend your analysis to queries containing more than two terms.

> <details>
> <summary>Solution (coming soon)</summary>
> <br>
> Provided after deadline of exercise
> </details>

---

### Task 1.1c
In web search, queries are typically very short. What happens when using only a single query term? How effective are these similarity measures in such an extreme case?

> <details>
> <summary>Solution (coming soon)</summary>
> <br>
> Provided after deadline of exercise
> </details>

---

### Task 1.1d
Let's explore text similarity searches, such as detecting plagiarized content. Using a bag-of-words model, we can measure text similarity using Euclidean distance. Let $𝒒$ represent the term vector for Query $Q$, and $𝒅$ represent the term vector for document $D$. The distance is calculated as:

$$\delta \left(Q,D\right)=\sqrt{\sum_i\left(p_i-d_i\right)^2}$$

Unlike inner vector product and cosine similarity measures, smaller distances indicate higher relevance, while larger distances indicate lower relevance.

Following Task 1.1a, describe the set of documents within distance $\beta$ from query $Q$. Which documents receive the highest rankings using this distance measure? Is this approach effective for detecting similar pages, and if so, why?

> <details>
> <summary>Solution (coming soon)</summary>
> <br>
> Provided after deadline of exercise
> </details>
