document.addEventListener('DOMContentLoaded', () => {
  initPortfolio();
});

function initPortfolio() {
  initScrollAnimations();
  initSmoothNavigation();
  initLanguageSwitcher();
}

function initScrollAnimations() {
  // Fallback for browsers without IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('visible'));
    return;
  }

  const options = {
    threshold: 0.15,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }
  }, options);

  const sections = document.querySelectorAll('.section');
  for (const section of sections) {
    observer.observe(section);
  }
}

function initSmoothNavigation() {
  const links = document.querySelectorAll('.hero__nav-link');
  for (const link of links) {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }
}

function getStoredLanguage() {
  try {
    const stored = localStorage.getItem('preferredLang');
    if (stored === 'es' || stored === 'en') {
      return stored;
    }
  } catch (e) {
    // localStorage not available
  }
  return 'es';
}

function storeLanguage(lang) {
  try {
    localStorage.setItem('preferredLang', lang);
  } catch (e) {
    // Silent failure
  }
}

function applyTranslations(lang) {
  if (typeof translations === 'undefined') return;
  const langData = translations[lang];
  if (!langData) return;

  const elements = document.querySelectorAll('[data-i18n]');
  for (const element of elements) {
    const key = element.getAttribute('data-i18n');
    if (langData[key] !== undefined) {
      if (langData[key].includes('<br>') || langData[key].includes('<li>')) {
        element.innerHTML = langData[key];
      } else {
        element.textContent = langData[key];
      }
    }
  }

  const htmlElements = document.querySelectorAll('[data-i18n-html]');
  for (const element of htmlElements) {
    const key = element.getAttribute('data-i18n-html');
    if (langData[key] !== undefined) {
      element.innerHTML = langData[key];
    }
  }

  document.documentElement.lang = lang;
}

function updateSwitcherButton(currentLang) {
  const switcher = document.getElementById('lang-switcher');
  if (!switcher) return;

  if (currentLang === 'es') {
    switcher.textContent = 'EN';
    switcher.setAttribute('aria-label', 'Cambiar idioma a inglés');
    switcher.setAttribute('title', 'Switch to English');
  } else {
    switcher.textContent = 'ES';
    switcher.setAttribute('aria-label', 'Switch language to Spanish');
    switcher.setAttribute('title', 'Cambiar a Español');
  }
}

function initLanguageSwitcher() {
  const switcher = document.getElementById('lang-switcher');
  if (!switcher) return;
  if (typeof translations === 'undefined') return;

  let currentLang = getStoredLanguage();

  applyTranslations(currentLang);
  updateSwitcherButton(currentLang);

  switcher.addEventListener('click', () => {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    applyTranslations(currentLang);
    updateSwitcherButton(currentLang);
    storeLanguage(currentLang);
  });
}
