# Evaluation

So far, we have not discussed the evaluation of classification and retrieval methods. However, both use similar metrics such as precision and recall. Precision measures the percentage of relevant or correctly labeled items among those retrieved or with the same label, while recall calculates the percentage of retrieved or correctly classified items out of the set of relevant items or items with the same label.

Before we define these metrics, let’s consider what we need for a retrieval benchmark. Firstly, we need a collection of documents that match the retrieval scenario. Secondly, we require multiple queries covering various aspects of the retrieval task, along with a relevance assessment of documents against these queries. Lastly, we need a performance goal that the algorithms should achieve.

```{admonition} Structure of a Retrieval Benchmark
:class: hint

  **Collections and queries:** examples include MS MARCO (Microsoft Machine Reading Comprehension Dataset), which contains over 500 thousand queries from Bing against millions of retrieved documents and passages. Another example is the TREC (Text REtrieval Conference) data sets, featuring 50+ queries against several thousand documents.

  **Assessment:** in the TREC data set, each query is assessed against the collection of retrieved documents (only the ones returned by competing systems). Even though we do not assess all documents for each query, we obtain a relatively dense assessment.  On the other hand, assessments for MS MARCO are sparse, with only a few documents assessed against the 500 thousand queries to keep the assessment efforts low. The impact of these different assessment approaches will be visualized on the next page.

  **Performance goal:** in web retrieval, users typically focus on the top result or the first 10 documents. The performance goal is to have a relevant document at the top of the ranking. On the other hand, a patent lawyer or a researcher aims to retrieve as many relevant documents as possible with only a few non-relevant items. They want more documents and at the same time reduce the fall-out, i.e., returned documents that turn out to be not relevant and thus incur overhead going through the results.
```
````{sidebar} Evaluation with dense assessments
```{figure} images/figure-1.png
:name: fig-dense-assessment
:width: 300px
```
````

In a typical text retrieval competition, each contestant evaluates all queries against the collection. The competition assess the combined set of documents retrieved by all contestants (often with the help of the contestants), leading to a dense assessment, as shown in the figure on the right. Even though not all documents are assessed, this approach maintains the relative order of competing algorithms. To illustrate, if we have a relevant document that was not assessed (see arrow), it may lead to a slight overestimation of the algorithms’ ability to retrieve relevant documents (recall). However, including assessments for these documents would not alter the relative ranking of the methods.

Competitions like MS MARCO have a large number of queries, making dense assessments impractical. Instead, they only assess a few documents per query (sometimes just 2-5 documents), leading to a sparse assessment, as shown on the right side. This significantly differs from the dense assessment above. For instance, there could be assessed and relevant documents that none of the contestants found. However, the challenge arises from missing assessment for retrieved documents, which can negatively impact the performance evaluation. For example, consider the area highlighted by the arrow: it contains relevant documents for which assessments are missing. Consequently, even if a competing algorithm provides a good answer, due to missing relevancy assessment, it may not receive credit for it.
