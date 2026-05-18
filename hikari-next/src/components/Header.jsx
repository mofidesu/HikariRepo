'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatbotSidebar from './ChatbotSidebar';
import MegaMenu from './MegaMenu';
import { supabase } from '@/lib/supabase';

// HIKARI platformunun genel üst bilgi (Header) bileşeni. Arama çubuğu, sepet/favori sayaçları ve Hikai Asistan tetikleyicisini barındırır.
export default function Header({ type = 'main' }) {
    const router = useRouter();
    const [cartCount, setCartCount] = useState(0);
    const [favCount, setFavCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [isCartBumping, setIsCartBumping] = useState(false);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);

    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [iconIndex, setIconIndex] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    // Hikai Asistanı için arama çubuğunda dönen ilham verici sorular listesi.
    const placeholders = [
        "Plajda giyilecek kadın kombini hazırla.",
        "Halısaha maçı için ne lazım?",
        "Kendi tuvalimi tasarlayacağım.",
        "Evimin bahçesi için mobilya önerileri.",
        "Crop altına ne giysem?",
        "Yılbaşı hediyesi fikirleri..."
    ];

    const icons = ["search", "lens", "scatter_plot", "more_horiz"];

    // Arama çubuğundaki yapay zeka sorularını belirli zaman aralığıyla (dikey kayarak) döndürür.
    useEffect(() => {
        const textIntervalId = setInterval(() => {
            setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
        }, 3500);

        return () => clearInterval(textIntervalId);
    }, []);

    // Arama büyüteci ile Hikai logosunun dönüşümlü geçiş efektini kontrol eden zamanlayıcı.
    useEffect(() => {
        const iconIntervalId = setInterval(() => {
            setIconIndex(prev => (prev + 1) % icons.length);
        }, 2200);

        return () => clearInterval(iconIntervalId);
    }, []);

    // Kullanıcı arama çubuğuna kelime girdikçe, 300ms gecikmeli (debounce) olarak Supabase'den canlı ürün önerileri getiren arama mekanizması.
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchValue.trim().length < 2) {
                setSuggestions([]);
                return;
            }
            const { data } = await supabase
                .from('products')
                .select('id, productname, imgUrl, price')
                .ilike('productname', `%${searchValue.trim()}%`)
                .limit(4);
            if (data) setSuggestions(data);
        };
        const timeoutId = setTimeout(() => fetchSuggestions(), 300); // debounce
        return () => clearTimeout(timeoutId);
    }, [searchValue]);

    // Kullanıcı giriş durumunu, sepet miktarını ve favori sayısını sessionStorage ile senkronize tutan ve storage olaylarını dinleyen kanca.
    useEffect(() => {
        const updateUserData = () => {
            const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
            setIsLoggedIn(loggedIn);
            if (loggedIn) {
                const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
                setFirstName(userData.firstName || 'Kullanıcı');

                let totalCartItems = 0;
                if (userData.cart) {
                    totalCartItems = userData.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
                }

                // Sepete yeni ürün eklendiğinde sepet ikonunu zıplatma (bump) animasyonunu tetikler.
                setCartCount(prev => {
                    if (prev !== totalCartItems && totalCartItems > prev) {
                        setIsCartBumping(true);
                        setTimeout(() => setIsCartBumping(false), 300);
                    }
                    return totalCartItems;
                });
                setFavCount(userData.favorites ? userData.favorites.length : 0);
            } else {
                setCartCount(0);
                setFavCount(0);
                setFirstName('');
            }
        };

        updateUserData();

        window.addEventListener('storage', updateUserData);
        return () => window.removeEventListener('storage', updateUserData);
    }, []);

    return (
        <header className="bg-surface-container shadow-sm docked full-width top-0 sticky z-50">
            <div className="flex justify-between items-center px-4 md:px-8 w-full gap-4 lg:gap-6 h-[80px]">
                {/* Logo */}
                <Link className="font-headline-lg text-headline-lg font-extrabold text-primary hover:opacity-80 transition-all active:scale-95 duration-200 shrink-0" href="/">
                    HIKARI
                </Link>

                {/* Search Bar - Sola Kaydırıldı */}
                <div className="hidden md:flex flex-1 max-w-2xl relative group lg:ml-8 xl:ml-12">
                    <button
                        onClick={() => setIsChatbotOpen(true)}
                        className="absolute left-1 top-1 bottom-1 w-12 flex items-center justify-center border-r border-outline-variant/50 hover:bg-surface-container-high rounded-l-full transition-colors z-20 group-hover:border-primary/30"
                        title="HIKARI Asistan'a Sor"
                    >
                        <div className="relative w-6 h-6 flex items-center justify-center">
                            <span className={`material-symbols-outlined text-primary absolute transition-all duration-500 ${iconIndex % 2 === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                                search
                            </span>
                            <img 
                                src="/hikai-logo.png" 
                                className={`w-5 h-5 object-contain absolute transition-all duration-500 ${iconIndex % 2 === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} 
                                alt="Hikai Logo" 
                            />
                        </div>
                    </button>

                    {!isFocused && !searchValue && (
                        <div className="absolute left-16 top-1/2 transform -translate-y-1/2 right-4 h-5 overflow-hidden pointer-events-none flex flex-col justify-start z-10">
                            <div
                                className="transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateY(-${placeholderIndex * 20}px)` }}
                            >
                                {placeholders.map((text, i) => (
                                    <p key={i} className="text-secondary/60 text-sm truncate h-[20px] flex items-center">
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}

                    <input
                        className="w-full pl-16 pr-4 py-3 rounded-full border border-outline-variant group-hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/10 bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-all"
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && searchValue.trim()) {
                                router.push(`/collection?q=${encodeURIComponent(searchValue.trim())}`);
                                setIsFocused(false);
                            }
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={isFocused ? "Ürün, marka, kategori arayın..." : ""}
                    />

                    {/* Search Suggestions Dropdown */}
                    {isFocused && suggestions.length > 0 && (
                        <div className="absolute top-[110%] left-0 right-0 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden">
                            {suggestions.map((item) => (
                                <div 
                                    key={item.id}
                                    onMouseDown={(e) => {
                                        // use onMouseDown to prevent onBlur firing before click
                                        e.preventDefault();
                                        router.push(`/detail?id=${item.id}`);
                                        setIsFocused(false);
                                        setSearchValue("");
                                    }}
                                    className="flex items-center gap-3 p-3 hover:bg-surface-container-low cursor-pointer transition-colors border-b border-outline-variant/30 last:border-0"
                                >
                                    <div className="w-10 h-10 shrink-0 bg-white border border-outline-variant/50 rounded overflow-hidden flex items-center justify-center p-1">
                                        <img src={item.imgUrl} alt={item.productname} className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-sm font-medium text-on-surface truncate">{item.productname}</span>
                                        <span className="text-xs text-primary font-bold">{new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2 }).format(item.price)} TL</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sağ Taraf Kompleksi */}
                <div className="flex items-center shrink-0">
                    
                    {/* Kategoriler Mega Menü */}
                    <div className="hidden md:block shrink-0 h-full">
                        <MegaMenu />
                    </div>

                    {/* Ayırıcı Çizgi */}
                    <div className="hidden md:block w-px h-6 bg-outline-variant/60 mx-4 lg:mx-6"></div>

                    {/* Sağ İkonlar ve Kullanıcı Alanı */}
                    <div className="flex items-center gap-4 lg:gap-6">
                        
                        {/* Favorilerim */}
                        <Link href="/favorites" className="flex items-center gap-2 group cursor-pointer relative hover:bg-surface-container-low px-2 py-1 rounded-lg transition-colors">
                            <div className="relative">
                                <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors text-[24px]">favorite</span>
                                {favCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                        {favCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[13px] font-bold text-on-surface group-hover:text-primary transition-colors hidden xl:inline">Favorilerim</span>
                        </Link>

                        {/* Sepetim */}
                        <Link href="/cart" className="flex items-center gap-2 group cursor-pointer relative hover:bg-surface-container-low px-2 py-1 rounded-lg transition-colors">
                            <div className="relative">
                                <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors text-[24px]">shopping_cart</span>
                                {cartCount > 0 && (
                                    <span className={`absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center transition-transform duration-300 ${isCartBumping ? 'scale-150' : 'scale-100'}`}>
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[13px] font-bold text-on-surface group-hover:text-primary transition-colors hidden xl:inline">Sepetim</span>
                        </Link>

                        {/* Profil / Giriş Yap */}
                        <div className="flex items-center">
                            {isLoggedIn ? (
                                <Link href="/profile" className="flex items-center gap-2 group cursor-pointer hover:bg-surface-container-low px-2 py-1 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors text-[24px]">person</span>
                                    <span className="text-[13px] font-bold text-on-surface group-hover:text-primary transition-colors hidden md:inline">Hesabım</span>
                                </Link>
                            ) : (
                                <Link href="/login" className="flex items-center gap-2 group cursor-pointer hover:bg-surface-container-low px-2 py-1 rounded-lg transition-colors">
                                    <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors text-[24px]">person</span>
                                    <span className="text-[13px] font-bold text-on-surface group-hover:text-primary transition-colors hidden md:inline">Giriş Yap</span>
                                </Link>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            <ChatbotSidebar isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

            {/* Global Floating Chatbot Button (Left Edge) */}
            {!isChatbotOpen && (
                <button
                    onClick={() => setIsChatbotOpen(true)}
                    className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-surface-container-lowest shadow-md hover:shadow-lg transition-all pl-2 pr-2 py-6 rounded-r-2xl border border-l-0 border-outline-variant/30 flex flex-col items-center justify-center group hover:pl-3"
                    title="Hikai'yi Aç"
                >
                    <img 
                        src="/hikai-logo.png" 
                        className="w-6 h-6 object-contain mb-1 group-hover:scale-110 transition-transform" 
                        alt="Hikai Logo" 
                    />
                    <span className="material-symbols-outlined text-secondary text-[24px] group-hover:text-primary transition-colors">
                        chevron_right
                    </span>
                </button>
            )}
        </header>
    );
}
