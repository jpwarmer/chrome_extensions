const defaultLanguage = 'en';

export function getBrowserLanguage() {
    const language = navigator.language.split('-')[0];
    return ['en', 'es'].includes(language) ? language : defaultLanguage;
}

export function getContentLanguage() {
    return getBrowserLanguage();
} 