import CONFIG from "../../config.js";

document.addEventListener('DOMContentLoaded', function() {
    // Image carousel logic
    const carousel = document.querySelector('.image-carousel');
    const images = carousel.querySelectorAll('img');
    const prevBtn = document.querySelector('.carousel-controls .prev');
    const nextBtn = document.querySelector('.carousel-controls .next');
    let currentIndex = 0;

    function showImage(index) {
        images.forEach(img => img.classList.remove('active'));
        images[index].classList.add('active');
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    }

    let intervalId = setInterval(nextImage, 5000);

    nextBtn.addEventListener('click', () => {
        clearInterval(intervalId);
        nextImage();
        intervalId = setInterval(nextImage, 5000);
    });

    prevBtn.addEventListener('click', () => {
        clearInterval(intervalId);
        prevImage();
        intervalId = setInterval(nextImage, 5000);
    });

    showImage(currentIndex);

    // Main application logic
    
    const sendBtn = document.getElementById('send-btn');
    const setupTextarea = document.getElementById('setup-textarea');
    const setupInputContainer = document.getElementById('setup-input-container');
    const aiPromptText = document.getElementById('ai-prompt-text');
    const outputContainer = document.getElementById('output-container');
    const outputTitle = document.getElementById('output-title');
    const outputText = document.getElementById('output-text');

    sendBtn.addEventListener('click', () => {
        const userInput = setupTextarea.value.trim();
        const parsedInput = parseUserInput(userInput);

        if (parsedInput) {
            const [preferredRole, expectedCTC, preferredCompany] = parsedInput;

            if (preferredRole && expectedCTC && preferredCompany) {
                setupInputContainer.innerHTML = '<img src="../assets/images/loading.gif" class="loading" id="loading">';
                aiPromptText.innerText = "Preparing the best advice for you based on your inputs...";
                fetchGeminiResponses(userInput);
            } else {
                outputText.innerText = "Please enter all details separated by commas, e.g., 'Product Manager, 20LPA, Google'.";
                outputContainer.style.display = 'block';
            }
        } else {
            outputText.innerText = "Invalid Input: Enter your Preferred Job Role, Goal CTC per annum, Goal Company";
            outputContainer.style.display = 'block';
        }
    });

    async function fetchGeminiResponses(userInput) {
        const [preferredRole, expectedCTC, preferredCompany] = parseUserInput(userInput);
    
        try {
            const interviewTips = await fetchGeminiAPI(
                `Provide concise interview tips for a candidate applying for the role of ${preferredRole} at ${preferredCompany} with an expected CTC of ${expectedCTC}.`
            );
    
            displayResponse({
                tips: interviewTips
            });
        } catch (error) {
            console.error("Error fetching Gemini responses:", error);
            displayResponse({ tips: "An error occurred. Please try again." });
        }
    }
    
    async function fetchGeminiAPI(prompt) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${CONFIG.API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();
        console.log("Gemini API response:", data);

        if (data.candidates && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            return "Sorry, I couldn't generate a response. Please try again.";
        }
    }

    function parseUserInput(userInput) {
        const [preferredRole, expectedCTC, preferredCompany] = userInput.split(',').map(part => part.trim());

        if (preferredRole && expectedCTC && preferredCompany) {
            return [preferredRole, expectedCTC, preferredCompany];
        } else if (preferredRole || expectedCTC || preferredCompany) {
            return null; // Incomplete input
        } else {
            return undefined; // Invalid or unrelated input
        }
    }

    function displayResponse({ tips }) {
        const formattedTips = formatText(tips);

        // Hide the input container and buttons
        setupInputContainer.style.display = 'none';

        outputTitle.innerText = "Interview Tips";
        outputText.innerHTML = `
            <h3>Interview Tips</h3>
            ${formattedTips}
        `;

        outputContainer.style.display = 'block';
        aiPromptText.innerText = "Here are your insights! Want to try another?";
    }

    function formatText(text) {
        const formattedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        return `<p>${formattedText}</p>`;
    }

    // Resume analysis
    document.getElementById('analyze-btn').addEventListener('click', async () => {
        const fileInput = document.getElementById('upload-image');
        const file = fileInput.files[0];
        const jobInput = document.getElementById('setup-textarea').value.trim();

        if (!file) {
            alert('Please select an image file.');
            return;
        }

        if (!jobInput) {
            alert('Please enter job details in the text area.');
            return;
        }

        document.getElementById('output').innerText = `Selected file: ${file.name}`;

        
        const ocrApiUrl = 'https://api.ocr.space/parse/image';

        const formData = new FormData();
        formData.append('apikey', CONFIG.ocrApiKey);
        formData.append('file', file);

        // Show loading gif
        document.getElementById('output').innerHTML = '<img src="../assets/images/loading.gif" class="loading" id="loading">';

        try {
            const ocrResponse = await fetch(ocrApiUrl, {
                method: 'POST',
                body: formData
            });
            const ocrData = await ocrResponse.json();

            if (ocrData.IsErroredOnProcessing) {
                document.getElementById('output').innerText = `Error: ${ocrData.ErrorMessage}`;
                return;
            }

            const extractedText = ocrData.ParsedResults.map(result => result.ParsedText).join('\n');

            const geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

            const geminiResponse = await fetch(`${geminiApiUrl}?key=${CONFIG.API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Analyze the following resume against the job requirements. 
                            Job Details: ${jobInput}
                            Resume:
                            ${extractedText}
                            Please provide:
                            1. An overall assessment of whether the candidate is qualified for the position.
                            2. A list of matching qualifications.
                            3. A list of missing or insufficient qualifications.
                            4. Suggestions for improvement, including relevant courses or certifications.
                            5. An estimated percentage chance of the candidate getting the job based on their current qualifications.`
                        }]
                    }]
                })
            });

            const geminiData = await geminiResponse.json();
            const feedback = geminiData.candidates && geminiData.candidates[0] && geminiData.candidates[0].content && geminiData.candidates[0].content.parts[0].text;

            const formattedFeedback = feedback
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');

            document.getElementById('output').innerHTML = `<div>${formattedFeedback || 'No feedback available'}</div>`;
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('output').innerText += `\nAn error occurred: ${error.message}`;
        }
    });
});
