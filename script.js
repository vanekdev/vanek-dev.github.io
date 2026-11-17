// ==========================================
// 1. ПРЕЛОАДЕР
// ==========================================

const preloader = document.getElementById('preloader');
const line1 = document.getElementById('preloader-line1');
const line2 = document.getElementById('preloader-line2');

function typeText(el, text, speed, callback) {
    let i = 0;
    el.textContent = '';
    const timer = setInterval(() => {
        el.textContent += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(timer);
            if (callback) setTimeout(callback, 200);
        }
    }, speed);
}

if (!sessionStorage.getItem('preloaderShown')) {
    typeText(line1, '> Инициализация...', 60, () => {
        typeText(line2, '> Доступ разрешен', 60, () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                sessionStorage.setItem('preloaderShown', 'true');
                setTimeout(() => preloader.remove(), 600);
            }, 600);
        });
    });
} else {
    preloader.remove();
}

// ==========================================
// 2. ЧАСТИЦЫ НА ФОНЕ
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
        ctx.fillStyle = `rgba(0,255,136,${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
                ctx.strokeStyle = `rgba(0,255,136,${0.1 * (1 - distance / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ==========================================
// 3. REVEAL-АНИМАЦИИ
// ==========================================

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

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
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ==========================================
// 6. ПАРАЛЛАКС НА ГЛАВНОМ ЭКРАНЕ
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
// 7. КУРСОР (точка + кольцо)
// ==========================================

const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.5;
    ringY += (mouseY - ringY) * 0.5;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .btn, .calc-base, .calc-option').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
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
// 9. КАЛЬКУЛЯТОР
// ==========================================

const calcCards = document.querySelectorAll('.calc-card');
const calcTotalEl = document.getElementById('calc-total');
const calcDiscountEl = document.getElementById('calc-discount');
const calcBtn = document.getElementById('calc-btn');
let currentTotal = 0;

function animateNumber(el, from, to, duration = 400) {
    const start = performance.now();
    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(from + (to - from) * progress);
        el.textContent = value.toLocaleString('ru-RU') + ' ₽';
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = to.toLocaleString('ru-RU') + ' ₽';
    }
    requestAnimationFrame(step);
}

function updateCalc() {
    let total = 0;
    let activeBlocks = 0;
    const selectedItems = [];

    calcCards.forEach(card => {
        const base = card.querySelector('.calc-base-input');
        const extras = card.querySelectorAll('.calc-extras input[type="checkbox"]');
        const isActive = base.checked;
        card.classList.toggle('active', isActive);
        if (isActive) activeBlocks++;

        extras.forEach(extra => {
            const label = extra.closest('.calc-option');
            if (isActive) {
                extra.disabled = false;
                label.classList.remove('disabled');
            } else {
                extra.disabled = true;
                extra.checked = false;
                label.classList.add('disabled');
            }
        });

        if (base.checked) {
            total += parseInt(base.dataset.price);
            selectedItems.push(base.dataset.label);
        }
        extras.forEach(extra => {
            if (extra.checked) {
                total += parseInt(extra.dataset.price);
                selectedItems.push(extra.dataset.label);
            }
        });
    });

    let finalTotal = total;
    const hasDiscount = activeBlocks >= 2;

    if (hasDiscount) {
        finalTotal = Math.round(total * 0.9);
        calcDiscountEl.style.display = 'block';
        calcDiscountEl.textContent = `Скидка за комплекс: −${(total - finalTotal).toLocaleString('ru-RU')} ₽ (10%)`;
    } else {
        calcDiscountEl.style.display = 'none';
    }

    animateNumber(calcTotalEl, currentTotal, finalTotal);
    currentTotal = finalTotal;

    if (finalTotal > 0) {
        calcBtn.classList.remove('btn-disabled');
        calcBtn.removeAttribute('disabled');
        const text = `Привет! Хочу ${selectedItems.join(', ')}, примерно ${finalTotal.toLocaleString('ru-RU')} ₽. Посчитаешь точно?`;
        calcBtn.href = `https://t.me/clown783?text=${encodeURIComponent(text)}`;
    } else {
        calcBtn.classList.add('btn-disabled');
        calcBtn.setAttribute('disabled', 'true');
        calcBtn.href = '#';
    }
}

calcCards.forEach(card => {
    card.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', updateCalc);
    });
});
updateCalc();

// ==========================================
// 10. 3D-НАКЛОН КАРТОЧЕК
// ==========================================

if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.tilt').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ==========================================
// 11. РЕСАЙЗ
// ==========================================

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ==========================================
// 12. 3D-СФЕРА ИЗ ЧАСТИЦ (Three.js)
// ==========================================

import * as THREE from 'three';

const globeCanvas = document.getElementById('globe-canvas');

if (globeCanvas && window.innerWidth > 768) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({
        canvas: globeCanvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    const count = 3000;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = 1.4 + Math.random() * 0.15;
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
        sizes[i] = Math.random() * 0.03 + 0.01;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const vertexShader = `
        attribute float size;
        void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `;

    const fragmentShader = `
        void main() {
            vec2 uv = gl_PointCoord - vec2(0.5);
            float dist = length(uv);
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, dist);
            gl_FragColor = vec4(0.0, 1.0, 0.53, alpha);
        }
    `;

    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const sphere = new THREE.Points(geometry, material);
    scene.add(sphere);

    const ringCount = 800;
    const ringPositions = new Float32Array(ringCount * 3);
    const ringSizes = new Float32Array(ringCount);

    for (let i = 0; i < ringCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = 2.0 + Math.random() * 0.4;
        ringPositions[i * 3] = Math.cos(angle) * r;
        ringPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
        ringPositions[i * 3 + 2] = Math.sin(angle) * r;
        ringSizes[i] = Math.random() * 0.02 + 0.005;
    }

    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
    ringGeo.setAttribute('size', new THREE.BufferAttribute(ringSizes, 1));

    const ring = new THREE.Points(ringGeo, material.clone());
    scene.add(ring);

    function animateGlobe() {
        requestAnimationFrame(animateGlobe);
        sphere.rotation.y += 0.0015;
        sphere.rotation.x += 0.0005;
        ring.rotation.y -= 0.001;
        ring.rotation.x += 0.0003;
        renderer.render(scene, camera);
    }
    animateGlobe();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}