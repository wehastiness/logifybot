let currentLang = '';

function showLanguage(lang){
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.getElementById('content-ru').style.display = (lang === 'ru') ? 'block' : 'none';
    document.getElementById('content-en').style.display = (lang === 'en') ? 'block' : 'none';
    document.getElementById('flag-btn').textContent = (lang === 'ru') ? '🇷🇺' : '🇬🇧';
}

document.getElementById('flag-btn').addEventListener('click', () => {
    const newLang = (currentLang === 'ru') ? 'en' : 'ru';
    showLanguage(newLang);
});

function detectLanguage() {
    const savedLang = localStorage.getItem('lang');
    if(savedLang) return showLanguage(savedLang);

    const lang = navigator.language || navigator.userLanguage;
    if(lang.toLowerCase().startsWith('ru')) showLanguage('ru');
    else showLanguage('en');
}

detectLanguage();