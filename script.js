// ==========================================
// 1. ЧАСТИЦЫ НА ФОНЕ
// ==========================================

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 80;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
        ctx.fillStyle = `rgba(0, 255, 136, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
                ctx.strokeStyle = `rgba(0, 255, 136, ${0.1 * (1 - distance / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    requestAnimationFrame(animateParticles);
}

animateParticles();

// ==========================================
// 2. МАТРИЧНЫЙ ДОЖДЬ
// ==========================================

const matrixCanvas = document.getElementById('matrix');
const mctx = matrixCanvas.getContext('2d');
matrixCanvas.width = window.innerWidth;
matrixCanvas.height = window.innerHeight;

const chars = '01アイウエオカキクケコサシスセソABCDEF'.split('');
const fontSize = 14;
const columns = matrixCanvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    mctx.fillStyle = 'rgba(5,5,5,0.05)';
    mctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    mctx.fillStyle = '#00ff88';
    mctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        mctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    }
}
setInterval(drawMatrix, 50);

// ==========================================
// 3. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
// ==========================================

const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .project-card, .process-step, .skill-item, .promo-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ==========================================
// 4. СЧЁТЧИКИ ЦИФР
// ==========================================

const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 30);
}

// ==========================================
// 5. ПЛАВНЫЙ СКРОЛЛ
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==========================================
// 6. ЭФФЕКТ ПАРАЛЛАКСА НА ГЛАВНОМ ЭКРАНЕ
// ==========================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - scrolled / 600;
    }
});

// ==========================================
// 7. КАСТОМНЫЙ КУРСОР
// ==========================================

const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

// ==========================================
// 8. ЖИВОЙ ТЕРМИНАЛ
// ==========================================

const phrases = [
    '> whoami',
    'Vanek — 19 лет, Python-разработчик',
    '> skills',
    'Python, aiogram, JS, AI API',
    '> status',
    'Готов к новым проектам 🚀'
];
let phraseIndex = 0, charIndex = 0;
const terminalEl = document.getElementById('terminal-text');

function typeTerminal() {
    if (phraseIndex >= phrases.length) {
        phraseIndex = 0;
        terminalEl.textContent = '';
        charIndex = 0;
    }
    const current = phrases[phraseIndex];
    terminalEl.textContent = current.slice(0, charIndex);
    charIndex++;
    if (charIndex > current.length) {
        setTimeout(() => {
            phraseIndex++;
            charIndex = 0;
            typeTerminal();
        }, 1500);
    } else {
        setTimeout(typeTerminal, 50);
    }
}
typeTerminal();

// ==========================================
// 9. РЕСАЙЗ
// ==========================================

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
});