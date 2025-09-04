// Nettoyage ciblé des cookies (évite de tout supprimer)
function clearAppCookies() {
    const cookiesToDelete = ['sessionId', 'userPrefs']; // adapte à ton app
    cookiesToDelete.forEach(name => {
        document.cookie = `${name}=; expires=${new Date(0).toUTCString()}; path=/`;
    });
}

// Reload intelligent (évite les blocages)
function smartReload() {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('refresh')) {
        url.searchParams.set('refresh', Date.now());
        window.location.href = url.toString();
    } else {
        window.location.reload(); // fallback simple
    }
}

// Exécution au démarrage
window.addEventListener('DOMContentLoaded', () => {
    clearAppCookies();
    smartReload();
});