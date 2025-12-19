# **Practical Exercise 4: Visual Features**

In this exercise, you will implement **visual features** that will assist a later step in identifying faces within images. We will not perform face recognition here; instead, we focus on preparing the data to simplify the process and to learn how to extract characteristic features for future machine learning or AI-based detection tasks.

Face detection involves searching for regions in an image that contain skin tones, helping to locate potential face areas. In this process, we isolate skin colors and identify a specific range of hues to distinguish skin pixels effectively.

For this task, use a standard framework for image processing and machine learning, such as:

* OpenCV ([https://opencv.org](https://opencv.org)), a computer vision library originally developed in C/C++ with bindings for Python, Java, and other languages.
* scikit-image ([http://scikit-image.org](http://scikit-image.org)), a Python library providing fundamental image manipulation and feature extraction tools.
* scikit-learn ([http://scikit-learn.org](http://scikit-learn.org)), a Python machine learning library offering a wide range of classification and regression algorithms.
* PyTorch ([https://pytorch.org/](https://pytorch.org/)), a machine learning framework by Meta AI that supports automatic gradient computation and includes many components for building deep learning models.
* TensorFlow ([https://www.tensorflow.org](https://www.tensorflow.org)), an advanced machine learning and neural network library with a Python interface.


---

## Task 4.1 – Data Set Preparation

Download images containing faces and use an image editing tool to crop out regions that show only skin—excluding eyes, beards, hair, glasses, hats, or veils. Additionally, create several negative samples that contain no skin but might resemble skin tones, such as sand or similar textures.

---

## Task 4.2 – Working with Colors

Familiarize yourself with your chosen library by exploring how color space transformations operate. Determine which RGB color space is being used for your images. 

The goal is to identify the most effective input dimensions for distinguishing between positive (skin) and negative (non-skin) samples.

Write code that converts all pixels into a two-dimensional color subspace and generate a scatter plot to visualize the results, using one color to represent positive samples and another for negative samples. Try out different color spaces, and look for the color subspace that best separates the two groups visually. 


You can either use your result from the previous task or get the data set from UCI Machine Learning Repository. Keep in mind that the data has around 50,000 skin values and 195,000 non-skin values. Each line has 4 values: blue, green, red, and a label (1 for skin, 2 for non-skin).

---

## Task 4.3 – Classifying Skin Color

You can use your dataset from the previous task or obtain a dataset from the [UCI Machine Learning Repository](https://archive.ics.uci.edu/dataset/229/skin+segmentation). Note that this dataset contains approximately 50,000 skin samples and 195,000 non-skin samples. Each entry includes four values: blue, green, red, and a label (1 for skin, 2 for non-skin).

For development, consider sub-sampling the dataset to speed up experimentation, and use the full dataset only when producing the final classifier.

Using this data, build a classifier either with a traditional machine learning model or a neural network. Train the model on your training data, then evaluate its performance using a separate test set.


---

## Task 4.4 – Test your Classifier

Use images showing faces and apply your prediction model to classify each pixel’s color, generating a mask that indicates skin regions (using binary values or probabilities). Overlay this mask onto the original image to visualize the detected skin areas.

Perform a qualitative analysis by observing how well your model identified skin regions. Reflect on its strengths and weaknesses, and consider what improvements could be made.


