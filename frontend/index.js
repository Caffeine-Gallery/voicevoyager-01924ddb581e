import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const targetLang = document.getElementById('targetLang');
const outputText = document.getElementById('outputText');
const speakButton = document.getElementById('speakButton');

let translationTimeout;

async function translateText() {
    const text = inputText.value;
    const lang = targetLang.value;

    if (text.trim() === '') {
        outputText.value = '';
        return;
    }

    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${lang}`);
        const data = await response.json();
        outputText.value = data.responseData.translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        outputText.value = 'Error occurred during translation.';
    }
}

function debounceTranslation() {
    clearTimeout(translationTimeout);
    translationTimeout = setTimeout(translateText, 300);
}

inputText.addEventListener('input', debounceTranslation);
targetLang.addEventListener('change', translateText);

speakButton.addEventListener('click', () => {
    const text = outputText.value;
    const lang = targetLang.value;

    if (text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
});

// Add subtle animation to the translation process
function animateTranslation() {
    outputText.style.opacity = '0.5';
    setTimeout(() => {
        outputText.style.opacity = '1';
    }, 300);
}

inputText.addEventListener('input', animateTranslation);
targetLang.addEventListener('change', animateTranslation);

// Greeting from the backend
window.addEventListener('load', async () => {
    try {
        const greeting = await backend.greet('User');
        console.log(greeting);
    } catch (error) {
        console.error('Error fetching greeting:', error);
    }
});
