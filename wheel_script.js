const audio = document.getElementById('backgroundMusic');
let isMusicPlaying = false;

window.addEventListener('load', () => {
    const shouldPlay = localStorage.getItem('musicPlaying') === 'true';
    const savedTime = parseFloat(localStorage.getItem('musicTime')) || 0;

    if (shouldPlay) {
        audio.currentTime = savedTime;
        audio.volume = 0.3;
        audio.play().then(() => {
            isMusicPlaying = true;
            console.log("Musik spielt weiter ab", savedTime);
        }).catch(e => {
            console.log("Autoplay verhindert:", e);
        });
    }
});


audio.addEventListener('timeupdate', () => {
    if (isMusicPlaying || !audio.paused) {
        localStorage.setItem('musicTime', audio.currentTime);
        localStorage.setItem('musicPlaying', 'true');
    }
});

window.addEventListener('beforeunload', () => {
    localStorage.setItem('musicTime', audio.currentTime);
    localStorage.setItem('musicPlaying', !audio.paused ? 'true' : 'false');
});


const sectors = [
    {color: "#ff69b4", label: "Umarmung"},
    {color: "#fa0561", label: "Kuss"},
    {color: "#ff1a75", label: "Date"},
    {color: "#e03777", label: "Essen"},
    {color: "#ff6b9d", label: "Spa Day"},
    {color: "#ff85a2", label: "Massage"},
];

const rand = (m, M) => Math.random() * (M - m) + m;
const tot = sectors.length;
const elSpin = document.querySelector("#spin");
const ctx = document.querySelector("#wheel").getContext('2d');
let dia = ctx.canvas.width;
let rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / tot;
const friction = 0.985;
const angVelMin = 0.001;
let angVelMax = 0;
let angVel = 0;
let ang = 0;
let isSpinning = false;
let isAccelerating = false;
let animFrame = null;

const getIndex = () => Math.floor(tot - ang / TAU * tot) % tot;

const drawSector = (sector, i) => {
    const ang = arc * i;
    ctx.save();

    // Sektor zeichnen
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();

    // Weißer Rand
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";

    // Label - größer und besser lesbar
    const textSize = Math.max(10, rad * 0.06);
    ctx.font = `bold ${textSize}px Nunito, sans-serif`;

    if (sector.label.length > 10) {
        const words = sector.label.split(' ');
        if (words.length > 1) {
            ctx.fillText(words[0], rad * 0.65, -8);
            ctx.fillText(words[1], rad * 0.65, 12);
        } else {
            ctx.fillText(sector.label, rad * 0.65, 3);
        }
    } else {
        ctx.fillText(sector.label, rad * 0.65, 2);
    }

    ctx.restore();
};

const rotate = () => {
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
};

const frame = () => {
    if (!isSpinning) return;

    if (angVel >= angVelMax) isAccelerating = false;

    if (isAccelerating) {
        angVel ||= angVelMin;
        angVel *= 1.05;
    } else {
        angVel *= friction;

        if (angVel < angVelMin) {
            isSpinning = false;
            angVel = 0;
            cancelAnimationFrame(animFrame);
            showResult();
        }
    }

    ang += angVel;
    ang %= TAU;
    rotate();
};

const engine = () => {
    frame();
    animFrame = requestAnimationFrame(engine);
};

const showResult = () => {
    const sector = sectors[getIndex()];
    const resultModal = document.getElementById('result');
    const resultText = resultModal.querySelector('.result-text');

    resultText.textContent = sector.label;

    setTimeout(() => {
        resultModal.classList.add('show');
        createConfetti();
        elSpin.disabled = false;
        elSpin.querySelector('.spin-text').textContent = 'DREHEN!';
    }, 500);
};

function closeResult() {
    document.getElementById('result').classList.remove('show');
}

function createConfetti() {
    const colors = ['#ff69b4', '#ff1493', '#fa0561', '#ff6b9d', '#ffc0cb', '#ffd700'];

    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = rand(5, 15) + 'px';
            confetti.style.height = rand(5, 15) + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = rand(0, 100) + '%';
            confetti.style.top = '-20px';
            confetti.style.opacity = rand(0.5, 1);
            confetti.style.borderRadius = rand(0, 50) + '%';
            confetti.style.transform = `rotate(${rand(0, 360)}deg)`;
            confetti.style.animation = `confettiFall ${rand(2, 4)}s linear`;
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 4000);
        }, i * 10);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

elSpin.addEventListener("click", () => {
    if (isSpinning) return;

    elSpin.disabled = true;
    elSpin.querySelector('.spin-text').textContent = 'DREHT...';

    isSpinning = true;
    isAccelerating = true;
    angVelMax = rand(0.30, 0.45);
    engine();
});

// Responsive Canvas-Größe anpassen
function resizeCanvas() {
    const viewportWidth = window.innerWidth;
    let size;

    if (viewportWidth <= 480) {
        size = Math.min(viewportWidth - 100, 280);
    } else if (viewportWidth <= 768) {
        size = Math.min(viewportWidth - 120, 350);
    } else {
        size = 500;
    }

    ctx.canvas.width = size;
    ctx.canvas.height = size;

    dia = size;
    rad = dia / 2;

    ctx.clearRect(0, 0, dia, dia);
    sectors.forEach(drawSector);
    rotate();
}

window.addEventListener('load', () => {
    resizeCanvas();
});

window.addEventListener('resize', () => {
    resizeCanvas();
});

resizeCanvas();
