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
// 2. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
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
// 3. СЧЁТЧИКИ ЦИФР
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
// 4. ПЛАВНЫЙ СКРОЛЛ
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
// 5. ЭФФЕКТ ПАРАЛЛАКСА НА ГЛАВНОМ ЭКРАНЕ
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
// 6. КАСТОМНЫЙ КУРСОР
// ==========================================

const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, .btn, .calc-option, .calc-base').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

// ==========================================
// 7. ЖИВОЙ ТЕРМИНАЛ
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
// 8. КАЛЬКУЛЯТОР СТОИМОСТИ
// ==========================================

const calcCards = document.querySelectorAll('.calc-card');
const calcTotal = document.getElementById('calc-total');
const calcDiscount = document.getElementById('calc-discount');
const calcBtn = document.getElementById('calc-btn');

function updateCalc() {
    let total = 0;
    let activeBlocks = 0;
    const selectedItems = [];

    calcCards.forEach(card => {
        const base = card.querySelector('.calc-base input[type="radio"]');
        const extras = card.querySelectorAll('.calc-extras input[type="checkbox"]');
        const extrasWrap = card.querySelector('.calc-extras');

        // Блок активен, если выбрана база
        const isActive = base.checked;
        card.classList.toggle('active', isActive);
        if (isActive) activeBlocks++;

        // Активируем/деактивируем допы
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

        // Считаем базу
        if (base.checked) {
            total += parseInt(base.dataset.price);
            selectedItems.push(base.dataset.label);
        }

        // Считаем допы
        extras.forEach(extra => {
            if (extra.checked) {
                total += parseInt(extra.dataset.price);
                selectedItems.push(extra.dataset.label);
            }
        });
    });

    // Скидка 10%, если баз в 2+ блоках
    let finalTotal = total;
    let hasDiscount = activeBlocks >= 2;

    if (hasDiscount) {
        finalTotal = Math.round(total * 0.9);
        calcDiscount.style.display = 'block';
        calcDiscount.textContent = `Скидка за комплекс: −${(total - finalTotal).toLocaleString('ru-RU')} ₽ (10%)`;
    } else {
        calcDiscount.style.display = 'none';
    }

    calcTotal.textContent = finalTotal.toLocaleString('ru-RU') + ' ₽';

    // Кнопка
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
// 9. РЕСАЙЗ
// ==========================================

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});