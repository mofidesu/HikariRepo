'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const formatPrice = (price) => {
    const val = parseFloat(price) || 0;
    return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val) + ' TL';
};

const getHeartSVG = (isFilled) => {
    if (isFilled) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px' }}>
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.372 0 2.615.551 3.512 1.435.897-.884 2.14-1.435 3.512-1.435 2.786 0 5.25 2.322 5.25 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
        );
    } else {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        );
    }
};

export default function ProductCard({ product, isGrid = false }) {
    const router = useRouter();
    const [isFav, setIsFav] = useState(false);
    
    const reviews = product.reviews || 0;
    const price = formatPrice(product.price);
    const categoryName = product.categories?.category_name || 'Kategori';

    useEffect(() => {
        if (sessionStorage.getItem('isLoggedIn') === 'true') {
            const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
            setIsFav(userData.favorites && userData.favorites.includes(product.id));
        }
    }, [product.id]);

    const handleToggleFavorite = (e) => {
        e.stopPropagation();
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            alert('Favorilere eklemek için lütfen giriş yapın.');
            router.push('/login');
            return;
        }

        const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
        if (!userData.favorites) userData.favorites = [];

        const index = userData.favorites.indexOf(product.id);
        let newIsFav = false;

        if (index === -1) {
            userData.favorites.push(product.id);
            newIsFav = true;
        } else {
            userData.favorites.splice(index, 1);
        }

        sessionStorage.setItem('userData', JSON.stringify(userData));
        
        // Sync to Supabase
        if (userData.id) {
            supabase.from('profiles')
                .update({ favorites: userData.favorites })
                .eq('id', userData.id)
                .then(({ error }) => {
                    if (error) console.error("Error updating favorites:", error);
                });
        }
        
        setIsFav(newIsFav);
        window.dispatchEvent(new Event('storage'));
    };

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            alert('Sepete eklemek için lütfen giriş yapın.');
            router.push('/login');
            return;
        }

        const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
        if (!userData.cart) userData.cart = [];

        const existingItem = userData.cart.find(item => item.productId === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            userData.cart.push({ productId: product.id, quantity: 1 });
        }

        sessionStorage.setItem('userData', JSON.stringify(userData));
        
        // Sync to Supabase
        if (userData.id) {
            supabase.from('profiles')
                .update({ cart: userData.cart })
                .eq('id', userData.id)
                .then(({ error }) => {
                    if (error) console.error("Error updating cart:", error);
                });
        }

        window.dispatchEvent(new Event('storage'));
    };

    const cardWidthClass = isGrid ? 'w-full' : 'w-[calc(50%-12px)] md:w-[calc(25%-18px)] flex-shrink-0 snap-start';

    // Stars
    const rating = parseFloat(product.stars) || 5;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push(
                <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] text-amber-500">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            );
        } else if (rating >= i - 0.5) {
            stars.push(
                <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px] text-amber-500">
                    <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
                </svg>
            );
        } else {
            stars.push(
                <svg key={i} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-surface-dim">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            );
        }
    }

    return (
        <div onClick={() => router.push(`/detail?id=${encodeURIComponent(product.id)}`)}
            className={`bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col h-full ${cardWidthClass}`}>
            <div className="relative aspect-[4/5] bg-surface-container-low overflow-hidden">
                <img alt={product.productname}
                    className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 bg-white"
                    src={product.imgUrl || 'https://via.placeholder.com/300'} />
                <button aria-label="Add to Favorites"
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full transition-colors shadow-sm cursor-pointer"
                    onClick={handleToggleFavorite}>
                    <span className={`flex items-center justify-center ${isFav ? 'text-error' : 'text-secondary'}`}>
                        {getHeartSVG(isFav)}
                    </span>
                </button>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <span className="font-label-sm text-label-sm text-secondary mb-1 uppercase tracking-wider truncate block">{categoryName}</span>
                <h3 className="font-body-md text-body-md text-on-surface mb-2 line-clamp-2 min-h-[3rem] font-medium">{product.productname}</h3>
                <div className="flex items-center gap-1 mb-3">
                    {stars}
                    <span className="font-label-sm text-label-sm text-secondary ml-1">({reviews})</span>
                </div>
                <div className="mt-auto flex justify-between items-center">
                    <span className="font-headline-md text-headline-md text-on-surface font-bold text-primary">{price}</span>
                    <button aria-label="Add to cart"
                        className="p-2 bg-surface-container rounded-lg text-on-surface hover:bg-primary hover:text-white transition-colors cursor-pointer"
                        onClick={handleAddToCart}>
                        <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
