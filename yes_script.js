let slideIndex = 1;
showSlide(slideIndex);

const audio = document.getElementById('backgroundMusic');
let isPlaying = false;

// Musik automatisch weiterspielen beim Laden
window.addEventListener('load', () => {
    const shouldPlay = localStorage.getItem('musicPlaying') === 'true';
    const savedTime = parseFloat(localStorage.getItem('musicTime')) || 0;

    if (shouldPlay) {
        audio.currentTime = savedTime;
        audio.volume = 0.3;
        audio.play().then(() => {
            isPlaying = true;
            console.log("Musik spielt weiter ab", savedTime);
        }).catch(e => {
            console.log("Autoplay verhindert:", e);
        });
    }
});

// Speichere Zeit kontinuierlich
audio.addEventListener('timeupdate', () => {
    if (isPlaying || !audio.paused) {
        localStorage.setItem('musicTime', audio.currentTime);
    }
});

// Automatisches Durchspielen alle 3 Sekunden
let autoPlay = setInterval(() => {
    changeSlide(1);
}, 3000);

function changeSlide(n) {
    showSlide(slideIndex += n);
    resetAutoPlay();
}

function currentSlide(n) {
    showSlide(slideIndex = n);
    resetAutoPlay();
}

function showSlide(n) {
    let slides = document.getElementsByClassName("gallery-slide");
    let dots = document.getElementsByClassName("dot");

    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }

    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }

    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
    }

    slides[slideIndex - 1].classList.add("active");
    dots[slideIndex - 1].classList.add("active");
}

function resetAutoPlay() {
    clearInterval(autoPlay);
    autoPlay = setInterval(() => {
        changeSlide(1);
    }, 3000);
}

// ===== LIGHTBOX FUNKTIONALITÄT =====
function openLightbox(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Verhindert Scrollen im Hintergrund
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Lightbox mit ESC-Taste schließen
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Lightbox beim Klick auf den Hintergrund schließen
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') {
        closeLightbox();
    }
});

// Füge Click-Handler zu allen Bildern hinzu
window.addEventListener('load', () => {
    const galleryImages = document.querySelectorAll('.gallery-slide img');
    galleryImages.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            openLightbox(img.src);
        });
    });
});

// ===== SWIPE FUNKTIONALITÄT FÜR MOBILE =====
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

const galleryContainer = document.querySelector('.gallery-container');

galleryContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, false);

galleryContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50; // Mindestdistanz für einen Swipe
    const horizontalDiff = touchEndX - touchStartX;
    const verticalDiff = Math.abs(touchEndY - touchStartY);

    // Nur horizontale Swipes erkennen (vertikale Bewegung sollte minimal sein)
    if (verticalDiff < 100) {
        if (horizontalDiff > swipeThreshold) {
            // Swipe nach rechts = vorheriges Bild
            changeSlide(-1);
        } else if (horizontalDiff < -swipeThreshold) {
            // Swipe nach links = nächstes Bild
            changeSlide(1);
        }
    }
}

// Konfetti-Animation
function createConfetti() {
    const container = document.querySelector('.confetti-container');
    const colors = ['#ff69b4', '#ff1493', '#fa0561', '#ff6b9d', '#ffc0cb'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.opacity = Math.random();
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear infinite`;
        confetti.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(confetti);
    }
}

// CSS für Konfetti
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

createConfetti();
