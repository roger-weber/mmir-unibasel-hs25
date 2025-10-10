## Theoretical Exercise 1.1: Vector Space Retrieval

For vector space retrieval, we introduced the inner vector product and cosine measure to rank documents by their similarity to the query. We will examine now the geometric interpretation of these functions. For simplicity, we begin by analyzing a two-term query before extending to higher dimensions.


### Task 1.1a
Consider a two-term query and define a similarity threshold $α$. For both similarity metrics, identify the set of documents that have a similarity score greater than $α$. Describe this set using geometric terminology.


> <details>
> <summary>Solution</summary>
> <br/>
> The dot product divides the space using a hyperplane, which in two-dimensional space appears as the line $𝒒^⊤𝒙=α$. Documents considered relevant lie on one side of this line, opposite from the origin. The query vector $𝒒$ serves as the normal vector to this line (or hyperplane when there are more than two query terms). In contrast, the cosine measure divides the space using a hypercone, which is defined by the query vector $𝒒$ and angle $acos(α)$. Documents that fall within this hypercone are considered relevant.
> <br/><br/>
> The hypercone extends across all dimensions containing query or document terms. In comparison, the dot product maps each document onto just the space defined by query terms. Looking at the formulas: the dot product simply sums up the products of corresponding components between query and document. When $q_j=0$, that component can be ignored, effectively projecting documents onto only the query term dimensions. The cosine measure also computes a component-wise sum, but then divides by both document and query lengths. While the query length only involves dimensions with query terms, the document length includes all dimensions with document terms. Therefore, the angle is measured not in the reduced query-term space, but in the full dimensional space containing both document and query terms.
> </details>

---

### Task 1.1b
Using the geometric interpretations from Task 1.1a, identify which types of documents are favored by each similarity measure. Provide an example document that achieves the highest possible similarity scores. Then extend your analysis to queries containing more than two terms.

> <details>
> <summary>Solution</summary>
> <br/>
> The dot-product favors longer documents since the product sum grows with term frequencies, and longer documents tend to have a higher number of term occurrences than shorter documents. In practice, this means that brief documents containing all query terms may rank lower than lengthy documents that only contain some query terms but with higher frequencies. This similarity measure is vulnerable to manipulation, as malicious users can artificially inflate term frequencies to achieve high rankings for targeted query terms.
> <br/><br/>
> The cosine measure favors documents that maintain term frequency ratios similar to the query. For instance, given a query "cat dog", documents containing equal frequencies of "cat" and "dog" receive the highest rankings (as their vectors align with the query vector). However, the document length normalization component penalizes longer documents by considering all terms when computing the angle between document and query vectors. This inclusion of non-query terms in the scoring calculation is counterintuitive for information retrieval purposes. We may argue that relevance should be determined primarily by how well documents represent query concepts, not by the presence of additional information unrelated to the query. A document containing precisely what a user seeks shouldn't be penalized merely because it contains other information as well.
> <br/><br/>
> Both dot-product and cosine similarity remain widely used as foundational scoring methods, including in modern semantic search with embeddings. However, newer approaches like BM25 have improved upon their limitations. BM25 takes a hybrid approach that addresses the drawbacks of both methods. Like the dot product, it considers term frequency, but applies a saturation function that yields diminishing returns for additional occurrences. For length normalization, rather than using cosine similarity's vector normalization, BM25 normalizes document length against the collection's average length. This provides a more balanced approach that moderately penalizes very long documents without the harsh penalties imposed by cosine similarity.
> </details>

---

### Task 1.1c
In web search, queries are typically very short. What happens when using only a single query term? How effective are these similarity measures in such an extreme case?

> <details>
> <summary>Solution</summary>
> <br>
> Web search engines typically avoid using pure vector space retrieval models for multiple reasons. Web queries tend to be very short, usually one or two terms and rarely more than four. As discussed previously, the inner vector product is susceptible to keyword spamming, where long documents with high query term frequencies can dominate the rankings. Even in the absence of deliberate manipulation, the inner vector product inherently favors longer documents over more relevant ones. In the case of single-term queries, documents would simply be ranked by term frequency, with the document containing the most occurrences appearing first.
> <br/><br/>
> The cosine measure does not offer significant improvements over the dot-product. While it performs effectively with longer queries containing infrequent terms, it becomes less effective with short queries. The issue of query term ratios discussed earlier becomes evident. In the extreme case of a single query term, there is only one direction in the one-dimensional space, and all documents containing that query term are considered relevant. The only distinction in relevance comes from the angle introduced by other document terms, which penalizes documents with diverse vocabulary and favors pages containing only the query term, such as a page with just the word "Microsoft".
> <br/><br/>
> Due to the shortcomings of these methods, most modern web search engines employ classical methods only to retrieve documents (with some adjustments to increase recall) and use more advanced techniques to rank the pages. We will discuss this in more detail in a later chapter of the course. 
> </details>

---

### Task 1.1d
Let's explore text similarity searches, such as detecting plagiarized content. Using a bag-of-words model, we can measure text similarity using Euclidean distance. Let $𝒒$ represent the term vector for Query $Q$, and $𝒅$ represent the term vector for document $D$. The distance is calculated as:

$$\delta \left(Q,D\right)=\sqrt{\sum_i\left(p_i-d_i\right)^2}$$

Unlike inner vector product and cosine similarity measures, smaller distances indicate higher relevance, while larger distances indicate lower relevance.

Following Task 1.1a, describe the set of documents within distance $\beta$ from query $Q$. Which documents receive the highest rankings using this distance measure? Is this approach effective for detecting similar pages, and if so, why?

> <details>
> <summary>Solution</summary>
> <br>
> Using Euclidean distance, the query defines a hypersphere (or circle in two dimensions) around the query point with radius $\beta$. Documents within this sphere are considered relevant, while those outside are not. The method favors documents containing all query terms with term frequencies matching the query document. This approach favors identical or slightly modified copies of the query text, but cannot identify query content embedded within longer documents. The method works well for finding duplicate pages and can effectively filtering them out to avoid showing nearly identical documents in search results.
> </details>
