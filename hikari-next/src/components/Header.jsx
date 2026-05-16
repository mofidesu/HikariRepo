'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header({ type = 'main' }) {
    const [cartCount, setCartCount] = useState(0);
    const [favCount, setFavCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [isCartBumping, setIsCartBumping] = useState(false);

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
        <header className="bg-surface shadow-sm docked full-width top-0 sticky z-50">
            <div className="flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto">
                <Link className="font-headline-lg text-headline-lg font-bold text-primary hover:opacity-80 transition-all active:scale-95 duration-200" href="/">
                    HIKARI
                </Link>
                
                <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary">search</span>
                    <input className="w-full pl-10 pr-4 py-3 rounded-DEFAULT border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 bg-surface-container-lowest text-on-surface font-body-md text-body-md outline-none transition-all" placeholder="Ürün, marka ve daha fazlasını arayın" type="text" />
                </div>
                
                <nav className="hidden md:flex items-center space-x-8">
                    <Link className={`font-body-md text-body-md ${type === 'main' ? 'text-primary border-b-2 border-primary pb-1' : 'text-secondary hover:text-primary transition-colors'}`} href="/">
                        Yeni Gelenler
                    </Link>
                    <Link className={`font-body-md text-body-md ${type === 'categories' ? 'text-primary border-b-2 border-primary pb-1' : 'text-secondary hover:text-primary transition-colors'}`} href="/categories">
                        Kategoriler
                    </Link>
                    
                    {/* Koleksiyonlar Dropdown */}
                    <div className="relative group py-4">
                        <Link className="font-body-md text-body-md text-secondary hover:text-primary transition-colors flex items-center gap-1" href="#">
                            Koleksiyonlar
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </Link>
                        <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-[600px] bg-white shadow-xl rounded-xl border border-outline-variant/30 p-6 z-50">
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-bold text-primary text-sm uppercase tracking-wider border-b border-primary/10 pb-2">Öne Çıkanlar</h4>
                                    <ul className="space-y-3">
                                        <li>
                                            <Link href="/collection?id=mothersday" className="text-on-surface hover:text-primary transition-colors flex flex-col">
                                                <span className="font-medium">Anneler Günü</span>
                                                <span className="text-xs text-secondary italic">HIKARI & ÇiçekSepeti Özel</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/collection?id=autumn" className="text-on-surface hover:text-primary transition-colors flex flex-col">
                                                <span className="font-medium">Sonbahar Essentials</span>
                                                <span className="text-xs text-secondary italic">Urban Boutique Seçkisi</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/collection?id=urban" className="text-on-surface hover:text-primary transition-colors flex flex-col">
                                                <span className="font-medium">Yaz Esintisi</span>
                                                <span className="text-xs text-secondary italic">Beach Mode x HIKARI</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-span-2 bg-surface-container-low rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-bold text-secondary uppercase">Haftanın Seçkisi: Anneler Günü</span>
                                        <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">YENİ</span>
                                    </div>
                                    <div className="flex gap-3 h-32">
                                        <div className="flex-1 rounded overflow-hidden shadow-sm border border-white">
                                            <img src="/datas/data/54018.jpg" className="w-full h-full object-cover" alt="Anneler Günü" />
                                        </div>
                                        <div className="flex-1 rounded overflow-hidden shadow-sm border border-white">
                                            <img src="/datas/data/8141.jpg" className="w-full h-full object-cover" alt="Anneler Günü" />
                                        </div>
                                        <div className="flex-1 bg-white rounded shadow-sm border border-white p-2 flex flex-col items-center justify-center text-center">
                                            <p className="text-[10px] text-primary font-bold italic mb-1">Lotus Home</p>
                                            <p className="text-[9px] text-secondary leading-tight mb-2">Porselen Fincan Takımı</p>
                                            <Link href="/collection?id=mothersday" className="text-[10px] font-bold border-b border-primary text-primary">İncele</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Erkek Dropdown */}
                    <div className="relative group py-4">
                        <Link className="font-body-md text-body-md text-secondary hover:text-primary transition-colors flex items-center gap-1" href="#">
                            Erkek
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </Link>
                        <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-white shadow-xl rounded-xl border border-outline-variant/30 py-3 z-50">
                            <Link href="/collection?category=Trousers" className="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Pantolon</Link>
                            <Link href="/collection?category=Nightwear" className="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Pijama</Link>
                            <Link href="/collection?category=Tshirts" className="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">T-Shirt</Link>
                            <Link href="/collection?category=Shirts" className="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Gömlek</Link>
                            <Link href="/collection?category=Briefs" className="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">İç Çamaşır</Link>
                            <Link href="/collection?category=Accessories" className="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Aksesuar</Link>
                        </div>
                    </div>

                    {/* Kadın Dropdown */}
                    <div className="relative group py-4">
                        <Link className="font-body-md text-body-md text-secondary hover:text-primary transition-colors flex items-center gap-1" href="#">
                            Kadın
                            <span className="material-symbols-outlined text-sm">expand_more</span>
                        </Link>
                        <div className="absolute left-0 top-full hidden group-hover:block w-48 bg-white shadow-xl rounded-xl border border-outline-variant/30 py-3 z-50">
                            <Link href="/collection?category=Trousers" className="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Pantolon</Link>
                            <Link href="/collection?category=Nightwear" className="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Pijama</Link>
                            <Link href="/collection?category=Tshirts" className="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">T-Shirt</Link>
                            <Link href="/collection?category=Shirts" className="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Gömlek</Link>
                            <Link href="/collection?category=Briefs" className="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">İç Çamaşır</Link>
                            <Link href="/collection?category=Accessories" className="block px-6 py-2.5 text-on-surface hover:bg-surface-container-high hover:text-primary transition-colors">Aksesuar</Link>
                        </div>
                    </div>
                </nav>
                
                <div className="flex items-center space-x-4">
                    <button aria-label="shopping_cart" onClick={() => window.location.href='/cart'} className="text-secondary hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full relative cursor-pointer">
                        <span className="material-symbols-outlined">shopping_cart</span>
                        {cartCount > 0 && (
                            <span className={`absolute top-0 right-0 bg-primary-container text-on-primary-container text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-transform duration-300 ${isCartBumping ? 'scale-150' : 'scale-100'}`}>
                                {cartCount}
                            </span>
                        )}
                    </button>
                    <button aria-label="favorite" onClick={() => window.location.href='/favorites'} className="text-secondary hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full relative cursor-pointer">
                        <span className="material-symbols-outlined">favorite</span>
                        {favCount > 0 && (
                            <span className="absolute top-0 right-0 bg-primary-container text-on-primary-container text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {favCount}
                            </span>
                        )}
                    </button>
                    
                    <div className="flex items-center">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-2">
                                <span className="font-label-md text-label-md text-secondary hidden md:inline">Hoş geldin, {firstName}</span>
                                <Link href="/profile" aria-label="person" className="text-secondary hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined">person</span>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="font-label-md text-label-md text-on-surface hover:text-primary transition-colors px-4 py-2 hidden md:inline">Giriş Yap</Link>
                                <Link href="/login" aria-label="person" className="text-secondary hover:text-primary transition-colors p-2 hover:bg-surface-container-high rounded-full md:hidden flex items-center justify-center">
                                    <span className="material-symbols-outlined">login</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
