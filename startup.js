function clearAppCookies() {
    const cookiesToDelete = ['sessionId', 'userPrefs'];
    cookiesToDelete.forEach(name => {
        document.cookie = `${name}=; expires=${new Date(0).toUTCString()}; path=/; domain=${location.hostname}`;
    });
}

function smartReload() {
    // Reload une seule fois, sans modifier l'URL
    if (!sessionStorage.getItem('hasReloaded')) {
        sessionStorage.setItem('hasReloaded', 'true');
        window.location.reload(); // simple, sans boucle
    }
}

window.addEventListener('DOMContentLoaded', () => {
    clearAppCookies();
    smartReload();
});
