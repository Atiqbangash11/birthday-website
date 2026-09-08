/* ==========================================
   GLOBAL STATE & AUDIO ENGINE
   ========================================== */
let currentScene = 1;
let audioStarted = false;

const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

// Audio Toggle Controller
musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.style.opacity = '1';
    } else {
        bgMusic.pause();
        musicToggle.style.opacity = '0.4';
    }
});

function initAudio() {
    if (!audioStarted) {
        bgMusic.play().then(() => {
            audioStarted = true;
            musicToggle.style.opacity = '1';
        }).catch(() => {
            // Mobile browser policy prevented autoplay
            audioStarted = false;
            musicToggle.style.opacity = '0.4';
        });
    }
}

/* ==========================================
   SCENE ENGINE (100vh NAVIGATION)
   ========================================== */
function nextScene(sceneNumber) {
    initAudio();

    const currentEl = document.getElementById(`scene-${currentScene}`);
    const nextEl = document.getElementById(`scene-${sceneNumber}`);

    if (!nextEl) return;

    // Transition Out Current Scene
    currentEl.classList.remove('active');

    setTimeout(() => {
        currentScene = sceneNumber;
        nextEl.classList.add('active');

        // Execute Scene Orchestration Logic
        handleSceneSetup(sceneNumber);
    }, 800); // Matches CSS transition time
}

/* ==========================================
   SCENE SPECIFIC TIMINGS & SEQUENCING
   ========================================== */
function handleSceneSetup(sceneNumber) {
    switch(sceneNumber) {
        case 3:
            // Screen 3: Fade out first group, fade in second group
            setTimeout(() => {
                const g1 = document.getElementById('s3-group-1');
                const g2 = document.getElementById('s3-group-2');
                g1.style.transition = 'opacity 600ms ease';
                g1.style.opacity = '0';
                setTimeout(() => {
                    g1.classList.add('hidden');
                    g2.classList.remove('hidden');
                    g2.classList.add('fade-in');
                }, 600);
            }, 3000);
            break;

        case 5:
            // Screen 5: Progressive Reveal
            const s5Heart = document.getElementById('s5-heart');
            const s5t1 = document.getElementById('s5-text-1');
            const s5t2 = document.getElementById('s5-text-2');
            const s5t3 = document.getElementById('s5-text-3');

            setTimeout(() => {
                s5Heart.classList.add('pulse-large');
            }, 500);

            setTimeout(() => {
                s5t1.classList.add('hidden');
                s5t2.classList.remove('hidden');
                s5t2.classList.add('fade-in');
            }, 2500);

            setTimeout(() => {
                s5t2.classList.add('hidden');
                s5t3.classList.remove('hidden');
                s5t3.classList.add('fade-in');
            }, 5000);
            break;

        case 7:
            // Screen 7: Sequential Text Reveal
            const s71 = document.getElementById('s7-seq-1');
            const s72 = document.getElementById('s7-seq-2');
            const s73 = document.getElementById('s7-seq-3');

            setTimeout(() => {
                s71.classList.add('hidden');
                s72.classList.remove('hidden');
                s72.classList.add('fade-in');
            }, 1800);

            setTimeout(() => {
                s72.classList.add('hidden');
                triggerFlash();
                s73.classList.remove('hidden');
                s73.classList.add('fade-in');
            }, 3600);
            break;

        case 9:
            // Screen 9: Delayed heart and particle explosion
            const p1 = document.getElementById('s9-phase-1');
            const p2 = document.getElementById('s9-phase-2');
            const p3 = document.getElementById('s9-phase-3');

            setTimeout(() => {
                p1.classList.remove('hidden');
            }, 1000);

            setTimeout(() => {
                p1.classList.add('hidden');
                p2.classList.remove('hidden');
            }, 3200);

            setTimeout(() => {
                p2.classList.add('hidden');
                triggerBurst();
                p3.classList.remove('hidden');
            }, 5000);
            break;
    }
}

/* ==========================================
   INTERACTION HANDLERS
   ========================================== */
function openGift() {
    triggerFlash();
    document.getElementById('s6-initial').classList.add('hidden');
    const revealed = document.getElementById('s6-revealed');
    revealed.classList.remove('hidden');
}

function openLetter() {
    document.getElementById('s8-envelope-container').classList.add('hidden');
    const letter = document.getElementById('s8-letter-card');
    letter.classList.remove('hidden');
    letter.classList.add('fade-in');
}

function triggerFlash() {
    const flash = document.createElement('div');
    flash.className = 'flash-overlay';
    document.body.appendChild(flash);
    
    setTimeout(() => flash.classList.add('active'), 10);
    setTimeout(() => {
        flash.classList.remove('active');
        setTimeout(() => flash.remove(), 400);
    }, 300);
}

/* ==========================================
   PARTICLE CANVAS ENGINE
   ========================================== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = -(Math.random() * 0.5 + 0.2);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.opacity -= this.fadeSpeed;

        if (this.opacity <= 0 || this.y < 0) {
            this.reset();
            this.y = canvas.height + 10;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 179, 209, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animateParticles);
}

function triggerBurst() {
    for (let i = 0; i < 60; i++) {
        const p = new Particle();
        p.x = canvas.width / 2;
        p.y = canvas.height / 2;
        p.speedX = (Math.random() - 0.5) * 6;
        p.speedY = (Math.random() - 0.5) * 6;
        p.size = Math.random() * 3 + 1;
        p.opacity = 1;
        particles.push(p);
    }
}

initParticles();
animateParticles();