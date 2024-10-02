import { AuthClient } from "@dfinity/auth-client";
import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const targetLang = document.getElementById('targetLang');
const outputText = document.getElementById('outputText');
const speakButton = document.getElementById('speakButton');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const userSection = document.getElementById('userSection');

let authClient;
let translationTimeout;

async function initAuth() {
    authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
        handleAuthenticated();
    }
}

async function handleAuthenticated() {
    loginButton.style.display = 'none';
    logoutButton.style.display = 'inline-block';
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal().toString();
    userSection.innerText = `Logged in as: ${principal}`;
    updateGreeting();
}

loginButton.onclick = async () => {
    authClient.login({
        identityProvider: "https://identity.ic0.app/#authorize",
        onSuccess: handleAuthenticated,
    });
};

logoutButton.onclick = async () => {
    await authClient.logout();
    loginButton.style.display = 'inline-block';
    logoutButton.style.display = 'none';
    userSection.innerText = '';
};

async function updateGreeting() {
    try {
        const greeting = await backend.greet();
        console.log(greeting);
    } catch (error) {
        console.error('Error fetching greeting:', error);
    }
}

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

function animateTranslation() {
    outputText.style.opacity = '0.5';
    setTimeout(() => {
        outputText.style.opacity = '1';
    }, 300);
}

inputText.addEventListener('input', animateTranslation);
targetLang.addEventListener('change', animateTranslation);

window.addEventListener('load', initAuth);
