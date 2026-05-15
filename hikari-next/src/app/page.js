'use client';
import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { productsData } from '@/data/products';
import Link from 'next/link';

export default function Home() {
    const [recommended, setRecommended] = useState([]);
    const [discover, setDiscover] = useState([]);
    const [discoverIndex, setDiscoverIndex] = useState(24);
    const sliderRef = useRef(null);

    useEffect(() => {
        // Hydration logic, run on client
        if (productsData && productsData.length > 0) {
            const shuffled = [...productsData].sort(() => 0.5 - Math.random());
            setRecommended(shuffled.slice(0, 8));
            setDiscover(shuffled.slice(8, 24));
        }
    }, []);

    const loadMoreDiscover = () => {
        const nextBatch = productsData.slice(discoverIndex, discoverIndex + 4);
        if (nextBatch.length > 0) {
            setDiscover(prev => [...prev, ...nextBatch]);
            setDiscoverIndex(prev => prev + 4);
        }
    };

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const scrollSlider = (direction) => {
        if (sliderRef.current && sliderRef.current.firstElementChild) {
            const itemWidth = sliderRef.current.firstElementChild.offsetWidth;
            const gap = 24;
            const scrollAmount = itemWidth + gap;
            sliderRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
        }
    };

    const loadAndScrollNext = () => {
        if (productsData && productsData.length > 0) {
            const randomProduct = productsData[Math.floor(Math.random() * productsData.length)];
            setRecommended(prev => [...prev, randomProduct]);
        }
        setTimeout(() => {
            if (sliderRef.current && sliderRef.current.firstElementChild) {
                const itemWidth = sliderRef.current.firstElementChild.offsetWidth;
                const gap = 24;
                const scrollAmount = itemWidth + gap;
                sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }, 50);
    };

    return (
        <>
            <Header type="main" />
            
            <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 flex flex-col gap-12">
                
                {/* Unified Bento Showcase Dashboard */}
                <div className="bg-surface-container-low rounded-3xl p-6 md:p-10 shadow-sm border border-outline-variant/10 flex flex-col gap-12">
                    {/* Part 1: Hero Grid */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 1. Main Hero Card */}
                        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-md group h-[500px]">
                            <img alt="Autumn Collection"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkOQbmLa0AF_mhAK8NADejH3amLYpZJvU1NwkL_n8lwTV9qXp7GHz-BQxw0QjRgpHgl32HD6_Ty0wZb7XxN-RGKThqO6sPDiIzwRD5rrE4knJAstKzLSOubBLfXoFITJyIPSDMyALro7ijm1Amz3UgFAZ0iDL1WQafPmkbUMF8Z6pgfsPKBt7rF6utNU-_hZQalUyqzGnkd_tN4sNKQcOLMrBGfhcGWGDjZ1B0YBawUwqnSZSX8qunDoknBCpMfM5A9Ph7gZfw1Rg" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8">
                                <span className="text-primary-fixed-dim font-bold text-xs uppercase tracking-[0.3em] mb-4">Yeni Sezon</span>
                                <h2 className="font-headline-xl text-headline-xl text-white mb-4">Sonbahar Temelleri</h2>
                                <p className="font-body-lg text-body-lg text-white/80 mb-8 max-w-md leading-relaxed">Birinci sınıf konforun yeni standardını keşfedin. Modern gardırop için küratörlüğünde stiller.</p>
                                <button onClick={() => scrollToSection('autumn-curation')}
                                    className="bg-primary text-white font-label-md text-label-md py-4 px-10 rounded-xl w-fit hover:bg-primary-container transition-all shadow-lg active:scale-95">Koleksiyonu İncele</button>
                            </div>
                        </div>

                        {/* Part 2: Right Stack (Accessories & Shipping) */}
                        <div className="flex flex-col gap-6">
                            {/* 2. Accessory Card */}
                            <Link href="/collection?category=Accessories" className="relative rounded-2xl overflow-hidden shadow-sm h-full group cursor-pointer border border-white/10 block">
                                <img alt="Accessories"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzy3NWVFDFzVFj4bPDocM009pnOGgbHVNBU3GwyKLrvezXDh9p7mC6QG-h5k6hLJgJx470qH2UkYY4eNrGyGUK8YC37kiWtNbjYp8P4PYuJkIVDSHYd5b_qI8e6ump7bvZ93DmXagnF15_1zmnwXwl0RJbhkKpGGCD6yMXjW8nTXJh4D2qY0D1jde0qCxdC6AaiW-fnj7ZtmFUuhBTo6M7BS7Uop0VnCVkpMN-DOb0sojoE28zFVOqzNdWEKTggvCjvjvotI-E3TA" />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors"></div>
                                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
                                    <h3 className="font-bold text-2xl text-white mb-2 tracking-tight">Premium Aksesuarlar</h3>
                                    <p className="text-white/70 text-sm border-b border-white/30 pb-1">Daha Fazlasını Keşfet</p>
                                </div>
                            </Link>
                            {/* 3. Shipping Info Card */}
                            <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm border border-outline-variant/10 group hover:border-primary/20 transition-all">
                                <span className="material-symbols-outlined text-primary text-4xl mb-4 group-hover:scale-110 transition-transform">local_shipping</span>
                                <h3 className="font-bold text-on-surface mb-1 text-lg">Ücretsiz Global Teslimat</h3>
                                <p className="text-secondary text-sm">200 TL üzerindeki tüm siparişlerde</p>
                            </div>
                        </div>
                    </section>

                    {/* Part 3: Curated Sellers Grid */}
                    <div id="autumn-curation" className="border-t border-outline-variant/10 pt-10">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                            <div>
                                <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] mb-2 block">Küratör Seçimleri</span>
                                <h2 className="text-3xl font-bold text-on-surface">Günün Kürasyonu: Sonbahar</h2>
                            </div>
                            <div className="px-4 py-2 bg-white rounded-full text-[10px] font-bold text-secondary border border-outline-variant/10 flex items-center gap-2 shadow-sm">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Canlı Veri Akışı
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* 4. Seller Card 1 */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/5 flex flex-col gap-6 group hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold border border-primary/10">HS</div>
                                    <div>
                                        <h4 className="font-bold text-on-surface text-lg">HIKARI Selection</h4>
                                        <p className="text-xs text-secondary italic">Premium Minimalist Stil</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="aspect-square bg-surface-container-lowest rounded-lg overflow-hidden">
                                        <img src="/datas/data/22245.jpg" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                    </div>
                                    <div className="aspect-square bg-surface-container-lowest rounded-lg overflow-hidden">
                                        <img src="/datas/data/22867.jpg" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                    </div>
                                    <div className="aspect-square bg-surface-container-lowest rounded-lg flex items-center justify-center border-2 border-dashed border-outline-variant/20">
                                        <span className="text-primary font-bold text-sm">+12</span>
                                    </div>
                                </div>
                                <Link href="/collection?id=autumn" className="text-center py-3 bg-primary/5 text-primary rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all">Seçkiyi Gör</Link>
                            </div>

                            {/* 5. Seller Card 2 */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/5 flex flex-col gap-6 group hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-secondary/5 flex items-center justify-center text-secondary font-bold border border-secondary/10">UB</div>
                                    <div>
                                        <h4 className="font-bold text-on-surface text-lg">Urban Boutique</h4>
                                        <p className="text-xs text-secondary italic">Modern Şehir Esintisi</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="aspect-square bg-surface-container-lowest rounded-lg overflow-hidden">
                                        <img src="/datas/data/50945.jpg" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                    </div>
                                    <div className="aspect-square bg-surface-container-lowest rounded-lg flex items-center justify-center border-2 border-dashed border-outline-variant/20">
                                        <span className="text-primary font-bold text-sm">+8</span>
                                    </div>
                                    <div className="aspect-square bg-surface-container-lowest rounded-lg overflow-hidden">
                                        <img src="/datas/data/26372.jpg" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                    </div>
                                </div>
                                <Link href="/collection?id=urban" className="text-center py-3 bg-primary/5 text-primary rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all">Seçkiyi Gör</Link>
                            </div>

                            {/* 6. Seller Card 3 */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/5 flex flex-col gap-6 group hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 font-bold border border-orange-100">AS</div>
                                    <div>
                                        <h4 className="font-bold text-on-surface text-lg">Autumn Spirit</h4>
                                        <p className="text-xs text-secondary italic">Sıcak & Samimi Dokular</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="aspect-square bg-surface-container-lowest rounded-lg flex items-center justify-center border-2 border-dashed border-outline-variant/20">
                                        <span className="text-primary font-bold text-sm">+5</span>
                                    </div>
                                    <div className="aspect-square bg-surface-container-lowest rounded-lg overflow-hidden">
                                        <img src="/datas/data/14997.jpg" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                    </div>
                                    <div className="aspect-square bg-surface-container-lowest rounded-lg overflow-hidden">
                                        <img src="/datas/data/1584.jpg" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                    </div>
                                </div>
                                <Link href="/collection?id=autumnspirit" className="text-center py-3 bg-primary/5 text-primary rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all">Seçkiyi Gör</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Circles */}
                <section className="py-4">
                    <br />
                    <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Kategoriye Göre Alışveriş Yap</h2>
                    <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x">
                        <Link className="flex flex-col items-center gap-3 min-w-[100px] snap-center group" href="/collection?category=Tshirts">
                            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-shadow relative">
                                <img alt="T-Shirts" className="absolute inset-0 w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQk9-UqrpgObl8ujrXMk-wpFz8SVjKQkcV1j64IWjFa2XLzWbkTXJ4qNLDvw64B8cpDk821s8AtbbF9Y6Yyt7eI-0qdFvFQyQ_kfPnfR0U75Sov48CVzsKOhPu4VzqAF0380DPizeojhMSmxtBBsOvvECYcdLCA8T0d8CgUpi7nXnHfRrXwluGLwkSQsKZfD1KEad55sKFMJopxkCBiTvkWpf1IHO-g-6oRAn0K9vTvF2qZIolBXs2zCHmB-Asy4rzx9vMHmVp86U" />
                            </div>
                            <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-center">T-Shirt</span>
                        </Link>
                        <Link className="flex flex-col items-center gap-3 min-w-[100px] snap-center group" href="/collection?category=Jackets">
                            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-shadow relative">
                                <img alt="Jackets" className="absolute inset-0 w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW8qoDqRaP5zBgZfFALV3brwfSoGIXcpvKMwjrnbVORXMzfc5ME6Ffw4ZrYiQtNV4ENhelffq5KpJwX4_JTZmQks7NgSO8YCRiZJJU86n5s1jJKrWlXDdK7ikIVuCRHuaNHUbHSAZ4JXuYc6JDWclKWSIpzGXwIFeF7VWS75Buv_SenrC8b0ThM0C9cB5EX1kcFEj-bf0goU2Jkx_HHg3QWu6qUYY4xrVM7qHCY5oKCinU0cYDgSvroKe_1u2GE0BE8m01AzkQ3MM" />
                            </div>
                            <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-center">Ceketler</span>
                        </Link>
                        <Link className="flex flex-col items-center gap-3 min-w-[100px] snap-center group" href="/collection?category=Sports Shoes">
                            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-shadow relative">
                                <img alt="Sneakers" className="absolute inset-0 w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKdWlLiEJY-v__f4oHKXNo-gY0cop7asa6dUzg4O1zcmZezrWsK-Vbqoa20g7FI-3Uo-ekcXuspA3dFYuQf4AM1bWmessNpP2JfDP0llS65YClt0a17wZmKob2GzGtocTzZjMOEFejG3Cr8Aubolh2KtoLfiZfAtwaWFYJ7dKk_ks2ONLlMXu67_-C_FdAqTSqPkVaKnIVaRLgnG_-yt9G_rMjRV9oZhy3lYUL4sXEpsBUwHmk66f8YSnek0oSqia1p0_M4aTMocY" />
                            </div>
                            <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-center">Spor Ayakkabılar</span>
                        </Link>
                        <Link className="flex flex-col items-center gap-3 min-w-[100px] snap-center group" href="/collection?category=Accessories">
                            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-shadow relative">
                                <img alt="Accessories" className="absolute inset-0 w-full h-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPp_pzChKqq5bgR40l6qKyOVgSAaSJT3nynxJ3gwGqvQyb2cHF9ndyLKGvCoQ6y2MDBQqSE9fqHDBwdtaYxIHeno1_JF36ZEUWbUxrSE-z3DGyBP7NLhlufUzwETVK0Q09c2azdV03amexPUuRM4Mqc0z7PBxWhtzz4eRbnVBxMVlak3C0IZrbpB-_5R59ZbKl3WYwyuwH8VBMGmpzgd8TjUJmigSXB__2TU167Jbf1251uVW_WPDkqaGTMonJnWbw1D0SfLtDOwc" />
                            </div>
                            <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-center">Aksesuarlar</span>
                        </Link>
                        <Link className="flex flex-col items-center gap-3 min-w-[100px] snap-center group" href="/categories">
                            <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden shadow-sm group-hover:shadow-md transition-shadow relative">
                                <span className="material-symbols-outlined text-3xl text-secondary">category</span>
                            </div>
                            <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors text-center">Tümünü Gör</span>
                        </Link>
                    </div>
                </section>

                {/* Recommended Products Slider */}
                <section className="relative">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-headline-lg text-headline-lg text-on-surface">Sizin İçin Önerilenler</h2>
                        <div className="flex items-center gap-2">
                            <button onClick={() => scrollSlider(-1)}
                                className="bg-white rounded-full w-10 h-10 flex items-center justify-center border border-surface-variant text-secondary hover:text-primary transition-colors hover:border-primary">
                                <span className="material-symbols-outlined">arrow_back</span>
                            </button>
                            <button onClick={loadAndScrollNext}
                                className="bg-white rounded-full w-10 h-10 flex items-center justify-center border border-surface-variant text-secondary hover:text-primary transition-colors hover:border-primary">
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <div ref={sliderRef}
                            className="flex overflow-x-auto snap-x scroll-smooth gap-gutter scrollbar-hide pb-4">
                            {recommended.map((product, index) => (
                                <ProductCard key={`rec-${product.image}-${index}`} product={product} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Discover Products Slider */}
                <section className="relative">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-headline-lg text-headline-lg text-on-surface">Keşfedebileceğin Ürünler</h2>
                    </div>
                    <div className="relative">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-4">
                            {discover.map((product, index) => (
                                <ProductCard key={`disc-${product.image}-${index}`} product={product} isGrid={true} />
                            ))}
                        </div>
                        <div className="flex justify-center mt-8">
                            <button onClick={loadMoreDiscover} className="bg-primary text-white font-label-md text-label-md py-3 px-8 rounded-xl hover:bg-primary-container transition-all">
                                Daha Fazla Yükle
                            </button>
                        </div>
                    </div>
                </section>
            </main>
            
            <Footer />
        </>
    );
}
