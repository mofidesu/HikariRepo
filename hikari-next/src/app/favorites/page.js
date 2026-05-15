'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { productsData } from '@/data/products';
import Link from 'next/link';

export default function Favorites() {
    const router = useRouter();
    const [favorites, setFavorites] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            router.push('/login');
            return;
        }

        const loadFavorites = () => {
            const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
            setFavorites(userData.favorites || []);
        };

        loadFavorites();
        setIsLoaded(true);

        window.addEventListener('storage', loadFavorites);
        return () => window.removeEventListener('storage', loadFavorites);
    }, [router]);

    if (!isLoaded) return <div className="min-h-screen"></div>;

    const favoriteProducts = favorites.map(favId => productsData.find(p => p.image === favId)).filter(Boolean);

    return (
        <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow w-full max-w-container-max mx-auto px-4 md:px-8 py-8">
                <h1 className="text-3xl font-bold text-on-surface mb-2">Favorilerim</h1>
                <p className="text-secondary mb-8">Kalbinizi çalan tüm ürünler burada.</p>

                {favoriteProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-xl border border-surface-variant">
                        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                        <h2 className="text-xl font-bold text-on-surface mb-2">Henüz favori ürününüz yok</h2>
                        <p className="text-secondary mb-6 text-center max-w-md">Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsiniz.</p>
                        <Link href="/" className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity">Alışverişe Başla</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {favoriteProducts.map(product => (
                            <ProductCard key={`fav-${product.image}`} product={product} isGrid={true} />
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
