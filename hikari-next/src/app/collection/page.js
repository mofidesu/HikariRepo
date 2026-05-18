'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';

function CollectionContent() {
    const searchParams = useSearchParams();
    const categoryName = searchParams.get('category');
    const searchQuery = searchParams.get('q');

    const [data, setData] = useState({
        title: 'Koleksiyon',
        subtitle: 'Tüm Ürünler',
        description: 'Tüm ürünler listeleniyor.',
        heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBzy3NWVFDFzVFj4bPDocM009pnOGgbHVNBU3GwyKLrvezXDh9p7mC6QG-h5k6hLJgJx470qH2UkYY4eNrGyGUK8YC37kiWtNbjYp8P4PYuJkIVDSHYd5b_qI8e6ump7bvZ93DmXagnF15_1zmnwXwl0RJbhkKpGGCD6yMXjW8nTXJh4D2qY0D1jde0qCxdC6AaiW-fnj7ZtmFUuhBTo6M7BS7Uop0VnCVkpMN-DOb0sojoE28zFVOqzNdWEKTggvCjvjvotI-E3TA',
        seller: 'HIKARI Boutique',
        sellerLogo: 'HB',
        products: []
    });

    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [queryConfig, setQueryConfig] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [sortBy, setSortBy] = useState('recommended');

    const fetchTotalCount = async (config) => {
        let count = 0;
        if (config.type === 'search') {
            const { count: c } = await supabase.from('products').select('*', { count: 'exact', head: true }).ilike('productname', `%${config.value}%`);
            count = c || 0;
        } else if (config.type === 'category_id') {
            const { count: c } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('category_id', config.value);
            count = c || 0;
        } else if (config.type === 'category_fallback') {
            const { count: c } = await supabase.from('products').select('*', { count: 'exact', head: true }).or(`sub_category.eq."${config.value}",main_category.eq."${config.value}"`);
            count = c || 0;
        } else {
            const { count: c } = await supabase.from('products').select('*', { count: 'exact', head: true });
            count = c || 0;
        }
        setTotalCount(count);
    };

    const getProductsQuery = (config, sortMethod) => {
        let q = supabase.from(sortMethod === 'recommended' ? 'random_products' : 'products').select('*').limit(40);
        
        if (config.type === 'search') q = q.ilike('productname', `%${config.value}%`);
        else if (config.type === 'category_id') q = q.eq('category_id', config.value);
        else if (config.type === 'category_fallback') q = q.or(`sub_category.eq."${config.value}",main_category.eq."${config.value}"`);
        
        if (sortMethod === 'price_asc') q = q.order('price', { ascending: true });
        else if (sortMethod === 'price_desc') q = q.order('price', { ascending: false });
        else if (sortMethod === 'most_reviewed') q = q.order('reviews', { ascending: false });

        return q;
    };

    useEffect(() => {
        const fetchInitial = async () => {
            setIsLoading(true);
            setHasMore(true);
            let config = { type: 'all', value: null };
            let displayTitle = 'Koleksiyon';
            let subtitle = 'Tüm Ürünler';
            let description = 'Mağazamızdaki öne çıkan ürünleri keşfedin.';

            if (searchQuery) {
                config = { type: 'search', value: searchQuery };
                displayTitle = `"${searchQuery}" İçin Sonuçlar`;
                subtitle = 'Arama Sonuçları';
            } else if (categoryName) {
                const { data: catData } = await supabase.from('categories').select('*').eq('slug', categoryName).single();
                if (catData) {
                    config = { type: 'category_id', value: catData.id };
                    displayTitle = catData.sub_category ? `${catData.main_category} > ${catData.sub_category}` : catData.main_category;
                } else {
                    config = { type: 'category_fallback', value: categoryName };
                    displayTitle = categoryName;
                }
                subtitle = 'Kategori Seçimi';
            }

            setQueryConfig(config);
            await fetchTotalCount(config);

            const { data: products } = await getProductsQuery(config, sortBy);
            if (products) {
                setData(prev => ({
                    ...prev,
                    title: displayTitle,
                    subtitle,
                    description: searchQuery ? `Aramanızla eşleşen ürünler bulunuyor.` : `${displayTitle} kategorisindeki ürünleri keşfedin.`,
                    products: products
                }));
                document.title = `HIKARI | ${displayTitle}`;
            }
            setIsLoading(false);
        };

        fetchInitial();
    }, [categoryName, searchQuery, sortBy]);

    const loadMore = async () => {
        if (isLoadingMore || !hasMore || !queryConfig) return;
        setIsLoadingMore(true);
        const { data: newProducts } = await getProductsQuery(queryConfig);
        
        if (newProducts && newProducts.length > 0) {
            setData(prev => {
                // Filtreleme ile dublikeleri önlüyoruz
                const existingIds = new Set(prev.products.map(p => p.id));
                const filtered = newProducts.filter(p => !existingIds.has(p.id));
                if (prev.products.length + filtered.length >= totalCount || filtered.length === 0) {
                    setHasMore(false);
                }
                return { ...prev, products: [...prev.products, ...filtered] };
            });
        } else {
            setHasMore(false);
        }
        setIsLoadingMore(false);
    };

    const observerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading && !isLoadingMore && hasMore) {
                loadMore();
            }
        }, { threshold: 0.1, rootMargin: '400px' });

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
            observer.disconnect();
        };
    }, [isLoading, isLoadingMore, hasMore, queryConfig]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

    return (
        <main className="flex-grow">
            {/* Minimal Category Header */}
            <section className="pt-12 pb-10 bg-surface-container-lowest border-b border-outline-variant/30">
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
                    <div className="flex flex-col items-center text-center space-y-4">
                        {/* Breadcrumbs / Subtitle */}
                        <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-primary tracking-[0.2em] uppercase">
                            <span className="material-symbols-outlined text-[18px]">category</span>
                            {data.subtitle}
                        </div>
                        
                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-on-surface tracking-tight">
                            {data.title}
                        </h1>
                        
                        {/* Description */}
                        <p className="text-secondary max-w-xl text-base mt-2">
                            {data.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <h2 className="text-3xl font-bold text-on-surface">Koleksiyon Ürünleri</h2>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <span className="text-secondary text-sm hidden md:inline-block">{data.products.length} / {totalCount} Ürün Listeleniyor</span>
                        
                        <div className="relative min-w-[200px]">
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full appearance-none bg-surface border border-outline-variant rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-on-surface hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer shadow-sm"
                            >
                                <option value="recommended">Önerilen Sıralama</option>
                                <option value="price_asc">En Düşük Fiyat</option>
                                <option value="price_desc">En Yüksek Fiyat</option>
                                <option value="most_reviewed">En Çok Değerlendirilen</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-secondary text-[20px]">
                                swap_vert
                            </span>
                        </div>
                    </div>
                </div>
                {data.products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {data.products.map(product => (
                            <ProductCard key={product.id} product={product} isGrid={true} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-secondary">
                        Bu kategori/arama için ürün bulunamadı.
                    </div>
                )}
                
                {isLoadingMore && (
                    <div className="text-center py-8 text-primary font-bold">
                        Daha fazla ürün yükleniyor...
                    </div>
                )}
                
                {/* Sentinel for Infinite Scroll */}
                <div ref={observerRef} className="h-10 w-full" />
            </section>
        </main>
    );
}

export default function Collection() {
    return (
        <>
            <Header />
            <Suspense fallback={<div className="min-h-screen">Yükleniyor...</div>}>
                <CollectionContent />
            </Suspense>
            <Footer />
        </>
    );
}
