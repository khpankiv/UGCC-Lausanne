// Основний JavaScript для сайту УГКЦ Лозанна

// Мультимовність: переклади
const translations = {
    uk: {
        nav: ["Головна", "Про нас", "Розклад", "Події", "Ресурси", "Українські події", "Контакти"],
        welcome: "☩ Ласкаво просимо до нашої парафії ☩",
        welcomeText: "«Де двоє або троє зібрані в ім'я Моє, там і Я посеред них» (Мт. 18:20)<br>Українська Греко-Католицька Церква в Лозанні - духовний дім для українців у Швейцарії.",
        scheduleBtn: "Розклад богослужінь",
        announcements: "Актуальні оголошення",
        announcementCards: [
            {title: "Розклад богослужінь", text: "Божественна Літургія відбувається кожної неділі о 10:00 в католицькому храмі Сен-Поль.", btn: "Детальніше"},
            {title: "Духовні бесіди", text: "Щомісячні катехитичні зустрічі для дорослих та дітей. Наступна зустріч - <span class='current-date'></span>.", btn: "Дізнатися більше"},
            {title: "Благодійна допомога", text: "Наша парафія активно підтримує Україну. Інформація про благодійні ініціативи та збори коштів.", btn: "Як допомогти"}
        ],
        about: "Про нашу парафію",
        schedule: "Розклад богослужінь",
        events: "Події та новини",
        resources: "Духовні ресурси",
        ukrainianEvents: "Події в українському середовищі",
        contact: "Контакти",
        contactSuccess: "Дякуємо за ваше повідомлення! Ми зв'яжемося з вами найближчим часом.",
        contactErrors: {
            name: "Будь ласка, введіть ваше ім'я",
            email: "Будь ласка, введіть коректну електронну адресу",
            message: "Повідомлення має містити принаймні 10 символів"
        }
    },
    fr: {
        nav: ["Accueil", "À propos", "Horaire", "Événements", "Ressources", "Événements ukrainiens", "Contacts"],
        welcome: "☩ Bienvenue dans notre paroisse ☩",
        welcomeText: "« Là où deux ou trois sont réunis en mon nom, je suis au milieu d'eux » (Mt 18,20)<br>L'Église gréco-catholique ukrainienne à Lausanne - une maison spirituelle pour les Ukrainiens en Suisse.",
        scheduleBtn: "Horaire des liturgies",
        announcements: "Annonces actuelles",
        announcementCards: [
            {title: "Horaire des liturgies", text: "La Divine Liturgie a lieu chaque dimanche à 10h00 à l'église catholique Saint-Paul.", btn: "Plus de détails"},
            {title: "Entretiens spirituels", text: "Rencontres catéchétiques mensuelles pour adultes et enfants. Prochaine rencontre - <span class='current-date'></span>.", btn: "En savoir plus"},
            {title: "Aide caritative", text: "Notre paroisse soutient activement l'Ukraine. Informations sur les initiatives caritatives et les collectes de fonds.", btn: "Comment aider"}
        ],
        about: "À propos de notre paroisse",
        schedule: "Horaire des liturgies",
        events: "Événements et actualités",
        resources: "Ressources spirituelles",
        ukrainianEvents: "Événements dans la communauté ukrainienne",
        contact: "Contacts",
        contactSuccess: "Merci pour votre message ! Nous vous contacterons bientôt.",
        contactErrors: {
            name: "Veuillez entrer votre nom",
            email: "Veuillez entrer une adresse e-mail valide",
            message: "Le message doit contenir au moins 10 caractères"
        }
    },
    en: {
        nav: ["Home", "About", "Schedule", "Events", "Resources", "Ukrainian Events", "Contacts"],
        welcome: "☩ Welcome to our parish ☩",
        welcomeText: "“Where two or three are gathered in My name, I am there among them” (Mt 18:20)<br>Ukrainian Greek Catholic Church in Lausanne - a spiritual home for Ukrainians in Switzerland.",
        scheduleBtn: "Service Schedule",
        announcements: "Current Announcements",
        announcementCards: [
            {title: "Service Schedule", text: "The Divine Liturgy is held every Sunday at 10:00 at the Catholic Church of Saint-Paul.", btn: "More details"},
            {title: "Spiritual Talks", text: "Monthly catechetical meetings for adults and children. Next meeting - <span class='current-date'></span>.", btn: "Learn more"},
            {title: "Charitable Aid", text: "Our parish actively supports Ukraine. Information about charitable initiatives and fundraising.", btn: "How to help"}
        ],
        about: "About our parish",
        schedule: "Service Schedule",
        events: "Events and News",
        resources: "Spiritual Resources",
        ukrainianEvents: "Events in the Ukrainian Community",
        contact: "Contacts",
        contactSuccess: "Thank you for your message! We will contact you shortly.",
        contactErrors: {
            name: "Please enter your name",
            email: "Please enter a valid email address",
            message: "Message must be at least 10 characters"
        }
    },
    de: {
        nav: ["Startseite", "Über uns", "Zeitplan", "Veranstaltungen", "Ressourcen", "Ukrainische Veranstaltungen", "Kontakt"],
        welcome: "☩ Willkommen in unserer Gemeinde ☩",
        welcomeText: "«Wo zwei oder drei in meinem Namen versammelt sind, bin ich mitten unter ihnen» (Mt 18,20)<br>Ukrainische griechisch-katholische Kirche in Lausanne - ein geistliches Zuhause für Ukrainer in der Schweiz.",
        scheduleBtn: "Gottesdienstplan",
        announcements: "Aktuelle Mitteilungen",
        announcementCards: [
            {title: "Gottesdienstplan", text: "Die Göttliche Liturgie findet jeden Sonntag um 10:00 Uhr in der katholischen Kirche St. Paul statt.", btn: "Mehr Details"},
            {title: "Spirituelle Gespräche", text: "Monatliche katechetische Treffen für Erwachsene und Kinder. Nächstes Treffen - <span class='current-date'></span>.", btn: "Mehr erfahren"},
            {title: "Wohltätige Hilfe", text: "Unsere Gemeinde unterstützt aktiv die Ukraine. Informationen zu wohltätigen Initiativen und Spendenaktionen.", btn: "Wie helfen"}
        ],
        about: "Über unsere Gemeinde",
        schedule: "Gottesdienstplan",
        events: "Veranstaltungen und Nachrichten",
        resources: "Spirituelle Ressourcen",
        ukrainianEvents: "Veranstaltungen in der ukrainischen Gemeinschaft",
        contact: "Kontakt"
    },
    it: {
        nav: ["Home", "Chi siamo", "Orario", "Eventi", "Risorse", "Eventi ucraini", "Contatti"],
        welcome: "☩ Benvenuti nella nostra parrocchia ☩",
        welcomeText: "«Dove due o tre sono riuniti nel mio nome, io sono in mezzo a loro» (Mt 18,20)<br>Chiesa greco-cattolica ucraina a Losanna - una casa spirituale per gli ucraini in Svizzera.",
        scheduleBtn: "Orario delle liturgie",
        announcements: "Annunci attuali",
        announcementCards: [
            {title: "Orario delle liturgie", text: "La Divina Liturgia si tiene ogni domenica alle 10:00 presso la Chiesa cattolica di San Paolo.", btn: "Dettagli"},
            {title: "Colloqui spirituali", text: "Incontri catechetici mensili per adulti e bambini. Prossimo incontro - <span class='current-date'></span>.", btn: "Scopri di più"},
            {title: "Aiuto caritativo", text: "La nostra parrocchia sostiene attivamente l'Ucraina. Informazioni sulle iniziative caritative e sulle raccolte fondi.", btn: "Come aiutare"}
        ],
        about: "Chi siamo",
        schedule: "Orario delle liturgie",
        events: "Eventi e notizie",
        resources: "Risorse spirituali",
        ukrainianEvents: "Eventi nella comunità ucraina",
        contact: "Contatti"
    }
};

// Determine current language and current page from the URL so switching preserves context
let currentLang = (function(){
    try {
        const parts = window.location.pathname.split('/').filter(Boolean);
        if (parts.length >= 1 && ['uk','en','fr'].includes(parts[0])) return parts[0];
    } catch (e) {}
    return 'uk';
})();

let currentPage = (function(){
    try {
        const parts = window.location.pathname.split('/').filter(Boolean);
        if (parts.length >= 2) return parts[1].replace('.html','');
    } catch (e) {}
    // fallback to body class or index
    const cls = (document.body && document.body.className) ? document.body.className.split(' ')[0] : '';
    return cls || 'index';
})();

function setLanguage(lang) {
    currentLang = lang;
    const t = translations[lang] || translations.uk;
        // Оновити навігацію
        document.querySelectorAll('nav ul li a').forEach((a, i) => {
            if (t.nav[i]) a.textContent = t.nav[i];
        });
        // Головна секція
        const h2 = document.querySelector('.hero h2');
        if (h2) h2.innerHTML = t.welcome;
        const p = document.querySelector('.hero p');
        if (p) p.innerHTML = t.welcomeText;
        const btn = document.querySelector('.hero .btn');
        if (btn) btn.textContent = t.scheduleBtn;
        // Оголошення
        const annTitle = document.querySelector('.section h2');
        if (annTitle) annTitle.textContent = t.announcements;
        const annCards = document.querySelectorAll('.section .cards-grid .card');
        t.announcementCards.forEach((card, i) => {
            if (annCards[i]) {
                const h3 = annCards[i].querySelector('h3');
                const p = annCards[i].querySelector('p');
                const a = annCards[i].querySelector('a');
                if (h3) h3.textContent = card.title;
                if (p) p.innerHTML = card.text;
                if (a) a.textContent = card.btn;
            }
        });
        // Секції
        const aboutTitle = document.querySelector('#about.section h2');
        if (aboutTitle) aboutTitle.textContent = t.about;
        const scheduleTitle = document.querySelector('#schedule.section h2');
        if (scheduleTitle) scheduleTitle.textContent = t.schedule;
        const eventsTitle = document.querySelector('#events.section h2');
        if (eventsTitle) eventsTitle.textContent = t.events;
        const resourcesTitle = document.querySelector('#resources.section h2');
        if (resourcesTitle) resourcesTitle.textContent = t.resources;
        const ukrEventsTitle = document.querySelector('#ukrainian-events.section h2');
        if (ukrEventsTitle) ukrEventsTitle.textContent = t.ukrainianEvents;
        const contactTitle = document.querySelector('#contact.section h2');
        if (contactTitle) contactTitle.textContent = t.contact;
}

function initLangSwitcher() {
    const selector = document.querySelector('.lang-switcher select');
    if (selector) {
        // If the server rendered the select with a selected option, leave it.
        // Otherwise set it to the current page path for the detected language.
        if (!selector.value || selector.value.indexOf('.html') === -1) {
            selector.value = `/${currentLang}/${currentPage}.html`;
        }

        selector.addEventListener('change', function() {
            const dest = this.value;
            // If option value is already a complete path (contains .html), navigate to it.
            if (dest && dest.indexOf('.html') > -1) {
                window.location.href = dest;
                return;
            }
            // Otherwise, build a path using the selected language and current page
            const sel = dest.replace(/^\/+/, ''); // strip leading slash
            window.location.href = `/${sel}/${currentPage}.html`;
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація всіх компонентів
    initMobileMenu();
    initSmoothScrolling();
    initContactForm();
    initGallery();
    initScrollAnimations();
        initLangSwitcher();
        // initialize in-page translated content to match the URL-derived language
        setLanguage(currentLang);
    
    console.log('Сайт УГКЦ Лозанна завантажено успішно');
});

// mark hero loaded for CSS animation
document.addEventListener('DOMContentLoaded', function() {
    const hero = document.querySelector('.hero');
    if (hero) setTimeout(() => hero.classList.add('loaded'), 120);
});

// Мобільне меню
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        // ensure initial state
        nav.classList.add('hidden');
        nav.setAttribute('aria-hidden', 'true');

        const updateToggleIcon = (expanded) => {
            menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            menuToggle.innerText = expanded ? '✕' : '☰';
        };

        menuToggle.addEventListener('click', function() {
            const isHidden = nav.classList.contains('hidden');
            if (isHidden) {
                nav.classList.remove('hidden');
                nav.setAttribute('aria-hidden', 'false');
                updateToggleIcon(true);
                // move focus to first link in nav for keyboard users
                const firstLink = nav.querySelector('a');
                if (firstLink) firstLink.focus();
            } else {
                nav.classList.add('hidden');
                nav.setAttribute('aria-hidden', 'true');
                updateToggleIcon(false);
                menuToggle.focus();
            }
        });

        // Закривати меню при кліку на посилання (на мобільних)
        nav.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && window.innerWidth <= 768) {
                nav.classList.add('hidden');
                nav.setAttribute('aria-hidden', 'true');
                updateToggleIcon(false);
                menuToggle.focus();
            }
        });

        // Закривати меню на Escape з клавіатури
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !nav.classList.contains('hidden')) {
                nav.classList.add('hidden');
                nav.setAttribute('aria-hidden', 'true');
                updateToggleIcon(false);
                menuToggle.focus();
            }
        });
    }
}

// Плавне прокручування до секцій
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Форма контактів
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            if (validateContactForm(data)) {
                const endpoint = this.getAttribute('data-endpoint');
                const successMsg = (translations[currentLang] && translations[currentLang].contactSuccess) || translations['en'].contactSuccess;
                if (endpoint) {
                    // send to provided endpoint (Formspree or similar)
                    fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Accept': 'application/json' },
                        body: formData
                    }).then(r => {
                        if (r.ok) {
                            showMessage(successMsg, 'success');
                            contactForm.reset();
                        } else {
                            showMessage('Server error. Please try again later.', 'error');
                        }
                    }).catch(err => {
                        console.error('Contact error', err);
                        showMessage('Network error. Please try again later.', 'error');
                    });
                } else {
                    // No endpoint configured — simulate success for static demo
                    showMessage(successMsg, 'success');
                    this.reset();
                }
            }
        });
    }
}

// Валідація форми контактів
function validateContactForm(data) {
    const errors = [];
    const localized = (translations[currentLang] && translations[currentLang].contactErrors) || translations['en'].contactErrors;

    if (!data.name || data.name.trim().length < 2) {
        errors.push(localized.name);
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push(localized.email);
    }

    if (!data.message || data.message.trim().length < 10) {
        errors.push(localized.message);
    }

    if (errors.length > 0) {
        showMessage(errors.join('\n'), 'error');
        return false;
    }

    return true;
}

// Перевірка email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Показ повідомлень
function showMessage(message, type = 'info') {
    // Видаляємо попереднє повідомлення
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Створюємо нове повідомлення
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        word-wrap: break-word;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Кольори залежно від типу
    switch(type) {
        case 'success':
            messageDiv.style.backgroundColor = '#10b981';
            break;
        case 'error':
            messageDiv.style.backgroundColor = '#ef4444';
            break;
        case 'warning':
            messageDiv.style.backgroundColor = '#f59e0b';
            break;
        default:
            messageDiv.style.backgroundColor = '#3b82f6';
    }
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    // Автоматично видаляємо через 5 секунд
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 5000);
    
    // Додаємо кнопку закриття
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 10px;
        cursor: pointer;
        font-size: 20px;
        line-height: 1;
    `;
    closeBtn.addEventListener('click', () => messageDiv.remove());
    messageDiv.appendChild(closeBtn);
}

// Галерея зображень
function initGallery() {
    const galleryImages = document.querySelectorAll('.gallery img');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            openLightbox(this.src, this.alt);
        });
        // fallback if image fails to load -> use church-themed Unsplash photo
        img.addEventListener('error', function() {
            const placeholder = 'https://images.unsplash.com/photo-1509223197845-458d87318791?q=80&w=1600&auto=format&fit=crop&crop=entropy&cs=tinysrgb&ixlib=rb-4.0.3&s=church';
            if (this.src !== placeholder) this.src = placeholder;
        });
    });
}

// Лайтбокс для зображень
function openLightbox(imageSrc, imageAlt) {
    // Створюємо лайтбокс
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = imageAlt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 8px;
    `;
    
    const closeBtn = document.createElement('span');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        color: white;
        font-size: 40px;
        cursor: pointer;
        z-index: 10001;
    `;
    
    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
    
    // Закриття лайтбоксу
    const closeLightbox = () => lightbox.remove();
    lightbox.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', closeLightbox);
    
    // Закриття на Escape
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', handleKeyDown);
        }
    };
    document.addEventListener('keydown', handleKeyDown);
}

// Анімації при прокручуванні
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Спостерігаємо за елементами
    document.querySelectorAll('.card, .section, .schedule-table').forEach(el => {
        observer.observe(el);
    });
}

// Активне посилання в навігації
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Слухаємо прокручування для активного посилання
window.addEventListener('scroll', updateActiveNavLink);

// Функція для форматування дати по-українськи
function formatDateUkrainian(date) {
    const months = [
        'січня', 'лютого', 'березня', 'квітня', 'травня', 'червня',
        'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
}

// Функція для динамічного оновлення дати
function updateCurrentDate() {
    const dateElements = document.querySelectorAll('.current-date');
    const today = new Date();
    const formattedDate = formatDateUkrainian(today);
    
    dateElements.forEach(el => {
        el.textContent = formattedDate;
    });
}

// Оновлюємо дату при завантаженні
updateCurrentDate();

// CSS анімації (додаємо динамічно)
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// --- Event card date formatting and reveal ---
function formatEventDates() {
    document.querySelectorAll('[data-date]').forEach(el => {
        const iso = el.getAttribute('data-date');
        if (!iso) return;
        const d = new Date(iso);
        if (isNaN(d)) return;
        const day = d.getDate();
        const month = d.toLocaleString(undefined, { month: 'short' });
        // clear and fill vertical structure
        el.classList.add('v-vertical');
        el.innerHTML = `<div class="day">${day}</div><div class="month">${month}</div>`;
    });
}

function revealEventCards() {
    const cards = document.querySelectorAll('.event-card');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    cards.forEach(c => obs.observe(c));
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        formatEventDates();
        revealEventCards();
    } catch (e) {
        console.warn('Event formatting failed', e);
    }
});