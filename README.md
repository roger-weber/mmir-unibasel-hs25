# Multimedia Retrieval HS25 (University of Basel)

This overview provides a summary of the content covered in the Multimedia Retrieval course at the University of Basel. You can find the course material here:
  - [ADAM University Basel](https://adam.unibas.ch/goto_adam_crs_1995846.html)
  - [Public Web Site](https://dmi.unibas.ch/de/studium/computer-science-informatik/lehrangebot-hs25/lecture-multimedia-retrieval/)



> **Table of Contents**
> - [Course Structure](#course-structure)
> - [Exercises](#exercises)
> - [Helpful software](#helpful-software)
>   1. [Installers](#1-installers)
>   1. [Python](#2-python)
>   1. [Jupyter notebooks](#3-jupyter-notebooks)
>   1. [IDE](#4-ide)
> - [Documentation, tutorials, cheat sheets](#documentation-tutorials-cheat-sheets)
> - [Links](#links)
> - [git issue with large files](#git-issue-with-large-files)




## Course Structure
| Chapter | Title                          | Content                                                                                                                                                                                                 |
|--------:|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 01      | [Introduction](01-Introduction/README.md)                    | We will cover the motivation, a short history, the general retrieval process and its variations, and watch demonstrations to get started.                                                               |
| 02      | [Classical Text Retrieval](02-ClassicalTextRetrieval/README.md)        | We discuss the main classical retrieval models: Boolean, vector space, and probabilistic. We conclude with BM25, the leading model used in many systems today.                                           |
| 03      | Performance Evaluation          | We evaluate and compare retrieval systems to determine how well the methods described in the chapters perform. Focus is on precision and recall related metrics.                                          |
| 04      | Advanced Text Processing        | We study how to extract improved text features, examine tokenization strategies for machine learning, and discuss various linguistic analysis and transformation methods.                                 |
| 05      | Index for Text Retrieval        | We explore methods to quickly find relevant documents and study Lucene, a widespread library that provides classical and modern text retrieval capabilities.                                              |
| 06      | Semantic Search                 | We explore semantic search: first Latent Semantic Indexing, then word embeddings, and finally modern transformer-based semantic search.                                                                  |
| 07      | Vector Search                   | We examine the challenge of searching embeddings and feature vectors. We explain the curse of dimensionality and review techniques used by vector search engines today.                                   |
| 08      | Retrieval Augmented Generation  | We show how large language models can improve responses to users by using retrieved information. We apply this approach to text search.                                                                   |
| 09      | Web Search                      | We study web retrieval, specifically methods that influence rankings using the relationships among documents or web pages.                                                                                |
| 10      | Multimodal Content Analysis     | We explain multimodal content analysis and how to evaluate extracted features using a confusion matrix. We present metadata extraction as a simple method to bridge the semantic gap.                      |
| 11      | Visual Features                 | We cover the human perception of visual signal information and examine several algorithms for extracting features that describe color, texture, and shape aspects found in the images.                     |
| 12      | Acoustic Features               | We cover the human perception of audio signals and study various algorithms for extracting features in both the time and frequency domains.                                                                |
| 13      | Spatiotemporal Features         | We present simple methods to describe how videos change over time and across space.                                                                                                                      |
| 14      | Classifiers                     | We study network architectures that extract classifiers from images and audio files to serve as focused content descriptors.                                                                               |
| 15      | Multimodal Search               | We use transformer-based models to generate improved descriptions and classifiers and examine how to integrate them into the retrieval process.                                                            |
| 99      | ML Methods                      | We review key machine learning methods used for content analysis and for extracting metadata. This chapter is not part of the exam; it is supplemental material to help you understand the course methods. |


## Exercises

The [quiz application](https://roger-weber.github.io/mmir-unibasel-hs25/) offers multiple choice questions covering the course content, organized by chapter. It provides two modes:
- Learn Mode: continue answering questions until all are answered correctly
- Test Mode: complete a set of questions and receive your score

New questions are added as we progress in the course.

> **Note**  
> The quiz application runs locally in your browser without storing or tracking results. The source code is [available in this repository](./mmir-quiz-app/). Feel free to provide suggestions for improvements! 





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


## Documentation, tutorials, cheat sheets

- [Markdown Cheat Sheet](https://www.markdownguide.org/cheat-sheet/)
- [Python Documentation](https://docs.python.org/3/index.html)
- [Quickstart with Python](https://docs.python.org/3/tutorial/index.html)
- [Python for Data Scientist](https://khuyentran1401.github.io/Efficient_Python_tricks_and_tools_for_data_scientists/README.html)
- [Python Cheat Sheets](https://www.pythoncheatsheet.org/)

## Links

- [Web Site Course (Uni Basel)](https://dmi.unibas.ch/de/studium/computer-science-informatik/lehrangebot-hs24/lecture-multimedia-retrieval/)
- [Link to Adam (Students only)](https://adam.unibas.ch/goto_adam_crs_1738202.html)


## git issue with large files
```
git config http.postBuffer 524288000     
```