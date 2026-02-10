# Overview

(This course is now archived)

The **Multimedia Retrieval** (HS25) course at the University of Basel is a comprehensive exploration of information retrieval systems spanning text, images, audio, and video content. The course begins with foundational concepts, covering classical text retrieval models including Boolean, vector space, and probabilistic approaches, culminating in the widely-used BM25 algorithm. Students learn performance evaluation techniques using precision and recall metrics to assess retrieval system effectiveness.

The curriculum progresses through advanced text processing methods, indexing strategies using tools like Lucene, and modern semantic search techniques including word embeddings and transformer-based models. A significant focus is placed on vector search challenges, addressing the curse of dimensionality and contemporary vector search engine techniques. The course embraces current AI trends by covering Retrieval Augmented Generation (RAG), showing how large language models enhance responses using retrieved information.

Beyond text, the course delves into multimodal content analysis, examining visual features (color, texture, shape), acoustic features in time and frequency domains, and spatiotemporal features for video analysis. Students explore machine learning classifiers for content description and multimodal search using transformer models. 

Throughout, students engage with theoretical and hands-on practical exercises, and can test their knowledge with an interactive quiz application. You can find the course material here:
  - [ADAM University Basel](https://adam.unibas.ch/goto_adam_crs_1995846.html) (for students only)
  - [Public Web Site](https://dmi.unibas.ch/de/studium/computer-science-informatik/lehrangebot-hs25/lecture-multimedia-retrieval/)

> **Table of Contents**
> - [Course Structure](#course-structure)
> - [Exercises](#exercises)
> - [Helpful software](#helpful-software)
>   - [Installers](#1-installers)
>   - [Python](#2-python)
>   - [Jupyter notebooks](#3-jupyter-notebooks)
>   - [IDE](#4-ide)
> - [Documentation, tutorials, cheat sheets](#documentation-tutorials-cheat-sheets)

<br>

---

<br>

## Course Structure

| Chapter | Title                          | Content                                                                                                                                                                                                 |
|--------:|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 01      | [Introduction](./01-Introduction/README.md)                    | We will cover the motivation, a short history, the general retrieval process and its variations, and watch demonstrations to get started.                                                               |
| 02      | [Classical Text Retrieval](./02-ClassicalTextRetrieval/README.md)        | We discuss the main classical retrieval models: Boolean, vector space, and probabilistic. We conclude with BM25, the leading model used in many systems today.                                           |
| 03      | [Performance Evaluation](./03-PerformanceEvaluation/README.md)          | We evaluate and compare retrieval systems to determine how well the methods described in the chapters perform. Focus is on precision and recall related metrics.                                          |
| 04      | [Advanced Text Processing](./04-AdvancedTextProcessing/README.md)        | We study how to extract improved text features, examine tokenization strategies for machine learning, and discuss various linguistic analysis and transformation methods.                                 |
| 05      | [Index for Text Retrieval](./05-IndexForTextRetrieval/README.md)        | We explore methods to quickly find relevant documents and study Lucene, a widespread library that provides classical and modern text retrieval capabilities.                                              |
| 06      | [Semantic Search](./06-SemanticSearch/README.md)                 | We explore semantic search: first Latent Semantic Indexing, then word embeddings, and finally modern transformer-based semantic search.                                                                  |
| 07      | [Vector Search](./07-VectorSearch/README.md)                   | We examine the challenge of searching embeddings and feature vectors. We explain the curse of dimensionality and review techniques used by vector search engines today.                                   |
| 08      | [Retrieval Augmented Generation](./08-RetrievalAugementedGeneration/README.md)  | We show how large language models can improve responses to users by using retrieved information. We apply this approach to text search.                                                                   |
| 09      | [Web Search](./09-WebSearch/README.md)                      | We study web retrieval, specifically methods that influence rankings using the relationships among documents or web pages.                                                                                |
| 10      | [Multimodal Content Analysis](./10-MultimodalContentAnalysis/README.md)     | We explain multimodal content analysis and how to evaluate extracted features using a confusion matrix. We present metadata extraction as a simple method to bridge the semantic gap.                      |
| 11      | [Visual Features](https://dmi.unibas.ch/fileadmin/user_upload/dmi/Studium/Computer_Science/Vorlesungen_HS23/Multimedia_Retrieval/HS25/11_VisualFeatures.pdf)                 | We cover the human perception of visual signal information and examine several algorithms for extracting features that describe color, texture, and shape aspects found in the images.                     |
| 12      | [Acoustic Features](https://dmi.unibas.ch/fileadmin/user_upload/dmi/Studium/Computer_Science/Vorlesungen_HS23/Multimedia_Retrieval/HS25/12_AcousticFeatures.pdf)               | We cover the human perception of audio signals and study various algorithms for extracting features in both the time and frequency domains.                                                                |
| 13      | [Spatiotemporal Features](https://dmi.unibas.ch/fileadmin/user_upload/dmi/Studium/Computer_Science/Vorlesungen_HS23/Multimedia_Retrieval/HS25/13_SpatiotemporalFeatures.pdf)         | We present simple methods to describe how videos change over time and across space.                                                                                                                      |
| 14      | [Structural Features](./14-StructuralFeatures/README.md)             | We study network architectures that extract classifiers from images and audio files to serve as focused content descriptors. We use transformer-based models to generate improved descriptions and classifiers and examine how to integrate them into the retrieval process.                                                            |
| 99      | [ML Methods](https://dmi.unibas.ch/fileadmin/user_upload/dmi/Studium/Computer_Science/Vorlesungen_HS23/Multimedia_Retrieval/HS25/99_MLMethods.pdf)                      | We review key machine learning methods used for content analysis and for extracting metadata. This chapter is not part of the exam; it is supplemental material to help you understand the course methods. |

<br>

---

<br>

## Exercises

The [Quiz Application](https://roger-weber.github.io/mmir-unibasel-hs25/) offers multiple choice questions covering the course content, organized by chapter. It provides two modes:
- Learn Mode: continue answering questions until all are answered correctly
- Test Mode: complete a set of questions and receive your score

New questions are added as we progress in the course. There is a short [User Manual](./mmir-quiz-app/USER_MANUAL.md) with more details on how the application works.

> **Note**  
> The quiz application runs locally in your browser without storing or tracking results. The source code is [available in this repository](./mmir-quiz-app/). Feel free to provide suggestions for improvements! 



| Exercise | Title | <img width="800" height="1"> |
|---|---|---------------------------------------------------------------|
| **Theoretical Exercise 1** | Classical Text Retrieval | <ul><li>Work through [Theoretical Exercise 1.1: Vector Space Retrieval](./98-Exercises/TEx_1_1_VectorSpaceRetrieval.md)<li>Work through [Theoretical Exercise 1.2: Probabilistic Retrieval](./98-Exercises/TEx_1_2_ProbabilisticRetrieval.md)<li>Complete the [Quiz App](https://roger-weber.github.io/mmir-unibasel-hs25/) for Chapters 1–2</ul> |
| **Practical Exercise 1** | Benchmarking | <ul><li>Work through [Practical Exercise 1: Benchmarking](./98-Exercises/PEx_1_EvaluationClassicalRetrieval.md)</ul> |
| **Theoretical Exercise 2** | Evaluation | <ul><li>Work through [Theoretical Exercise 2.1: Precision, Recall, and MRR](./98-Exercises/TEx_2_1_PrecisionRecallMRR.md)<li>Work through [Theoretical Exercise 2.2: Graded Relevance](./98-Exercises/TEx_2_2_GradedRelevance.md)<li>Complete the [Quiz App](https://roger-weber.github.io/mmir-unibasel-hs25/) for Chapters 3-4</ul> |
| **Practical Exercise 2** | Text Retrieval with Lucene | <ul><li>Work through [Practical Exercise 2: Text Retrieval](./98-Exercises/PEx_2_TextRetrievalWithLucene.md)</ul> |
| **Theoretical Exercise 3** | Semantic Search | <ul><li>Complete the [Quiz App](https://roger-weber.github.io/mmir-unibasel-hs25/) for Chapters 5-6</ul> |
| **Practical Exercise 3** | Semantic Search | <ul><li>Work through [Practical Exercise 3: Semantic Search](./98-Exercises/PEx_3_SemanticSearch.md)</ul> |
| **Theoretical Exercise 4** | Web Search | <ul><li>Work through [Theoretical Exercise 4.1: Hubs, Authorities, and PageRank](./98-Exercises/TEx_4_1_Hubs_Authorities_PageRank.md)<li>Complete the [Quiz App](https://roger-weber.github.io/mmir-unibasel-hs25/) for Chapters 7–9</ul> |
| **Practical Exercise 4** | Visual Features | <ul><li>Work through [Practical Exercise 4: Visual Features](./98-Exercises/PEx_4_VisualFeatures.md)</ul> |
| **Theoretical Exercise 5** | Web Search | <ul><li>Complete the [Quiz App](https://roger-weber.github.io/mmir-unibasel-hs25/) for Chapters 10–14</ul> |
<br>

---

<br>

## Helpful software

1. **Installers**
   - [WinGet for Windows](https://learn.microsoft.com/en-us/windows/package-manager/winget)
     [winget.run to find packages](https://winget.run)
   - [Chocolatey for Windows](https://chocolatey.org/install)
     [Chocolatey package search](https://community.chocolatey.org/packages)
   - [brew for macOS](https://brew.sh/)
     [homebrew formuale](https://formulae.brew.sh/)

2. **Python**
    - **[Download Python](https://www.python.org/downloads/)**
      winget: ```winget install -e --id Python.Python.3.11```
      choco: ```choco install python```
      macOS: ```brew install python```
      Check the version:

      ```bash
        python --version
      ```
  
    - **Set a symlink** for ```python``` to ```python3``` (if it does not exist; or: always use python3 and pip3)

    - **Upgrade pip**

      ```bash
        python -m pip install --upgrade pip
      ```

    - **Best practice**: create a vritual python environment to prevent package version conflicts

      ```bash
        python -m venv .venv

        windows> .venv\scripts\activate
        macOS> source .venv/bin/activate
      ```

      This also works with jupyter notebooks (select the .venv python kernel)
      Deactivate the environment with

      ```bash
        windows> deactivate
        macOS> deactivate
      ```

    - **Keep track of dependencies** with ```requirements.txt``` then use pip to install

      ```bash
        pip install -r requirements.txt
      ```

      Example for ```requirements.txt```:

      ```text
        ###### Requirements without Version Specifiers ######
        nose
        nose-cov
        beautifulsoup4

        ###### Requirements with Version Specifiers ######
        docopt == 0.6.1             # Version Matching. Must be version 0.6.1
        keyring >= 4.1.1            # Minimum version 4.1.1
        coverage != 3.5             # Version Exclusion. Anything except version 3.5
        Mopidy-Dirble ~= 1.1        # Compatible release. Same as >= 1.1, == 1.*
      ```

    - **[Finding packages (PyPI)](https://pypi.org/)**

3. **Jupyter notebooks**

    - Install Jupyter Notebook, and run from current folder (with *.ipynb files)

      ```bash
        pip install notebook
        jupyter notebook
      ```

    - Optional: install JupyterLab, and run from current folder (with *.ipynb files)

      ```bash
        pip install notebook
        jupyter notebook
      ```

    - Optional: install additional kernels for jupyter
        - [Ganymede](https://github.com/allen-ball/ganymede): JShell Kernel for notebooks
          download the jar `ganymede-nnn.jar`
          install the new kernel `java -jar ganymede-nnn.jar -i`
          restart jupyter notebook / VSCode
          open notebook and select ganymede kernel
          use `%%pom` to load 3rd party libraries

            ```pom
                %%pom
                dependencies:
                - org.apache.lucene:lucene-core:LATEST
                - org.apache.lucene:lucene-analyzers-common:LATEST
                - org.apache.lucene:lucene-queryparser:LATEST
            ```

        - [iRuby](https://github.com/sciruby/iruby#macos)

            ```bash
                gem install iruby
                iruby register --force
            ```

        - [more kernels for other languages](https://github.com/jupyter/jupyter/wiki/Jupyter-kernels)

4. **IDE**

    - [VSCode](https://code.visualstudio.com/)
        Install the following extensions

        ```bash
            Python
            Pylance
            Jupyter
            Java Language Support
            Gradle for Java
            AWS Toolkit (free coding assistant)
        ```

    - [PyCharm](https://www.jetbrains.com/pycharm/)

    - [Sign-up for Amazon Q (free)](https://docs.aws.amazon.com/amazonq/latest/qdeveloper-ug/q-free-tier.html)
        (this requires an AWS Builder ID; usage is for free for individual tier; no AWS account required)

<br>

---

<br>

## Documentation, tutorials, cheat sheets

- [Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/)
- [Python Documentation](https://docs.python.org/3/index.html)
- [Quickstart with Python](https://docs.python.org/3/tutorial/index.html)
- [Python for Data Scientist](https://khuyentran1401.github.io/Efficient_Python_tricks_and_tools_for_data_scientists/README.html)
- [Python Cheat Sheets](https://www.pythoncheatsheet.org/)

