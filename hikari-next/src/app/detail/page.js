'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { productsData } from '@/data/products';
import { reviewsData } from '@/data/reviews';
import Link from 'next/link';

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

function DetailContent() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('id');

    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [isFav, setIsFav] = useState(false);
    const sliderRef = useRef(null);
    const reviewCount = productId ? reviewsData.filter(r => r.productId === productId).length : 0;

    useEffect(() => {
        if (productId) {
            window.scrollTo({ top: 0, behavior: 'instant' });
            const foundProduct = productsData.find(p => p.image === productId);
            if (foundProduct) {
                setProduct(foundProduct);
                document.title = `HIKARI | ${foundProduct['display name']}`;

                // Set initial favorite status
                if (sessionStorage.getItem('isLoggedIn') === 'true') {
                    const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
                    setIsFav(userData.favorites && userData.favorites.includes(productId));
                }

                // Similar products
                const shuffled = [...productsData].sort(() => 0.5 - Math.random());
                const filtered = shuffled.filter(p => p.image !== productId);
                setSimilarProducts(filtered.slice(0, 8));
            }
        }
    }, [productId]);

    const handleToggleFavorite = () => {
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            alert('Favorilere eklemek için lütfen giriş yapın.');
            window.location.href = '/login';
            return;
        }

        const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
        if (!userData.favorites) userData.favorites = [];

        const index = userData.favorites.indexOf(productId);
        let newIsFav = false;

        if (index === -1) {
            userData.favorites.push(productId);
            newIsFav = true;
        } else {
            userData.favorites.splice(index, 1);
        }

        sessionStorage.setItem('userData', JSON.stringify(userData));
        const usersList = JSON.parse(localStorage.getItem('usersList')) || [];
        const userIndex = usersList.findIndex(u => u.email === userData.email);
        if (userIndex !== -1) {
            usersList[userIndex].favorites = userData.favorites;
            localStorage.setItem('usersList', JSON.stringify(usersList));
        }
        setIsFav(newIsFav);
        window.dispatchEvent(new Event('storage'));
    };

    const handleAddToCart = () => {
        if (sessionStorage.getItem('isLoggedIn') !== 'true') {
            alert('Sepete eklemek için lütfen giriş yapın.');
            window.location.href = '/login';
            return;
        }

        const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
        if (!userData.cart) userData.cart = [];

        const existingItem = userData.cart.find(item => item.productId === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            userData.cart.push({ productId: productId, quantity: quantity });
        }

        sessionStorage.setItem('userData', JSON.stringify(userData));
        const usersList = JSON.parse(localStorage.getItem('usersList')) || [];
        const userIndex = usersList.findIndex(u => u.email === userData.email);
        if (userIndex !== -1) {
            usersList[userIndex].cart = userData.cart;
            localStorage.setItem('usersList', JSON.stringify(usersList));
        }

        window.dispatchEvent(new Event('storage'));
    };

    const scrollSlider = (direction) => {
        if (sliderRef.current && sliderRef.current.firstElementChild) {
            const itemWidth = sliderRef.current.firstElementChild.offsetWidth;
            const gap = 24;
            const scrollAmount = itemWidth + gap;
            sliderRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
        }
    };

    if (!product) return <div className="min-h-[50vh] flex items-center justify-center">Ürün bulunamadı.</div>;

    const priceVal = parseFloat(product.price);
    const oldPriceVal = priceVal * 1.25;

    const rating = parseFloat(product.stars) || 5;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars.push(
                <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="w-[20px] h-[20px] text-amber-500">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            );
        } else if (rating >= i - 0.5) {
            stars.push(
                <svg key={i} viewBox="0 0 24 24" fill="currentColor" className="w-[20px] h-[20px] text-amber-500">
                    <path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" />
                </svg>
            );
        } else {
            stars.push(
                <svg key={i} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-surface-dim">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            );
        }
    }

    return (
        <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-label-sm text-secondary mb-8">
                <Link className="hover:text-primary transition-colors" href="/">Anasayfa</Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <Link className="hover:text-primary transition-colors" href={`/collection?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-on-surface font-medium">{product['display name']}</span>
            </nav>

            {/* Product Presentation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-16 lg:mb-24">
                {/* Image Gallery */}
                <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 h-[600px] lg:h-[800px]">
                    <div className="flex md:flex-col gap-4 order-2 md:order-1 overflow-x-auto md:overflow-y-auto no-scrollbar shrink-0 w-full md:w-[100px]">
                        {[1, 2, 3].map((num) => (
                            <button key={num} className={`w-[80px] md:w-full aspect-[4/5] bg-surface-container-lowest border rounded-DEFAULT overflow-hidden relative shrink-0 transition-opacity ${num === 1 ? 'border-primary' : 'border-outline-variant opacity-70 hover:opacity-100'}`}>
                                <img alt={`Thumbnail ${num}`} className="w-full h-full object-cover" src={`/datas/data/${product.image}`} />
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 order-1 md:order-2 bg-surface-container-lowest rounded-lg overflow-hidden relative">
                        <img alt={product['display name']} className="w-full h-full object-cover object-center" src={`/datas/data/${product.image}`} />
                        <button className="absolute top-4 right-4 p-3 bg-surface/80 backdrop-blur-sm rounded-full text-secondary hover:text-primary hover:bg-surface shadow-sm transition-all">
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>zoom_in</span>
                        </button>
                    </div>
                </div>

                {/* Product Info */}
                <div className="lg:col-span-5 flex flex-col pt-4 lg:pl-8">
                    <div className="mb-6">
                        <h2 className="font-headline-md text-headline-md font-bold text-secondary mb-2 tracking-wide uppercase">{product.category}</h2>
                        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">{product['display name']}</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center text-primary-container">
                                {stars}
                            </div>
                            <Link href={`/reviews?id=${product.image}`} className="text-label-md text-secondary hover:text-primary underline underline-offset-4 decoration-secondary hover:decoration-primary transition-all">
                                {reviewCount} Değerlendirme
                            </Link>
                        </div>
                    </div>

                    <div className="mb-8 flex items-baseline gap-4">
                        <span className="font-headline-xl text-headline-xl text-on-surface">{formatPrice(priceVal)}</span>
                        <span className="font-body-lg text-body-lg text-secondary line-through">{formatPrice(oldPriceVal)}</span>
                        <span className="bg-primary-container text-on-primary-container font-label-sm text-label-sm px-2 py-1 rounded-full uppercase tracking-wider">%25 İndirim</span>
                    </div>

                    <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">{product.description}</p>
                    <hr className="border-surface-variant mb-8" />

                    <div className="mb-8 flex items-end gap-4">
                        <div className="w-24">
                            <label className="block font-label-sm text-label-sm text-on-surface mb-2" htmlFor="quantity">Adet</label>
                            <div className="flex items-center justify-between border border-outline-variant rounded h-12 w-full">
                                <button aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 h-full flex items-center text-secondary hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">remove</span>
                                </button>
                                <div className="flex-1 text-center font-body-md text-on-surface flex items-center justify-center font-medium select-none" id="quantity">
                                    {quantity}
                                </div>
                                <button aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)} className="px-3 h-full flex items-center text-secondary hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-1 gap-2">
                            <button onClick={handleAddToCart} className="flex-1 bg-primary text-on-primary font-label-md text-label-md h-12 rounded-lg hover:bg-surface-tint hover:opacity-90 transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">shopping_bag</span> Sepete Ekle
                            </button>
                            <button onClick={handleToggleFavorite} aria-label="Add to Favorites" className={`w-12 h-12 flex items-center justify-center border ${isFav ? 'border-error' : 'border-outline-variant'} rounded-lg transition-colors shadow-sm bg-surface`}>
                                <span className={`flex items-center justify-center ${isFav ? 'text-error' : 'text-secondary'}`}>
                                    {getHeartSVG(isFav)}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Accordions */}
                    <div className="border-t border-surface-variant divide-y divide-surface-variant mt-auto">
                        <details className="group py-4" open>
                            <summary className="flex justify-between items-center font-label-md text-label-md text-on-surface cursor-pointer list-none hover:text-primary transition-colors">
                                Ürün Açıklaması <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-secondary">expand_more</span>
                            </summary>
                            <div className="mt-4 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                {product.description}
                            </div>
                        </details>
                        <details className="group py-4">
                            <summary className="flex justify-between items-center font-label-md text-label-md text-on-surface cursor-pointer list-none hover:text-primary transition-colors">
                                İçerik <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-secondary">expand_more</span>
                            </summary>
                            <div className="mt-4 font-body-md text-body-md text-on-surface-variant leading-relaxed">Üstün kaliteli malzemelerden üretilmiştir. Çevreye duyarlı ve sürdürülebilir üretim aşamalarından geçmiştir.</div>
                        </details>
                        <details className="group py-4">
                            <summary className="flex justify-between items-center font-label-md text-label-md text-on-surface cursor-pointer list-none hover:text-primary transition-colors">
                                Kargo ve İade <span className="material-symbols-outlined group-open:rotate-180 transition-transform text-secondary">expand_more</span>
                            </summary>
                            <div className="mt-4 font-body-md text-body-md text-on-surface-variant leading-relaxed">50 TL üzerindeki siparişlerde ücretsiz standart kargo. Açılmamış ürünler tam iade için 30 gün içinde iade edilebilir.</div>
                        </details>
                    </div>
                </div>
            </div>

            {/* Similar Products Carousel */}
            <section className="mt-24 relative">
                <div className="flex justify-between items-center mb-6 border-b border-surface-variant pb-4">
                    <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">Bunları da Sevebilirsiniz</h3>
                    <div className="flex items-center gap-2">
                        <button onClick={() => scrollSlider(-1)} className="p-2 border border-outline-variant rounded-full text-secondary hover:text-primary hover:border-primary transition-colors">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button onClick={() => scrollSlider(1)} className="p-2 border border-outline-variant rounded-full text-secondary hover:text-primary hover:border-primary transition-colors">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
                <div ref={sliderRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-8">
                    {similarProducts.map(p => (
                        <ProductCard key={`sim-${p.image}`} product={p} />
                    ))}
                </div>
            </section>
        </main>
    );
}

export default function Detail() {
    return (
        <>
            <Header />
            <Suspense fallback={<div className="min-h-screen">Yükleniyor...</div>}>
                <DetailContent />
            </Suspense>
            <Footer />
        </>
    );
}
