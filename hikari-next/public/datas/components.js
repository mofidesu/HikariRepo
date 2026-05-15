const CollectionsData = {
    'autumn': {
        title: 'Sonbahar Essentials',
        subtitle: 'HIKARI Selection',
        description: 'Şehrin ritmine ayak uyduran, konfor ve zarafeti birleştiren Sonbahar seçkimizle tanışın. Yün dokular, toprak tonları ve zamansız silüetler.',
        heroImage: 'datas/images/autumn_collection_hero_1778858262223.png',
        seller: 'HIKARI Selection',
        sellerLogo: 'HS',
        products: ['22245.jpg', '22867.jpg', '15685.jpg', '46935.jpg', '31732.jpg'] // Casual shoes, chinos, perfume, blazer
    },
    'mothersday': {
        title: 'Anneler Günü Özel',
        subtitle: 'Lotus Home & HIKARI',
        description: 'En değerli varlıklarımız için özenle seçilmiş hediyeler. Zarafet dolu detaylar, şık aksesuarlar ve sevginizi yansıtacak parçalar.',
        heroImage: 'datas/images/mothers_day_collection_hero_1778858278156.png',
        seller: 'Lotus Home',
        sellerLogo: 'LH',
        products: ['54018.jpg', '8141.jpg', '48603.jpg', '28951.jpg', '33126.jpg'] // Handbags, watches, earrings, kurtis, heels
    },
    'urban': {
        title: 'Modern Şehir Esintisi',
        subtitle: 'Urban Boutique Seçkisi',
        description: 'Modern kadının şehirli stili. Keskin hatlar, güçlü duruşlar ve sofistike kombinler için hazırlanan özel bir koleksiyon.',
        heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzy3NWVFDFzVFj4bPDocM009pnOGgbHVNBU3GwyKLrvezXDh9p7mC6QG-h5k6hLJgJx470qH2UkYY4eNrGyGUK8YC37kiWtNbjYp8P4PYuJkIVDSHYd5b_qI8e6ump7bvZ93DmXagnF15_1zmnwXwl0RJbhkKpGGCD6yMXjW8nTXJh4D2qY0D1jde0qCxdC6AaiW-fnj7ZtmFUuhBTo6M7BS7Uop0VnCVkpMN-DOb0sojoE28zFVOqzNdWEKTggvCjvjvotI-E3TA',
        seller: 'Urban Boutique',
        sellerLogo: 'UB',
        products: ['50945.jpg', '26372.jpg', '55025.jpg', '11305.jpg', '42659.jpg'] // Jeans, trousers, lipstick, etc.
    },
    'autumnspirit': {
        title: 'Sonbahar Ruhu',
        subtitle: 'Autumn Spirit x HIKARI',
        description: 'Sıcak ve samimi dokularla Sonbaharın tadını çıkarın. Örgü detaylar, yumuşak kumaşlar ve ruhunuzu ısıtacak bir seçki.',
        heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkOQbmLa0AF_mhAK8NADejH3amLYpZJvU1NwkL_n8lwTV9qXp7GHz-BQxw0QjRgpHgl32HD6_Ty0wZb7XxN-RGKThqO6sPDiIzwRD5rrE4knJAstKzLSOubBLfXoFITJyIPSDMyALro7ijm1Amz3UgFAZ0iDL1WQafPmkbUMF8Z6pgfsPKBt7rF6utNU-_hZQalUyqzGnkd_tN4sNKQcOLMrBGfhcGWGDjZ1B0YBawUwqnSZSX8qunDoknBCpMfM5A9Ph7gZfw1Rg',
        seller: 'Autumn Spirit',
        sellerLogo: 'AS',
        products: ['14997.jpg', '1584.jpg', '24523.jpg', '43014.jpg', '7215.jpg']
    },
    'accessories': {
        title: 'Premium Aksesuarlar',
        subtitle: 'HIKARI Luxury Details',
        description: 'Stilinizi tamamlayan en zarif detaylar. Deri el işçiliği çantalar, özel tasarım saatler ve zarafeti simgeleyen aksesuarlar.',
        heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzy3NWVFDFzVFj4bPDocM009pnOGgbHVNBU3GwyKLrvezXDh9p7mC6QG-h5k6hLJgJx470qH2UkYY4eNrGyGUK8YC37kiWtNbjYp8P4PYuJkIVDSHYd5b_qI8e6ump7bvZ93DmXagnF15_1zmnwXwl0RJbhkKpGGCD6yMXjW8nTXJh4D2qY0D1jde0qCxdC6AaiW-fnj7ZtmFUuhBTo6M7BS7Uop0VnCVkpMN-DOb0sojoE28zFVOqzNdWEKTggvCjvjvotI-E3TA',
        seller: 'HIKARI Boutique',
        sellerLogo: 'HB',
        products: ['54018.jpg', '8141.jpg', '15685.jpg', '22245.jpg', '48603.jpg']
    }
};

const Navbars = {
    main: `
    <header class="bg-surface dark:bg-background shadow-sm dark:shadow-none docked full-width top-0 sticky z-50">
        <div class="flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto">
            <a class="font-headline-lg text-headline-lg font-bold text-primary dark:text-primary-fixed-dim hover:opacity-80 transition-all active:scale-95 duration-200" href="main.html">HIKARI</a>
            <div class="hidden md:flex flex-1 max-w-xl mx-8 relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary">search</span>
                <input class="w-full pl-10 pr-4 py-3 rounded-DEFAULT border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-all" placeholder="Ürün, marka ve daha fazlasını arayın" type="text" />
            </div>
            <nav class="hidden md:flex items-center space-x-8">
                <a class="font-body-md text-body-md text-primary dark:text-primary-fixed-dim border-b-2 border-primary pb-1" href="main.html">Yeni Gelenler</a>
                <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors" href="categories.html">Kategoriler</a>
                
                <!-- Koleksiyonlar Dropdown -->
                <div class="relative group py-4">
                    <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors flex items-center gap-1" href="#">
                        Koleksiyonlar
                        <span class="material-symbols-outlined text-sm">expand_more</span>
                    </a>
                    <div class="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-[600px] bg-white dark:bg-background shadow-xl rounded-xl border border-outline-variant/30 p-6 z-50">
                        <div class="grid grid-cols-3 gap-6">
                            <div class="space-y-4">
                                <h4 class="font-bold text-primary text-sm uppercase tracking-wider border-b border-primary/10 pb-2">Öne Çıkanlar</h4>
                                <ul class="space-y-3">
                                    <li><a href="collection.html?id=mothersday" class="text-on-surface hover:text-primary transition-colors flex flex-col">
                                        <span class="font-medium">Anneler Günü</span>
                                        <span class="text-xs text-secondary italic">HIKARI & ÇiçekSepeti Özel</span>
                                    </a></li>
                                    <li><a href="collection.html?id=autumn" class="text-on-surface hover:text-primary transition-colors flex flex-col">
                                        <span class="font-medium">Sonbahar Essentials</span>
                                        <span class="text-xs text-secondary italic">Urban Boutique Seçkisi</span>
                                    </a></li>
                                    <li><a href="collection.html?id=urban" class="text-on-surface hover:text-primary transition-colors flex flex-col">
                                        <span class="font-medium">Yaz Esintisi</span>
                                        <span class="text-xs text-secondary italic">Beach Mode x HIKARI</span>
                                    </a></li>
                                </ul>
                            </div>
                            <div class="col-span-2 bg-surface-container-low rounded-lg p-4">
                                <div class="flex justify-between items-center mb-3">
                                    <span class="text-xs font-bold text-secondary uppercase">Haftanın Seçkisi: Anneler Günü</span>
                                    <span class="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">YENİ</span>
                                </div>
                                <div class="flex gap-3 h-32">
                                    <div class="flex-1 rounded overflow-hidden shadow-sm border border-white">
                                        <img src="datas/data/54018.jpg" class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 rounded overflow-hidden shadow-sm border border-white">
                                        <img src="datas/data/8141.jpg" class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 bg-white rounded shadow-sm border border-white p-2 flex flex-col items-center justify-center text-center">
                                        <p class="text-[10px] text-primary font-bold italic mb-1">Lotus Home</p>
                                        <p class="text-[9px] text-secondary leading-tight mb-2">Porselen Fincan Takımı</p>
                                        <a href="collection.html?id=mothersday" class="text-[10px] font-bold border-b border-primary text-primary">İncele</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Erkek Dropdown -->
                <div class="relative group py-4">
                    <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors flex items-center gap-1" href="#">
                        Erkek
                        <span class="material-symbols-outlined text-sm">expand_more</span>
                    </a>
                    <div class="absolute left-0 top-full hidden group-hover:block w-48 bg-white dark:bg-background shadow-xl rounded-xl border border-outline-variant/30 py-3 z-50">
                        <a href="collection.html?category=Trousers" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Pantolon</a>
                        <a href="collection.html?category=Nightwear" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Pijama</a>
                        <a href="collection.html?category=Tshirts" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">T-Shirt</a>
                        <a href="collection.html?category=Shirts" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Gömlek</a>
                        <a href="collection.html?category=Briefs" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">İç Çamaşır</a>
                        <a href="collection.html?category=Accessories" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Aksesuar</a>
                    </div>
                </div>

                <!-- Kadın Dropdown -->
                <div class="relative group py-4">
                    <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors flex items-center gap-1" href="#">
                        Kadın
                        <span class="material-symbols-outlined text-sm">expand_more</span>
                    </a>
                    <div class="absolute left-0 top-full hidden group-hover:block w-48 bg-white dark:bg-background shadow-xl rounded-xl border border-outline-variant/30 py-3 z-50">
                        <a href="collection.html?category=Trousers" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Pantolon</a>
                        <a href="collection.html?category=Nightwear" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Pijama</a>
                        <a href="collection.html?category=Tshirts" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">T-Shirt</a>
                        <a href="collection.html?category=Shirts" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Gömlek</a>
                        <a href="collection.html?category=Briefs" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">İç Çamaşır</a>
                        <a href="collection.html?category=Accessories" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Aksesuar</a>
                    </div>
                </div>
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
            <nav class="hidden md:flex items-center space-x-8">
                <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors" href="main.html">Yeni Gelenler</a>
                <a class="font-body-md text-body-md text-primary dark:text-primary-fixed-dim border-b-2 border-primary pb-1" href="categories.html">Kategoriler</a>
                
                <!-- Koleksiyonlar Dropdown -->
                <div class="relative group py-4">
                    <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors flex items-center gap-1" href="#">
                        Koleksiyonlar
                        <span class="material-symbols-outlined text-sm">expand_more</span>
                    </a>
                    <div class="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-[600px] bg-white dark:bg-background shadow-xl rounded-xl border border-outline-variant/30 p-6 z-50">
                        <div class="grid grid-cols-3 gap-6">
                            <div class="space-y-4">
                                <h4 class="font-bold text-primary text-sm uppercase tracking-wider border-b border-primary/10 pb-2">Öne Çıkanlar</h4>
                                <ul class="space-y-3">
                                    <li><a href="collection.html?id=mothersday" class="text-on-surface hover:text-primary transition-colors flex flex-col">
                                        <span class="font-medium">Anneler Günü</span>
                                        <span class="text-xs text-secondary italic">HIKARI & ÇiçekSepeti Özel</span>
                                    </a></li>
                                    <li><a href="collection.html?id=autumn" class="text-on-surface hover:text-primary transition-colors flex flex-col">
                                        <span class="font-medium">Sonbahar Essentials</span>
                                        <span class="text-xs text-secondary italic">Urban Boutique Seçkisi</span>
                                    </a></li>
                                    <li><a href="collection.html?id=urban" class="text-on-surface hover:text-primary transition-colors flex flex-col">
                                        <span class="font-medium">Yaz Esintisi</span>
                                        <span class="text-xs text-secondary italic">Beach Mode x HIKARI</span>
                                    </a></li>
                                </ul>
                            </div>
                            <div class="col-span-2 bg-surface-container-low rounded-lg p-4">
                                <div class="flex justify-between items-center mb-3">
                                    <span class="text-xs font-bold text-secondary uppercase">Haftanın Seçkisi: Anneler Günü</span>
                                    <span class="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">YENİ</span>
                                </div>
                                <div class="flex gap-3 h-32">
                                    <div class="flex-1 rounded overflow-hidden shadow-sm border border-white">
                                        <img src="datas/data/54018.jpg" class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 rounded overflow-hidden shadow-sm border border-white">
                                        <img src="datas/data/8141.jpg" class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 bg-white rounded shadow-sm border border-white p-2 flex flex-col items-center justify-center text-center">
                                        <p class="text-[10px] text-primary font-bold italic mb-1">Lotus Home</p>
                                        <p class="text-[9px] text-secondary leading-tight mb-2">Porselen Fincan Takımı</p>
                                        <a href="collection.html?id=mothersday" class="text-[10px] font-bold border-b border-primary text-primary">İncele</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Erkek Dropdown -->
                <div class="relative group py-4">
                    <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors flex items-center gap-1" href="#">
                        Erkek
                        <span class="material-symbols-outlined text-sm">expand_more</span>
                    </a>
                    <div class="absolute left-0 top-full hidden group-hover:block w-48 bg-white dark:bg-background shadow-xl rounded-xl border border-outline-variant/30 py-3 z-50">
                        <a href="collection.html?category=Trousers" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Pantolon</a>
                        <a href="collection.html?category=Nightwear" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Pijama</a>
                        <a href="collection.html?category=Tshirts" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">T-Shirt</a>
                        <a href="collection.html?category=Shirts" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Gömlek</a>
                        <a href="collection.html?category=Briefs" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">İç Çamaşır</a>
                        <a href="collection.html?category=Accessories" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Aksesuar</a>
                    </div>
                </div>

                <!-- Kadın Dropdown -->
                <div class="relative group py-4">
                    <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors flex items-center gap-1" href="#">
                        Kadın
                        <span class="material-symbols-outlined text-sm">expand_more</span>
                    </a>
                    <div class="absolute left-0 top-full hidden group-hover:block w-48 bg-white dark:bg-background shadow-xl rounded-xl border border-outline-variant/30 py-3 z-50">
                        <a href="collection.html?category=Trousers" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Pantolon</a>
                        <a href="collection.html?category=Nightwear" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Pijama</a>
                        <a href="collection.html?category=Tshirts" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">T-Shirt</a>
                        <a href="collection.html?category=Shirts" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Gömlek</a>
                        <a href="collection.html?category=Briefs" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">İç Çamaşır</a>
                        <a href="collection.html?category=Accessories" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Aksesuar</a>
                    </div>
                </div>
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
    <header class="bg-surface dark:bg-background shadow-sm dark:shadow-none docked full-width top-0 sticky z-50">
        <div class="flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto">
            <a class="font-headline-lg text-headline-lg font-bold text-primary dark:text-primary-fixed-dim hover:opacity-80 transition-all active:scale-95 duration-200" href="main.html">HIKARI</a>
            <div class="hidden md:flex flex-1 max-w-xl mx-8 relative">
                <span class="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary">search</span>
                <input class="w-full pl-10 pr-4 py-3 rounded-DEFAULT border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-all" placeholder="Ürün, marka ve daha fazlasını arayın" type="text" />
            </div>
            <nav class="hidden md:flex items-center space-x-8">
                <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors" href="main.html">Yeni Gelenler</a>
                <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors" href="categories.html">Kategoriler</a>
                
                <!-- Koleksiyonlar Dropdown -->
                <div class="relative group py-4">
                    <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors flex items-center gap-1" href="#">
                        Koleksiyonlar
                        <span class="material-symbols-outlined text-sm">expand_more</span>
                    </a>
                    <div class="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-[600px] bg-white dark:bg-background shadow-xl rounded-xl border border-outline-variant/30 p-6 z-50">
                        <div class="grid grid-cols-3 gap-6">
                            <div class="space-y-4">
                                <h4 class="font-bold text-primary text-sm uppercase tracking-wider border-b border-primary/10 pb-2">Öne Çıkanlar</h4>
                                <ul class="space-y-3">
                                    <li><a href="collection.html?id=mothersday" class="text-on-surface hover:text-primary transition-colors flex flex-col">
                                        <span class="font-medium">Anneler Günü</span>
                                        <span class="text-xs text-secondary italic">HIKARI & ÇiçekSepeti Özel</span>
                                    </a></li>
                                    <li><a href="collection.html?id=autumn" class="text-on-surface hover:text-primary transition-colors flex flex-col">
                                        <span class="font-medium">Sonbahar Essentials</span>
                                        <span class="text-xs text-secondary italic">Urban Boutique Seçkisi</span>
                                    </a></li>
                                    <li><a href="collection.html?id=urban" class="text-on-surface hover:text-primary transition-colors flex flex-col">
                                        <span class="font-medium">Yaz Esintisi</span>
                                        <span class="text-xs text-secondary italic">Beach Mode x HIKARI</span>
                                    </a></li>
                                </ul>
                            </div>
                            <div class="col-span-2 bg-surface-container-low rounded-lg p-4">
                                <div class="flex justify-between items-center mb-3">
                                    <span class="text-xs font-bold text-secondary uppercase">Haftanın Seçkisi: Anneler Günü</span>
                                    <span class="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">YENİ</span>
                                </div>
                                <div class="flex gap-3 h-32">
                                    <div class="flex-1 rounded overflow-hidden shadow-sm border border-white">
                                        <img src="datas/data/54018.jpg" class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 rounded overflow-hidden shadow-sm border border-white">
                                        <img src="datas/data/8141.jpg" class="w-full h-full object-cover" />
                                    </div>
                                    <div class="flex-1 bg-white rounded shadow-sm border border-white p-2 flex flex-col items-center justify-center text-center">
                                        <p class="text-[10px] text-primary font-bold italic mb-1">Lotus Home</p>
                                        <p class="text-[9px] text-secondary leading-tight mb-2">Porselen Fincan Takımı</p>
                                        <a href="collection.html?id=mothersday" class="text-[10px] font-bold border-b border-primary text-primary">İncele</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Erkek Dropdown -->
                <div class="relative group py-4">
                    <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors flex items-center gap-1" href="#">
                        Erkek
                        <span class="material-symbols-outlined text-sm">expand_more</span>
                    </a>
                    <div class="absolute left-0 top-full hidden group-hover:block w-48 bg-white dark:bg-background shadow-xl rounded-xl border border-outline-variant/30 py-3 z-50">
                        <a href="collection.html?category=Trousers" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Pantolon</a>
                        <a href="collection.html?category=Nightwear" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Pijama</a>
                        <a href="collection.html?category=Tshirts" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">T-Shirt</a>
                        <a href="collection.html?category=Shirts" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Gömlek</a>
                        <a href="collection.html?category=Briefs" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">İç Çamaşır</a>
                        <a href="collection.html?category=Accessories" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Aksesuar</a>
                    </div>
                </div>

                <!-- Kadın Dropdown -->
                <div class="relative group py-4">
                    <a class="font-body-md text-body-md text-secondary dark:text-secondary-fixed hover:text-primary transition-colors flex items-center gap-1" href="#">
                        Kadın
                        <span class="material-symbols-outlined text-sm">expand_more</span>
                    </a>
                    <div class="absolute left-0 top-full hidden group-hover:block w-48 bg-white dark:bg-background shadow-xl rounded-xl border border-outline-variant/30 py-3 z-50">
                        <a href="collection.html?category=Trousers" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Pantolon</a>
                        <a href="collection.html?category=Nightwear" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Pijama</a>
                        <a href="collection.html?category=Tshirts" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">T-Shirt</a>
                        <a href="collection.html?category=Shirts" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Gömlek</a>
                        <a href="collection.html?category=Briefs" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">İç Çamaşır</a>
                        <a href="collection.html?category=Accessories" class="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Aksesuar</a>
                    </div>
                </div>
            </nav>
            <div class="flex items-center space-x-4">
            </br>
                <button aria-label="shopping_cart" onclick="window.location.href='cart.html'" class="text-secondary hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full relative">
                    <span class="material-symbols-outlined">shopping_cart</span>
                    <span id="cart-badge-detail" class="absolute top-0 right-0 bg-primary-container text-on-primary-container text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center hidden">0</span>
                </button>
                <button aria-label="favorite" onclick="window.location.href='favorites.html'" class="text-secondary hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full relative">
                    <span class="material-symbols-outlined">favorite</span>
                    <span id="fav-badge-detail" class="absolute top-0 right-0 bg-primary-container text-on-primary-container text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center hidden">0</span>
                </button>
                <div id="auth-container" class="flex items-center"></div>
            </div>
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
// Helper to get heart SVG
window.getHeartSVG = function(isFilled) {
    if (isFilled) {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px;"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.372 0 2.615.551 3.512 1.435.897-.884 2.14-1.435 3.512-1.435 2.786 0 5.25 2.322 5.25 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>`;
    } else {
        return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 24px; height: 24px;"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>`;
    }
};

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
        iconElement.innerHTML = getHeartSVG(isFavorite);
        if (isFavorite) {
            iconElement.classList.add('text-error');
            iconElement.classList.remove('text-secondary');
        } else {
            iconElement.classList.remove('text-error');
            iconElement.classList.add('text-secondary');
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

window.getReviewCount = function(productId) {
    if (typeof reviewsData === 'undefined' || !Array.isArray(reviewsData)) return 128;
    
    const cleanId = String(productId).trim();
    const realCount = reviewsData.filter(r => String(r.productId).trim() === cleanId).length;
    
    // If we have real reviews, return them. 
    // If not, generate a deterministic number based on the productId string 
    // so it looks like real data but stays consistent.
    if (realCount > 0) return realCount;
    
    // Deterministic "fake" count for products with no reviews in the dataset
    let hash = 0;
    for (let i = 0; i < cleanId.length; i++) {
        hash = ((hash << 5) - hash) + cleanId.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash % 150) + 20; // Returns something between 20 and 170
};

window.getStarsHTML = function(productId, baseRating) {
    let rating = parseFloat(baseRating) || 5;
    
    // If we have real reviews, calculate the actual average
    if (typeof reviewsData !== 'undefined' && Array.isArray(reviewsData)) {
        const cleanId = String(productId).trim();
        const productReviews = reviewsData.filter(r => String(r.productId).trim() === cleanId);
        if (productReviews.length > 0) {
            const sum = productReviews.reduce((acc, r) => acc + (parseFloat(r.overall) || 0), 0);
            rating = sum / productReviews.length;
        }
    }
    
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            starsHTML += `<span class="material-symbols-outlined text-primary text-sm" style="font-variation-settings: 'FILL' 1;">star</span>`;
        } else if (rating >= i - 0.5) {
            starsHTML += `<span class="material-symbols-outlined text-primary text-sm" style="font-variation-settings: 'FILL' 1;">star_half</span>`;
        } else {
            starsHTML += `<span class="material-symbols-outlined text-surface-dim text-sm" style="font-variation-settings: 'FILL' 1;">star</span>`;
        }
    }
    return starsHTML;
};

window.createProductCards = function(container, productsList, isGridOverride = null) {
    if (!container) return;
    let html = '';
    
    // Determine card width based on container layout or override
    const isGrid = isGridOverride !== null ? isGridOverride : container.classList.contains('grid');
    const cardWidthClass = isGrid ? 'w-full' : 'w-[calc(50%-12px)] md:w-[calc(25%-18px)] flex-shrink-0 snap-start';

    productsList.forEach((product) => {
        const price = formatPrice(product.price);
        const reviews = getReviewCount(product.image);
        const starsHTML = getStarsHTML(product.image, product.stars);

        const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
        const isFav = userData.favorites && userData.favorites.includes(product.image);
        const favColorClass = isFav ? "text-error" : "text-secondary";

        const cardHTML = `
            <div onclick="window.location.href='detail.html?id=${encodeURIComponent(product.image)}&reviews=${reviews}'"
                class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-full ${cardWidthClass}">
                <div class="relative aspect-[4/5] bg-surface-container-low overflow-hidden">
                    <img alt="${product['display name']}"
                        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        src="datas/data/${product.image}" />
                    <button aria-label="Add to Favorites"
                        class="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full transition-colors shadow-sm"
                        onclick="event.stopPropagation(); toggleFavorite('${product.image}', this.querySelector('span'));">
                        <span class="flex items-center justify-center ${favColorClass}">${getHeartSVG(isFav)}</span>
                    </button>
                </div>
                <div class="p-4 flex flex-col flex-grow">
                    <span class="font-label-sm text-label-sm text-secondary mb-1 uppercase tracking-wider truncate block">${product.category}</span>
                    <h3 class="font-body-md text-body-md text-on-surface mb-2 line-clamp-2 min-h-[3rem] font-medium">${product['display name']}</h3>
                    <div class="flex items-center gap-1 mb-3">
                        ${starsHTML}
                        <span class="font-label-sm text-label-sm text-secondary ml-1">(${reviews})</span>
                    </div>
                    <div class="mt-auto flex justify-between items-center">
                        <span class="font-headline-md text-headline-md text-on-surface font-bold text-primary">${price}</span>
                        <button aria-label="Add to cart"
                            class="p-2 bg-surface-container rounded-lg text-on-surface hover:bg-primary hover:text-white transition-colors"
                            onclick="event.stopPropagation(); addToCart('${product.image}');">
                            <span class="material-symbols-outlined text-xl">add_shopping_cart</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        html += cardHTML;
    });
    container.insertAdjacentHTML('beforeend', html);
};

