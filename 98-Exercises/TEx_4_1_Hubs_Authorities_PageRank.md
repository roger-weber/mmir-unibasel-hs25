## Theoretical Exercise 4.1: Hubs, Authorities, and PageRank

Consider the following directed network:

<img src="TEx_4_1_Network.png" width="600"/>

In this exercise, we analyze the nodes in the network using three important measures: **hub scores**, **authority scores**, and **PageRank**. These measures help us understand the roles that nodes play in the given network.


### Task 4.1a
We have defined matrices $\mathbf{M}$ and $\mathbf{A}$ for the iterative computations. In this part, we apply the original **HITS (Hyperlink-Induced Topic Search)** algorithm. The following update rules are used:

$$\mathbf{A}^{(t+1)}=\frac{1-\alpha }{N}\cdot\mathbf{1}+\alpha\cdot\mathbf{M}\cdot\mathbf{r}^{\left(t\right)}$$ 

$$\mathbf{h}^{(t+1)}=\mathbf{A}\cdot \mathbf{a}^{\left(t\right)}$$

$$\mathbf{a}^{\left(t+1\right)}=\mathbf{A}^⊤\cdot\mathbf{h}^{(t)}$$

Compute the matrices for the network shown above. This includes constructing the adjacency matrix, the transition matrix, and the matrices used during the HITS iterations.

> <details>
> <summary>Solution (coming soon)</summary>
> <br>
> Provided after deadline of exercise
> </details>


---

### Task 4.1b
Write a program that computes the hub, authority, and PageRank values using a fixed-point iteration method. Your program should:
- Initialize the vectors (e.g., with uniform values)
- Iteratively apply the update equations
- Normalize after each step
- Continue until convergence or until a maximum number of iterations is reached


> <details>
> <summary>Solution (coming soon)</summary>
> <br>
> Provided after deadline of exercise
> </details>

---

### Task 4.1c

Identify the top-ranking nodes according to:
- **Hub scores**: Which nodes serve as the best “link providers”?
- **Authority scores**: Which nodes receive the most valuable incoming links?
- **PageRank**: Which nodes are, overall, the most important within the network?

Discuss how and why these rankings differ. Consider whether certain nodes act predominantly as hubs, others as authorities, and whether PageRank gives a different perspective on node importance.


> <details>
> <summary>Solution (coming soon)</summary>
> <br>
> Provided after deadline of exercise
> </details>
