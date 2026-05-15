document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('auth-container');
    if (authContainer) {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            const userData = JSON.parse(localStorage.getItem('userData')) || {};
            const firstName = userData.firstName || 'Kullanıcı';
            authContainer.innerHTML = `
                <div class="flex items-center gap-2">
                    <span class="font-label-md text-label-md text-secondary hidden md:inline">Hoş geldin, ${firstName}</span>
                    <a href="profile.html" aria-label="person"
                        class="text-secondary hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full flex items-center justify-center">
                        <span class="material-symbols-outlined">person</span>
                    </a>
                </div>
            `;
        } else {
            authContainer.innerHTML = `
                <a href="login.html" class="font-label-md text-label-md text-on-surface hover:text-primary transition-colors px-4 py-2 hidden md:inline">Giriş Yap</a>
                <a href="login.html" aria-label="person" class="text-secondary hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full md:hidden flex items-center justify-center">
                    <span class="material-symbols-outlined">login</span>
                </a>
            `;
        }
    }
});
