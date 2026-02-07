const messages = [
    "Hä, Arina, bist du sicher?",
    "Wirklich sicher??",
    "Alles gut bei dir?",
    "Checke ich nicht...",
    "Denk bitte nach!",
    "Ich werde wirklich sehr traurig, wenn du nein sagst...",
    "Sehr sehr traurig...",
    "Ich meine, sehr sehr sehr traurig, Arina...",
    "Ok, egal...",
    "Bitte sag JAAAAA!!!!! ❤️"
];

let messageIndex = 0;
let musicStarted = false;
const audio = document.getElementById('backgroundMusic');

// Musik starten beim ersten Klick
function startMusic() {
    if (!musicStarted) {
        audio.volume = 0.3;
        audio.play().catch(e => console.log("Autoplay verhindert:", e));
        musicStarted = true;
    }
}

// Speichere die aktuelle Zeit der Musik
audio.addEventListener('timeupdate', () => {
    if (musicStarted) {
        localStorage.setItem('musicTime', audio.currentTime);
        localStorage.setItem('musicPlaying', 'true');
    }
});

function handleNoClick() {
    startMusic();
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    noButton.textContent = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.5}px`;
}

function handleYesClick() {
    startMusic();
    // Speichere Status vor dem Seitenwechsel
    if (musicStarted) {
        localStorage.setItem('musicTime', audio.currentTime);
        localStorage.setItem('musicPlaying', 'true');
    }
    window.location.href = "yes_page.html";
}
