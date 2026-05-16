'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatbotSidebar from './ChatbotSidebar';
import MegaMenu from './MegaMenu';

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

    const placeholders = [
        "Plajda giyilecek kadın kombini hazırla.",
        "Halısaha maçı için ne lazım?",
        "Kendi tuvalimi tasarlayacağım.",
        "Evimin bahçesi için mobilya önerileri.",
        "Crop altına ne giysem?",
        "Yılbaşı hediyesi fikirleri..."
    ];

    const icons = ["search", "lens", "scatter_plot", "more_horiz"];

    useEffect(() => {
        const textIntervalId = setInterval(() => {
            setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
        }, 3500);

        return () => clearInterval(textIntervalId);
    }, []);

    useEffect(() => {
        const iconIntervalId = setInterval(() => {
            setIconIndex(prev => (prev + 1) % icons.length);
        }, 2200);

        return () => clearInterval(iconIntervalId);
    }, []);

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
                            <span className={`material-symbols-outlined text-primary absolute transition-opacity duration-500 ${iconIndex % 2 === 0 ? 'opacity-100' : 'opacity-0'}`}>
                                search
                            </span>
                            <span className={`material-symbols-outlined text-primary absolute transition-opacity duration-500 ${iconIndex % 2 === 1 ? 'opacity-100' : 'opacity-0'}`}>
                                lens
                            </span>
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
                            }
                        }}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={isFocused ? "Ürün, marka, kategori arayın..." : ""}
                    />
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
        </header>
    );
}
