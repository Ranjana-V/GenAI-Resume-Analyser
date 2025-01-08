# Placement Preparation Web Application

This project is a **placement preparation web application** designed to help users evaluate their resumes and improve their chances of landing their dream job. The application uses **OCR** (Optical Character Recognition) and **Gemini APIs** for analyzing resumes and generating personalized suggestions.


## Features

- **Resume Analysis**: 
  - Upload a picture or PDF of your resume.
  - The application extracts text using the **OCR API**.
  - The extracted text is analyzed using the Google **Gemini API** to give a personalized feedback.

- **Personalized Feedback**:
  - Enter your **preferred job role**, **goal CTC**, and **goal company**.
  - Get:
    - **Percentage chances** of getting the job.
    - **Feedback**  & **Suggestions** to enhance your resume for the target job.

- **Interview Tips**:
  - Generates concise interview tips tailored to the provided input.


https://github.com/user-attachments/assets/7b300faa-8982-44ed-a142-778059654ebd



## Setup Instructions

### Prerequisites
1. Install [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com/).
2. Get free API keys:
   - **OCR API Key** from [OCR.Space](https://ocr.space/ocrapi).
   - **Gemini API Key** from [Google Gemini API](https://ai.google.dev/gemini-api/docs/api-key).
3. Add your free API keys in place of the placeholders in **config.js** file

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/Ranjana-V/GenAI-Resume-Analyser.git
   
