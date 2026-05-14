const Navbars = {
    main: `
    <header class="bg-surface dark:bg-background shadow-sm dark:shadow-none docked full-width top-0 sticky z-50">
        <div class="flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto">
            <a class="font-headline-lg text-headline-lg font-bold text-primary dark:text-primary-fixed-dim hover:opacity-80 transition-all active:scale-95 duration-200" href="main.html">HIKARI</a>
            <div class="hidden md:flex flex-1 max-w-xl mx-8 relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary">search</span>
                <input class="w-full pl-10 pr-4 py-3 rounded-DEFAULT border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-all" placeholder="Ürün, marka ve daha fazlasını arayın" type="text" />
            </div>
            <nav class="hidden md:flex items-center space-x-6">
                <a class="font-body-md text-body-md text-primary dark:text-primary-fixed-dim border-b-2 border-primary pb-1" href="#">Yeni Gelenler</a>
                <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors hover:opacity-80 transition-all active:scale-95 duration-200" href="categories.html">Kategoriler</a>
                <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors hover:opacity-80 transition-all active:scale-95 duration-200" href="#">Koleksiyonlar</a>
                <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors hover:opacity-80 transition-all active:scale-95 duration-200" href="#">Erkek</a>
                <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors hover:opacity-80 transition-all active:scale-95 duration-200" href="#">Kadın</a>
            </nav>
            <div class="flex items-center space-x-4">
            </br>
                <button aria-label="shopping_cart" onclick="window.location.href='cart.html'" class="text-secondary hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full relative">
                    <span class="material-symbols-outlined">shopping_cart</span>
                    <span id="cart-badge-main" class="absolute top-0 right-0 bg-primary-container text-on-primary-container text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center hidden">0</span>
                </button>
                <button aria-label="favorite" onclick="window.location.href='favorites.html'" class="text-secondary hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full relative">
                    <span class="material-symbols-outlined">favorite</span>
                    <span id="fav-badge-main" class="absolute top-0 right-0 bg-primary-container text-on-primary-container text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center hidden">0</span>
                </button>
                <div id="auth-container" class="flex items-center"></div>
            </div>
        </div>
    </header>
    `,
    categories: `
    <header class="bg-surface dark:bg-background shadow-sm dark:shadow-none docked full-width top-0 sticky z-50">
        <div class="flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto">
            <a class="font-headline-lg text-headline-lg font-bold text-primary dark:text-primary-fixed-dim hover:opacity-80 transition-all active:scale-95 duration-200" href="main.html">HIKARI</a>
            <div class="hidden md:flex flex-1 max-w-xl mx-8 relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary">search</span>
                <input class="w-full pl-10 pr-4 py-3 rounded-DEFAULT border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-all" placeholder="Ürün, marka ve daha fazlasını arayın" type="text" />
            </div>
            <nav class="hidden md:flex items-center space-x-6">
                <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors hover:opacity-80 transition-all active:scale-95 duration-200" href="main.html">Yeni Gelenler</a>
                <a class="font-body-md text-body-md text-primary dark:text-primary-fixed-dim border-b-2 border-primary pb-1" href="categories.html">Kategoriler</a>
                <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors hover:opacity-80 transition-all active:scale-95 duration-200" href="#">Koleksiyonlar</a>
                <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors hover:opacity-80 transition-all active:scale-95 duration-200" href="#">Erkek</a>
                <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors hover:opacity-80 transition-all active:scale-95 duration-200" href="#">Kadın</a>
            </nav>
            <div class="flex items-center space-x-4">
            </br>
                <button aria-label="shopping_cart" onclick="window.location.href='cart.html'" class="text-secondary hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full relative">
                    <span class="material-symbols-outlined">shopping_cart</span>
                    <span id="cart-badge-categories" class="absolute top-0 right-0 bg-primary-container text-on-primary-container text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center hidden">0</span>
                </button>
                <button aria-label="favorite" onclick="window.location.href='favorites.html'" class="text-secondary hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full relative">
                    <span class="material-symbols-outlined">favorite</span>
                    <span id="fav-badge-categories" class="absolute top-0 right-0 bg-primary-container text-on-primary-container text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center hidden">0</span>
                </button>
                <div id="auth-container" class="flex items-center"></div>
            </div>
        </div>
    </header>
    `,
    detail: `
    <header class="bg-surface sticky top-0 z-50 shadow-sm w-full">
        <nav class="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 w-full max-w-container-max mx-auto">
            <div class="flex-1 flex items-center justify-start hidden md:flex">
                <div class="relative w-full max-w-xs">
                    <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary" style="font-variation-settings: 'FILL' 0;">search</span>
                    <input class="w-full bg-surface-container-lowest border border-outline-variant rounded px-10 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-body-md text-on-surface" placeholder="Ara..." type="text" />
                </div>
            </div>
            <button class="md:hidden p-2 text-primary hover:opacity-80 transition-all active:scale-95 duration-200">
                <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">menu</span>
            </button>
            <div class="flex-1 flex justify-center">
                <a class="font-headline-lg text-headline-lg font-bold text-primary tracking-tight" href="main.html">HIKARI</a>
            </div>
            <div class="flex-1 flex justify-end gap-4 items-center">
                <button class="p-2 text-primary hover:opacity-80 transition-all active:scale-95 duration-200 md:hidden">
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">search</span>
                </button>
                <button onclick="window.location.href='cart.html'" class="p-2 text-primary hover:opacity-80 transition-all active:scale-95 duration-200 relative">
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">shopping_cart</span>
                    <span id="cart-badge-detail" class="absolute top-1 right-1 bg-primary-container text-on-primary-container text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center hidden">0</span>
                </button>
                <button onclick="window.location.href='favorites.html'" class="p-2 text-primary hover:opacity-80 transition-all active:scale-95 duration-200 relative">
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 0;">favorite</span>
                    <span id="fav-badge-detail" class="absolute top-1 right-1 bg-primary-container text-on-primary-container text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center hidden">0</span>
                </button>
                <div id="auth-container" class="flex items-center"></div>
            </div>
        </nav>
        <div class="hidden md:flex justify-center items-center gap-8 pb-4 w-full max-w-container-max mx-auto px-margin-desktop bg-surface">
            <a class="text-secondary hover:text-primary transition-colors font-body-md" href="#">Yeni Gelenler</a>
            <a class="text-secondary hover:text-primary transition-colors font-body-md" href="categories.html">Kategoriler</a>
            <a class="text-secondary hover:text-primary transition-colors font-body-md" href="#">Erkek</a>
            <a class="text-primary border-b-2 border-primary pb-1 font-body-md" href="#">Kadın</a>
            <a class="text-secondary hover:text-primary transition-colors font-body-md" href="#">İndirim</a>
        </div>
    </header>
    `,
    reviews: `
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex-shrink-0 flex items-center">
          <a href="main.html" class="text-2xl font-bold tracking-tight text-brand hover:opacity-80 transition-opacity">HIKARI</a>
        </div>
        <nav class="hidden md:flex space-x-8">
          <a class="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium" href="#">Yeni Gelenler</a>
          <a class="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium" href="categories.html">Kategoriler</a>
          <a class="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium" href="#">Koleksiyonlar</a>
        </nav>
        <div class="flex items-center space-x-4">
          <button class="text-gray-400 hover:text-gray-500">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
          </button>
          <button onclick="window.location.href='cart.html'" class="text-gray-400 hover:text-gray-500 relative">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
            <span id="cart-badge-reviews" class="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center hidden">0</span>
          </button>
          <button onclick="window.location.href='favorites.html'" class="text-gray-400 hover:text-gray-500 relative">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewbox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            <span id="fav-badge-reviews" class="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center hidden">0</span>
          </button>
          <div id="auth-container" class="flex items-center"></div>
        </div>
      </div>
    </div>
  </header>
    `,
    profile: `
    <header class="bg-surface shadow-sm sticky top-0 z-50">
        <div class="flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto">
            <a class="font-headline-lg text-headline-lg font-bold text-primary hover:opacity-80 transition-all" href="main.html">HIKARI</a>
            <a href="main.html" class="flex items-center gap-2 text-secondary hover:text-primary transition-colors">
                <span class="material-symbols-outlined">shopping_bag</span>
                <span class="font-label-md text-label-md hidden md:inline">Alışverişe Dön</span>
            </a>
        </div>
    </header>
    `
};

const Footers = {
    main: `
    <footer class="bg-surface-container dark:bg-inverse-surface full-width bottom-0 mt-auto flat no shadows">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-12 max-w-container-max mx-auto">
            <div class="flex flex-col gap-4">
                <a href="main.html" class="font-headline-md text-headline-md font-bold text-primary hover:opacity-80 transition-opacity">HIKARI</a>
                <p class="font-body-md text-body-md text-secondary dark:text-secondary-fixed max-w-xs">Modern yaşam tarzı için birinci sınıf temeller seçiyoruz. Nicelikten ziyade nitelik.</p>
            </div>
            <div class="flex flex-col gap-3">
                <h4 class="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface uppercase tracking-wider mb-2">Müşteri Hizmetleri</h4>
                <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary hover:underline transition-all cursor-pointer" href="#">Bize Ulaşın</a>
                <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary hover:underline transition-all cursor-pointer" href="#">Nakliye Bilgisi</a>
                <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary hover:underline transition-all cursor-pointer" href="#">İadeler</a>
            </div>
            <div class="flex flex-col gap-3">
                <h4 class="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface uppercase tracking-wider mb-2">Kurumsal</h4>
                <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary hover:underline transition-all cursor-pointer" href="#">Gizlilik Politikası</a>
                <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary hover:underline transition-all cursor-pointer" href="#">Hizmet Şartları</a>
            </div>
            <div class="flex flex-col gap-3">
                <h4 class="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface uppercase tracking-wider mb-2">Bülten</h4>
                <p class="font-body-md text-body-md text-secondary dark:text-secondary-fixed mb-2">Yeni koleksiyonlara erken erişim için abone olun.</p>
                <div class="flex">
                    <input class="w-full px-4 py-2 rounded-l-DEFAULT border border-outline-variant bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none focus:border-primary" placeholder="E-posta adresiniz" type="email" />
                    <button class="bg-primary text-white px-4 py-2 rounded-r-DEFAULT font-label-md text-label-md hover:bg-primary-container transition-colors">Abone Ol</button>
                </div>
            </div>
        </div>
        <div class="border-t border-outline-variant/30">
            <div class="px-margin-desktop py-6 max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="font-body-md text-body-md text-secondary dark:text-secondary-fixed">© 2026 HIKARI Premium E-ticaret. Tüm hakları saklıdır.</p>
                <div class="flex gap-4">
                    <div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-secondary hover:text-primary cursor-pointer transition-colors">
                        <span class="material-symbols-outlined text-sm">language</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    `,
    detail: `
    <footer class="bg-surface-container dark:bg-inverse-surface mt-24 border-t border-surface-variant">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-12 max-w-container-max mx-auto">
            <div class="col-span-1 md:col-span-1 mb-8 md:mb-0">
                <div class="font-headline-md text-headline-md font-bold text-primary mb-4">HIKARI</div>
                <p class="font-body-md text-body-md text-secondary mb-6">Modern minimalistler için premium cilt bakımı. Etik kaynaklı, bilimsel olarak kanıtlanmış.</p>
            </div>
            <div class="col-span-1">
                <h4 class="font-label-md text-label-md font-bold text-on-surface mb-4 uppercase tracking-wider">ALIŞVERİŞ</h4>
                <ul class="space-y-3">
                    <li><a class="font-body-md text-body-md text-secondary hover:text-primary hover:underline transition-all cursor-pointer" href="#">Yeni Gelenler</a></li>
                    <li><a class="font-body-md text-body-md text-secondary hover:text-primary hover:underline transition-all cursor-pointer" href="categories.html">Cilt Bakımı</a></li>
                    <li><a class="font-body-md text-body-md text-secondary hover:text-primary hover:underline transition-all cursor-pointer" href="#">Vücut</a></li>
                    <li><a class="font-body-md text-body-md text-secondary hover:text-primary hover:underline transition-all cursor-pointer" href="#">İndirim</a></li>
                </ul>
            </div>
            <div class="col-span-1">
                <h4 class="font-label-md text-label-md font-bold text-on-surface mb-4 uppercase tracking-wider">DESTEK</h4>
                <ul class="space-y-3">
                    <li><a class="font-body-md text-body-md text-secondary hover:text-primary hover:underline transition-all cursor-pointer" href="#">Bize Ulaşın</a></li>
                    <li><a class="font-body-md text-body-md text-secondary hover:text-primary hover:underline transition-all cursor-pointer" href="#">Kargo Bilgisi</a></li>
                    <li><a class="font-body-md text-body-md text-secondary hover:text-primary hover:underline transition-all cursor-pointer" href="#">İadeler</a></li>
                    <li><a class="font-body-md text-body-md text-secondary hover:text-primary hover:underline transition-all cursor-pointer" href="#">SSS</a></li>
                </ul>
            </div>
            <div class="col-span-1">
                <h4 class="font-label-md text-label-md font-bold text-on-surface mb-4 uppercase tracking-wider">YASAL</h4>
                <ul class="space-y-3">
                    <li><a class="font-body-md text-body-md text-secondary hover:text-primary hover:underline transition-all cursor-pointer" href="#">Gizlilik Politikası</a></li>
                    <li><a class="font-body-md text-body-md text-secondary hover:text-primary hover:underline transition-all cursor-pointer" href="#">Kullanım Koşulları</a></li>
                </ul>
            </div>
        </div>
        <div class="border-t border-outline-variant/30 px-margin-desktop py-6 max-w-container-max mx-auto text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="font-body-md text-body-md text-secondary">© 2026 HIKARI Premium E-ticaret. Tüm hakları saklıdır.</p>
        </div>
    </footer>
    `,
    reviews: `
  <footer class="bg-white border-t border-gray-200 mt-12 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <a href="main.html" class="text-2xl font-bold tracking-tight text-brand hover:opacity-80 transition-opacity">HIKARI</a>
          <p class="mt-4 text-sm text-gray-500">Premium e-ticaret deneyimi ile en iyi ürünleri keşfedin.</p>
        </div>
        <div>
          <h4 class="font-medium text-gray-900 mb-4">Müşteri Hizmetleri</h4>
          <ul class="space-y-2 text-sm text-gray-500">
            <li><a class="hover:text-brand" href="#">İletişim</a></li>
            <li><a class="hover:text-brand" href="#">Sıkça Sorulan Sorular</a></li>
            <li><a class="hover:text-brand" href="#">İade Politikası</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium text-gray-900 mb-4">Hakkımızda</h4>
          <ul class="space-y-2 text-sm text-gray-500">
            <li><a class="hover:text-brand" href="#">Hikayemiz</a></li>
            <li><a class="hover:text-brand" href="#">Kariyer</a></li>
            <li><a class="hover:text-brand" href="#">Mağazalarımız</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium text-gray-900 mb-4">Bültene Katılın</h4>
          <form class="flex mt-2">
            <input class="w-full px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:ring-brand focus:border-brand" placeholder="E-posta adresiniz" type="email" />
            <button class="bg-gray-900 text-white px-4 py-2 rounded-r-md text-sm font-medium hover:bg-gray-800 transition-colors" type="submit">Abone Ol</button>
          </form>
        </div>
      </div>
      <div class="border-t border-gray-100 mt-8 pt-8 text-center text-sm text-gray-500">
        © 2026 HIKARI. Tüm hakları saklıdır.
      </div>
    </div>
  </footer>
    `
};

function renderNavbar(type) {
    const placeholder = document.getElementById('navbar-placeholder');
    if (placeholder && Navbars[type]) {
        placeholder.innerHTML = Navbars[type];

        // Setup Auth Logic
        const authContainer = document.getElementById('auth-container');
        if (authContainer) {
            if (sessionStorage.getItem('isLoggedIn') === 'true') {
                const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
                const firstName = userData.firstName || 'Kullanıcı';

                // Keep styles dependent on type
                if (type === 'reviews') {
                    authContainer.innerHTML = `
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500 hidden md:inline">Hoş geldin, ${firstName}</span>
                            <a href="profile.html" class="text-gray-400 hover:text-gray-500 flex items-center justify-center">
                                <span class="material-symbols-outlined">person</span>
                            </a>
                        </div>
                    `;
                } else {
                    authContainer.innerHTML = `
                        <div class="flex items-center gap-2">
                            <span class="font-label-md text-label-md text-secondary hidden md:inline">Hoş geldin, ${firstName}</span>
                            <a href="profile.html" aria-label="person"
                                class="text-secondary hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full flex items-center justify-center">
                                <span class="material-symbols-outlined">person</span>
                            </a>
                        </div>
                    `;
                }
            } else {
                if (type === 'reviews') {
                    authContainer.innerHTML = `
                        <a href="login.html" class="text-sm font-medium text-brand hover:underline px-4 py-2 hidden md:inline">Giriş Yap</a>
                        <a href="login.html" class="text-gray-400 hover:text-gray-500 md:hidden flex items-center justify-center">
                            <span class="material-symbols-outlined">login</span>
                        </a>
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
        }

        updateCartAndFavoritesBadges();
    }
}

function updateCartAndFavoritesBadges() {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
        const cartCount = userData.cart ? userData.cart.length : 0;
        const favCount = userData.favorites ? userData.favorites.length : 0;

        // Find all possible badges by ID prefix and update them
        ['main', 'detail', 'reviews', 'categories'].forEach(type => {
            const cartBadge = document.getElementById(`cart-badge-${type}`);
            const favBadge = document.getElementById(`fav-badge-${type}`);

            if (cartBadge) {
                cartBadge.innerText = cartCount;
                if (cartCount > 0) cartBadge.classList.remove('hidden');
                else cartBadge.classList.add('hidden');
            }
            if (favBadge) {
                favBadge.innerText = favCount;
                if (favCount > 0) favBadge.classList.remove('hidden');
                else favBadge.classList.add('hidden');
            }
        });
    }
}

// Global functions for adding to cart and favorites
window.toggleFavorite = function (productId, iconElement) {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        alert('Favorilere eklemek için lütfen giriş yapın.');
        window.location.href = 'login.html';
        return;
    }

    const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
    if (!userData.favorites) userData.favorites = [];

    const index = userData.favorites.indexOf(productId);
    let isFavorite = false;

    if (index === -1) {
        userData.favorites.push(productId);
        isFavorite = true;
    } else {
        userData.favorites.splice(index, 1);
    }

    // Sync to sessionStorage
    sessionStorage.setItem('userData', JSON.stringify(userData));

    // Sync to localStorage
    const usersList = JSON.parse(localStorage.getItem('usersList')) || [];
    const userIndex = usersList.findIndex(u => u.email === userData.email);
    if (userIndex !== -1) {
        usersList[userIndex].favorites = userData.favorites;
        localStorage.setItem('usersList', JSON.stringify(usersList));
    }

    // Visual Update
    if (iconElement) {
        if (isFavorite) {
            iconElement.style.fontVariationSettings = "'FILL' 1";
            iconElement.classList.add('text-primary'); // Make it colorful
        } else {
            iconElement.style.fontVariationSettings = "'FILL' 0";
            iconElement.classList.remove('text-primary'); // Remove color if we added it
        }
    }

    updateCartAndFavoritesBadges();
};

window.addToCart = function (productId, quantity = 1) {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') {
        alert('Sepete eklemek için lütfen giriş yapın.');
        window.location.href = 'login.html';
        return;
    }

    const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
    if (!userData.cart) userData.cart = [];

    // Check if product already in cart
    const existingItem = userData.cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity += parseInt(quantity);
    } else {
        userData.cart.push({ productId, quantity: parseInt(quantity) });
    }

    // Sync to sessionStorage
    sessionStorage.setItem('userData', JSON.stringify(userData));

    // Sync to localStorage
    const usersList = JSON.parse(localStorage.getItem('usersList')) || [];
    const userIndex = usersList.findIndex(u => u.email === userData.email);
    if (userIndex !== -1) {
        usersList[userIndex].cart = userData.cart;
        localStorage.setItem('usersList', JSON.stringify(usersList));
    }

    // Visual Update
    updateCartAndFavoritesBadges();

    // Create a temporary toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-lg shadow-lg font-body-md z-50 transform transition-all translate-y-0 opacity-100';
    toast.innerText = 'Ürün sepete eklendi!';
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
};

window.removeFromCart = function (productId) {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') return;

    const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
    if (!userData.cart) return;

    userData.cart = userData.cart.filter(item => item.productId !== productId);

    sessionStorage.setItem('userData', JSON.stringify(userData));

    const usersList = JSON.parse(localStorage.getItem('usersList')) || [];
    const userIndex = usersList.findIndex(u => u.email === userData.email);
    if (userIndex !== -1) {
        usersList[userIndex].cart = userData.cart;
        localStorage.setItem('usersList', JSON.stringify(usersList));
    }

    updateCartAndFavoritesBadges();
};

window.updateCartQuantity = function (productId, quantity) {
    if (sessionStorage.getItem('isLoggedIn') !== 'true') return;

    const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
    if (!userData.cart) return;

    const existingItem = userData.cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity = parseInt(quantity);
        if (existingItem.quantity <= 0) {
            window.removeFromCart(productId);
            return;
        }
    }

    sessionStorage.setItem('userData', JSON.stringify(userData));

    const usersList = JSON.parse(localStorage.getItem('usersList')) || [];
    const userIndex = usersList.findIndex(u => u.email === userData.email);
    if (userIndex !== -1) {
        usersList[userIndex].cart = userData.cart;
        localStorage.setItem('usersList', JSON.stringify(usersList));
    }

    updateCartAndFavoritesBadges();
};

function renderFooter(type) {
    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder && Footers[type]) {
        placeholder.innerHTML = Footers[type];
    }
}

window.formatPrice = function(price) {
    const val = parseFloat(price) || 0;
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val) + ' TL';
};

